# Security Hardening & Infrastructure — Implementation Tasks

**Feature:** Comprehensive security hardening and production-ready infrastructure
**Status:** Ready for Implementation
**Created:** 2026-06-21

---

## Overview

This implementation plan converts the security hardening design into discrete coding tasks. Each task builds incrementally, with checkpoints to ensure system stability. Tasks are ordered to deliver critical security features first (rate limiting, authentication) before moving to monitoring and optimization.

---

## Tasks

### Phase 1: Infrastructure and Core Setup

- [x] 1. Set up Upstash Redis and core dependencies
  - Install `@upstash/redis`, `@upstash/ratelimit`, and `fast-check` packages
  - Create Redis client configuration in `lib/redis.ts`
  - Set up environment variables for Upstash connection
  - Test Redis connection and basic operations
  - _Requirements: 4.1_

- [ ] 2. Create rate limiting infrastructure
  - [x] 2.1 Implement rate limiter interface and Redis-backed implementation
    - Create `lib/rate-limiter.ts` with RateLimiter interface
    - Implement sliding window rate limiting using `@upstash/ratelimit`
    - Define rate limit configurations for different endpoint types
    - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3_
  
  - [ ] 2.2 Write property test for rate limiter
    - **Property 1: Rate limit enforcement**
    - **Validates: Requirements 1.1, 1.2, 4.2, 4.3**
  
  - [ ] 2.3 Write property test for sliding window accuracy
    - **Property 2: Sliding window accuracy**
    - **Validates: Requirements 4.2**

- [x] 3. Implement security utilities and helpers
  - Create `lib/security-utils.ts` with IP extraction, sanitization functions
  - Implement client IP detection (handle proxies, Vercel headers)
  - Create input sanitization functions (string, search query, URL)
  - _Requirements: 5.2, 5.3_

### Phase 2: Authentication Security

- [ ] 4. Implement secure OTP system
  - [x] 4.1 Create OTP generation and storage
    - Implement cryptographically secure 6-digit OTP generation
    - Create `otp_codes` table in Supabase with proper schema
    - Implement OTP hashing for secure storage
    - Add expiration tracking (10 minutes)
    - _Requirements: 2.1, 2.2_
  
  - [ ] 4.2 Write property tests for OTP
    - **Property 3: OTP format and randomness**
    - **Property 4: OTP expiration**
    - **Validates: Requirements 2.1, 2.2**
  
  - [ ] 4.3 Implement OTP verification with attempt tracking
    - Create verification function with attempt counting
    - Enforce 3-attempt limit per OTP
    - Record failed attempts with IP address
    - _Requirements: 2.3, 2.4_
  
  - [ ] 4.4 Write property test for OTP attempt limiting
    - **Property 5: OTP attempt limiting**
    - **Validates: Requirements 2.3**

- [ ] 5. Implement account lockout protection
  - [ ] 5.1 Create failed attempts tracking
    - Create `failed_login_attempts` table in Supabase
    - Implement attempt recording and retrieval functions
    - Add lockout logic (5 attempts = 15 min lockout)
    - _Requirements: 2.5_
  
  - [ ] 5.2 Write property test for account lockout
    - **Property 6: Account lockout enforcement**
    - **Validates: Requirements 2.5**

- [ ] 6. Harden session management
  - [ ] 6.1 Implement secure cookie configuration
    - Configure session cookies with httpOnly, secure, sameSite attributes
    - Implement session creation with proper cookie options
    - Add session rotation on privilege escalation
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ] 6.2 Write property tests for session security
    - **Property 7: Secure cookie attributes**
    - **Property 8: Session invalidation on logout**
    - **Validates: Requirements 3.1, 3.3, 3.5**
  
  - [ ] 6.3 Write unit tests for session edge cases
    - Test cookie attributes in production vs development
    - Test session rotation behavior
    - Test logout invalidation

- [ ] 7. Checkpoint - Authentication system validation
  - Run all authentication tests
  - Verify OTP generation, verification, and expiration
  - Test rate limiting on auth endpoints
  - Verify account lockout works correctly
  - Ask user if questions arise

### Phase 3: API Security Middleware

- [ ] 8. Implement request validation middleware
  - [ ] 8.1 Create Zod validation schemas
    - Define schemas for all API endpoints (orders, addresses, reviews)
    - Create validation middleware wrapper
    - Implement error formatting for validation failures
    - _Requirements: 5.1_
  
  - [ ] 8.2 Write property test for input validation
    - **Property 9: Input validation enforcement**
    - **Validates: Requirements 5.1**
  
  - [ ] 8.3 Add file upload validation
    - Implement file type and size validation
    - Add MIME type checking
    - Enforce upload limits
    - _Requirements: 5.4_
  
  - [ ] 8.4 Write property test for file upload validation
    - **Property 10: File upload validation**
    - **Validates: Requirements 5.4**

