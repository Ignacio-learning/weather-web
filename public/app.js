"use strict";

// ================================
// REFERENCIAS AL DOM
// ================================
const form      = document.getElementById("weatherForm");
const cityEl    = document.getElementById("city");
const statusEl  = document.getElementById("status");
const resultEl  = document.getElementById("result");

const placeEl   = document.getElementById("place");
const descEl    = document.getElementById("desc");
const tempEl    = document.getElementById("temp");
const badgeEl   = document.getElementById("badge");
const feelsEl   = document.getElementById("feels");
const humEl     = document.getElementById("hum");
const windEl    = document.getElementById("wind");
const pressEl   = document.getElementById("press");
const minmaxEl  = document.getElementById("minmax");
const coordsEl  = document.getElementById("coords");

const submitBtn = document.getElementById("submitBtn");
const clearBtn  = document.getElementById("clearBtn");

// ================================
// AUTOCOMPLETE — ESTADO
// ================================

/**
 * AbortController activo para el request de geocoding en vuelo.
 * Si el usuario typea de nuevo antes de que llegue la respuesta,
 * cancelamos el anterior para evitar resultados desordenados.
 */
let geocodeController = null;

/**
 * Timer del debounce. Guardamos la referencia para poder
 * cancelarlo si el usuario sigue tipeando.
 */
let debounceTimer = null;

/**
 * Índice del item actualmente resaltado en el dropdown.
 * -1 = ninguno seleccionado (el usuario no usó el teclado todavía)
 */
let activeIndex = -1;

/**
 * Última sugerencia elegida del autocomplete.
 * Se invalida si el usuario vuelve a editar el input.
 */
let selectedCity = null;

const regionNames =
  typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function"
    ? new Intl.DisplayNames(["es"], { type: "region" })
    : null;

function displayCountry(code) {
  if (!code) return "";
  try {
    return regionNames?.of(code) || code;
  } catch {
    return code;
  }
}

// ================================
// AUTOCOMPLETE — SETUP DEL DOM
// ================================

/**
 * Envolvemos el campo ciudad en un div relativo para que el
 * dropdown se posicione correctamente debajo de él.
 * Hacemos esto desde JS para no cambiar el HTML original.
 */
const cityField = cityEl.parentElement;
cityField.classList.add("autocomplete-wrap");

const dropdown = document.createElement("ul");
dropdown.className = "autocomplete-list";
dropdown.setAttribute("role", "listbox");
dropdown.hidden = true;
cityField.appendChild(dropdown);

// ================================
// AUTOCOMPLETE — FUNCIONES CORE
// ================================

/** Cierra el dropdown y resetea el índice activo */
function closeDropdown() {
  dropdown.hidden = true;
  activeIndex = -1;
}

/** Abre el dropdown con los resultados recibidos */
function renderDropdown(cities) {
  dropdown.innerHTML = "";

  if (!cities.length) {
    closeDropdown();
    return;
  }

  cities.forEach((city, index) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.dataset.index = index;

    // Separamos nombre del detalle para poder estilizarlos distinto
    const countryLabel = displayCountry(city.country);
    li.innerHTML = `
      <span class="city-name">${city.name}</span>
      <span class="city-detail">${countryLabel}${city.state ? ` — ${city.state}` : ""}</span>
    `;

    li.addEventListener("mousedown", (e) => {
      // mousedown en vez de click para que se ejecute ANTES
      // del blur del input, evitando que el dropdown se cierre
      // antes de registrar la selección
      e.preventDefault();
      selectCity(city);
    });

    dropdown.appendChild(li);
  });

  dropdown.hidden = false;
  activeIndex = -1;
}

/**
 * Cuando el usuario selecciona una ciudad del dropdown:
 * llenamos los campos y cerramos.
 */
function selectCity(city) {
  cityEl.value = city.name;
  selectedCity = city;
  closeDropdown();
  submitBtn.focus();
}

/**
 * Actualiza visualmente qué item está activo en el dropdown.
 * Esto permite navegar con teclado sin cambiar el valor del input.
 */
function updateActiveItem(index) {
  const items = dropdown.querySelectorAll("li");
  items.forEach((li) => li.classList.remove("active"));
  if (index >= 0 && index < items.length) {
    items[index].classList.add("active");
  }
}

// ================================
// AUTOCOMPLETE — FETCH
// ================================

/**
 * Consulta el backend con debounce de 300ms.
 * Cancela el request anterior si el usuario sigue tipeando.
 */
async function fetchSuggestions(query) {
  // Cancelar request anterior
  if (geocodeController) geocodeController.abort();
  geocodeController = new AbortController();

  try {
    const url = new URL("/api/geocode", window.location.origin);
    url.searchParams.set("q", query);
    url.searchParams.set("limit", "5");

    const resp = await fetch(url, {
      signal: geocodeController.signal,
      headers: { Accept: "application/json" },
    });

    if (!resp.ok) return;

    const cities = await resp.json();
    renderDropdown(cities);
  } catch (err) {
    // AbortError es esperado cuando cancelamos — no es un error real
    if (err.name !== "AbortError") {
      console.error("Error en autocomplete:", err.message);
    }
  }
}

// ================================
// AUTOCOMPLETE — EVENTOS DEL INPUT
// ================================

