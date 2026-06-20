-- Failed login attempts tracking for account lockout protection
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS failed_login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- email or IP address
  identifier_type TEXT NOT NULL CHECK (identifier_type IN ('email', 'ip')),
  attempt_count INTEGER DEFAULT 1,
  first_attempt_at TIMESTAMPTZ DEFAULT NOW(),
  last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_failed_attempts_identifier 
  ON failed_login_attempts(identifier, identifier_type);

-- Function to increment failed attempts
CREATE OR REPLACE FUNCTION increment_failed_attempts(
  p_identifier TEXT,
  p_identifier_type TEXT
)
RETURNS failed_login_attempts AS $$
DECLARE
  v_record failed_login_attempts;
  v_lockout_duration INTERVAL := INTERVAL '15 minutes';
  v_max_attempts INTEGER := 5;
BEGIN
  -- Try to find existing record
  SELECT * INTO v_record
  FROM failed_login_attempts
  WHERE identifier = p_identifier
    AND identifier_type = p_identifier_type
    AND first_attempt_at > NOW() - INTERVAL '1 hour'; -- Reset window after 1 hour
  
  IF FOUND THEN
    -- Update existing record
    UPDATE failed_login_attempts
    SET 
      attempt_count = attempt_count + 1,
      last_attempt_at = NOW(),
      locked_until = CASE 
        WHEN attempt_count + 1 >= v_max_attempts 
        THEN NOW() + v_lockout_duration
        ELSE locked_until
      END
    WHERE id = v_record.id
    RETURNING * INTO v_record;
  ELSE
    -- Create new record
    INSERT INTO failed_login_attempts (identifier, identifier_type)
    VALUES (p_identifier, p_identifier_type)
    RETURNING * INTO v_record;
  END IF;
  
  RETURN v_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if identifier is locked
CREATE OR REPLACE FUNCTION is_identifier_locked(
  p_identifier TEXT,
  p_identifier_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_locked_until TIMESTAMPTZ;
BEGIN
  SELECT locked_until INTO v_locked_until
  FROM failed_login_attempts
  WHERE identifier = p_identifier
    AND identifier_type = p_identifier_type
    AND locked_until > NOW()
  LIMIT 1;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset failed attempts
CREATE OR REPLACE FUNCTION reset_failed_attempts(
  p_identifier TEXT,
  p_identifier_type TEXT
)
RETURNS void AS $$
BEGIN
  DELETE FROM failed_login_attempts
  WHERE identifier = p_identifier
    AND identifier_type = p_identifier_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-cleanup old records (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_failed_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM failed_login_attempts 
  WHERE first_attempt_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE failed_login_attempts ENABLE ROW LEVEL SECURITY;

-- Only service role can manage failed attempts
CREATE POLICY "Service role can manage failed attempts"
  ON failed_login_attempts FOR ALL
  USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT ALL ON failed_login_attempts TO service_role;

COMMENT ON TABLE failed_login_attempts IS 'Tracks failed login attempts for account lockout protection';
