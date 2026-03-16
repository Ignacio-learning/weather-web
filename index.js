"use strict";

const readline = require("readline");

// Usa la API de OpenWeatherMap (https://openweathermap.org/)
// 1. Crea una cuenta gratuita.
// 2. Consigue tu API key.
// 3. Ponla en la variable de entorno OPENWEATHER_API_KEY.

const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.error("ERROR: Debes definir la variable de entorno OPENWEATHER_API_KEY con tu API key de OpenWeatherMap.");
  console.error("Ejemplo en PowerShell:");
  console.error('$env:OPENWEATHER_API_KEY="TU_API_KEY_AQUI"');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function preguntar(texto) {
  return new Promise((resolve) => {
    rl.question(texto, (respuesta) => resolve(respuesta.trim()));
  });
}

async function obtenerClima(ciudad, pais) {
  const q = pais ? `${ciudad},${pais}` : ciudad;

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", q);
  url.searchParams.set("appid", API_KEY);
  url.searchParams.set("units", "metric"); // grados Celsius
  url.searchParams.set("lang", "es");

  try {
    const resp = await fetch(url);

    if (!resp.ok) {
      if (resp.status === 404) {
        throw new Error("Ciudad no encontrada. Revisa el nombre y el país.");
      }
      throw new Error(`Error en la API (status ${resp.status})`);
    }

    const data = await resp.json();

    const nombreCiudad = `${data.name}, ${data.sys.country}`;
    const temp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const tempMin = data.main.temp_min;
    const tempMax = data.main.temp_max;
    const humedad = data.main.humidity;
    const presion = data.main.pressure;
    const descripcion = data.weather && data.weather[0] ? data.weather[0].description : "Sin descripción";
    const viento = data.wind && typeof data.wind.speed === "number" ? data.wind.speed : null;

    console.log("\n================ CLIMA ACTUAL ================");
    console.log(`Ubicación          : ${nombreCiudad}`);
    console.log(`Descripción        : ${descripcion}`);
    console.log(`Temperatura        : ${temp} °C`);
    console.log(`Sensación térmica  : ${feelsLike} °C`);
    console.log(`Temp. mínima       : ${tempMin} °C`);
    console.log(`Temp. máxima       : ${tempMax} °C`);
    console.log(`Humedad            : ${humedad} %`);
    console.log(`Presión            : ${presion} hPa`);
    if (viento !== null) {
      console.log(`Viento             : ${viento} m/s`);
    }
    console.log("=============================================\n");
  } catch (err) {
    console.error("\nOcurrió un error al obtener el clima:");
    console.error(err.message);
  }
}

async function main() {
  console.log("=============================================");
  console.log("      CONSULTA DE CLIMA (OpenWeather)        ");
  console.log("=============================================\n");

  while (true) {
    const ciudad = await preguntar("Ingresa la ciudad (o deja vacío para salir): ");
    if (!ciudad) break;

    const pais = await preguntar('Ingresa el código de país (ej: AR, MX, ES) o deja vacío para omitir: ');

    await obtenerClima(ciudad, pais);

    const otra = await preguntar("¿Quieres consultar otra ubicación? (s/n): ");
    if (!/^s(i)?$/i.test(otra)) {
      break;
    }
    console.log();
  }

  rl.close();
  console.log("\nGracias por usar la app de clima.");
}

main().catch((err) => {
  console.error("Error inesperado:", err);
  rl.close();
  process.exit(1);
});

