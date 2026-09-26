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

# Структура комнат: room_id -> {"sender": websocket, "viewers": {viewer_id: websocket}}
ROOMS = {}

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

            # 1. Регистрация роли (стример или зритель)
            if msg_type == "register":
                role = data.get("role")  # "sender" или "viewer"
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
                    # Оповещаем уже подключенных зрителей, что стример онлайн
                    for v_id, v_ws in list(ROOMS[room_id]["viewers"].items()):
                        try:
                            await v_ws.send(json.dumps({"type": "host_status", "online": True, "room": room_id}))
                            # И просим хост отправить оффер зрителю
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

                    # Оповещаем стримера о новом зрителе для создания WebRTC PeerConnection
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

            # 2. Маршрутизация WebRTC сигналинга (SDP Offer, SDP Answer, ICE Candidates)
            elif msg_type == "signal":
                target = data.get("target")  # "sender" или ID зрителя
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

            # 2.1. Резервный видеопоток через WebSocket (на случай блокировки WebRTC UDP межсетевым экраном)
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

            # 3. Обработка клика мыши
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
                    screen_w, screen_h = pyautogui.size()
                    real_x = int(norm_x * screen_w)
                    real_y = int(norm_y * screen_h)
                    mode_info = f"Экран ({screen_w}x{screen_h})"

                print(f"[HostAgent] Клик [{button} x{clicks}]: ({norm_x:.4f}, {norm_y:.4f}) -> ({real_x}, {real_y}) [{mode_info}]")
                try:
                    pyautogui.click(x=real_x, y=real_y, button=button, clicks=clicks)
                except Exception as err:
                    print(f"[HostAgent] Ошибка при клике: {err}")

                # Пересылаем событие клика хосту для отображения в журнале sender.html
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
    screen_w, screen_h = pyautogui.size()
    print("=" * 60)
    print("  KMG Remote Presentation Host Agent & WebRTC Signaling")
    print(f"  Разрешение экрана: {screen_w}x{screen_h}")
    print(f"  WebSocket & Signaling: ws://{HOST}:{PORT}")
    print("  Полностью локальный режим (без внешних облачных серверов)")
    print("=" * 60)

    async with websockets.serve(handle_client, HOST, PORT):
        await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[HostAgent] Сервер остановлен пользователем.")
        sys.exit(0)
