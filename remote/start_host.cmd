@echo off
title KMG Remote Host Launcher
cd /d "%~dp0"

echo ========================================================
echo   KMG Remote Host - Starting Services
echo ========================================================
echo.

rem 1. Check Python and dependencies
python -c "import pyautogui, websockets" >nul 2>&1
if %errorlevel% equ 0 goto DEPS_OK

echo [!] Missing dependencies (pyautogui, websockets).
echo [*] Launching setup_host.cmd...
call "%~dp0setup_host.cmd"

:DEPS_OK
rem 2. Start HTTP server on port 8000 if not running
netstat -ano | findstr ":8000" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 goto HTTP_RUNNING

echo [+] Starting local HTTP server on http://localhost:8000 ...
start "KMG HTTP Server :8000" /min python -m http.server 8000
timeout /t 2 /nobreak >nul
goto OPEN_BROWSER

:HTTP_RUNNING
echo [i] HTTP server on port 8000 is already active.

:OPEN_BROWSER
set "SENDER_URL=http://localhost:8000/sender.html?v=%RANDOM%"

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"

if exist "%CHROME%" (
    echo [+] Opening host interface in Google Chrome...
    start "" "%CHROME%" --app="%SENDER_URL%"
) else (
    echo [+] Opening host interface in default browser...
    start "" "%SENDER_URL%"
)

rem 4. Run Python click agent
echo.
echo ========================================================
echo   Running Python Host Agent (WebSocket :8765)
echo   Press Ctrl+C to stop
echo ========================================================
python "%~dp0host_agent.py"

pause
