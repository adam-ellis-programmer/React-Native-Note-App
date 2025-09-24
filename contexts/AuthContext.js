import { createContext, useContext, useEffect, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

// The provider is what wrapps the app
// this has children
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // check when every page loads
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    setLoading(true)
    const response = await authService.getUser()

    if (response?.error) {
      setUser(null)
    } else {
      setUser(response)
    }

    setLoading(false)
  }

  const login = async (email, password) => {
    const response = await authService.login(email, password)

    if (response?.error) {
      return response
    }

    await checkUser()
    return { success: true }
  }

  const register = async (email, password) => {
    const response = await authService.register(email, password)

    if (response?.error) {
      return response
    }

    return login(email, password) // Auto-login after register
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    await checkUser()
  }

  // Pass all the state / funcs down:
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {/* App gets passed in as children */}
      {children}
    </AuthContext.Provider>
  )
}

// bring into components with useAuth
export const useAuth = () => useContext(AuthContext)

/**
 * we can now use useAuth like 
 * const { user } = useAuth()
 * 
 * wrap the app in the main layout 
 */

