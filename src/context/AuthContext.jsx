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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          const isAdminEmail = firebaseUser.email === 'selaboykouotou23@gmail.com';
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            const combinedUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || data.email || 'utilisateur@orange.cm',
              user: data.name || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Utilisateur'),
              role: data.role || (isAdminEmail ? 'agence' : 'agence'),
              poste: data.poste || (isAdminEmail ? 'Administrateur' : (data.role === 'client' ? 'Brand Manager' : 'Chef de Projet Digital')),
              photoURL: firebaseUser.photoURL || null,
              client: localStorage.getItem('bridge_active_client') || 'Orange Cameroun',
            };
            setUser(combinedUser);
            localStorage.setItem('bridge_user', JSON.stringify(combinedUser));
          } else {
            // Keep local cached user role/poste if exists or defaults
            const saved = localStorage.getItem('bridge_user');
            const parsed = saved ? JSON.parse(saved) : {};
            const newUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || parsed.email || 'utilisateur@orange.cm',
              user: firebaseUser.displayName || parsed.user || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Utilisateur'),
              role: parsed.role || (isAdminEmail ? 'agence' : 'agence'),
              poste: parsed.poste || (isAdminEmail ? 'Administrateur' : 'Chef de Projet Digital'),
              photoURL: firebaseUser.photoURL || null,
              client: parsed.client || localStorage.getItem('bridge_active_client') || 'Orange Cameroun',
            };
            
            setUser(newUser);
            localStorage.setItem('bridge_user', JSON.stringify(newUser));

            // Save to Firestore
            try {
              await setDoc(userDocRef, {
                uid: firebaseUser.uid,
                email: newUser.email,
                name: newUser.user,
                role: newUser.role,
                poste: newUser.poste,
                photoURL: newUser.photoURL || '',
                updatedAt: new Date().toISOString(),
              }, { merge: true });
            } catch (writeErr) {
              console.warn('Initial user profile write warning:', writeErr);
            }
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
      const uid = auth.currentUser?.uid || `usr_${Date.now()}`;
      const fullUser = {
        uid,
        ...userData,
      };

      setUser(fullUser);
      localStorage.setItem('bridge_user', JSON.stringify(fullUser));
      if (fullUser.client) {
        localStorage.setItem('bridge_active_client', fullUser.client);
      }

      // Save profile to Firestore if session exists
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

  // Google Sign-In (Firebase Auth)
  const loginWithGoogle = useCallback(async (selectedRole = null, defaultPoste = null, extraMetadata = {}) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const isAdminEmail = fbUser.email === 'selaboykouotou23@gmail.com';
      let finalRole = selectedRole || (isAdminEmail ? 'agence' : 'agence');
      let finalPoste = defaultPoste || (isAdminEmail ? 'Administrateur' : (finalRole === 'client' ? 'Brand Manager' : 'Chef de Projet Digital'));

      const userDocRef = doc(db, 'users', fbUser.uid);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.role && !selectedRole) finalRole = data.role;
          if (data.poste && !defaultPoste) finalPoste = data.poste;
        }
      } catch (err) {
        console.warn('Could not read existing user doc from Firestore:', err);
      }

      const clientName = extraMetadata.client || localStorage.getItem('bridge_active_client') || 'Orange Cameroun';

      const userData = {
        uid: fbUser.uid,
        email: fbUser.email || 'utilisateur@orange.cm',
        user: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Utilisateur Google'),
        role: finalRole,
        poste: finalPoste,
        photoURL: fbUser.photoURL || null,
        client: clientName,
        interlocuteurClient: extraMetadata.interlocuteurClient || (finalRole === 'client' ? finalPoste : 'Brand Manager'),
        profilAgence: extraMetadata.profilAgence || (finalRole === 'agence' ? finalPoste : 'Chef de Projet Digital'),
      };

      setUser(userData);
      localStorage.setItem('bridge_user', JSON.stringify(userData));
      localStorage.setItem('bridge_active_client', clientName);

      // Persist profile to Firestore
      try {
        await setDoc(userDocRef, {
          uid: fbUser.uid,
          email: userData.email,
          name: userData.user,
          role: userData.role,
          poste: userData.poste,
          photoURL: userData.photoURL || '',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (saveError) {
        console.warn('Non-blocking user profile Firestore save warning:', saveError);
      }

      return userData;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
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
