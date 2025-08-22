import { useState } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Menu from './pages/Menu'
import Kitchen from './pages/Kitchen'
import AdminMenu from './pages/AdminMenu'

function Private({ roles, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const linkBase =
    'inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium transition'
  const linkActive = 'bg-slate-900 text-white shadow-sm'
  const linkIdle = 'text-slate-700 hover:bg-slate-100'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M4 10a6 6 0 1 0 12 0H4Z" fill="currentColor" />
                <path d="M3 18h14a1 1 0 0 0 1-1v-2H2v2a1 1 0 0 0 1 1Z" fill="currentColor" />
                <path d="M20 7v10h2V7a1 1 0 1 0-2 0Z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-base font-semibold text-slate-900">Smart Canteen</span>
            {user && (
              <span className="ml-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                {user.role}
              </span>
            )}
          </div>

          {/* Desktop links */}
          <div className="hidden items-center gap-2 md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkIdle}`
              }
            >
              Menu
            </NavLink>

            {user && (user.role === 'ADMIN' || user.role === 'STAFF') && (
              <NavLink
                to="/kitchen"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkIdle}`
                }
              >
                Kitchen
              </NavLink>
            )}

            {user?.role === 'ADMIN' && (
              <NavLink
                to="/admin/menu"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkIdle}`
                }
              >
                Admin Menu
              </NavLink>
            )}

            <div className="ml-2 h-6 w-px bg-slate-200" />

            {user ? (
              <button
                onClick={logout}
                className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkIdle}`
                }
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile toggler */}
          <button
            className="inline-flex items-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
              {open ? (
                <path fill="currentColor" d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3L16.9 4.3z" />
              ) : (
                <path fill="currentColor" d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-slate-200 md:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
              <NavLink
                to="/"
                end
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkIdle}`
                }
              >
                Menu
              </NavLink>

              {user && (user.role === 'ADMIN' || user.role === 'STAFF') && (
                <NavLink
                  to="/kitchen"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkIdle}`
                  }
                >
                  Kitchen
                </NavLink>
              )}

              {user?.role === 'ADMIN' && (
                <NavLink
                  to="/admin/menu"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkIdle}`
                  }
                >
                  Admin Menu
                </NavLink>
              )}

              <div className="h-px w-full bg-slate-200" />

              {user ? (
                <button
                  onClick={() => {
                    setOpen(false)
                    logout()
                  }}
                  className="inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkIdle}`
                  }
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/kitchen"
            element={
              <Private roles={['ADMIN', 'STAFF']}>
                <Kitchen />
              </Private>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <Private roles={['ADMIN']}>
                <AdminMenu />
              </Private>
            }
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Smart Canteen</span>
          <span>v1.0</span>
        </div>
      </footer>
    </div>
  )
}
