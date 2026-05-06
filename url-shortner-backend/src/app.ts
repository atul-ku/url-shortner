import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import urlRoutes from './routes/url.routes';

const app = express();

// ── Security middleware ───────────────────────────────────────────────────────
// helmet() sets ~15 HTTP security headers automatically (XSS protection,
// content-type sniffing prevention, etc.). One line = many security wins.
app.use(helmet());

// cors() allows browsers from different origins to call your API.
// Without this, your React frontend (port 5173) can't call the API (port 3000).
app.use(cors());

// Parse JSON request bodies automatically
app.use(express.json());

// ── Health check ─────────────────────────────────────────────────────────────
// This endpoint is used by Docker, Kubernetes, and AWS to know if the service
// is alive. If it returns non-200, traffic stops being sent to this instance.
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Application routes ───────────────────────────────────────────────────────
app.use('/', urlRoutes);

// ── 404 catch-all ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;