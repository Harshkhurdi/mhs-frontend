import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { HiArrowUpRight } from 'react-icons/hi2'
import { useAuth } from '../context/AuthContext'
import { withTimeout } from '../lib/quote'

export default function AdminLogin() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await withTimeout(login(form.email.trim(), form.password))
      navigate('/admin', { replace: true })
    } catch (err) {
      const errors = {
        'auth/invalid-credential': 'The email or password is incorrect.',
        'auth/too-many-requests':
          'Too many attempts. Please wait before trying again.',
        'auth/network-request-failed':
          'Unable to connect. Check your internet connection and try again.',
      }
      setError(
        errors[err.code] ||
          'Sign-in is unavailable. Please check your details or contact the site administrator.',
      )
    } finally {
      setLoading(false)
    }
  }
  if (user) return <Navigate to="/admin" replace />
  return (
    <section className="login-section">
      <PageMeta title="Staff sign in | Medelec Healthcare Solutions" noindex />
      <div className="login-panel">
        <p className="eyebrow">MEDELEC / STAFF ACCESS</p>
        <h1>Welcome back.</h1>
        <p className="muted text-sm">
          Manage the equipment portfolio and review customer inquiries.
        </p>
        <form onSubmit={submit}>
          <fieldset disabled={loading}>
            <div className="login-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button" type="submit">
              {loading ? 'Signing in…' : 'Sign in'}
              <HiArrowUpRight />
            </button>
          </fieldset>
        </form>
        <p className="fine-print">
          For authorised Medelec staff. Account access is managed by your
          administrator.
        </p>
      </div>
    </section>
  )
}
