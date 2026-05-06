import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import urlRoutes from './routes/url.routes';

const app = express();

// ── Security middleware ───────────────────────────────────────────────────────
// helmet() sets ~15 HTTP security headers automatically (XSS protection,
// content-type sniffing prevention, etc.). One line = many security wins.
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // log HTTP requests to the console (method, path, status, response time)

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