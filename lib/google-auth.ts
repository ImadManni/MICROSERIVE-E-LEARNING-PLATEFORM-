declare global {
  interface Window {
    google: any
    gapi: any
  }
}

export interface GoogleUser {
  credential: string
  select_by: string
}

export function loadGoogleScript(clientId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Failed to load Google OAuth script"))
    document.head.appendChild(script)
  })
}

export async function initializeGoogleAuth(clientId: string): Promise<void> {
  await loadGoogleScript(clientId)

  return new Promise((resolve) => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: () => {},
      })
      resolve()
    } else {
      setTimeout(() => initializeGoogleAuth(clientId).then(resolve), 100)
    }
  })
}

export function renderGoogleButton(
  elementId: string,
  clientId: string,
  onSuccess: (response: GoogleUser) => void,
  onError: (error: Error) => void,
) {
  if (!window.google) {
    onError(new Error("Google OAuth script not loaded"))
    return
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response: GoogleUser) => {
      if (response.credential) {
        onSuccess(response)
      } else {
        onError(new Error("No credential received"))
      }
    },
  })

  window.google.accounts.id.renderButton(document.getElementById(elementId), {
    theme: "outline",
    size: "large",
    width: "100%",
    text: "signin_with",
    locale: "en",
  })
}

export async function verifyGoogleToken(token: string): Promise<{
  email: string
  name: string
  picture?: string
  sub: string
}> {
  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
    if (!response.ok) {
      throw new Error("Failed to verify token")
    }
    const data = await response.json()
    return {
      email: data.email,
      name: data.name,
      picture: data.picture,
      sub: data.sub,
    }
  } catch (error) {
    throw new Error("Token verification failed")
  }
}

