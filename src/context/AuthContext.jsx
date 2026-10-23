import { createContext, useContext, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../config/firebaseClient'
import { isApprovedStaff } from '../lib/staffAccess'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(auth))

  useEffect(() => {
    let mounted = true
    if (!auth) return

    // Recheck the approved UID on restored sessions and every login/logout.
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!mounted) return
        const staffUser = isApprovedStaff(firebaseUser) ? firebaseUser : null
        setSession(staffUser)
        setUser(staffUser)
        setLoading(false)
        if (firebaseUser && !staffUser) {
          // The route stays closed even if clearing persistence fails offline.
          signOut(auth).catch(() => {})
        }
      },
      () => {
        if (mounted) {
          setSession(null)
          setUser(null)
          setLoading(false)
        }
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
    if (!isApprovedStaff(credentials.user)) {
      setSession(null)
      setUser(null)
      try {
        await signOut(auth)
      } catch {
        // Authorization remains denied independently of sign-out delivery.
      }
      const error = new Error('This account is not approved for staff access.')
      error.code = 'auth/staff-access-denied'
      throw error
    }
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
