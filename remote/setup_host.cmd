@echo off
chcp 65001 >nul
title Установка зависимостей KMG Remote Host
cd /d "%~dp0"

echo ========================================================
echo   Установка компонентов KMG Remote Host (на удаленном ПК)
echo ========================================================
echo.

rem 1. Проверка наличия Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Python не обнаружен в PATH!
    echo Попытка установки через winget...
    winget install -e --id Python.Python.3.11 --scope machine --accept-source-agreements --accept-package-agreements
    if %errorlevel% neq 0 (
        echo [ERROR] Не удалось установить Python автоматически.
        echo Пожалуйста, установите Python вручную (с галочкой "Add Python to PATH"):
        echo https://www.python.org/downloads/
        pause
        exit /b 1
    )
    rem Обновляем PATH для текущей сессии
    set "PATH=%PATH%;%ProgramFiles%\Python311;%ProgramFiles%\Python311\Scripts;%LocalAppData%\Programs\Python\Python311;%LocalAppData%\Programs\Python\Python311\Scripts"
)

echo [+] Python найден:
python --version
echo.

rem 2. Обновление pip и установка библиотек
echo [+] Установка необходимых Python-библиотек...
python -m pip install --upgrade pip
python -m pip install websockets pyautogui pygetwindow pillow

if %errorlevel% neq 0 (
    echo [ERROR] Ошибка установки пакетов pip.
    pause
    exit /b 1
)

rem 3. Настройка Брандмауэра Windows (опционально, если потребуется подключение по локальной сети)
echo.
echo [+] Настройка портов Брандмауэра Windows (8765 WebSocket, 8000 Web)...
net session >nul 2>&1
if %errorlevel% equ 0 (
    netsh advfirewall firewall add rule name="KMG_Remote_WS_8765" dir=in action=allow protocol=TCP localport=8765 profile=any >nul 2>&1
    netsh advfirewall firewall add rule name="KMG_Remote_HTTP_8000" dir=in action=allow protocol=TCP localport=8000 profile=any >nul 2>&1
    echo [OK] Правила брандмауэра добавлены.
) else (
    echo [i] Запуск без прав администратора. Правила брандмауэра пропущены (для localhost не требуются).
)

echo.
echo ========================================================
echo   Настройка успешно завершена!
echo   Теперь можно запускать start_host.cmd
echo ========================================================
echo.
pause
