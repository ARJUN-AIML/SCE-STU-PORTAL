import React, { createContext, useContext, useEffect, useState } from "react"
import type { User as FirebaseUser } from "firebase/auth"
import {
  subscribeAuth,
  loginWithEmail as firebaseLoginWithEmail,
  signupWithEmail as firebaseSignupWithEmail,
  logoutUser,
  loginWithGoogle,
  isAllowedEmail,
  getRoleFromEmail,
} from "@/lib/firebase"
import { toast } from "sonner"

export interface ExtendedUser extends FirebaseUser {
  dbId?: string
  role?: string
}

interface AuthContextType {
  user: ExtendedUser | null
  loading: boolean
  requireAuth: (callback?: () => void) => Promise<boolean>
  loginWithEmail: (email: string, pass: string) => Promise<void>
  signupWithEmail: (email: string, pass: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  requireAuth: async () => false,
  loginWithEmail: async () => {},
  signupWithEmail: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [loading, setLoading] = useState(true)

  // ── Enrich a Firebase user with role + optional backend data ──────
  const enrichUser = async (u: FirebaseUser): Promise<ExtendedUser> => {
    const role = getRoleFromEmail(u.email ?? "")

    try {
      const token = await u.getIdToken()
      const res = await fetch("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const d = await res.json()
        if (d.success) {
          return { ...u, role: d.data.role, dbId: d.data.id } as ExtendedUser
        }
      }
    } catch (e) {
      console.error("Backend user fetch failed (non-fatal):", e)
    }

    return { ...u, role } as ExtendedUser
  }

  // ── Firebase onAuthStateChanged — the ONLY source of truth ────────
  useEffect(() => {
    const unsubscribe = subscribeAuth(async (firebaseUser) => {
      if (firebaseUser) {
        if (!isAllowedEmail(firebaseUser.email ?? "")) {
          // User signed in with a non-college email (e.g. via Google)
          await logoutUser()
          setUser(null)
          toast.error("Only official Saranathan College accounts are allowed.")
        } else {
          const extendedUser = await enrichUser(firebaseUser)
          setUser(extendedUser)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // ── Email / password login ────────────────────────────────────────
  const handleEmailLogin = async (email: string, password: string) => {
    const emailLower = email.toLowerCase().trim()

    // Pre-validate domain before hitting Firebase
    if (!isAllowedEmail(emailLower)) {
      throw Object.assign(new Error("Invalid domain"), { code: "auth/invalid-domain" })
    }

    const credential = await firebaseLoginWithEmail(emailLower, password)

    // Double-check domain after sign-in (should never fail given pre-check)
    if (!isAllowedEmail(credential.user.email ?? "")) {
      await logoutUser()
      throw Object.assign(new Error("Invalid domain"), { code: "auth/invalid-domain" })
    }

    const extendedUser = await enrichUser(credential.user)
    setUser(extendedUser)
  }

  // ── Email / password signup ───────────────────────────────────────
  const handleEmailSignup = async (email: string, password: string) => {
    const emailLower = email.toLowerCase().trim()

    // Pre-validate domain before creating the account
    if (!isAllowedEmail(emailLower)) {
      throw Object.assign(new Error("Invalid domain"), { code: "auth/invalid-domain" })
    }

    // createUserWithEmailAndPassword + sendEmailVerification (inside firebase.ts)
    const credential = await firebaseSignupWithEmail(emailLower, password)

    if (!isAllowedEmail(credential.user.email ?? "")) {
      await logoutUser()
      throw Object.assign(new Error("Invalid domain"), { code: "auth/invalid-domain" })
    }

    const extendedUser = await enrichUser(credential.user)
    setUser(extendedUser)
  }

  // ── Google popup auth (kept for backward compatibility) ───────────
  const requireAuth = async (callback?: () => void): Promise<boolean> => {
    if (user) {
      callback?.()
      return true
    }

    try {
      const result = await loginWithGoogle()
      const loggedInUser = result.user

      if (!isAllowedEmail(loggedInUser.email ?? "")) {
        await logoutUser()
        toast.error("Only official Saranathan College accounts are allowed.")
        return false
      }

      const extendedUser = await enrichUser(loggedInUser)
      setUser(extendedUser)
      callback?.()
      return true
    } catch (error: any) {
      if (error.code !== "auth/popup-closed-by-user") {
        console.error("Authentication error:", error)
      }
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        requireAuth,
        loginWithEmail: handleEmailLogin,
        signupWithEmail: handleEmailSignup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
