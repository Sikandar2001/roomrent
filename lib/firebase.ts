import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

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
let storage: FirebaseStorage | null = null;

if (allPresent) {
  const firebaseConfig: Record<string, string> = {
    apiKey: apiKey!,
    authDomain: authDomain!,
    projectId: projectId!,
    appId: appId!,
  };
  if (storageBucket) firebaseConfig.storageBucket = storageBucket;
  if (messagingSenderId) firebaseConfig.messagingSenderId = messagingSenderId;
  
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { auth, db, storage };
export default app;
