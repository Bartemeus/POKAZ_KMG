@echo off
title Keep RDP Session Alive (Console Transfer)
cd /d "%~dp0"

echo ========================================================
echo   Перевод RDP-сессии в консоль (Desktop Keep-Alive)
echo ========================================================
echo.
echo [!] Внимание: RDP-окно сейчас закроется, но рабочий стол
echo     сервера останется АКТИВНЫМ в памяти.
echo     Трансляция и клики продолжат работать!
echo.

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Требуются права Администратора!
    echo Запустите этот файл правой кнопкой мыши:
    echo "Запуск от имени администратора"
    echo.
    pause
    exit /b 1
)

echo [*] Переключение сессии в консоль...
for /f "tokens=3" %%i in ('query session ^| findstr ">"') do (
    tscon %%i /dest:console
)

if %errorlevel% neq 0 (
    echo [*] Попытка через номер текущей сессии...
    tscon %sessionname% /dest:console
)

echo.
echo [OK] Готово.
