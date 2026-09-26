import asyncio
import json
import sys
import time
import ctypes
import pyautogui
import websockets

try:
    import pygetwindow as gw
except ImportError:
    gw = None

# Включаем учет масштабирования DPI в Windows (чтобы координаты 100% совпадали с пикселями экрана)
try:
    ctypes.windll.shcore.SetProcessDpiAwareness(2)  # Per-monitor DPI aware
except Exception:
    try:
        ctypes.windll.user32.SetProcessDPIAware()
    except Exception:
        pass

# Немедленный вывод в консоль без буферизации
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(line_buffering=True)

pyautogui.FAILSAFE = False
pyautogui.PAUSE = 0.01

HOST = "0.0.0.0"
PORT = 8765

ROOMS = {}

def get_screen_resolution():
    try:
        user32 = ctypes.windll.user32
        w = user32.GetSystemMetrics(0)
        h = user32.GetSystemMetrics(1)
        if w > 0 and h > 0:
            return w, h
    except Exception:
        pass
    return pyautogui.size()

def perform_hardware_click(x, y, button="left", clicks=1):
    try:
        user32 = ctypes.windll.user32
        user32.SetCursorPos(int(x), int(y))
        
        down_flag = 0x0002 if button == "left" else (0x0008 if button == "right" else 0x0020)
        up_flag = 0x0004 if button == "left" else (0x0010 if button == "right" else 0x0040)
        
        for i in range(clicks):
            user32.mouse_event(down_flag, 0, 0, 0, 0)
            time.sleep(0.03)
            user32.mouse_event(up_flag, 0, 0, 0, 0)
            if clicks > 1 and i < clicks - 1:
                time.sleep(0.05)
    except Exception as exc:
        print(f"[HostAgent] Ctypes click error, fallback to pyautogui: {exc}")
        pyautogui.click(x=x, y=y, button=button, clicks=clicks)

