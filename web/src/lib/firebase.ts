// Firebase web config is public by design: it ships in the page. Access is controlled by Auth
// and security rules, and the API key is restricted to this app's domains and Firebase APIs.
export const firebaseConfig = {
  apiKey: "AIzaSyDCV7gR6CCBeeH_6Wywh2eR_At-y0fRqq8",
  // Serve the sign-in handler from our own domain so redirect sign-in works in browsers that
  // block third-party storage (Safari, Chrome on iOS).
  authDomain: typeof location !== "undefined" && location.hostname.endsWith(".web.app") ? location.hostname : "paperpath-learn.firebaseapp.com",
  projectId: "paperpath-learn",
  storageBucket: "paperpath-learn.firebasestorage.app",
  messagingSenderId: "166134195111",
  appId: "1:166134195111:web:ebe1c1a543f13f0e648c82",
};

async function load() {
  const [{ initializeApp }, authMod, fsMod] = await Promise.all([import("firebase/app"), import("firebase/auth"), import("firebase/firestore")]);
  const app = initializeApp(firebaseConfig);
  return { auth: authMod.getAuth(app), db: fsMod.getFirestore(app), authMod, fsMod };
}

let loaded: ReturnType<typeof load> | null = null;

/** Firebase loads after first paint so the catalogue and lessons appear without waiting for it. */
export function firebase() {
  return (loaded ??= load());
}
