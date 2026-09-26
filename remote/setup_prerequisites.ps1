# KMG Remote Host Prerequisites Setup
# Requires PowerShell 5.1+
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Настройка окружения KMG Remote Host (PowerShell)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Проверка Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[+] Найден Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[!] Python не найден. Попытка установки через winget..." -ForegroundColor Yellow
    winget install -e --id Python.Python.3.11 --scope machine --accept-source-agreements --accept-package-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

# 2. Установка pip-пакетов
Write-Host "[+] Установка библиотек websockets, pyautogui, pygetwindow, pillow..." -ForegroundColor Cyan
python -m pip install --upgrade pip
python -m pip install websockets pyautogui pygetwindow pillow

# 3. Настройка портов брандмауэра (если запущен с правами администратора)
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
    Write-Host "[+] Добавление правил брандмауэра..." -ForegroundColor Cyan
    New-NetFirewallRule -DisplayName "KMG Remote WS 8765" -Direction Inbound -LocalPort 8765 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue | Out-Null
    New-NetFirewallRule -DisplayName "KMG Remote HTTP 8000" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue | Out-Null
    Write-Host "[OK] Порты 8765 и 8000 открыты в брандмауэре." -ForegroundColor Green
} else {
    Write-Host "[i] Запуск без прав администратора. Правила брандмауэра пропущены." -ForegroundColor Gray
}

Write-Host "`n[OK] Окружение готово к работе." -ForegroundColor Green
