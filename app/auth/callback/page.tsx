"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    const email = searchParams.get("email")
    const name = searchParams.get("name")
    const id = searchParams.get("id")

    if (token && email && name && id) {
      const userData = {
        id: parseInt(id),
        email,
        fullName: name,
        roles: ["ROLE_STUDENT"],
      }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      api.setToken(token)

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
      router.push("/login?error=oauth2_failed")
    }
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}

