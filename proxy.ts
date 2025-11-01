import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const password = process.env.PASSWORD;
  const hasPassword = request.cookies.has('password');

  if (
    !hasPassword &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/api/login')
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (hasPassword) {
    const cookie = request.cookies.get('password');
    if (cookie?.value !== password) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('password');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
