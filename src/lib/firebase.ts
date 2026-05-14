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
 * Helper to get config value with fallback.
 * Checks if the environment variable is set and not a placeholder or "undefined" string.
 */
const getConfigValue = (envVar: string | undefined, fallback: string | undefined, keyName: string) => {
  const isEnvValid = envVar && 
                    typeof envVar === 'string' && 
                    envVar.length > 5 && 
                    envVar !== "undefined" && 
                    envVar !== "null" &&
                    !envVar.startsWith("YOUR_");
  
  if (isEnvValid) {
    return envVar.trim();
  }
  
  const isFallbackValid = fallback && 
                         typeof fallback === 'string' && 
                         fallback.length > 5 && 
                         !fallback.startsWith("YOUR_");
                         
  if (isFallbackValid) {
    return fallback!.trim();
  }

  return "";
};

const firebaseConfig = {
  projectId: getConfigValue(process.env.FIREBASE_PROJECT_ID, firebaseConfigJson.projectId, 'projectId'),
  appId: getConfigValue(process.env.FIREBASE_APP_ID, firebaseConfigJson.appId, 'appId'),
  apiKey: getConfigValue(process.env.FIREBASE_API_KEY, firebaseConfigJson.apiKey, 'apiKey'),
  authDomain: getConfigValue(process.env.FIREBASE_AUTH_DOMAIN, firebaseConfigJson.authDomain, 'authDomain'),
  storageBucket: getConfigValue(process.env.FIREBASE_STORAGE_BUCKET, firebaseConfigJson.storageBucket, 'storageBucket'),
  messagingSenderId: getConfigValue(process.env.FIREBASE_MESSAGING_SENDER_ID, firebaseConfigJson.messagingSenderId, 'messagingSenderId'),
  measurementId: getConfigValue(process.env.FIREBASE_MEASUREMENT_ID, firebaseConfigJson.measurementId, 'measurementId') || "",
};

console.log("Firebase Debug: Final Config", {
  projectId: firebaseConfig.projectId,
  hasApiKey: !!firebaseConfig.apiKey,
  apiKeyLength: firebaseConfig.apiKey.length,
  apiKeyStart: firebaseConfig.apiKey.substring(0, 5),
  apiKeyEnd: firebaseConfig.apiKey.substring(firebaseConfig.apiKey.length - 3)
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
const databaseId = getConfigValue(process.env.FIREBASE_FIRESTORE_DATABASE_ID, firebaseConfigJson.firestoreDatabaseId, 'databaseId') || "(default)";

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


