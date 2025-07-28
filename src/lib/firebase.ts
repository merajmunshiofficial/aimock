import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyDW6tUXKD_noSXN0M8FO_mFDc3lUBKRnK0",
  authDomain: "ai-mock-9702b.firebaseapp.com",
  projectId: "ai-mock-9702b",
  storageBucket: "ai-mock-9702b.firebasestorage.app",
  messagingSenderId: "1087816856998",
  appId: "1:1087816856998:web:ba02e4cb9f026cf5598b67",
  measurementId: "G-WF6QF5LVMR"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Firestore instance (main usage for progress/evaluation storage)
export const db = getFirestore(firebaseApp);

// Analytics (loaded only in browser and if supported)
export let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== "undefined") {
  analyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(firebaseApp);
      }
    })
    .catch(() => {/* ignore */});
}
