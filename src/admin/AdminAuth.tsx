import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

const SESSION_KEY = 'plp_admin_auth'
const PASSWORD_HASH = btoa('Arjun123')

interface AdminAuthContextValue {
  authenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  authenticated: false,
  login: () => false,
  logout: () => {},
})

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    setAuthenticated(sessionStorage.getItem(SESSION_KEY) === PASSWORD_HASH)
  }, [])

  const login = (password: string) => {
    if (btoa(password) === PASSWORD_HASH) {
      sessionStorage.setItem(SESSION_KEY, PASSWORD_HASH)
      setAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthenticated(false)
  }

  return (
    <AdminAuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
