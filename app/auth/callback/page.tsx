"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get("token")
    const email = searchParams.get("email")
    const name = searchParams.get("name")
    const id = searchParams.get("id")

    if (token && email && name && id) {
      const userData = {
        id,
        email,
        fullName: name,
        roles: ["ROLE_STUDENT"],
      }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))

      if (typeof document !== "undefined") {
        const expires = new Date()
        expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000)
        document.cookie = `token=${token};expires=${expires.toUTCString()};path=/;SameSite=Lax`
      }

      setTimeout(() => {
        router.push("/dashboard")
        window.location.reload()
      }, 500)
    } else {
      router.push("/login?error=oauth2_callback_failed")
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}

