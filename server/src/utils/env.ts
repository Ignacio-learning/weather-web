export function requireApiKey(): string {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    throw new Error('OPENWEATHER_API_KEY no está configurada en el entorno');
  }
  return key;
}
