@echo off
title Aula de Letras - Iniciando...
color 0A

echo.
echo  =============================================
echo       AULA DE LETRAS - Plataforma Docente
echo  =============================================
echo.
echo  Iniciando servidor y cliente...
echo.

:: Iniciar el servidor en una nueva ventana
start "Servidor - Aula de Letras" cmd /k "cd /d %~dp0server && echo Iniciando servidor en http://localhost:5000 && npm run dev"

:: Esperar 3 segundos para que el servidor inicie
timeout /t 3 /nobreak >nul

:: Iniciar el cliente en una nueva ventana
start "Cliente - Aula de Letras" cmd /k "cd /d %~dp0client && echo Iniciando cliente en http://localhost:3000 && npm run dev"

:: Esperar 5 segundos adicionales
timeout /t 5 /nobreak >nul

:: Abrir el navegador
echo.
echo  Abriendo navegador...
start http://localhost:3000

echo.
echo  =============================================
echo  Proyecto iniciado correctamente!
echo  =============================================
echo.
echo  - Frontend: http://localhost:3000
echo  - Backend:  http://localhost:5000
echo.
echo  Usuario Admin:
echo  - Email: admin@auladeletras.com
echo  - Password: admin123
echo.
echo  Presiona cualquier tecla para cerrar esta ventana...
echo  (Las otras ventanas seguiran ejecutandose)
echo.
pause >nul
