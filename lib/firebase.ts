import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics, isSupported } from "firebase/analytics";

function hasPlaceholders(v: string | undefined) {
  if (!v) return true;
  const invalidHints = ["your_", "xxxxxxxx", "000000000000"];
  return invalidHints.some((h) => v.includes(h));
}

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

const required = [apiKey, authDomain, projectId, appId];
const allPresent =
  required.every((v) => !!v) &&
  !hasPlaceholders(apiKey) &&
  !hasPlaceholders(authDomain) &&
  !hasPlaceholders(projectId) &&
  !hasPlaceholders(appId);

let app: ReturnType<typeof getApp> | ReturnType<typeof initializeApp> | null =
  null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

if (allPresent) {
  const firebaseConfig: Record<string, string> = {
    apiKey: apiKey!,
    authDomain: authDomain!,
    projectId: projectId!,
    appId: appId!,
    storageBucket: storageBucket || `${projectId}.firebasestorage.app`,
    measurementId: measurementId || "",
  };
  if (messagingSenderId) firebaseConfig.messagingSenderId = messagingSenderId;
  
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Analytics is only for client-side
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app);
      }
    });
  }
  
  console.log("Firebase initialized");
}

export { auth, db, analytics };
export default app;