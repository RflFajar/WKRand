import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

try {
  const firebaseConfig = {
    apiKey: rawConfig.apiKey,
    authDomain: rawConfig.authDomain,
    projectId: rawConfig.projectId,
    storageBucket: rawConfig.storageBucket,
    messagingSenderId: rawConfig.messagingSenderId,
    appId: rawConfig.appId,
  };

  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });

  // Initialize Firestore with fallback
  if (rawConfig.firestoreDatabaseId && rawConfig.firestoreDatabaseId !== '(default)') {
    try {
      db = getFirestore(app, rawConfig.firestoreDatabaseId);
    } catch (dbErr) {
      console.warn('Could not initialize named firestore database, falling back to default:', dbErr);
      db = getFirestore(app);
    }
  } else {
    db = getFirestore(app);
  }
} catch (err) {
  console.error('Firebase initialization error:', err);
}

export { app, auth, db, googleProvider };
export default app;

