import { NextResponse } from "next/server"

export function proxy(request) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  // Protected routes
  const protectedRoutes = ["/dashboard", "/bookmarks"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Let them access auth pages if they want (e.g., to see the form)

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/bookmarks/:path*"],
}
