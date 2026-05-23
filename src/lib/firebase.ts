import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import firebaseConfigJson from "../../firebase-applet-config.json";

// Hardcoded Firebase Config (Replace these placeholder strings with your actual Firebase project credentials)
const hardcodedConfig = {
  apiKey: "REPLACE_WITH_MY_ACTUAL_API_KEY",
  authDomain: "REPLACE_WITH_MY_ACTUAL_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_MY_ACTUAL_PROJECT_ID",
  storageBucket: "REPLACE_WITH_MY_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_MY_ACTUAL_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_MY_ACTUAL_APP_ID"
};

const isPlaceholder = (val: string) => !val || val.includes("REPLACE_WITH") || val.includes("YOUR_");

const useFallback = isPlaceholder(hardcodedConfig.apiKey);

const firebaseConfig = {
  apiKey: useFallback ? firebaseConfigJson.apiKey : hardcodedConfig.apiKey,
  authDomain: useFallback ? firebaseConfigJson.authDomain : hardcodedConfig.authDomain,
  projectId: useFallback ? firebaseConfigJson.projectId : hardcodedConfig.projectId,
  storageBucket: useFallback ? firebaseConfigJson.storageBucket : hardcodedConfig.storageBucket,
  messagingSenderId: useFallback ? firebaseConfigJson.messagingSenderId : hardcodedConfig.messagingSenderId,
  appId: useFallback ? firebaseConfigJson.appId : hardcodedConfig.appId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Use sandbox firestoreDatabaseId when on fallback, otherwise standard "(default)" for personal project
const databaseId = useFallback 
  ? (firebaseConfigJson as any).firestoreDatabaseId || "(default)"
  : "(default)";

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  experimentalAutoDetectLongPolling: false
}, databaseId);

export { app, auth, db };
