// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '../API/api.js'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth')) } catch { return null }
  })

  const navigate = useNavigate()
  const USE_MOCK = import.meta.env.VITE_USE_MOCK === '1'

  const login = async (username, password) => {
    if (USE_MOCK) {
      // acepta cualquier usuario/clave en modo mock
      const auth = { token: 'mock-token', username: username || 'usuario' }
      localStorage.setItem('auth', JSON.stringify(auth))
      setUser(auth)
      navigate('/vuelos')
      return
    }

    // flujo real (cuando tengas backend)
    const data = await api.post('/auth/login', { username, password })
    const auth = { token: data?.token, username: data?.username || username }
    localStorage.setItem('auth', JSON.stringify(auth))
    setUser(auth)
    navigate('/vuelos')
  }

  const logout = () => {
    localStorage.removeItem('auth')
    setUser(null)
    navigate('/login')
  }

  useEffect(() => {
    api.setToken(user?.token || null)
  }, [user])

  const value = useMemo(() => ({ user, login, logout }), [user])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)

export function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}
