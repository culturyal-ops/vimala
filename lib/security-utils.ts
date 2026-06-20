/**
 * Security utility functions for input sanitization and validation
 */

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove inline event handlers
    .trim()
    .substring(0, maxLength);
}

/**
 * Sanitize search query to prevent SQL injection in LIKE queries
 */
export function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[%_\\]/g, '\\$&') // Escape LIKE wildcards
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/[;'"]/g, '') // Remove SQL special characters
    .trim()
    .substring(0, 200);
}

/**
 * Sanitize URL to prevent open redirects
 */
export function sanitizeURL(url: string, allowedDomains: string[] = []): string | null {
  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    // Check against allowed domains if provided
    if (allowedDomains.length > 0) {
      const isAllowed = allowedDomains.some(
        (domain) =>
          parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
      );

      if (!isAllowed) return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate Indian pincode
 */
export function isValidPincode(pincode: string): boolean {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
}

/**
 * Generate cryptographically secure random string
 */
export function generateSecureToken(length = 32): string {
  if (typeof crypto === 'undefined' || !crypto.randomUUID) {
    throw new Error('Crypto API not available');
  }

  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get client IP address from request with proxy support
 */
export function getClientIP(request: Request): string {
  // Check common proxy headers in order of preference
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'true-client-ip',
    'x-client-ip',
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can be a comma-separated list
      const ip = value.split(',')[0]?.trim();
      if (ip && ip !== 'unknown') return ip;
    }
  }

  return 'unknown';
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}

/**
 * Check if IP address is suspicious (simple heuristics)
 */
export function isSuspiciousIP(ip: string): boolean {
  // Block known bad ranges (example)
  const suspiciousPatterns = [
    /^0\./, // Reserved
    /^127\./, // Loopback
    /^10\./, // Private
    /^172\.(1[6-9]|2[0-9]|3[01])\./, // Private
    /^192\.168\./, // Private
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(ip));
}

/**
 * Mask sensitive data for logging
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@***';

  const maskedLocal =
    local.length <= 3
      ? '***'
      : `${local[0]}***${local[local.length - 1]}`;

  return `${maskedLocal}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length < 4) return '****';
  return `****${phone.slice(-4)}`;
}

export function maskIP(ip: string): string {
  const parts = ip.split('.');
  if (parts.length !== 4) return '***';
  return `${parts[0]}.${parts[1]}.***.**`;
}

/**
 * Time-safe string comparison to prevent timing attacks
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
