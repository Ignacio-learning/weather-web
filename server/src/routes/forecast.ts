import { Router, type Request, type Response } from 'express';
import { getForecastByCity } from '../services/forecastService.js';

const router = Router();

router.get('/forecast', async (req: Request, res: Response) => {
  const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';
  const country =
    typeof req.query.country === 'string'
      ? req.query.country.trim().toUpperCase()
      : '';

  if (!city) {
    res.status(400).json({ error: "Falta el parámetro 'city'." });
    return;
  }

  if (country && !/^[A-Z]{2}$/.test(country)) {
    res.status(400).json({
      error: 'El código de país debe ser de 2 letras (ej: CL, AR, MX).',
    });
    return;
  }

  try {
    const forecast = await getForecastByCity(city, country);
    res.json(forecast);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

export default router;
