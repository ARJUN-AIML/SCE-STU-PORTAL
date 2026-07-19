import { initializeApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// ── Allowed email domains ──────────────────────────────────────────
const ALLOWED_DOMAINS = ["saranathan.ac.in", "sceadmin.ac.in"] as const

export function isAllowedEmail(email: string): boolean {
  const lower = email.toLowerCase().trim()
  return ALLOWED_DOMAINS.some((d) => lower.endsWith(`@${d}`))
}

export function getRoleFromEmail(email: string): "student" | "admin" {
  return email.toLowerCase().trim().endsWith("@sceadmin.ac.in")
    ? "admin"
    : "student"
}

// ── Auth operations (all go through real Firebase) ─────────────────

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signupWithEmail(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  // Send verification email immediately after signup
  await sendEmailVerification(credential.user)
  return credential
}

export const logoutUser = () => signOut(auth)

export const subscribeAuth = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
