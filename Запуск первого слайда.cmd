@echo off
title KMG Digital Twin - Slide 1 Launcher
cd /d "%~dp0"

echo ========================================================
echo   KMG Digital Twin · Запуск первого слайда
echo   Хост удаленной трансляции: 10.122.149.90
echo ========================================================
echo.

rem 1. Запуск локального HTTP сервера для обхода CORS
netstat -ano | findstr ":8000" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 goto HTTP_READY

echo [+] Запуск локального HTTP сервера (http://localhost:8000)...
start "KMG HTTP Server :8000" /min python -m http.server 8000
timeout /t 2 /nobreak >nul

:HTTP_READY
rem 2. Открытие в Chrome
set "SLIDE_URL=http://localhost:8000/%%D1%%86%%D0%%B4/%%D0%%BF%%D0%%B5%%D1%%80%%D0%%B2%%D1%%8B%%D0%%B9_%%D1%%81%%D0%%BB%%D0%%B0%%D0%%B9%%D0%%B4_v3.html?server=10.122.149.90"

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"

if exist "%CHROME%" (
    echo [+] Запуск Chrome...
    start "" "%CHROME%" --autoplay-policy=no-user-gesture-required "%SLIDE_URL%"
) else (
    echo [+] Открытие браузера по умолчанию...
    start "" "%SLIDE_URL%"
)

echo.
echo [OK] Слайд запущен на http://localhost:8000
echo.
