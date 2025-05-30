import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user');
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = request.nextUrl.pathname === '/login';

  // If trying to access admin routes without being logged in
  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access login page while already logged in
  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}; 