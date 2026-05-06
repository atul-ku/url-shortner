import { db } from '../config/database';
import { redis } from '../config/redis';
import { nanoid } from 'nanoid';

const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS) || 3600;
const BASE_URL  = process.env.BASE_URL || 'http://localhost:3000';

export interface UrlRecord {
  id:           string;
  short_code:   string;
  original_url: string;
  clicks:       number;
  created_at:   Date;
  expires_at:   Date | null;
}

// ── Create ──────────────────────────────────────────────────────────────────

export const createShortUrl = async (originalUrl: string): Promise<UrlRecord> => {
  // If we already shortened this exact URL, return the existing record.
  // This prevents duplicate rows for the same destination.
  const existing = await db.query<UrlRecord>(
    'SELECT * FROM urls WHERE original_url = $1',
    [originalUrl]
  );
  if (existing.rows.length > 0) return existing.rows[0];

  // nanoid(7) gives us 7 random characters from a URL-safe alphabet.
  // With 64 possible chars and length 7, we get 64^7 ≈ 4.4 trillion combinations
  // before we'd ever expect a collision. This is plenty for a real URL shortener.
  const shortCode = nanoid(7);

  const result = await db.query<UrlRecord>(
    `INSERT INTO urls (short_code, original_url)
     VALUES ($1, $2)
     RETURNING *`,
    [shortCode, originalUrl]
  );

  return result.rows[0];
};

// ── Redirect ─────────────────────────────────────────────────────────────────

export const getOriginalUrl = async (shortCode: string): Promise<string | null> => {
  // Step 1: Check Redis first. This is the "hot path" — most requests end here.
  const cached = await redis.get(`url:${shortCode}`);
  if (cached) {
    // Increment clicks asynchronously — we don't await this so the redirect
    // response goes back to the user immediately without waiting for the DB write.
    db.query('UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1', [shortCode])
      .catch(err => console.error('Click increment error:', err));
    return cached;
  }

  // Step 2: Cache miss — go to PostgreSQL (slower, but still fast)
  const result = await db.query<Pick<UrlRecord, 'original_url'>>(
    'SELECT original_url FROM urls WHERE short_code = $1',
    [shortCode]
  );

  if (result.rows.length === 0) return null;

  const { original_url } = result.rows[0];

  // Step 3: Populate the cache so the NEXT request takes the fast path
  // setex = SET with EXpiry. After CACHE_TTL seconds, Redis auto-deletes it.
  await redis.setex(`url:${shortCode}`, CACHE_TTL, original_url);

  // Step 4: Record the click
  await db.query(
    'UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1',
    [shortCode]
  );

  return original_url;
};

// ── Stats ────────────────────────────────────────────────────────────────────

export const getUrlStats = async (shortCode: string): Promise<UrlRecord | null> => {
  const result = await db.query<UrlRecord>(
    'SELECT * FROM urls WHERE short_code = $1',
    [shortCode]
  );
  return result.rows[0] ?? null;
};

// ── Delete ───────────────────────────────────────────────────────────────────

export const deleteShortUrl = async (shortCode: string): Promise<boolean> => {
  const result = await db.query(
    'DELETE FROM urls WHERE short_code = $1',
    [shortCode]
  );
  // Always evict from cache, even if the DB row didn't exist
  await redis.del(`url:${shortCode}`);
  return (result.rowCount ?? 0) > 0;
};