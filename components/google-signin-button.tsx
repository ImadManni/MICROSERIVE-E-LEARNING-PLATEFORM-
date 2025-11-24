"use client"

import { useEffect, useRef, useState } from "react"
import { renderGoogleButton, verifyGoogleToken, type GoogleUser } from "@/lib/google-auth"
import { Loader2 } from "lucide-react"

interface GoogleSignInButtonProps {
  onSuccess: (email: string, name: string, token: string) => void
  onError?: (error: string) => void
  disabled?: boolean
}

export function GoogleSignInButton({ onSuccess, onError, disabled }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!clientId) {
      onError?.("Google Client ID not configured")
      return
    }

    const init = async () => {
      try {
        const { initializeGoogleAuth } = await import("@/lib/google-auth")
        await initializeGoogleAuth(clientId)
        setInitialized(true)
      } catch (error) {
        onError?.("Failed to initialize Google OAuth")
      }
    }

    init()
  }, [onError])

  useEffect(() => {
    if (!initialized || !buttonRef.current || disabled) return

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) return

    const handleSuccess = async (response: GoogleUser) => {
      setLoading(true)
      try {
        const userInfo = await verifyGoogleToken(response.credential)
        onSuccess(userInfo.email, userInfo.name, response.credential)
      } catch (error) {
        onError?.("Failed to verify Google token")
      } finally {
        setLoading(false)
      }
    }

    const handleError = (error: Error) => {
      onError?.(error.message)
    }

    renderGoogleButton(buttonRef.current.id, clientId, handleSuccess, handleError)
  }, [initialized, disabled, onSuccess, onError])

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-2">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div id="google-signin-button" ref={buttonRef} className="w-full" />
    </div>
  )
}

