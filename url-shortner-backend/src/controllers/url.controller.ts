import { Request, Response } from 'express';
import * as urlService from '../services/url.service';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// POST /api/shorten
// Body: { "url": "https://very-long-url.com/path" }
export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: '`url` field is required in the request body' });
      return;
    }

    // Use the built-in URL constructor for validation — no regex needed.
    // It throws if the URL is malformed (missing protocol, etc.)
    try {
      new URL(url);
    } catch {
      res.status(400).json({ error: 'Invalid URL. Make sure it starts with http:// or https://' });
      return;
    }

    const record = await urlService.createShortUrl(url);

    res.status(201).json({
      short_url:    `${BASE_URL}/${record.short_code}`,
      short_code:   record.short_code,
      original_url: record.original_url,
      created_at:   record.created_at,
    });
  } catch (error) {
    console.error('shortenUrl error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /:code  → 301 redirect to the original URL
export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const originalUrl = await urlService.getOriginalUrl(code);

    if (!originalUrl) {
      res.status(404).json({ error: `Short URL '${code}' not found` });
      return;
    }

    // 301 = Permanent redirect. Browsers cache this, which is great for performance
    // but means changing the destination later won't take effect immediately.
    // Use 302 if you want temporary/changeable redirects.
    res.redirect(301, originalUrl);
  } catch (error) {
    console.error('redirectUrl error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/stats/:code
export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const stats = await urlService.getUrlStats(code);

    if (!stats) {
      res.status(404).json({ error: `Short URL '${code}' not found` });
      return;
    }

    res.json({
      short_url:    `${BASE_URL}/${stats.short_code}`,
      original_url: stats.original_url,
      clicks:       stats.clicks,
      created_at:   stats.created_at,
      expires_at:   stats.expires_at,
    });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/urls/:code
export const deleteUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;
    const deleted = await urlService.deleteShortUrl(code);

    if (!deleted) {
      res.status(404).json({ error: `Short URL '${code}' not found` });
      return;
    }

    res.status(204).send(); // 204 = success, no body
  } catch (error) {
    console.error('deleteUrl error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};