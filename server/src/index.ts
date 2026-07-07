import { config } from 'dotenv';
import path from 'node:path';
import express from 'express';
import cors from 'cors';

config({ path: path.resolve(process.cwd(), '..', '.env') });
import weatherRouter from './routes/weather.js';
import geocodeRouter from './routes/geocode.js';
import forecastRouter from './routes/forecast.js';
import boostrRouter from './routes/boostr.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.error('ERROR: Define OPENWEATHER_API_KEY en tu archivo .env');
  process.exit(1);
}

const app = express();
app.disable('x-powered-by');
app.use(cors());

// Static files (built client)
const clientDist = path.resolve(process.cwd(), '..', 'client', 'dist');
app.use(express.static(clientDist));

// Rate limiter for API routes
app.use('/api', apiLimiter);

// API routes
app.use('/api', weatherRouter);
app.use('/api', geocodeRouter);
app.use('/api', forecastRouter);
app.use('/api', boostrRouter);

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});
