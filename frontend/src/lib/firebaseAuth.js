/**
 * Firebase client config: Vite inlines VITE_* at build time. On hosts like Render, if the build
 * ran without those vars, we load the same values from the API at runtime (public web SDK keys).
 */
const API_BASE = (import.meta.env.VITE_API_BASE || "/api").replace(/\/$/, "");

function isCompleteConfig(c) {
  return Boolean(
    c?.apiKey &&
      c?.authDomain &&
      c?.projectId &&
      c?.appId
  );
}

export async function resolveFirebaseConfig() {
  const fromEnv = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  if (isCompleteConfig(fromEnv)) return fromEnv;

  try {
    const res = await fetch(`${API_BASE}/config/firebase`, {
      credentials: "same-origin",
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!isCompleteConfig(data)) return null;
    return {
      apiKey: data.apiKey,
      authDomain: data.authDomain,
      projectId: data.projectId,
      storageBucket: data.storageBucket || "",
      messagingSenderId: String(data.messagingSenderId || ""),
      appId: data.appId,
    };
  } catch (e) {
    console.warn("Firebase runtime config fetch failed:", e);
    return null;
  }
}

export async function getFirebaseAuth() {
  const firebaseConfig = await resolveFirebaseConfig();
  if (!firebaseConfig) return null;

  const { getAuth, signInWithPopup, GoogleAuthProvider } = await import(
    "firebase/auth"
  );
  const { initializeApp, getApps } = await import("firebase/app");

  try {
    const app =
      getApps().length === 0
        ? initializeApp(firebaseConfig)
        : getApps()[0];
    const auth = getAuth(app);
    return { auth, signInWithPopup, GoogleAuthProvider };
  } catch (err) {
    console.error("Firebase init error:", err);
    return null;
  }
}
