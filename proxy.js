import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';
import { connectToDatabase } from './lib/db';

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'sainidaksh70@gmail.com';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    (pathname.includes('.') && !pathname.includes('/admin'))
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

  const protectedRoutes = ['/dashboard', '/bookmarks', '/profile', '/roadmaps', '/patterns'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  const authRoutes = ['/auth/login', '/auth/sign-up'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  const adminRoutes = pathname.startsWith('/admin');
  const blockedPage = pathname === '/blocked';
  const welcomeBackPage = pathname === '/welcome-back';  // ✅ NEW

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


  if (isAuthenticated && !welcomeBackPage && !blockedPage) {
    try {
      const { db } = await connectToDatabase();
      const { ObjectId } = await import('mongodb');

      const dbUser = await db.collection('users').findOne(
        { _id: new ObjectId(user.id) },
        { projection: { showWelcomeBack: 1, isBlocked: 1, blockReason: 1, blockedAt: 1 } }
      );


      if (dbUser?.showWelcomeBack) {
        return NextResponse.redirect(new URL('/welcome-back', request.url));
      }

      if (dbUser?.isBlocked) {
        const blockedUrl = new URL('/blocked', request.url);
        blockedUrl.searchParams.set('reason', dbUser.blockReason || 'Account suspended');
        blockedUrl.searchParams.set('date', dbUser.blockedAt?.toISOString() || '');
        return NextResponse.redirect(blockedUrl);
      }
    } catch (error) {
      console.error('User status check error:', error);
    }
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
