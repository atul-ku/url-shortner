-- This file runs automatically when the PostgreSQL container starts for the first time.
-- It creates our table and a performance index on short_code.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS urls (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code   VARCHAR(10)  UNIQUE NOT NULL,
  original_url TEXT         NOT NULL,
  clicks       INTEGER      DEFAULT 0,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  expires_at   TIMESTAMPTZ  -- NULL means never expires
);

-- This index makes lookups by short_code extremely fast (O(log n) instead of O(n))
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);

-- Seed a test record so you can verify everything works immediately
INSERT INTO urls (short_code, original_url)
VALUES ('test123', 'https://www.google.com')
ON CONFLICT DO NOTHING;