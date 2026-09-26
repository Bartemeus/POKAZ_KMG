@echo off
title KMG Disconnect and Keep Desktop Alive
cd /d "%~dp0"

echo ========================================================
echo   KMG: Отключение RDP с сохранением рабочего стола
echo ========================================================
echo.
echo [*] Запрашиваем перевод сессии на физическую консоль...
echo [!] Окно RDP закроется, но рабочий стол продолжит работать,
echo     трансляция и клики останутся активными!
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$id = (Get-Process -Id $PID).SessionId; Write-Host \"[+] Сессия ID: $id\"; Start-Process tscon -ArgumentList \"$id /dest:console\" -Verb RunAs"

if %errorlevel% neq 0 (
    echo [!] Ошибка запуска tscon. Попробуйте запустить этот файл:
    echo     Правой кнопкой мыши -^> Запуск от имени администратора.
    pause
)
