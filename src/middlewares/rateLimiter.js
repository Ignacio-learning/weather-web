"use strict"

const rateLimit = require("express-rate-limit")

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Demasiadas consultas. Espere un minuto antes de volver a intentar.",
    },
});

module.exports = { apiLimiter };