@echo off
chcp 65001 >nul
title KMG Remote Host · Запуск системы трансляции
cd /d "%~dp0\.."

echo ========================================================
echo   Запуск KMG Remote Host (Стример + Агент кликов)
echo ========================================================
echo.

rem 1. Проверка установки зависимостей
python -c "import pyautogui, websockets" >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Не найдены необходимые библиотеки (pyautogui, websockets).
    echo Запускаю автоматическую установку...
    call "%~dp0setup_host.cmd"
)

rem 2. Запуск локального веб-сервера (порт 8000) в фоновом окне, если порт свободен
netstat -ano | findstr ":8000" | findstr "LISTENING" >nul 2>&1
if %errorlevel% neq 0 (
    echo [+] Запуск локального HTTP сервера (http://localhost:8000)...
    start "KMG HTTP Server :8000" /min python -m http.server 8000
    timeout /t 2 /nobreak >nul
) else (
    echo [i] Веб-сервер на порту 8000 уже активен.
)

rem 3. Открытие страницы хоста в браузере (Chrome / Edge / дефолтный)
set "SENDER_URL=http://localhost:8000/remote/sender.html"

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"

if exist "%CHROME%" (
    echo [+] Открытие хоста в Google Chrome...
    start "" "%CHROME%" --app="%SENDER_URL%"
) else (
    echo [+] Открытие хоста в браузере по умолчанию...
    start "" "%SENDER_URL%"
)

rem 4. Запуск Python-агента кликов в текущем окне
echo.
echo ========================================================
echo   Запуск Python Host Agent (WebSocket :8765)
echo   Для остановки нажмите Ctrl+C
echo ========================================================
python "%~dp0host_agent.py"

pause