- [ ] 9. Implement request size and timeout enforcement
  - Add request payload size limiting middleware
  - Implement query parameter count validation
  - Add timeout handling for long-running requests
  - _Requirements: 5.5_
  
  - [ ] 9.1 Write property test for request size limiting
    - **Property 11: Request size limiting**
    - **Validates: Requirements 5.5**

- [ ] 10. Create authentication and authorization middleware
  - [ ] 10.1 Implement JWT verification middleware
    - Create `requireAuth` middleware for protected routes
    - Extract and verify JWT from cookies
    - Handle token expiration and invalid tokens
    - _Requirements: 6.1_
  
  - [ ] 10.2 Write property test for authentication enforcement
    - **Property 12: Authentication requirement enforcement**
    - **Validates: Requirements 6.1**
  
  - [ ] 10.3 Implement role-based authorization
    - Create `requireRole` middleware
    - Add role checking logic (admin, manager, customer)
    - Implement resource ownership checks (orders, addresses)
    - _Requirements: 6.2, 6.3, 6.4_
  
  - [ ] 10.4 Write property test for RBAC
    - **Property 13: Role-based authorization**
    - **Validates: Requirements 6.2, 6.3, 6.4**

- [ ] 11. Integrate rate limiting into Next.js middleware
  - Create `middleware.ts` with rate limiting logic
  - Apply rate limits to auth endpoints (OTP, login)
  - Apply rate limits to API endpoints (per-IP, per-user)
  - Return proper 429 responses with Retry-After headers
  - _Requirements: 1.1, 1.2, 1.4, 4.1, 4.3_

- [ ] 12. Checkpoint - API security validation
  - Run all API security tests
  - Test authentication and authorization flows
  - Verify rate limiting works across endpoints
  - Test input validation on all routes
  - Ask user if questions arise

### Phase 4: Payment Security

- [ ] 13. Implement Razorpay webhook verification
  - [ ] 13.1 Create webhook signature verification
    - Implement HMAC signature verification
    - Add timestamp-based replay prevention (5 min window)
    - Create webhook handler with verification
    - _Requirements: 7.1, 7.4_
  
  - [ ] 13.2 Write property tests for webhook security
    - **Property 14: Webhook signature verification**
    - **Property 15: Webhook replay prevention**
    - **Validates: Requirements 7.1, 7.4**

- [ ] 14. Implement payment idempotency enforcement
  - [ ] 14.1 Create idempotency key tracking
    - Implement Redis-based idempotency key storage
    - Add duplicate detection and response caching
    - Handle concurrent processing prevention
    - _Requirements: 7.5_
  
  - [ ] 14.2 Write property test for idempotency
    - **Property 16: Idempotency enforcement**
    - **Validates: Requirements 7.5**

- [ ] 15. Secure payment integration
  - Update payment routes to use hosted Razorpay checkout
  - Ensure no card data stored in database
  - Implement payment verification on server
  - _Requirements: 8.1, 8.2_
  
  - [ ] 15.1 Write unit tests for payment security
    - Test that database has no card fields
    - Test that secret keys not exposed to client
    - Test payment log sanitization

### Phase 5: Security Headers and Infrastructure

- [ ] 16. Implement security headers
  - [x] 16.1 Configure security headers
    - Add CSP, X-Frame-Options, HSTS, and other headers
    - Configure headers in `next.config.js` and middleware
    - Adjust CSP for Razorpay integration
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [ ] 16.2 Write property test for security headers
    - **Property 18: Security headers presence**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6**

- [ ] 17. Environment variable security audit
  - [ ] 17.1 Audit and secure environment variables
    - Move all secrets to environment variables
    - Create separate .env files for each environment
    - Verify .env in .gitignore
    - Update Vercel environment configuration
    - _Requirements: 10.1, 10.3, 10.4_
  
  - [ ] 17.2 Write security scanning tests
    - Test that no secrets in code
    - Test that service keys not in client bundle
    - Test that dependencies have exact versions

### Phase 6: Database Security (RLS)

- [ ] 18. Audit and fix RLS policies
  - [ ] 18.1 Review existing RLS policies
    - Audit all tables for RLS enablement
    - Document current policy coverage
    - Identify gaps in protection
    - _Requirements: 11.1_
  
  - [ ] 18.2 Implement missing RLS policies
    - Enable RLS on addresses table
    - Add RLS policies for OTP codes table
    - Fix order update policies
    - Add policies for user roles table
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [ ] 18.3 Write property tests for RLS
    - **Property 19: Row-level security enforcement**
    - **Property 20: Admin table access control**
    - **Validates: Requirements 11.2, 11.3**

- [ ] 19. Minimize service role usage
  - Audit code for service role (supabaseAdmin) usage
  - Replace with authenticated client where possible
  - Add explicit permission checks for remaining usage
  - Document necessary service role usage
  - _Requirements: 11.4_

- [ ] 20. Checkpoint - Database security validation
  - Run all RLS tests
  - Verify user isolation works correctly
  - Test admin access controls
  - Verify service role minimization
  - Ask user if questions arise