cityEl.addEventListener("input", () => {
  const query = cityEl.value.trim();
  selectedCity = null;

  // Limpiamos el debounce anterior antes de arrancar uno nuevo
  clearTimeout(debounceTimer);

  if (query.length < 2) {
    closeDropdown();
    return;
  }

  // Esperamos 300ms después de que el usuario deja de tipear
  debounceTimer = setTimeout(() => fetchSuggestions(query), 300);
});

/** Navegación por teclado dentro del dropdown */
cityEl.addEventListener("keydown", (e) => {
  if (dropdown.hidden) return;

  const items = dropdown.querySelectorAll("li");
  const total = items.length;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex = (activeIndex + 1) % total;
    updateActiveItem(activeIndex);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex = (activeIndex - 1 + total) % total;
    updateActiveItem(activeIndex);
  } else if (e.key === "Enter" && activeIndex >= 0) {
    // Si hay un item seleccionado con teclado, lo confirmamos
    // en lugar de hacer submit del formulario
    e.preventDefault();
    const cities = dropdown.querySelectorAll("li");
    cities[activeIndex].dispatchEvent(new MouseEvent("mousedown"));
  } else if (e.key === "Escape") {
    closeDropdown();
  }
});

/** Cerramos el dropdown si el usuario hace click fuera */
document.addEventListener("click", (e) => {
  if (!cityField.contains(e.target)) {
    closeDropdown();
  }
});

// ================================
// HELPERS DE FORMATO
// ================================
function fmtC(n) {
  return typeof n === "number" ? `${Math.round(n)} °C` : "—";
}
function fmtPct(n) {
  return typeof n === "number" ? `${Math.round(n)} %` : "—";
}
function fmtWind(n) {
  return typeof n === "number" ? `${n.toFixed(1)} m/s` : "—";
}
function fmtPress(n) {
  return typeof n === "number" ? `${Math.round(n)} hPa` : "—";
}
function fmtCoords(lat, lon) {
  return typeof lat === "number" && typeof lon === "number"
    ? `${lat.toFixed(2)}, ${lon.toFixed(2)}`
    : "—";
}
function comfortBadge(tempC, humidity) {
  if (typeof tempC !== "number") return "—";
  if (tempC <= 5) return "Frío";
  if (tempC <= 18) return "Fresco";
  if (tempC <= 27) return humidity >= 70 ? "Cálido y húmedo" : "Agradable";
  return humidity >= 60 ? "Caluroso y húmedo" : "Caluroso";
}

// ================================
// RENDER DEL RESULTADO CLIMA
// ================================
function render(data) {
  const city = data.location?.name ?? "—";
  const country = data.location?.country ?? "";
  placeEl.textContent = country ? `${city}, ${country}` : city;
  descEl.textContent = data.weather?.description ?? "—";

  const t = data.metrics?.tempC;
  tempEl.textContent = fmtC(t);
  badgeEl.textContent = comfortBadge(t, data.metrics?.humidity);

  feelsEl.textContent  = fmtC(data.metrics?.feelsLikeC);
  humEl.textContent    = fmtPct(data.metrics?.humidity);
  windEl.textContent   = fmtWind(data.metrics?.windSpeed);
  pressEl.textContent  = fmtPress(data.metrics?.pressure);
  minmaxEl.textContent = `${fmtC(data.metrics?.tempMinC)} / ${fmtC(data.metrics?.tempMaxC)}`;
  coordsEl.textContent = fmtCoords(data.location?.lat, data.location?.lon);

  resultEl.hidden = false;
}

// ================================
// FETCH CLIMA
// ================================
let weatherController = null;

async function fetchWeather(city, country) {
  if (weatherController) weatherController.abort();
  weatherController = new AbortController();

  const url = new URL("/api/weather", window.location.origin);
  url.searchParams.set("city", city);
  if (country) url.searchParams.set("country", country);

  const resp = await fetch(url, {
    signal: weatherController.signal,
    headers: { Accept: "application/json" },
  });

  const body = await resp.json().catch(() => null);
  if (!resp.ok) {
    throw new Error(body?.error ?? `Error (${resp.status})`);
  }
  return body;
}

// ================================
// EVENTOS DEL FORMULARIO
// ================================
function setStatus(text, type = "info") {
  statusEl.textContent = text || "";
  statusEl.classList.toggle("error", type === "error");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city    = cityEl.value.trim();

  const selectedMatches =
    selectedCity &&
    typeof selectedCity.name === "string" &&
    selectedCity.name.trim().toLowerCase() === city.toLowerCase();
  const country = selectedMatches ? (selectedCity.country ?? "").toString().trim().toUpperCase() : "";

  closeDropdown();
  resultEl.hidden = true;
  setStatus("");

  if (!city) {
    setStatus("Escribe una ciudad para consultar.", "error");
    cityEl.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Consultando…";
  clearBtn.disabled = true;
  setStatus("Consultando clima…");

  try {
    const data = await fetchWeather(city, country);
    render(data);
    setStatus("Listo.");
  } catch (err) {
    if (err.name !== "AbortError") {
      setStatus(err.message || "Error al consultar.", "error"); // ← esto
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Consultar";
    clearBtn.disabled = false;
  }
});

clearBtn.addEventListener("click", () => {
  cityEl.value    = "";
  selectedCity = null;
  resultEl.hidden = true;
  closeDropdown();
  setStatus("");
  cityEl.focus();
});

cityEl.focus();