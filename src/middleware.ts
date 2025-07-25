import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user');
  let user: { isAdmin?: boolean } | null = null;

  if (userCookie) {
    try {
      user = JSON.parse(userCookie.value);
    } catch (e) {
      console.error('Failed to parse user cookie in middleware:', e);
      user = null; // Treat as not logged in if cookie is invalid
    }
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isProducerRoute = request.nextUrl.pathname.startsWith('/producer');

  const isLoginRoute = request.nextUrl.pathname === '/login';

  // Protect /admin routes: only accessible by logged-in admins
  if (isAdminRoute) {
    if (!user || !user.isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }



  // Protect /producer routes: only accessible by logged-in non-admins (producers)
  if (isProducerRoute) {
    if (!user) { // Not logged in at all
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (user.isAdmin) { // Logged in as admin, but trying to access producer route
      return NextResponse.redirect(new URL('/admin', request.url)); // Redirect admin away
    }
  }

  // If trying to access login page while already logged in
  if (isLoginRoute && user) {
    if (user.isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else {
      return NextResponse.redirect(new URL('/producer', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/producer/:path*', '/login'],
};
