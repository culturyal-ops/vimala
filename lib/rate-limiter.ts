import { Ratelimit } from '@upstash/ratelimit';
import { getRedisClient, isRedisConfigured } from './redis';

export interface RateLimitConfig {
  identifier: string; // IP, email, user ID, etc.
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in ms
  retryAfter?: number; // Seconds until retry
}

// Rate limit configurations for different endpoint types
export const RATE_LIMITS = {
  // Authentication endpoints
  OTP_REQUEST_PER_EMAIL: { max: 3, window: 15 * 60 * 1000 }, // 3 per 15 min
  OTP_REQUEST_PER_IP: { max: 10, window: 60 * 60 * 1000 }, // 10 per hour
  OTP_VERIFY_PER_EMAIL: { max: 3, window: 10 * 60 * 1000 }, // 3 per 10 min
  LOGIN_PER_IP: { max: 5, window: 15 * 60 * 1000 }, // 5 per 15 min

  // API endpoints
  API_PER_IP: { max: 100, window: 60 * 1000 }, // 100 per minute
  API_PER_USER: { max: 60, window: 60 * 1000 }, // 60 per minute

  // Payment endpoints
  PAYMENT_CREATE: { max: 10, window: 60 * 1000 }, // 10 per minute
  PAYMENT_VERIFY: { max: 20, window: 60 * 1000 }, // 20 per minute
  PAYMENT_WEBHOOK: { max: 100, window: 60 * 1000 }, // 100 per minute

  // Commerce endpoints
  CHECKOUT: { max: 5, window: 60 * 1000 }, // 5 per minute
  CART_SYNC: { max: 30, window: 60 * 1000 }, // 30 per minute

  // Admin endpoints
  ADMIN_PER_USER: { max: 120, window: 60 * 1000 }, // 120 per minute
} as const;

/**
 * Redis-backed distributed rate limiter using sliding window algorithm
 */
export class RateLimiter {
  private limiters: Map<string, Ratelimit> = new Map();

  /**
   * Check if request is within rate limit
   */
  async check(config: RateLimitConfig): Promise<RateLimitResult> {
    // If Redis not configured, allow all requests (development mode)
    if (!isRedisConfigured()) {
      console.warn('[RateLimiter] Redis not configured - rate limiting disabled');
      return {
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests,
        reset: Date.now() + config.windowMs,
      };
    }

    const limiter = this.getLimiter(config);
    const result = await limiter.limit(config.identifier);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
    };
  }

  /**
   * Reset rate limit for a specific identifier
   */
  async reset(identifier: string): Promise<void> {
    if (!isRedisConfigured()) return;

    const redis = getRedisClient();
    const keys = await redis.keys(`ratelimit:*:${identifier}`);

    if (keys && keys.length > 0) {
      await redis.del(...keys);
    }
  }

  /**
   * Get or create rate limiter for specific configuration
   */
  private getLimiter(config: RateLimitConfig): Ratelimit {
    const key = `${config.maxRequests}:${config.windowMs}`;

    let limiter = this.limiters.get(key);
    if (limiter) return limiter;

    const redis = getRedisClient();

    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowMs} ms`),
      analytics: true,
      prefix: 'ratelimit',
    });

    this.limiters.set(key, limiter);
    return limiter;
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

/**
 * Helper function to get client IP address from request
 */
export function getClientIP(request: Request): string {
  // Check Vercel/Next.js headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  return 'unknown';
}
