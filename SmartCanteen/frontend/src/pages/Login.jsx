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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-3 sm:px-4">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Brand / header */}
        <div className="mb-4 sm:mb-6 text-center">
          <div className="mx-auto mb-2 sm:mb-3 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
            <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              <path d="M8 10h8v2H8z"/>
              <path d="M8 13h6v2H8z"/>
              <path d="M8 16h4v2H8z"/>
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Smart Canteen</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">Sign in to manage orders and menu</p>
        </div>

        {/* Card */}
        <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur">
          <form onSubmit={submit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Error alert */}
            {error && (
              <div
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 py-2 sm:py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="admin@canteen.local"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg sm:rounded-xl border border-slate-300 px-3 py-2 sm:py-2.5 pr-10 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="admin123"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? (
                    // Eye slash
                    <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
                      <path fill="currentColor" d="M12 4c6 0 10.27 4.36 11.54 7.18.3.63.3 1.39 0 2.04C22.72 16.8 18 21 12 21S1.28 16.8.46 13.22a2.24 2.24 0 0 1 0-1.64C1.73 8.36 6 4 12 4Zm0 2c-3.93 0-7.3 2.7-9 6 1.73 3.27 5.1 6 9 6s7.27-2.73 9-6c-1.7-3.3-5.07-6-9-6-1 0-1.98.15-2.88.44L7.9 4.1A11.8 11.8 0 0 1 12 2Z" />
                    </svg>
                  ) : (
                    // Eye
                    <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
                      <path fill="currentColor" d="M12 4c6 0 10.27 4.36 11.54 7.18.3.63.3 1.39 0 2.04C22.72 16.8 18 21 12 21S1.28 16.8.46 13.22a2.24 2.24 0 0 1 0-1.64C1.73 8.36 6 4 12 4Zm0 2c-3.93 0-7.3 2.7-9 6 1.73 3.27 5.1 6 9 6s7.27-2.73 9-6c-1.7-3.3-5.07-6-9-6-1 0-1.98.15-2.88.44L7.9 4.1A11.8 11.8 0 0 1 12 2Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember + submit */}
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300" />
                Remember me
              </label>
              <span className="text-xs text-slate-500">
                New here?{' '}
                <Link to="/register" className="font-medium text-slate-900 hover:underline">
                  Create an account
                </Link>
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg sm:rounded-xl bg-slate-900 px-4 py-2.5 sm:py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-slate-600">
            By continuing you agree to the Terms & Privacy.
          </p>
        </div>
      </div>
    </div>
  )
}
