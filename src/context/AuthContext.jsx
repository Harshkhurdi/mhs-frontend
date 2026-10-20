import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../config/firebaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(auth))

  useEffect(() => {
    let mounted = true
    if (!auth) return

    // Firebase delivers the current auth state on subscribe (covers page
    // reloads and token refreshes) and pushes changes on login/logout.
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!mounted) return
        setSession(firebaseUser)
        setUser(firebaseUser)
        setLoading(false)
      },
      () => {
        if (mounted) setLoading(false)
      },
    )

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    if (!auth)
      throw new Error(
        'Admin sign-in is not configured. Please contact the site administrator.',
      )
    const credentials = await signInWithEmailAndPassword(auth, email, password)
    return credentials
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
