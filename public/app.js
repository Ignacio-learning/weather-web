"use strict";

const form = document.getElementById("weatherForm");
const cityEl = document.getElementById("city");
const countryEl = document.getElementById("country");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");

const placeEl = document.getElementById("place");
const descEl = document.getElementById("desc");
const tempEl = document.getElementById("temp");
const badgeEl = document.getElementById("badge");

const feelsEl = document.getElementById("feels");
const humEl = document.getElementById("hum");
const windEl = document.getElementById("wind");
const pressEl = document.getElementById("press");
const minmaxEl = document.getElementById("minmax");
const coordsEl = document.getElementById("coords");

const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");

function setStatus(text, type = "info") {
  statusEl.textContent = text || "";
  statusEl.classList.toggle("error", type === "error");
}

function fmtC(n) {
  if (typeof n !== "number") return "—";
  return `${Math.round(n)} °C`;
}

function fmtPct(n) {
  if (typeof n !== "number") return "—";
  return `${Math.round(n)} %`;
}

function fmtWind(n) {
  if (typeof n !== "number") return "—";
  return `${n.toFixed(1)} m/s`;
}

function fmtPress(n) {
  if (typeof n !== "number") return "—";
  return `${Math.round(n)} hPa`;
}

function fmtCoords(lat, lon) {
  if (typeof lat !== "number" || typeof lon !== "number") return "—";
  return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
}

function comfortBadge(tempC, humidity) {
  if (typeof tempC !== "number") return "—";
  if (tempC <= 5) return "Frío";
  if (tempC <= 18) return "Fresco";
  if (tempC <= 27) return humidity >= 70 ? "Cálido y húmedo" : "Agradable";
  return humidity >= 60 ? "Caluroso y húmedo" : "Caluroso";
}

function render(data) {
  const city = data.location?.name ?? "—";
  const country = data.location?.country ?? "";
  placeEl.textContent = country ? `${city}, ${country}` : city;

  const desc = data.weather?.description ?? "—";
  descEl.textContent = desc;

  const t = data.metrics?.tempC;
  tempEl.textContent = fmtC(t);
  badgeEl.textContent = comfortBadge(t, data.metrics?.humidity);

  feelsEl.textContent = fmtC(data.metrics?.feelsLikeC);
  humEl.textContent = fmtPct(data.metrics?.humidity);
  windEl.textContent = fmtWind(data.metrics?.windSpeed);
  pressEl.textContent = fmtPress(data.metrics?.pressure);
  minmaxEl.textContent = `${fmtC(data.metrics?.tempMinC)} / ${fmtC(data.metrics?.tempMaxC)}`;
  coordsEl.textContent = fmtCoords(data.location?.lat, data.location?.lon);

  resultEl.hidden = false;
}

async function fetchWeather(city, country) {
  const url = new URL("/api/weather", window.location.origin);
  url.searchParams.set("city", city);
  if (country) url.searchParams.set("country", country);

  const resp = await fetch(url, { headers: { Accept: "application/json" } });
  const body = await resp.json().catch(() => null);
  if (!resp.ok) {
    const msg = body?.error ? String(body.error) : `Error (${resp.status})`;
    throw new Error(msg);
  }
  return body;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityEl.value.trim();
  const country = countryEl.value.trim().toUpperCase();

  resultEl.hidden = true;
  setStatus("", "info");

  if (!city) {
    setStatus("Escribe una ciudad para consultar.", "error");
    cityEl.focus();
    return;
  }

  submitBtn.disabled = true;
  clearBtn.disabled = true;
  setStatus("Consultando clima…", "info");

  try {
    const data = await fetchWeather(city, country);
    render(data);
    setStatus("Listo.", "info");
  } catch (err) {
    setStatus(err.message || "Error al consultar.", "error");
  } finally {
    submitBtn.disabled = false;
    clearBtn.disabled = false;
  }
});

clearBtn.addEventListener("click", () => {
  cityEl.value = "";
  countryEl.value = "";
  resultEl.hidden = true;
  setStatus("");
  cityEl.focus();
});

// UX: Enter rápido si venías con valores
cityEl.focus();

