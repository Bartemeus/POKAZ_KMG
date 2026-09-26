@echo off
chcp 65001 >nul
title KMG Remote Host Agent (Mouse & Screen Control)
echo ===================================================
echo  Запуск локального агента управления кликами
echo  WebSocket: ws://localhost:8765
echo ===================================================
python "%~dp0host_agent.py"
pause
