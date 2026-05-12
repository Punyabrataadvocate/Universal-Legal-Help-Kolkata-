import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL: Database ID
export const auth = getAuth();
setPersistence(auth, browserLocalPersistence);
export const storage = getStorage(app);

// Test connection on boot
export async function testConnection() {
  try {
    const testDoc = await getDoc(doc(db, 'test', 'connection'));
    console.log("Firebase connection test successful. Doc exists:", testDoc.exists());
  } catch (error) {
    console.error("Firebase connection test failed:", error);
    if (error instanceof Error && error.message.includes('permissions')) {
      console.warn("Check if App Check is enforced in Firebase Console and if rules allow public read on /test/connection");
    }
  }
}

testConnection();
