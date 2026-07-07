import { Router, type Request, type Response } from 'express';
import { searchCities } from '../services/geoCodeService.js';

const router = Router();

router.get('/geocode', async (req: Request, res: Response) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  const limitRaw = parseInt(req.query.limit as string, 10);
  const limit = isNaN(limitRaw) || limitRaw < 1 ? 5 : Math.min(limitRaw, 5);

  if (!q || q.length < 2) {
    res.status(400).json({
      error: "El parámetro 'q' debe tener al menos 2 caracteres.",
    });
    return;
  }

  try {
    const cities = await searchCities(q, limit);
    res.json(cities);
  } catch (err: any) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

export default router;
