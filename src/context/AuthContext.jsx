import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  signInAnonymously 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bridge_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Sync with Firebase Auth state
  useEffect(() => {
    // Ensure Firebase Auth session exists so Firestore rules allow reads
    const initAuth = async () => {
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.warn('Auto anonymous sign-in:', e?.message || e);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch additional profile data from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            const combinedUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || data.email || 'utilisateur@orange.cm',
              user: data.name || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Utilisateur'),
              role: data.role || 'agence',
              poste: data.poste || (data.role === 'client' ? 'Brand Manager' : 'Chef de Projet Digital'),
              photoURL: firebaseUser.photoURL || null,
            };
            setUser(combinedUser);
            localStorage.setItem('bridge_user', JSON.stringify(combinedUser));
          } else {
            // Keep local cached user role/poste if exists or defaults
            const saved = localStorage.getItem('bridge_user');
            const parsed = saved ? JSON.parse(saved) : {};
            const newUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || parsed.email || 'demo@bridge.cm',
              user: firebaseUser.displayName || parsed.user || 'Utilisateur Bridge',
              role: parsed.role || 'agence',
              poste: parsed.poste || 'Chef de Projet Digital',
              photoURL: firebaseUser.photoURL || null,
            };
            
            // Save to Firestore
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: newUser.email,
              name: newUser.user,
              role: newUser.role,
              poste: newUser.poste,
              photoURL: newUser.photoURL || '',
              updatedAt: new Date().toISOString(),
            }, { merge: true });

            setUser(newUser);
            localStorage.setItem('bridge_user', JSON.stringify(newUser));
          }
        } catch (err) {
          console.warn('Error reading user profile from Firestore:', err);
        }
      } else {
        // Keep local user if offline or demo login
        const saved = localStorage.getItem('bridge_user');
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch (e) {}
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Standard Login (email/persona)
  const login = useCallback(async (userData) => {
    try {
      // Authenticate with Firebase if not already signed in
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.warn('Anonymous sign-in skipped/failed:', e);
        }
      }

      const uid = auth.currentUser?.uid || `usr_${Date.now()}`;
      const fullUser = {
        uid,
        ...userData,
      };

      setUser(fullUser);
      localStorage.setItem('bridge_user', JSON.stringify(fullUser));

      // Save profile to Firestore
      if (auth.currentUser) {
        try {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          await setDoc(userDocRef, {
            uid: auth.currentUser.uid,
            email: fullUser.email || 'utilisateur@orange.cm',
            name: fullUser.user || 'Utilisateur',
            role: fullUser.role || 'agence',
            poste: fullUser.poste || '',
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, `users/${auth.currentUser.uid}`);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }, []);

  // Google Sign-In
  const loginWithGoogle = useCallback(async (selectedRole = 'agence', defaultPoste = '') => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      let finalRole = selectedRole;
      let finalPoste = defaultPoste || (selectedRole === 'client' ? 'Brand Manager' : 'Chef de Projet Digital');

      if (userDoc.exists()) {
        const data = userDoc.data();
        finalRole = data.role || selectedRole;
        finalPoste = data.poste || finalPoste;
      }

      const userData = {
        uid: fbUser.uid,
        email: fbUser.email,
        user: fbUser.displayName || fbUser.email.split('@')[0],
        role: finalRole,
        poste: finalPoste,
        photoURL: fbUser.photoURL,
      };

      await setDoc(userDocRef, {
        uid: fbUser.uid,
        email: fbUser.email,
        name: userData.user,
        role: finalRole,
        poste: finalPoste,
        photoURL: fbUser.photoURL || '',
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setUser(userData);
      localStorage.setItem('bridge_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('SignOut warning:', e);
    }
    setUser(null);
    localStorage.removeItem('bridge_user');
  }, []);

  const isAgency = user?.role === 'agence';
  const isClient = user?.role === 'client';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithGoogle, 
      logout, 
      isAgency, 
      isClient, 
      isAuthenticated: !!user,
      loadingAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
