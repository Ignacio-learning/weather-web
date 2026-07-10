import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  // Avoid ERR_ERL_UNEXPECTED_X_FORWARDED_FOR crashing the function on Vercel
  validate: { xForwardedForHeader: false },
  message: {
    error: 'Demasiadas consultas. Espere un minuto antes de volver a intentar.',
  },
});
