@echo off
chcp 65001 >nul
title KMG Remote Host Agent (Mouse & Screen Control)
echo ===================================================
echo  Запуск локального агента управления кликами
echo  WebSocket: ws://localhost:8765
echo ===================================================
python -c "import pyautogui, websockets" >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Не найдены зависимости pyautogui / websockets. Запускаю установку...
    call "%~dp0setup_host.cmd"
)
python "%~dp0host_agent.py"
pause
