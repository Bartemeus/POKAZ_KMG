@echo off
title KMG Remote Host Setup
cd /d "%~dp0"

echo ========================================================
echo   KMG Remote Host - Environment Setup
echo ========================================================
echo.

rem 1. Check Python
python --version >nul 2>&1
if %errorlevel% equ 0 goto PYTHON_OK

echo [!] Python not found in PATH.
echo [*] Trying to install Python via winget...
winget install -e --id Python.Python.3.11 --scope machine --accept-source-agreements --accept-package-agreements
if %errorlevel% neq 0 goto PYTHON_ERROR

rem Refresh PATH for current session
for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "SYS_PATH=%%b"
for /f "tokens=2*" %%a in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USER_PATH=%%b"
set "PATH=%SYS_PATH%;%USER_PATH%;%PATH%"

python --version >nul 2>&1
if %errorlevel% neq 0 goto PYTHON_ERROR

:PYTHON_OK
echo [+] Python found:
python --version
echo.

rem 2. Install pip packages
echo [+] Installing required packages: websockets, pyautogui, pygetwindow, pillow...
python -m pip install --upgrade pip
python -m pip install websockets pyautogui pygetwindow pillow
if %errorlevel% neq 0 goto PIP_ERROR

rem 3. Configure Windows Firewall
echo.
echo [+] Configuring Windows Firewall (ports 8765 and 8000)...
net session >nul 2>&1
if %errorlevel% neq 0 goto FIREWALL_SKIP

netsh advfirewall firewall add rule name="KMG_Remote_WS_8765" dir=in action=allow protocol=TCP localport=8765 profile=any >nul 2>&1
netsh advfirewall firewall add rule name="KMG_Remote_HTTP_8000" dir=in action=allow protocol=TCP localport=8000 profile=any >nul 2>&1
echo [OK] Firewall rules added.
goto FINISH

:FIREWALL_SKIP
echo [i] Running without admin privileges. Firewall rules skipped (not required for localhost).
goto FINISH

:PIP_ERROR
echo.
echo [ERROR] Failed to install pip packages.
pause
exit /b 1

:PYTHON_ERROR
echo.
echo [ERROR] Python not found and automatic installation failed.
echo Please install Python manually from https://www.python.org/downloads/
echo Make sure to check "Add Python to PATH" during installation.
pause
exit /b 1

:FINISH
echo.
echo ========================================================
echo   Setup completed successfully!
echo   You can now run start_host.cmd
echo ========================================================
echo.
pause
