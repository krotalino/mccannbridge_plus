import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { 
  initializeFirestore,
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase safely (preventing duplicate app initialization on module reloads)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore using the custom database ID provided in config with long-polling resilience
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = firestoreDb;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

/**
 * Standardized Firestore error handler
 */
export function handleFirestoreError(error, operationType, path = null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  // Log offline/timeout warnings cleanly without unhandled crashes
  if (errMsg.includes('the client is offline') || errMsg.includes("Backend didn't respond")) {
    console.info(`[Firestore Sync] Operating in offline/cached mode for ${operationType} on ${path || 'unknown'}`);
    return {
      error: errMsg,
      operationType,
      path,
      isOffline: true,
    };
  }

  const errInfo = {
    error: errMsg,
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      providerInfo: auth.currentUser?.providerData?.map(p => ({
        providerId: p.providerId,
        email: p.email,
      })) || []
    }
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Test Firestore server connection safely
 */
export async function testConnection() {
  try {
    if (!auth.currentUser) return true;
    await getDocFromServer(doc(db, 'users', auth.currentUser.uid));
    console.log('Firebase Firestore connection verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes("Backend didn't respond"))) {
      console.warn('Firebase client is offline, continuing with local persistence.');
    }
    return false;
  }
}

