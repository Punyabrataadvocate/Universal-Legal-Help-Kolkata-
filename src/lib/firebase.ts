import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

/**
 * Firebase configuration strategy:
 * 1. Prefer environment variables (process.env) for security/Play Store submission.
 * 2. Fallback to firebase-applet-config.json for AI Studio preview environment.
 */
/**
 * Helper to check if a value is a placeholder or undefined.
 */
const isPlaceholder = (val: string | undefined): boolean => {
  if (!val || typeof val !== 'string') return true;
  const lower = val.toLowerCase().trim();
  return (
    lower === "" ||
    lower === "undefined" ||
    lower === "null" ||
    lower.startsWith("your-") ||
    lower.startsWith("your_") ||
    lower.startsWith("your") ||
    lower.includes("placeholder") ||
    lower.includes("api-key") ||
    val.length <= 5
  );
};

// Evaluate if a complete set of critical environment keys exists.
// This prevents mixing part of environment config with part of JSON file config.
const hasEnvConfig = 
  process.env.FIREBASE_PROJECT_ID && !isPlaceholder(process.env.FIREBASE_PROJECT_ID) &&
  process.env.FIREBASE_API_KEY && !isPlaceholder(process.env.FIREBASE_API_KEY) &&
  process.env.FIREBASE_APP_ID && !isPlaceholder(process.env.FIREBASE_APP_ID);

const firebaseConfig = hasEnvConfig ? {
  projectId: process.env.FIREBASE_PROJECT_ID!.trim(),
  appId: process.env.FIREBASE_APP_ID!.trim(),
  apiKey: process.env.FIREBASE_API_KEY!.trim(),
  authDomain: (process.env.FIREBASE_AUTH_DOMAIN && !isPlaceholder(process.env.FIREBASE_AUTH_DOMAIN)) 
    ? process.env.FIREBASE_AUTH_DOMAIN.trim() 
    : `${process.env.FIREBASE_PROJECT_ID!.trim()}.firebaseapp.com`,
  storageBucket: (process.env.FIREBASE_STORAGE_BUCKET && !isPlaceholder(process.env.FIREBASE_STORAGE_BUCKET))
    ? process.env.FIREBASE_STORAGE_BUCKET.trim()
    : `${process.env.FIREBASE_PROJECT_ID!.trim()}.firebasestorage.app`,
  messagingSenderId: (process.env.FIREBASE_MESSAGING_SENDER_ID && !isPlaceholder(process.env.FIREBASE_MESSAGING_SENDER_ID))
    ? process.env.FIREBASE_MESSAGING_SENDER_ID.trim()
    : "",
  measurementId: (process.env.FIREBASE_MEASUREMENT_ID && !isPlaceholder(process.env.FIREBASE_MEASUREMENT_ID))
    ? process.env.FIREBASE_MEASUREMENT_ID.trim()
    : ""
} : {
  projectId: firebaseConfigJson.projectId,
  appId: firebaseConfigJson.appId,
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  measurementId: firebaseConfigJson.measurementId || ""
};

console.log("Firebase Debug: Final Config Source", hasEnvConfig ? "ENVIRONMENT VARIABLES" : "JSON FILE");
console.log("Firebase Debug: Final Config", {
  projectId: firebaseConfig.projectId,
  hasApiKey: !!firebaseConfig.apiKey,
  apiKeyLength: firebaseConfig.apiKey ? firebaseConfig.apiKey.length : 0,
  apiKeyStart: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 5) : "",
  apiKeyEnd: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(firebaseConfig.apiKey.length - 3) : ""
});

// Validate configuration
const missingKeys = ['projectId', 'appId', 'apiKey', 'authDomain'].filter(key => 
  !firebaseConfig[key as keyof typeof firebaseConfig]
);

if (missingKeys.length > 0) {
  console.error(`CRITICAL: Firebase configuration missing: ${missingKeys.join(', ')}`);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const databaseId = (hasEnvConfig && process.env.FIREBASE_FIRESTORE_DATABASE_ID && !isPlaceholder(process.env.FIREBASE_FIRESTORE_DATABASE_ID))
  ? process.env.FIREBASE_FIRESTORE_DATABASE_ID.trim()
  : (firebaseConfigJson.firestoreDatabaseId && !isPlaceholder(firebaseConfigJson.firestoreDatabaseId))
    ? firebaseConfigJson.firestoreDatabaseId.trim()
    : "(default)";

console.log(`Firebase Debug: Database ID: ${databaseId}`);

// Using initializeFirestore with forced long polling
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  experimentalAutoDetectLongPolling: false
}, databaseId);
export const auth = getAuth();
setPersistence(auth, browserLocalPersistence);
export const storage = getStorage(app);

// Test connection on boot
export async function testConnection() {
  try {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    console.log(`Firebase Debug: Testing connection to database [${databaseId}]... (Online: ${isOnline})`);
    
    // integration[firebase] recommendation: use getDocFromServer to strictly test connection
    const testDoc = await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase Debug: Connection test successful. Doc exists:", testDoc.exists());
  } catch (error) {
    console.error("Firebase Debug: Connection test failed:", error);
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("The client reports OFFLINE. navigator.onLine:", navigator.onLine);
      console.warn("Possible reasons: Service Worker blocking, invalid API key, or network firewall.");
    }
    if (error instanceof Error && error.message.includes('permission')) {
      console.warn("Permission denied. Check if '/test/connection' exists and has public read rules.");
    }
  }
}

testConnection();


