@echo off
cd /d "%~dp0"
REM === CONFIGURA TU API KEY AQUI ===
set "OPENWEATHER_API_KEY="AQUI-TU-API-KEY"
set "PORT=5173"
echo Iniciando Weather Web...
npm start
echo.
echo (Presiona una tecla para cerrar esta ventana)
echo ERROR: %errorlevel%
pause >nul