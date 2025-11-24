import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/dashboard", "/my-courses", "/admin"]
const authRoutes = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // For protected routes, let client-side handle auth check
  // This allows localStorage-based auth to work
  // The ProtectedRoute component will handle redirects
  if (isProtectedRoute && !token) {
    // Don't redirect here - let client-side ProtectedRoute handle it
    // This allows the page to load and check localStorage
    return NextResponse.next()
  }

  // Redirect to dashboard if accessing auth routes with token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/my-courses/:path*", "/admin/:path*", "/login", "/register"],
}
