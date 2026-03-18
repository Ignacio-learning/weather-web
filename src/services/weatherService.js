"use strict";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

function buildWeatherUrl(city, country) {
    const q = country ? '${city}, ${country}' : city;
    const url = new URL(BASE_URL);

    url.searchParams.set("q", q);
    url.searchParams.set("appid", process.env.OPENWEATHER_API_KEY);
    url.searchParams.set("units", "metric");
    url.searchParams.set("lang", "es");

    return url;
}

function mapWeatherResponse(data) {
    return {
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
        },
    };

    }
    async function getWeatherByCity(city, country) {

        const url = buildWeatherUrl(city, country);

        const resp = await fetch(url);
        const data = await resp.json().catch(() => null);

        if (!resp.ok) {
            const error = new Error(
                resp.status === 404
                ? "Ciudad no encontrada. Revisa el nombre y/o el pais."
                : data?.message ?? `Error en la API externa (status ${resp.status})`
            );
            error.statusCode = resp.status === 404 ? 404 : 502;
            throw error;
        }
        return mapWeatherResponse(data);
    }
    module.exports = {getWeatherByCity};