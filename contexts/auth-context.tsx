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

// Helper to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === "undefined") return
  try {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  } catch (error) {
    // Silently fail if cookies are disabled
    console.warn("Failed to set cookie:", error)
  }
}

// Helper to delete cookie
const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

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
      // Sync to cookie if not already set
      if (typeof document !== "undefined") {
        const cookieToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1]
        if (!cookieToken || cookieToken !== storedToken) {
          setCookie("token", storedToken, 7)
        }
      }
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
    setCookie("token", response.token, 7) // Also set in cookie for middleware
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
    setCookie("token", response.token, 7) // Also set in cookie for middleware
    setToken(response.token)
    setUser(userData)
    api.setToken(response.token)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    deleteCookie("token")
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
