import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/client';

export interface OTPRecord {
  id: string;
  email: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

export interface OTPVerificationResult {
  success: boolean;
  reason?: 'OTP_NOT_FOUND' | 'OTP_EXPIRED' | 'INVALID_CODE' | 'MAX_ATTEMPTS_EXCEEDED' | 'ACCOUNT_LOCKED';
  remainingAttempts?: number;
}

/**
 * Generate cryptographically secure 6-digit OTP
 */
export function generateSecureOTP(): string {
  // Use crypto.randomInt for cryptographically secure random
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
}

/**
 * Hash OTP code for secure storage
 */
function hashOTP(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

/**
 * Verify hashed OTP
 */
function verifyHashedOTP(plainCode: string, hashedCode: string): boolean {
  const hash = hashOTP(plainCode);
  return timingSafeEqual(hash, hashedCode);
}

/**
 * Timing-safe string comparison
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Create new OTP code
 */
export async function createOTP(
  email: string,
  ipAddress: string,
  userAgent?: string
): Promise<{ code: string; expiresAt: Date }> {
  const code = generateSecureOTP();
  const codeHash = hashOTP(code);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const supabase = createAdminClient();

  // Delete any existing unused OTPs for this email
  await supabase
    .from('otp_codes')
    .delete()
    .eq('email', email)
    .is('used_at', null);

  // Insert new OTP
  await supabase.from('otp_codes').insert({
    email,
    code_hash: codeHash,
    expires_at: expiresAt.toISOString(),
    attempts: 0,
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  return { code, expiresAt };
}

/**
 * Verify OTP code
 */
export async function verifyOTP(
  email: string,
  code: string,
  ipAddress: string
): Promise<OTPVerificationResult> {
  const supabase = createAdminClient();

  // Check if account is locked
  const { data: isLocked } = await supabase.rpc('is_identifier_locked', {
    p_identifier: email,
    p_identifier_type: 'email',
  });

  if (isLocked) {
    return { success: false, reason: 'ACCOUNT_LOCKED' };
  }

  // Find active OTP
  const { data: record, error } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('email', email)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !record) {
    // Record failed attempt
    await supabase.rpc('increment_failed_attempts', {
      p_identifier: email,
      p_identifier_type: 'email',
    });

    await supabase.rpc('increment_failed_attempts', {
      p_identifier: ipAddress,
      p_identifier_type: 'ip',
    });

    return { success: false, reason: 'OTP_NOT_FOUND' };
  }

  // Check attempts
  if (record.attempts >= 3) {
    return {
      success: false,
      reason: 'MAX_ATTEMPTS_EXCEEDED',
      remainingAttempts: 0,
    };
  }

  // Verify code
  const isValid = verifyHashedOTP(code, record.code_hash as string);

  if (!isValid) {
    // Increment attempts
    await supabase
      .from('otp_codes')
      .update({ attempts: record.attempts + 1 })
      .eq('id', record.id);

    // Record failed attempt
    await supabase.rpc('increment_failed_attempts', {
      p_identifier: email,
      p_identifier_type: 'email',
    });

    return {
      success: false,
      reason: 'INVALID_CODE',
      remainingAttempts: 3 - (record.attempts + 1),
    };
  }

  // Mark OTP as used
  await supabase
    .from('otp_codes')
    .update({ used_at: new Date().toISOString() })
    .eq('id', record.id);

  // Reset failed attempts on successful login
  await supabase.rpc('reset_failed_attempts', {
    p_identifier: email,
    p_identifier_type: 'email',
  });

  await supabase.rpc('reset_failed_attempts', {
    p_identifier: ipAddress,
    p_identifier_type: 'ip',
  });

  return { success: true };
}

/**
 * Check if identifier (email or IP) is locked
 */
export async function isIdentifierLocked(
  identifier: string,
  type: 'email' | 'ip'
): Promise<boolean> {
  const supabase = createAdminClient();

  const { data: isLocked } = await supabase.rpc('is_identifier_locked', {
    p_identifier: identifier,
    p_identifier_type: type,
  });

  return Boolean(isLocked);
}
