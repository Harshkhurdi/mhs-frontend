import { AuthProvider } from '../context/AuthContext'

export default function StaffArea({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}
