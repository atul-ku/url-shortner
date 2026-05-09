import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as urlController from '../controllers/url.controller';

const router = Router();

// Rate limiter for the shorten endpoint only.
// Without this, someone could write a script that hammers your API
// and fills up your database with millions of fake URLs.
const shortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 100,                  // max 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again in 15 minutes' },
});

// ── API routes ───────────────────────────────────────────────────────────────
router.post('/api/shorten',    shortenLimiter, urlController.shortenUrl);
router.get('/api/stats/:code',               urlController.getStats);
router.delete('/api/urls/:code',             urlController.deleteUrl);

// ── Redirect route ───────────────────────────────────────────────────────────
// IMPORTANT: This must come LAST. The pattern /:code would match /api/shorten
// and /api/stats/:code if it were defined first, breaking those routes.
router.get('/:code', urlController.redirectUrl);

export default router;