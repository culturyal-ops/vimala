import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimiter, getClientIP, RATE_LIMITS } from './lib/rate-limiter';

// Security headers applied to all responses
const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://api.razorpay.com https://vercel.live wss://*.supabase.co",
    "frame-src https://api.razorpay.com https://checkout.razorpay.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const ip = getClientIP(request);

  // Apply rate limiting to API routes
  if (path.startsWith('/api/')) {
    // Checkout endpoints - stricter limits
    if (path.startsWith('/api/commerce/checkout')) {
      const result = await rateLimiter.check({
        identifier: `checkout:ip:${ip}`,
        maxRequests: RATE_LIMITS.CHECKOUT.max,
        windowMs: RATE_LIMITS.CHECKOUT.window,
      });

      if (!result.success) {
        return new NextResponse(
          JSON.stringify({
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many requests. Please try again later.',
            },
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(result.retryAfter || 60),
              'X-RateLimit-Limit': String(result.limit),
              'X-RateLimit-Remaining': String(result.remaining),
              'X-RateLimit-Reset': String(result.reset),
            },
          }
        );
      }
    }

    // Payment endpoints
    if (path.startsWith('/api/commerce/payments/')) {
      const result = await rateLimiter.check({
        identifier: `payment:ip:${ip}`,
        maxRequests: RATE_LIMITS.PAYMENT_VERIFY.max,
        windowMs: RATE_LIMITS.PAYMENT_VERIFY.window,
      });

      if (!result.success) {
        return new NextResponse(
          JSON.stringify({
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many payment requests.',
            },
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(result.retryAfter || 60),
            },
          }
        );
      }
    }

    // General API rate limiting
    const result = await rateLimiter.check({
      identifier: `api:ip:${ip}`,
      maxRequests: RATE_LIMITS.API_PER_IP.max,
      windowMs: RATE_LIMITS.API_PER_IP.window,
    });

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          error: {
            code: 'RATE_LIMITED',
            message: 'Too many requests. Please slow down.',
          },
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(result.retryAfter || 60),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.reset),
          },
        }
      );
    }
  }

  // Create response with security headers
  const response = NextResponse.next();

  // Apply security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add rate limit headers for successful requests
  if (path.startsWith('/api/')) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
