# Weather Web (Node.js)

Pequeña aplicación web en Node.js para consultar el clima actual por ciudad y país usando la API de OpenWeatherMap.

## Requisitos

- Node.js 18 o superior (para usar `fetch` nativo).
- Una API key gratuita de OpenWeatherMap.

## Configuración de la API key

1. Crea una cuenta en [OpenWeatherMap](https://openweathermap.org/).
2. Obtén tu API key.
3. El servidor usa la variable de entorno `OPENWEATHER_API_KEY`. En PowerShell (Windows), ejecuta:

```powershell
$env:OPENWEATHER_API_KEY="TU_API_KEY_AQUI"
```

> Esa variable solo vive en la sesión actual de la terminal. Si cierras la ventana tendrás que volver a definirla, o bien agregarla a tus variables de entorno de Windows de forma permanente.

## Instalación

En la carpeta del proyecto (`Weather/`), instala dependencias:

```bash
npm install
```

## Uso (Web)

En la carpeta del proyecto:

```bash
npm start
```

Luego:

- Abre `http://localhost:5173` en tu navegador.
- Ingresa la **ciudad** cuando te lo pida la interfaz.
- Opcionalmente ingresa el **código de país** (por ejemplo `AR`, `MX`, `ES`).
- La app mostrará temperatura en °C, sensación térmica, mín/máx, humedad, presión, viento, descripción y coordenadas.

## Ejecutar desde Cursor/VSCode (Launch)

En `.vscode/launch.json` tienes `Ejecutar Weather Web`. Reemplaza `OPENWEATHER_API_KEY` por tu key y lanza con F5.