async def handle_client(websocket):
    client_addr = websocket.remote_address
    print(f"[HostAgent] Клиент подключился: {client_addr}")
    client_info = {"role": None, "room": None, "viewer_id": None}

    try:
        async for message in websocket:
            try:
                data = json.loads(message)
            except json.JSONDecodeError:
                print(f"[HostAgent] Невалидный JSON: {message}")
                continue

            msg_type = data.get("type", "click")

            # 1. Регистрация
            if msg_type == "register":
                role = data.get("role")
                room_id = data.get("room", "kmg-stream-demo")
                client_info["role"] = role
                client_info["room"] = room_id

                if room_id not in ROOMS:
                    ROOMS[room_id] = {"sender": None, "viewers": {}}

                if role == "sender":
                    ROOMS[room_id]["sender"] = websocket
                    viewers_cnt = len(ROOMS[room_id]["viewers"])
                    print(f"[HostAgent] Хост зарегистрирован в комнате '{room_id}' (зрителей: {viewers_cnt})")
                    await websocket.send(json.dumps({
                        "type": "registered",
                        "role": "sender",
                        "room": room_id,
                        "viewers_count": viewers_cnt
                    }))
                    for v_id, v_ws in list(ROOMS[room_id]["viewers"].items()):
                        try:
                            await v_ws.send(json.dumps({"type": "host_status", "online": True, "room": room_id}))
                            await websocket.send(json.dumps({"type": "viewer_joined", "viewer_id": v_id, "room": room_id}))
                        except Exception:
                            pass

                elif role == "viewer":
                    v_id = str(data.get("viewer_id") or id(websocket))
                    client_info["viewer_id"] = v_id
                    ROOMS[room_id]["viewers"][v_id] = websocket
                    print(f"[HostAgent] Зритель [{v_id}] зарегистрирован в комнате '{room_id}'")

                    sender_ws = ROOMS[room_id]["sender"]
                    is_host_online = sender_ws is not None
                    await websocket.send(json.dumps({
                        "type": "registered",
                        "role": "viewer",
                        "viewer_id": v_id,
                        "room": room_id,
                        "host_online": is_host_online
                    }))

                    if is_host_online:
                        try:
                            await sender_ws.send(json.dumps({
                                "type": "viewer_joined",
                                "viewer_id": v_id,
                                "room": room_id,
                                "viewers_count": len(ROOMS[room_id]["viewers"])
                            }))
                        except Exception:
                            pass

            # 2. Сигналинг
            elif msg_type == "signal":
                target = data.get("target")
                room_id = data.get("room") or client_info.get("room", "kmg-stream-demo")
                signal_data = data.get("data")
                sender_id = client_info.get("viewer_id") or "sender"

                if room_id in ROOMS:
                    if target == "sender":
                        target_ws = ROOMS[room_id]["sender"]
                        if target_ws:
                            await target_ws.send(json.dumps({
                                "type": "signal",
                                "from": sender_id,
                                "data": signal_data
                            }))
                    else:
                        target_ws = ROOMS[room_id]["viewers"].get(target)
                        if target_ws:
                            await target_ws.send(json.dumps({
                                "type": "signal",
                                "from": "sender",
                                "data": signal_data
                            }))

            # 2.1. Резервный видеоканал через сокет
            elif msg_type == "frame":
                room_id = client_info.get("room") or "kmg-stream-demo"
                frame_data = data.get("data")
                if room_id in ROOMS:
                    for v_ws in list(ROOMS[room_id]["viewers"].values()):
                        try:
                            await v_ws.send(json.dumps({
                                "type": "frame",
                                "data": frame_data
                            }))
                        except Exception:
                            pass

            # 3. Клик мыши
            elif msg_type == "click":
                norm_x = float(data.get("x", 0.0))
                norm_y = float(data.get("y", 0.0))
                button = data.get("button", "left")
                clicks = int(data.get("clicks", 1))
                window_title = data.get("window_title", None)

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
                    mode_info = f"Окно '{target_window.title}'"
                else:
                    screen_w, screen_h = get_screen_resolution()
                    real_x = int(norm_x * screen_w)
                    real_y = int(norm_y * screen_h)
                    mode_info = f"Экран ({screen_w}x{screen_h})"

                print(f"[HostAgent] Клик [{button} x{clicks}]: ({norm_x:.4f}, {norm_y:.4f}) -> Реальные координаты ({real_x}, {real_y}) [{mode_info}]")
                try:
                    perform_hardware_click(real_x, real_y, button=button, clicks=clicks)
                except Exception as err:
                    print(f"[HostAgent] Ошибка при клике: {err}")

                room_id = client_info.get("room")
                if room_id and room_id in ROOMS and ROOMS[room_id]["sender"]:
                    try:
                        await ROOMS[room_id]["sender"].send(json.dumps({
                            "type": "click_logged",
                            "x": norm_x,
                            "y": norm_y,
                            "real_x": real_x,
                            "real_y": real_y,
                            "button": button
                        }))
                    except Exception:
                        pass

            elif msg_type == "ping":
                await websocket.send(json.dumps({"type": "pong"}))

    except websockets.exceptions.ConnectionClosed:
        pass
    except Exception as exc:
        print(f"[HostAgent] Ошибка соединения: {exc}")
    finally:
        room_id = client_info.get("room")
        role = client_info.get("role")
        if room_id and room_id in ROOMS:
            if role == "sender" and ROOMS[room_id]["sender"] == websocket:
                ROOMS[room_id]["sender"] = None
                print(f"[HostAgent] Хост отключился из комнаты '{room_id}'")
                for v_ws in list(ROOMS[room_id]["viewers"].values()):
                    try:
                        await v_ws.send(json.dumps({"type": "host_status", "online": False}))
                    except Exception:
                        pass
            elif role == "viewer":
                v_id = client_info.get("viewer_id")
                if v_id and v_id in ROOMS[room_id]["viewers"]:
                    del ROOMS[room_id]["viewers"][v_id]
                    print(f"[HostAgent] Зритель [{v_id}] отключился из комнаты '{room_id}'")
                    sender_ws = ROOMS[room_id]["sender"]
                    if sender_ws:
                        try:
                            await sender_ws.send(json.dumps({
                                "type": "viewer_left",
                                "viewer_id": v_id,
                                "viewers_count": len(ROOMS[room_id]["viewers"])
                            }))
                        except Exception:
                            pass
        print(f"[HostAgent] Соединение закрыто: {client_addr}")

async def main():
    screen_w, screen_h = get_screen_resolution()
    print("=" * 60)
    print("  KMG Remote Presentation Host Agent & WebRTC Signaling")
    print(f"  Разрешение экрана (DPI-aware): {screen_w}x{screen_h}")
    print(f"  WebSocket & Signaling: ws://{HOST}:{PORT}")
    print("=" * 60)

    async with websockets.serve(handle_client, HOST, PORT):
        await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[HostAgent] Сервер остановлен пользователем.")
        sys.exit(0)
