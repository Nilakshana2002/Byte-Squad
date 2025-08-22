import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from './api'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

// tiny jwt decoder (no crypto verification, just base64 decode)
function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(true)
  const interceptorId = useRef(null)

  // hydrate on first load from token if user missing
  useEffect(() => {
    const hydrate = async () => {
      try {
        if (token && !user) {
          const payload = decodeJwt(token) // { id, role, name, exp, ... }
          if (payload?.exp && payload.exp * 1000 < Date.now()) {
            // token expired
            doLogout()
          } else if (payload) {
            // best effort user from token; backend also returns user on /auth/login
            setUser({ id: payload.id, role: payload.role, name: payload.name, email: payload.email })
          }
        }
      } finally {
        setLoading(false)
      }
    }
    hydrate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once

  // keep storage + axios header in sync
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  // Axios interceptor to catch 401s and logout
  useEffect(() => {
    // remove previous interceptor (hot reload safe)
    if (interceptorId.current !== null) {
      api.interceptors.response.eject(interceptorId.current)
      interceptorId.current = null
    }
    interceptorId.current = api.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status
        if (status === 401) {
          doLogout()
        }
        return Promise.reject(err)
      }
    )
    return () => {
      if (interceptorId.current !== null) {
        api.interceptors.response.eject(interceptorId.current)
        interceptorId.current = null
      }
    }
  }, [token])

  const doLogout = () => {
    setUser(null)
    setToken('')
  }

  // API
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setUser(data.user)      // { id, name, email, role }
    setToken(data.token)    // JWT (7d in your backend)
  }

  const register = async (payload) => {
    await api.post('/auth/register', payload)
    // keep user on register flow simple; caller can redirect to /login
  }

  const value = useMemo(() => {
    const isAuthed = !!token && !!user
    const hasRole = (...roles) => !!user && roles.includes(user.role)
    return {
      user,
      token,
      loading,
      isAuthed,
      hasRole,
      login,
      register,
      logout: doLogout,
      setUser,   // handy if you add /me update later
    }
  }, [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
