import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');

  if (request.nextUrl.pathname === '/login' && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!refreshToken && request.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
