"use strict";
// Configuración de la API key y el puerto, debe estar al inicio del codigo ya que mas abajo se usan las variables de entorno y si se pone despues,
//  no se va a poder usar las variables de entorno, ya que se usan antes de que se definan.
require("dotenv").config();

const path = require("path");
const express = require("express");
const weatherRouter = require("./routes/weather");

const PORT = process.env.PORT ? Number(process.env.PORT) : 5173;
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.error("ERROR: Define OPENWEATHER_API_KEY en tu archivo .env");
  process.exit(1);
}

const app = express();
app.disable("x-powered-by");

//Archivos estaticos
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));

// Rutas de la API
app.use("/api", weatherRouter);

// Fallback SPA
app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});
