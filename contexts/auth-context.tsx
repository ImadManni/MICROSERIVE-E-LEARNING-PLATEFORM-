"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api, type User as ApiUser } from "@/lib/api"

interface AuthContextType {
  user: ApiUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      api.setToken(storedToken)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password)
    const userData: ApiUser = {
      id: response.id,
      email: response.email,
      fullName: response.fullName,
      roles: response.roles,
    }
    localStorage.setItem("token", response.token)
    localStorage.setItem("user", JSON.stringify(userData))
    setToken(response.token)
    setUser(userData)
    api.setToken(response.token)
  }

  const register = async (fullName: string, email: string, password: string) => {
    const response = await api.register(fullName, email, password)
    const userData: ApiUser = {
      id: response.id,
      email: response.email,
      fullName: response.fullName,
      roles: response.roles,
    }
    localStorage.setItem("token", response.token)
    localStorage.setItem("user", JSON.stringify(userData))
    setToken(response.token)
    setUser(userData)
    api.setToken(response.token)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    api.setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
