import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Login() {
  const [email, setEmail] = useState('admin@canteen.local')
  const [password, setPassword] = useState('admin123')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email.trim(), password)
      // Show success alert
      alert('Login successful! Redirecting to dashboard...')
      nav('/')
    } catch (e) {
      // Show error alert for wrong credentials
      const errorMessage = e?.response?.data?.error || 'Wrong credentials! Please check your email and password.'
      setError(errorMessage)
      alert('Login failed: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand / header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            {/* Simple plate icon */}
            <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
              <path d="M4 10a6 6 0 1 0 12 0H4Z" fill="currentColor" />
              <path d="M3 18h14a1 1 0 0 0 1-1v-2H2v2a1 1 0 0 0 1 1Z" fill="currentColor" />
              <path d="M20 7v10h2V7a1 1 0 1 0-2 0Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Smart Canteen</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to manage orders and menu</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur">
          <form onSubmit={submit} className="p-6">
            {/* Error alert */}
            {error && (
              <div
                className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none
                           ring-0 transition placeholder:text-slate-400
                           focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  to="#"
                  className="text-xs text-slate-500 underline-offset-4 hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-slate-900 shadow-sm outline-none
                             ring-0 transition placeholder:text-slate-400
                             focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute inset-y-0 right-0 mr-2 flex items-center rounded-md px-2 text-slate-500 hover:text-slate-700 focus:outline-none"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? (
                    // Eye-off
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                      <path fill="currentColor" d="M2 3.3 3.3 2 22 20.7 20.7 22l-2.7-2.7A11.8 11.8 0 0 1 12 20C6 20 1.73 15.64.46 12.82a2.24 2.24 0 0 1 0-1.64C1.28 9.2 3.9 5.5 8.1 4.3L2 3.3Zm8.7 8.7a1.3 1.3 0 0 0 1.3 1.3l-1.3-1.3Zm-3.9-3.9 1.7 1.7a3.8 3.8 0 0 0 5.1 5.1l1.7 1.7a6 6 0 0 1-8.5-8.5Z" />
                      <path fill="currentColor" d="M12 6a6 6 0 0 1 6 6c0 .7-.12 1.36-.35 1.98l-2.1-2.1a3.8 3.8 0 0 0-3.53-3.53L9.97 6.35C10.6 6.12 11.3 6 12 6Zm0-4c6 0 10.27 4.36 11.54 7.18.3.63.3 1.39 0 2.04C22.72 14.8 20.1 18.5 15.9 19.7l-1.72-1.72c3.23-1 5.6-3.64 6.82-6-1.7-3.3-5.07-6-9-6-1 0-1.98.15-2.88.44L7.9 4.1A11.8 11.8 0 0 1 12 2Z" />
                    </svg>
                  ) : (
                    // Eye
                    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                      <path fill="currentColor" d="M12 4c6 0 10.27 4.36 11.54 7.18.3.63.3 1.39 0 2.04C22.72 16.8 18 21 12 21S1.28 16.8.46 13.22a2.24 2.24 0 0 1 0-1.64C1.73 8.36 6 4 12 4Zm0 2c-3.93 0-7.3 2.7-9 6 1.73 3.27 5.1 6 9 6s7.27-2.73 9-6c-1.7-3.3-5.07-6-9-6Zm0 2.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember + submit */}
            <div className="mb-6 flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300" />
                Remember me
              </label>
              <span className="text-xs text-slate-500">
                New here?{' '}
                <Link to="/register" className="font-medium text-slate-900 underline-offset-4 hover:underline">
                  Create an account
                </Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white
                         shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" className="opacity-75"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-4 text-center text-xs text-slate-500">
          By continuing you agree to the Terms & Privacy.
        </p>
      </div>
    </div>
  )
}
