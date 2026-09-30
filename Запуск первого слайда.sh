#!/bin/bash
cd "$(dirname "$0")"

echo "========================================================"
echo "  KMG Digital Twin · Запуск первого слайда"
echo "  Хост удаленной трансляции: 10.122.149.90"
echo "========================================================"
echo

# 1. Запуск локального HTTP сервера для обхода CORS
if lsof -i :8000 | grep -q LISTEN; then
    echo "[+] HTTP сервер уже запущен на порту 8000"
else
    echo "[+] Запуск локального HTTP сервера (http://localhost:8000)..."
    python3 -m http.server 8000 > /dev/null 2>&1 &
    sleep 1
fi

# 2. Открытие в Chrome
SLIDE_URL="http://localhost:8000/%D1%86%D0%B4/%D0%BF%D0%B5%D1%80%D0%B2%D1%8B%D0%B9_%D1%81%D0%BB%D0%B0%D0%B9%D0%B4_v3.html?server=10.122.149.90"

if [ -d "/Applications/Google Chrome.app" ]; then
    echo "[+] Запуск Chrome..."
    open -a "Google Chrome" "$SLIDE_URL"
else
    echo "[+] Открытие браузера по умолчанию..."
    open "$SLIDE_URL"
fi

echo
echo "[OK] Слайд запущен на http://localhost:8000"
echo
