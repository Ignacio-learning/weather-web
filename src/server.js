"use strict";

const path = require("path");
const express = require("express");

const PORT = process.env.PORT ? Number(process.env.PORT) : 5173;
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.error(
    "ERROR: Debes definir OPENWEATHER_API_KEY (API key de OpenWeatherMap) para levantar el servidor."
  );
  console.error("Ejemplo en PowerShell:");
  console.error('$env:OPENWEATHER_API_KEY="TU_API_KEY_AQUI"');
  process.exit(1);
}

const app = express();
app.disable("x-powered-by");

const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

app.get("/api/weather", async (req, res) => {
  const city = typeof req.query.city === "string" ? req.query.city.trim() : "";
  const country = typeof req.query.country === "string" ? req.query.country.trim() : "";

  if (!city) {
    return res.status(400).json({ error: "Falta el parámetro 'city'." });
  }

  const q = country ? `${city},${country}` : city;

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", q);
  url.searchParams.set("appid", API_KEY);
  url.searchParams.set("units", "metric");
  url.searchParams.set("lang", "es");

  try {
    const resp = await fetch(url);
    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      if (resp.status === 404) {
        return res.status(404).json({ error: "Ciudad no encontrada. Revisa el nombre y/o el país." });
      }
      const msg =
        data && data.message ? String(data.message) : `Error en la API (status ${resp.status})`;
      return res.status(resp.status).json({ error: msg });
    }

    return res.json({
      location: {
        name: data.name,
        country: data.sys?.country ?? null,
        lat: data.coord?.lat ?? null,
        lon: data.coord?.lon ?? null,
      },
      weather: {
        description: data.weather?.[0]?.description ?? null,
        main: data.weather?.[0]?.main ?? null,
        icon: data.weather?.[0]?.icon ?? null,
      },
      metrics: {
        tempC: data.main?.temp ?? null,
        feelsLikeC: data.main?.feels_like ?? null,
        tempMinC: data.main?.temp_min ?? null,
        tempMaxC: data.main?.temp_max ?? null,
        humidity: data.main?.humidity ?? null,
        pressure: data.main?.pressure ?? null,
        windSpeed: data.wind?.speed ?? null,
      },
      meta: {
        provider: "openweathermap",
        units: "metric",
        lang: "es",
        query: q,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Error inesperado al consultar el clima." });
  }
});

// SPA-ish fallback (cuando se entra directo a /)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});

