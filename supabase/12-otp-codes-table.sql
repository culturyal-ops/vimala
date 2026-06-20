-- OTP codes table for secure authentication
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER DEFAULT 0,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_otp_codes_email_active 
  ON otp_codes(email, expires_at) 
  WHERE used_at IS NULL;

-- Auto-cleanup expired OTPs (runs hourly)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_codes 
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Only service role can manage OTP codes (no direct user access)
CREATE POLICY "Service role can manage OTP codes"
  ON otp_codes FOR ALL
  USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT ALL ON otp_codes TO service_role;

COMMENT ON TABLE otp_codes IS 'Stores hashed OTP codes for email authentication';
