import { Router, type Request, type Response } from 'express';

const router = Router();
const BOOSTR_BASE = 'https://api.boostr.cl';

const TIMEOUT_MS = 10_000;

async function proxyToBoostr(path: string, res: Response) {
  try {
    const resp = await fetch(`${BOOSTR_BASE}${path}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const data = await resp.json();
    res.json(data);
  } catch (err: any) {
    if (err.name === 'TimeoutError') {
      res.status(504).json({ error: 'Tiempo de espera agotado al consultar boostr.cl' });
      return;
    }
    res.status(502).json({ error: `Error al consultar boostr.cl: ${err.message}` });
  }
}

// ─── ECONOMÍA ──────────────────────────────────────────

router.get('/boostr/economy/indicators', async (_req: Request, res: Response) => {
  await proxyToBoostr('/economy/indicators.json', res);
});

router.get('/boostr/economy/dolar', async (_req: Request, res: Response) => {
  await proxyToBoostr('/economy/indicator/dolar.json', res);
});

router.get('/boostr/economy/dolar/:year', async (req: Request, res: Response) => {
  await proxyToBoostr(`/economy/indicator/dolar/${req.params.year}.json`, res);
});

router.get('/boostr/economy/euro', async (_req: Request, res: Response) => {
  await proxyToBoostr('/economy/indicator/euro.json', res);
});

router.get('/boostr/economy/euro/:year', async (req: Request, res: Response) => {
  await proxyToBoostr(`/economy/indicator/euro/${req.params.year}.json`, res);
});

router.get('/boostr/economy/uf', async (_req: Request, res: Response) => {
  await proxyToBoostr('/economy/indicator/uf.json', res);
});

router.get('/boostr/economy/uf/:year', async (req: Request, res: Response) => {
  await proxyToBoostr(`/economy/indicator/uf/${req.params.year}.json`, res);
});

router.get('/boostr/economy/utm', async (_req: Request, res: Response) => {
  await proxyToBoostr('/economy/indicator/utm.json', res);
});

router.get('/boostr/economy/utm/:year', async (req: Request, res: Response) => {
  await proxyToBoostr(`/economy/indicator/utm/${req.params.year}.json`, res);
});

router.get('/boostr/economy/ipc', async (_req: Request, res: Response) => {
  await proxyToBoostr('/economy/indicator/ipc.json', res);
});

router.get('/boostr/economy/ipc/:year', async (req: Request, res: Response) => {
  await proxyToBoostr(`/economy/indicator/ipc/${req.params.year}.json`, res);
});

router.get('/boostr/economy/previred', async (_req: Request, res: Response) => {
  await proxyToBoostr('/economy/previred', res);
});

router.get('/boostr/economy/cryptos', async (_req: Request, res: Response) => {
  await proxyToBoostr('/economy/cryptos', res);
});

// ─── SISMOS ────────────────────────────────────────────

router.get('/boostr/earthquake/latest', async (_req: Request, res: Response) => {
  await proxyToBoostr('/earthquake/latest.json', res);
});

router.get('/boostr/earthquakes/recent', async (_req: Request, res: Response) => {
  await proxyToBoostr('/earthquakes/recent.json', res);
});

// ─── FERIADOS ──────────────────────────────────────────

router.get('/boostr/holidays', async (_req: Request, res: Response) => {
  await proxyToBoostr('/holidays', res);
});

router.get('/boostr/holidays/:year', async (req: Request, res: Response) => {
  await proxyToBoostr(`/holidays/${req.params.year}`, res);
});

// ─── FARMACIAS ─────────────────────────────────────────

router.get('/boostr/pharmacies', async (_req: Request, res: Response) => {
  await proxyToBoostr('/pharmacies', res);
});

router.get('/boostr/pharmacies/24h', async (_req: Request, res: Response) => {
  await proxyToBoostr('/pharmacies/24h', res);
});

// ─── GEOGRAFÍA ─────────────────────────────────────────

router.get('/boostr/geography/regions', async (_req: Request, res: Response) => {
  await proxyToBoostr('/geography/regions', res);
});

router.get('/boostr/geography/provinces', async (_req: Request, res: Response) => {
  await proxyToBoostr('/geography/provinces', res);
});

router.get('/boostr/geography/communes', async (_req: Request, res: Response) => {
  await proxyToBoostr('/geography/communes', res);
});

// ─── CLIMA CHILE (MeteoChile) ──────────────────────────

router.get('/boostr/weather/stations', async (_req: Request, res: Response) => {
  await proxyToBoostr('/weather/stations.json', res);
});

router.get('/boostr/weather/station/:code', async (req: Request, res: Response) => {
  await proxyToBoostr(`/weather/station/${req.params.code}.json`, res);
});

// ─── OTROS ─────────────────────────────────────────────

router.get('/boostr/banks', async (_req: Request, res: Response) => {
  await proxyToBoostr('/banks', res);
});

router.get('/boostr/isapres', async (_req: Request, res: Response) => {
  await proxyToBoostr('/isapres', res);
});

router.get('/boostr/postalcode', async (_req: Request, res: Response) => {
  await proxyToBoostr('/postalcode', res);
});

router.get('/boostr/radios', async (_req: Request, res: Response) => {
  await proxyToBoostr('/radios', res);
});

export default router;
