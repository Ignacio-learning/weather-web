"use strict";

const { Router } = require("express");
const { getWeatherByCity } = require("../services/weatherService");

const router = Router();

router.get("/weather", async (req, res) => {
  const city =
    typeof req.query.city === "string" ? req.query.city.trim() : "";
  const country =
    typeof req.query.country === "string"
      ? req.query.country.trim().toUpperCase()
      : "";

  // Validación 1: ciudad es obligatoria
  if (!city) {
    return res.status(400).json({ error: "Falta el parámetro 'city'." });
  }

  // Validación 2: si se envió país, debe ser exactamente 2 letras
  if (country && !/^[A-Z]{2}$/.test(country)) {
    return res.status(400).json({
      error: "El código de país debe ser de 2 letras (ej: CL, AR, MX).",
    });
  }

  try {
    const data = await getWeatherByCity(city, country);
    return res.json(data);
  } catch (err) {
    return res.status(err.statusCode ?? 500).json({ error: err.message });
  }
});

module.exports = router;