import asyncio
import json
import sys
import pyautogui
import websockets

try:
    import pygetwindow as gw
except ImportError:
    gw = None

# Немедленный вывод в консоль без буферизации
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(line_buffering=True)

# Предотвращаем падение при кликах в углах экрана (0, 0)
pyautogui.FAILSAFE = False
pyautogui.PAUSE = 0.02

HOST = "0.0.0.0"
PORT = 8765

async def handle_client(websocket):
    client_addr = websocket.remote_address
    print(f"[HostAgent] Клиент подключен: {client_addr}")
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
            except json.JSONDecodeError:
                print(f"[HostAgent] Невалидный JSON: {message}")
                continue

            msg_type = data.get("type", "click")
            if msg_type == "click":
                norm_x = float(data.get("x", 0.0))
                norm_y = float(data.get("y", 0.0))
                button = data.get("button", "left")
                clicks = int(data.get("clicks", 1))
                window_title = data.get("window_title", None)

                # Ограничиваем диапазон от 0.0 до 1.0
                norm_x = max(0.0, min(1.0, norm_x))
                norm_y = max(0.0, min(1.0, norm_y))

                target_window = None
                if window_title and gw:
                    windows = gw.getWindowsWithTitle(window_title)
                    if windows:
                        target_window = windows[0]

                if target_window and target_window.width > 0 and target_window.height > 0:
                    real_x = int(target_window.left + norm_x * target_window.width)
                    real_y = int(target_window.top + norm_y * target_window.height)
                    mode_info = f"Окно '{target_window.title}' ({target_window.left},{target_window.top} {target_window.width}x{target_window.height})"
                else:
                    screen_w, screen_h = pyautogui.size()
                    real_x = int(norm_x * screen_w)
                    real_y = int(norm_y * screen_h)
                    mode_info = f"Экран ({screen_w}x{screen_h})"

                print(f"[HostAgent] Клик [{button} x{clicks}]: ({norm_x:.4f}, {norm_y:.4f}) -> Реальные координаты ({real_x}, {real_y}) [{mode_info}]")
                try:
                    pyautogui.click(x=real_x, y=real_y, button=button, clicks=clicks)
                except Exception as err:
                    print(f"[HostAgent] Ошибка при клике: {err}")

            elif msg_type == "ping":
                await websocket.send(json.dumps({"type": "pong"}))

    except websockets.exceptions.ConnectionClosed:
        print(f"[HostAgent] Клиент отключился: {client_addr}")
    except Exception as exc:
        print(f"[HostAgent] Ошибка соединения: {exc}")

async def main():
    screen_w, screen_h = pyautogui.size()
    print("=" * 60)
    print("  KMG Remote Presentation Host Agent")
    print(f"  Разрешение экрана: {screen_w}x{screen_h}")
    print(f"  WebSocket сервер: ws://{HOST}:{PORT}")
    print("  Ожидание команд от sender.html...")
    print("=" * 60)

    async with websockets.serve(handle_client, HOST, PORT):
        await asyncio.Future()  # Работает непрерывно

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[HostAgent] Сервер остановлен пользователем.")
        sys.exit(0)
