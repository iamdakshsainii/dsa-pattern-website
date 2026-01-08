import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'sainidaksh70@gmail.com';

// Next.js 16 uses "proxy" instead of "middleware"
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Skip for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') && !pathname.includes('/admin')
  ) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get('auth-token');

  let isAuthenticated = false;
  let user = null;

  if (authToken?.value) {
    const payload = verifyToken(authToken.value);
    isAuthenticated = payload !== null;
    user = payload;
  }

  const protectedRoutes = ['/dashboard', '/bookmarks', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  const authRoutes = ['/auth/login', '/auth/sign-up'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  const adminRoutes = pathname.startsWith('/admin');

  // Handle admin routes
  if (adminRoutes) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login?redirect=/admin', request.url));
    }
    if (user.email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle auth routes (redirect if already logged in)
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
