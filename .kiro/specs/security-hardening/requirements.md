# Security Hardening & Infrastructure — Requirements

**Feature:** Comprehensive security hardening and production-ready infrastructure
**Status:** Draft
**Priority:** P0 - Critical
**Created:** 2026-06-21

---

## Problem Statement

Current codebase has critical security vulnerabilities that make it unsuitable for production:

1. **In-memory rate limiting** — Resets on server restart, bypassed with multiple instances
2. **No auth rate limiting** — OTP endpoints can be spammed
3. **Weak session security** — Client-side session tokens, no CSRF protection
4. **Missing input validation** — API endpoints lack proper sanitization
5. **Exposed service keys** — Service role key visible in client bundle
6. **No monitoring/logging** — Can't detect attacks or debug issues
7. **No request signing** — Payment verification can be replayed
8. **Missing security headers** — No CSP, HSTS, X-Frame-Options
9. **Supabase RLS gaps** — Admin routes bypass RLS unsafely
10. **No API versioning** — Breaking changes will affect all clients

---

## User Stories & Acceptance Criteria

### 1. Authentication Security

#### 1.1 Rate-Limited OTP Requests
**As a** system administrator  
**I want** OTP requests to be strictly rate-limited  
**So that** attackers cannot spam users or abuse the email service

**Acceptance Criteria:**
- [ ] OTP endpoint limited to 3 requests per email per 15 minutes
- [ ] IP-based rate limiting: 10 OTP requests per hour per IP
- [ ] Rate limit data persists across server restarts (Redis/Supabase)
- [ ] Clear error messages with retry-after headers
- [ ] Admin dashboard shows rate limit violations

#### 1.2 OTP Security Hardening
**As a** security engineer  
**I want** OTP codes to be cryptographically secure  
**So that** they cannot be guessed or brute-forced

**Acceptance Criteria:**
- [ ] 6-digit OTP codes use cryptographically secure random generation
- [ ] OTP expires after 10 minutes
- [ ] Maximum 3 verification attempts per OTP
- [ ] Failed attempts logged with IP address
- [ ] Account lockout after 5 failed verifications

#### 1.3 Session Security
**As a** developer  
**I want** secure session management  
**So that** user sessions cannot be hijacked

**Acceptance Criteria:**
- [ ] HTTP-only cookies for session tokens
- [ ] Secure flag enabled in production
- [ ] SameSite=Lax for CSRF protection
- [ ] Session rotation on privilege escalation
- [ ] Logout invalidates all sessions

---

### 2. API Security

#### 2.1 Distributed Rate Limiting
**As a** platform operator  
**I want** rate limiting that works across all server instances  
**So that** attackers cannot bypass limits by hitting multiple servers

**Acceptance Criteria:**
- [ ] Rate limiting backed by Redis/Upstash
- [ ] Sliding window algorithm for accurate limits
- [ ] Per-endpoint, per-user, and per-IP limits
- [ ] Configurable limits via environment variables
- [ ] Rate limit metrics exposed to monitoring

#### 2.2 Request Validation & Sanitization
**As a** security engineer  
**I want** all API inputs validated and sanitized  
**So that** injection attacks are prevented

**Acceptance Criteria:**
- [ ] Zod schema validation on all API routes
- [ ] SQL injection prevention via parameterized queries
- [ ] XSS prevention via output encoding
- [ ] File upload validation (type, size, content)
- [ ] JSON payload size limits enforced

#### 2.3 API Authentication & Authorization
**As a** developer  
**I want** proper authentication on all protected endpoints  
**So that** only authorized users can access resources

**Acceptance Criteria:**
- [ ] JWT verification middleware for protected routes
- [ ] Role-based access control (RBAC) for admin endpoints
- [ ] Order access restricted to order owner or admin
- [ ] Customer data access restricted to customer or admin
- [ ] API keys for third-party integrations

---

### 3. Payment Security

#### 3.1 Razorpay Webhook Verification
**As a** payment processor  
**I want** webhook signatures verified  
**So that** fake payment notifications are rejected

**Acceptance Criteria:**
- [ ] Razorpay signature verification on all webhooks
- [ ] Webhook secret stored securely in environment
- [ ] Failed verification attempts logged and alerted
- [ ] Replay attack prevention via timestamp check
- [ ] Idempotency key enforcement on payment processing

#### 3.2 Payment Data Security
**As a** compliance officer  
**I want** payment data encrypted and PCI-compliant  
**So that** we meet regulatory requirements

**Acceptance Criteria:**
- [ ] No card data stored in our database
- [ ] Payment gateway integration via hosted checkout
- [ ] TLS 1.3 enforced for all payment requests
- [ ] Payment logs exclude sensitive card details
- [ ] Razorpay keys never exposed to client

