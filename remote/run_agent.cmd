@echo off
title KMG Remote Host Agent
cd /d "%~dp0"

echo ========================================================
echo   KMG Remote Host Agent (Mouse & Screen Control)
echo   WebSocket: ws://localhost:8765
echo ========================================================
python -c "import pyautogui, websockets" >nul 2>&1
if %errorlevel% equ 0 goto RUN

echo [!] Missing dependencies (pyautogui, websockets). Installing...
call "%~dp0setup_host.cmd"

:RUN
python "%~dp0host_agent.py"
pause
