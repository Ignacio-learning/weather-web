"use strict"

const { Router } = require("express");
const { searchCities } = require("../services/geoCodeService");

const router = Router();

router.get("/geocode", async (req, res) => {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const limitRaw = parseInt(req.query.limit, 10);
    // Si no viene limit o es inválido, usamos 5 por defecto
    const limit = isNaN(limitRaw) || limitRaw < 1 ? 5 : Math.min(limitRaw, 5);

    if (!q || q.length < 2) {
        return res.status(400).json({
          error: "El parámetro 'q' debe tener al menos 2 caracteres.",
        });
      }
    
      try {
        const cities = await searchCities(q, limit);
        return res.json(cities);
      } catch (err) {
        return res.status(err.statusCode ?? 500).json({ error: err.message });
      }
    });
module.exports = router;