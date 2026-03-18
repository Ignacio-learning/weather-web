"use strict";

const GEOCODE_URL = "http://api.openweathermap.org/geo/1.0/direct";

function sanitizeQuery(query) {
  return query
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[,;|]/g, "")
    .slice(0, 100);
}

function mapGeocodeResults(results) {
  return results.map((item) => ({
    name: item.name,
    country: item.country ?? null,
    state: item.state ?? null,
    lat: item.lat,
    lon: item.lon,
    label: item.state
      ? `${item.name}, ${item.state}, ${item.country}`
      : `${item.name}, ${item.country}`,
  }));
}

async function searchCities(query, limit = 5) {
  const cleanQuery = sanitizeQuery(query);

  const url = new URL(GEOCODE_URL);
  url.searchParams.set("q", cleanQuery);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("appid", process.env.OPENWEATHER_API_KEY);

  const resp = await fetch(url); // ← fetch() es obligatorio aquí

  if (!resp.ok) {
    const error = new Error(
      `Error en Geocoding API (status ${resp.status})`
    );
    error.statusCode = 502;
    throw error;
  }

  const data = await resp.json();
  return mapGeocodeResults(data);
}

module.exports = { searchCities };