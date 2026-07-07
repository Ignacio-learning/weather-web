# Chile Data Hub

Portal de datos chilenos: clima, indicadores económicos, sismos, feriados y más.

## Stack

- **Frontend**: Vite + React 19 + TypeScript (`client/`)
- **Backend**: Express + TypeScript BFF (`server/`)
- **APIs**: OpenWeatherMap + boostr.cl

## Requisitos

- Node.js 18+
- API key de OpenWeatherMap (gratuita en https://openweathermap.org/)

## Desarrollo

```bash
npm install
npm run dev
```

Esto levanta:
- **Vite** en `http://localhost:5173` (frontend con HMR)
- **Express** en `http://localhost:3001` (backend, proxeado vía Vite)

## Build

```bash
npm run build
npm start
```

## Estructura

```
client/     → Frontend React (Vite)
server/     → Backend Express (BFF proxy)
.env        → Variables de entorno
```
