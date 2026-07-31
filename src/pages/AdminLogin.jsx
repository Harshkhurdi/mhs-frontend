import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ScrollReveal from '../components/ScrollReveal'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | Medelec Healthcare Solutions</title>
      </Helmet>

      <section className="min-h-screen bg-bg-platinum flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="w-full max-w-md space-y-8">
            <div>
              <h2 className="text-center text-2xl font-bold text-primary-blue">
                Admin Login
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-blue mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary-blue mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-teal w-full"
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center text-xs text-text-muted">
              <p>Authorized Medelec administrative personnel only.</p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}