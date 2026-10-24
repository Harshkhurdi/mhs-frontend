import { useContext, useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, authReady } from '../config/firebaseAuth'
import { isApprovedStaff } from '../lib/staffAccess'
import { signInStaff, watchStaffSession } from '../lib/staffSession'
import { StaffContext as AuthContext } from './StaffContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(auth))
  useEffect(() => {
    if (!auth) return
    return watchStaffSession({
      ready: authReady,
      subscribe: (changed, failed) => onAuthStateChanged(auth, changed, failed),
      clear: () => signOut(auth), approved: isApprovedStaff,
      changed: staff => { setSession(staff); setUser(staff); setLoading(false) },
      failed: () => { setSession(null); setUser(null); setLoading(false) },
    })
  }, [])
  const login = async (email, password) => {
    if (!auth) throw new Error('Admin sign-in is not configured. Please contact the site administrator.')
    return signInStaff({ ready: authReady, signIn: (email, password) => signInWithEmailAndPassword(auth, email, password), clear: () => signOut(auth), approved: isApprovedStaff }, email, password)
  }
  const logout = async () => { await signOut(auth) }
  return <AuthContext.Provider value={{ user, session, loading, login, logout }}>{children}</AuthContext.Provider>
}
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
