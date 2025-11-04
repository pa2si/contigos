import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter for proxy
class ProxyRateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(
    identifier: string,
    maxRequests: number = 60,
    windowMs: number = 60000
  ): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }

    const userRequests = this.requests.get(identifier)!;
    const validRequests = userRequests.filter(
      (timestamp) => timestamp > windowStart
    );

    if (validRequests.length >= maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }
}

const rateLimiter = new ProxyRateLimiter();

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

export function proxy(request: NextRequest) {
  const password = process.env.PASSWORD;
  const hasPassword = request.cookies.has('password');
  const clientIP = getClientIP(request);

  // Rate limiting - more restrictive for API routes
  const isAPIRoute = request.nextUrl.pathname.startsWith('/api/');
  const maxRequests = isAPIRoute ? 30 : 60; // 30 API calls or 60 page requests per minute

  if (!rateLimiter.isAllowed(clientIP, maxRequests, 60000)) {
    return new NextResponse('Rate limit exceeded', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
      },
    });
  }

  // Security headers for all responses
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');

  // Content Security Policy for additional XSS protection
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self';"
  );

  // API route specific security
  if (isAPIRoute) {
    // Check Content-Type for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return new NextResponse('Content-Type must be application/json', {
          status: 415,
        });
      }

      // Check Content-Length
      const contentLength = request.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 10 * 1024) {
        // 10KB limit
        return new NextResponse('Request body too large', {
          status: 413,
        });
      }
    }
  }

  // Authentication check
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
      const authResponse = NextResponse.redirect(
        new URL('/login', request.url)
      );
      authResponse.cookies.delete('password');
      return authResponse;
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
