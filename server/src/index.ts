import { config } from 'dotenv';
import path from 'node:path';
import express from 'express';
import cors from 'cors';

// Local: load .env from repo root. On Vercel, env vars come from the dashboard.
config({ path: path.resolve(process.cwd(), '.env') });
config({ path: path.resolve(process.cwd(), '..', '.env') });

import weatherRouter from './routes/weather.js';
import geocodeRouter from './routes/geocode.js';
import forecastRouter from './routes/forecast.js';
import boostrRouter from './routes/boostr.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const isVercel = process.env.VERCEL === '1';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  const msg = isVercel
    ? 'ERROR: Configura OPENWEATHER_API_KEY en las environment variables de Vercel'
    : 'ERROR: Define OPENWEATHER_API_KEY en tu archivo .env';
  console.error(msg);
  if (!isVercel) process.exit(1);
}

const app = express();
app.disable('x-powered-by');
// Required on Vercel (reverse proxy) so express-rate-limit can read client IP
if (isVercel) {
  app.set('trust proxy', 1);
}
app.use(cors());

// Rate limiter for API routes
app.use('/api', apiLimiter);

// Health check (useful to verify the Vercel function boots)
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    vercel: isVercel,
    hasOpenWeatherKey: Boolean(API_KEY),
  });
});

// API routes
app.use('/api', weatherRouter);
app.use('/api', geocodeRouter);
app.use('/api', forecastRouter);
app.use('/api', boostrRouter);

// Static files & SPA fallback (only in local dev — Vercel handles it)
if (!isVercel) {
  const clientDist = path.resolve(process.cwd(), '..', 'client', 'dist');
  app.use(express.static(clientDist));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Servidor listo en http://localhost:${PORT}`);
  });
}

export default app;