### Phase 7: Monitoring and Logging

- [ ] 21. Implement security event logging
  - [ ] 21.1 Create security logging infrastructure
    - Set up Axiom or Logtail client
    - Create `security_events` table in Supabase
    - Implement SecurityLogger class with structured logging
    - Define all security event types
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [ ] 21.2 Write property test for security logging
    - **Property 21: Security event logging**
    - **Validates: Requirements 2.4, 12.1, 12.2, 12.3, 12.4**

- [ ] 22. Integrate logging across security components
  - Add logging to authentication handlers (OTP, login, logout)
  - Add logging to rate limiter (violations)
  - Add logging to payment verification (failures)
  - Add logging to authorization checks (admin actions)
  - _Requirements: 2.4, 7.3, 12.1, 12.2, 12.3, 12.4_

- [ ] 23. Implement real-time alerting
  - [ ] 23.1 Create alerting engine
    - Implement AlertingEngine with rule evaluation
    - Define alert rules (failed logins, webhook failures, rate limits)
    - Implement alert actions (email, Slack)
    - _Requirements: 13.1, 13.2, 13.3, 13.4_
  
  - [ ] 23.2 Write unit tests for alerting
    - Test alert triggering thresholds
    - Test alert delivery mechanisms
    - Test alert rule evaluation

- [ ] 24. Create security metrics dashboard
  - [ ] 24.1 Implement metrics calculation
    - Create metrics aggregation functions
    - Implement success rate calculations
    - Implement error rate tracking per endpoint
    - _Requirements: 14.3, 14.4_
  
  - [ ] 24.2 Write property tests for metrics
    - **Property 22: Success rate calculation accuracy**
    - **Property 23: Error rate tracking**
    - **Validates: Requirements 14.3, 14.4**

### Phase 8: Testing and Validation

- [ ] 25. Implement comprehensive property-based tests
  - Ensure all 23 properties have corresponding tests
  - Configure fast-check with 100 iterations minimum
  - Add proper test tags for traceability
  - Verify all tests pass

- [ ] 26. Add integration tests
  - [ ] 26.1 Test Redis rate limiter persistence
    - Verify limits survive service restart
  
  - [ ] 26.2 Test Supabase RLS integration
    - Test user isolation across operations
  
  - [ ] 26.3 Test payment webhook flow
    - End-to-end webhook verification test

- [ ] 27. Add edge case and error handling tests
  - [ ] 27.1 Test SQL injection prevention
    - Attempt SQL injection in search queries
  
  - [ ] 27.2 Test XSS prevention
    - Attempt XSS in user inputs
  
  - [ ] 27.3 Test error handling graceful degradation
    - Test behavior when Redis unavailable
    - Test behavior when Supabase unavailable

- [ ] 28. Final checkpoint - Complete system validation
  - Run full test suite (unit + property + integration)
  - Verify all 23 properties pass
  - Run security scanning tools
  - Review test coverage report
  - Ask user if questions arise

### Phase 9: Deployment Preparation

- [ ] 29. Configure production environment
  - Set up production Upstash Redis instance
  - Configure production environment variables in Vercel
  - Set up logging service (Axiom/Logtail) for production
  - Configure alert channels (email, Slack)
  - _Requirements: 10.2_

- [ ] 30. Create deployment documentation
  - Document environment variable setup
  - Document deployment checklist
  - Document rollback procedures
  - Document monitoring setup
  - Document secret rotation procedures

- [ ] 31. Performance and load testing
  - Run load tests on rate limiter (verify <10ms overhead)
  - Test API endpoints under load (verify p99 <100ms)
  - Test database performance with RLS
  - Verify auto-scaling configuration

### Phase 10: Security Audit and Launch

- [ ] 32. Run security audit
  - Run `npm audit` and fix vulnerabilities
  - Run SAST scanning (if available)
  - Run secret scanning tools
  - Review security headers in production
  - Verify no critical vulnerabilities

- [ ] 33. Deploy to staging and validate
  - Deploy complete security hardening to staging
  - Run full test suite in staging
  - Test all security features end-to-end
  - Verify monitoring and alerting work
  - Run penetration testing (if available)

- [ ] 34. Production deployment
  - Deploy to production with gradual rollout
  - Monitor error rates and performance
  - Verify all security features active
  - Monitor for 48 hours
  - Document any issues and resolutions

---

## Notes

- All tasks including tests are required for comprehensive security coverage
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and catch issues early
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests verify external service interactions
- The implementation follows defense-in-depth principle with multiple security layers

---

## Estimated Timeline

- **Phase 1-2 (Infrastructure + Auth):** 5-7 days
- **Phase 3 (API Security):** 3-4 days
- **Phase 4 (Payment Security):** 2-3 days
- **Phase 5-6 (Headers + RLS):** 3-4 days
- **Phase 7 (Monitoring):** 3-4 days
- **Phase 8-10 (Testing + Deployment):** 5-7 days

**Total: 21-29 days (4-6 weeks)**
