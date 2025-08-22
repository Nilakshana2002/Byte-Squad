import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function Register() {
  const [name, setName] = useState('Student')
  const [email, setEmail] = useState('student@canteen.local')
  const [password, setPassword] = useState('student123')
  const [showPw, setShowPw] = useState(false)
  const [role, setRole] = useState('STUDENT')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const nav = useNavigate()

  const validate = () => {
    if (!name.trim()) return 'Name is required'
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return 'Valid email is required'
    if (!password || password.length < 6) return 'Password must be at least 6 characters'
    return ''
  }

  const submit = async (e) => {
    e.preventDefault()
    const v = validate()
    if (v) return setError(v)
    setError('')
    setLoading(true)
    try {
      await register({ name: name.trim(), email: email.trim(), password, role })
      nav('/login', { replace: true })
    } catch (e) {
      setError(e?.response?.data?.error || 'Registration failed')
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
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Create your account</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Join Smart Canteen to place and manage orders
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur">
          <form onSubmit={submit} className="p-4 sm:p-6">
            {/* Error alert */}
            {error && (
              <div className="mb-3 sm:mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-lg sm:rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none
                           focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="Your full name"
              />
            </div>

            {/* Email */}
            <div className="mb-3 sm:mb-4">
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
                className="block w-full rounded-lg sm:rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none
                           focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg sm:rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-slate-900 shadow-sm outline-none
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
                    <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
                      <path fill="currentColor" d="M2 3.3 3.3 2 22 20.7 20.7 22l-2.7-2.7A11.8 11.8 0 0 1 12 20C6 20 1.73 15.64.46 12.82a2.24 2.24 0 0 1 0-1.64C1.28 9.2 3.9 5.5 8.1 4.3L2 3.3Zm8.7 8.7a1.3 1.3 0 0 0 1.3 1.3l-1.3-1.3Zm-3.9-3.9 1.7 1.7a3.8 3.8 0 0 0 5.1 5.1l1.7 1.7a6 6 0 0 1-8.5-8.5Z" />
                      <path fill="currentColor" d="M12 6a6 6 0 0 1 6 6c0 .7-.12 1.36-.35 1.98l-2.1-2.1a3.8 3.8 0 0 0-3.53-3.53L9.97 6.35C10.6 6.12 11.3 6 12 6Zm0-4c6 0 10.27 4.36 11.54 7.18.3.63.3 1.39 0 2.04C22.72 14.8 20.1 18.5 15.9 19.7l-1.72-1.72c3.23-1 5.6-3.64 6.82-6-1.7-3.3-5.07-6-9-6-1 0-1.98.15-2.88.44L7.9 4.1A11.8 11.8 0 0 1 12 2Z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true">
                      <path fill="currentColor" d="M12 4c6 0 10.27 4.36 11.54 7.18.3.63.3 1.39 0 2.04C22.72 16.8 18 21 12 21S1.28 16.8.46 13.22a2.24 2.24 0 0 1 0-1.64C1.73 8.36 6 4 12 4Zm0 2c-3.93 0-7.3 2.7-9 6 1.73 3.27 5.1 6 9 6s7.27-2.73 9-6c-1.7-3.3-5.07-6-9-6Zm0 2.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="role" className="mb-1 block text-sm font-medium text-slate-700">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full rounded-lg sm:rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none
                           focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value="STUDENT">Student</option>
                <option value="STAFF">Staff</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-lg sm:rounded-xl bg-slate-900 px-4 py-2.5 sm:py-3 text-sm font-medium text-white
                         shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" className="opacity-75"></path>
                  </svg>
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>

            <p className="mt-3 sm:mt-4 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-slate-900 underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          By continuing you agree to the Terms & Privacy.
        </p>
      </div>
    </div>
  )
}