---

### 4. Infrastructure Security

#### 4.1 Security Headers
**As a** security engineer  
**I want** proper security headers on all responses  
**So that** common web attacks are mitigated

**Acceptance Criteria:**
- [ ] Content-Security-Policy (CSP) header configured
- [ ] X-Frame-Options: DENY to prevent clickjacking
- [ ] X-Content-Type-Options: nosniff
- [ ] Strict-Transport-Security (HSTS) enabled
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy configured

#### 4.2 Environment Variable Security
**As a** developer  
**I want** secrets managed securely  
**So that** they are never exposed or committed

**Acceptance Criteria:**
- [ ] All secrets in environment variables, never in code
- [ ] Separate keys for dev/staging/production
- [ ] Service role keys never exposed to client
- [ ] .env files in .gitignore
- [ ] Secret rotation procedure documented

#### 4.3 Database Security (Supabase RLS)
**As a** database administrator  
**I want** proper row-level security policies  
**So that** users can only access their own data

**Acceptance Criteria:**
- [ ] RLS enabled on all tables
- [ ] Customer orders filtered by customer_id
- [ ] Admin-only tables have owner role check
- [ ] Service role usage audited and minimized
- [ ] RLS policies tested with automated tests

---

### 5. Monitoring & Incident Response

#### 5.1 Security Logging
**As a** security operator  
**I want** comprehensive security logs  
**So that** attacks can be detected and investigated

**Acceptance Criteria:**
- [ ] Failed login attempts logged with IP
- [ ] Rate limit violations logged
- [ ] Payment verification failures logged
- [ ] Admin actions logged in audit trail
- [ ] Logs stored securely and retained for 90 days

#### 5.2 Real-time Alerting
**As a** on-call engineer  
**I want** alerts for security incidents  
**So that** I can respond immediately

**Acceptance Criteria:**
- [ ] Alert on 5+ failed logins from same IP
- [ ] Alert on webhook signature failures
- [ ] Alert on rate limit threshold breaches
- [ ] Alert on database connection errors
- [ ] Alerts sent via email/SMS/Slack

#### 5.3 Security Monitoring Dashboard
**As a** security team  
**I want** a dashboard showing security metrics  
**So that** I can monitor the security posture

**Acceptance Criteria:**
- [ ] Real-time rate limit metrics
- [ ] Failed authentication attempts graph
- [ ] Payment verification success rate
- [ ] API error rates by endpoint
- [ ] Geographic distribution of requests

---

### 6. Additional Hardening

#### 6.1 DDoS Protection
**As a** platform operator  
**I want** DDoS protection  
**So that** the site stays online during attacks

**Acceptance Criteria:**
- [ ] Cloudflare or similar CDN enabled
- [ ] Rate limiting at edge before hitting origin
- [ ] Bot detection enabled
- [ ] Geographic blocking for high-risk regions (optional)
- [ ] Auto-scaling configured for traffic spikes

#### 6.2 Dependency Security
**As a** developer  
**I want** dependencies checked for vulnerabilities  
**So that** known exploits are patched

**Acceptance Criteria:**
- [ ] `npm audit` runs on every build
- [ ] Dependabot/Snyk enabled for automated PRs
- [ ] Critical vulnerabilities block deployment
- [ ] Dependency pinning for reproducible builds
- [ ] Regular dependency updates scheduled

#### 6.3 Code Security Scanning
**As a** security engineer  
**I want** code scanned for vulnerabilities  
**So that** issues are caught before production

**Acceptance Criteria:**
- [ ] Static analysis (ESLint security rules)
- [ ] SAST scanning (SonarQube/Semgrep)
- [ ] Secret scanning (GitGuardian/TruffleHog)
- [ ] Security checks in CI/CD pipeline
- [ ] Failed security checks block merge

---

## Technical Constraints

- Must work on Vercel serverless platform
- Redis/Upstash for distributed state
- Supabase for database and auth
- No breaking changes to existing API contracts (until v2)
- Must maintain <100ms p99 latency

---

## Out of Scope (Future Enhancements)

- Web Application Firewall (WAF) rules
- Advanced bot detection with ML
- Biometric authentication
- Hardware security modules (HSM)
- Bug bounty program
- SOC 2 compliance
- Penetration testing

---

## Success Metrics

- Zero authentication bypass incidents
- Rate limit effectiveness >99%
- Payment verification failure rate <0.1%
- Security audit score >90/100
- Mean time to detect (MTTD) security incidents <5 minutes
- Mean time to respond (MTTR) <30 minutes

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/authentication)
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)
