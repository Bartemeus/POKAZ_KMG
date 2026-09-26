### Созданные и измененные файлы

* [host_agent.py](file:///c:/Users/ADMIN/Documents/src/POKAZ_KMG/remote/host_agent.py) — локальный WebSocket-сервер (`ws://localhost:8765`), транслирующий координаты кликов в реальные действия мыши через `pyautogui`.
* [run_agent.cmd](file:///c:/Users/ADMIN/Documents/src/POKAZ_KMG/remote/run_agent.cmd) — скрипт быстрого запуска Python-агента в один клик.
* [sender.html](file:///c:/Users/ADMIN/Documents/src/POKAZ_KMG/remote/sender.html) — страница хоста: захват окна приложения через `getDisplayMedia`, WebRTC-вещание через PeerJS и пересылка кликов в `host_agent.py`.
* [viewer.html](file:///c:/Users/ADMIN/Documents/src/POKAZ_KMG/remote/viewer.html) — легковесный клиент для `<iframe>`: прием WebRTC-видеопотока, расчет относительных координат (`0.0`–`1.0`) с учетом `object-fit: contain` и отправка кликов хосту.
* [первый_слайд_v3.html](file:///c:/Users/ADMIN/Documents/src/POKAZ_KMG/цд/первый_слайд_v3.html) — добавлен переключатель **«🔴 Live Управление» / «📹 Видеозапись»** и встроенный `<iframe id="pc-stream">` вместо стандартного видео.

---

### Пошаговая инструкция запуска и тестирования

#### Шаг 1. Запуск Python-агента кликов
Запустите агент двойным щелчком по [run_agent.cmd](file:///c:/Users/ADMIN/Documents/src/POKAZ_KMG/remote/run_agent.cmd) либо в терминале:
```bash
python remote/host_agent.py
```
*(Сервер слушает на `ws://0.0.0.0:8765`, разрешение экрана и координаты логируются в консоль).*

#### Шаг 2. Запуск хоста стрима
1. Откройте страницу хоста: [http://localhost:8000/remote/sender.html](http://localhost:8000/remote/sender.html).
2. Убедитесь, что индикатор **Python-агент** горит зеленым (`Готов`).
3. Нажмите кнопку **«🖥️ Выбрать окно для стрима»** и выберите окно целевой программы (или весь экран).
4. По умолчанию используется комната `kmg-stream-demo`.

#### Шаг 3. Открытие клиента (презентации)
* **Внутри цифрового двойника:** откройте [http://localhost:8000/цд/первый_слайд_v3.html](http://localhost:8000/цд/первый_слайд_v3.html), перейдите в правый блок контента — активен режим **«🔴 Live Управление»**, принимающий видео и транслирующий клики.
* **Автономный плеер:** откройте [http://localhost:8000/remote/viewer.html](http://localhost:8000/remote/viewer.html) (параметр комнаты по умолчанию: `?room=kmg-stream-demo`).

#### Шаг 4. Проверка связки
1. Кликните мышью в любую область видеотрансляции в `viewer.html` или в окне цифрового двойника.
2. На экране зрителя отобразится точка клика (голубая анимация ряби).
3. В консоли `host_agent.py` и на странице `sender.html` отобразится входящее событие:
   ```text
   [HostAgent] Клик [left x1]: (0.4521, 0.3210) -> Реальные координаты (868, 346) [Экран (1920x1080)]
   ```
4. Мышь на хосте физически совершит клик по указанным координатам.