import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

export function proxy(request) {
  const authToken = request.cookies.get('auth-token')
  const { pathname } = request.nextUrl

  let isAuthenticated = false

  if (authToken?.value) {
    const payload = verifyToken(authToken.value)
    isAuthenticated = payload !== null && payload !== undefined
  }

  const protectedRoutes = ['/dashboard', '/bookmarks']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  const authRoutes = ['/auth/login', '/auth/sign-up']
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ]
}
