class LeftHeadBtns extends HTMLElement {
  static get observedAttributes() { return ['count']; }

  attributeChangedCallback(_name, _oldValue, count) {
    const badge = this.shadowRoot?.querySelector('.badge');
    if (badge) badge.textContent = count || '';
  }

  connectedCallback() {
    if (this.shadowRoot) {
      document.addEventListener('pointerdown', this.onOutsideClick);
      return;
    }
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        :host { display:block;position:relative;z-index:2;flex:none;font-family:Segoe UI,Calibri,sans-serif }
        * { box-sizing:border-box }
        button { cursor:pointer }
        .trigger { position:relative;display:grid;place-items:center;width:56px;height:56px;
          padding:0;border:1px solid #64646c;border-radius:5px;background:#50505a;color:#fff }
        .trigger:hover,.trigger:focus-visible { outline:2px solid #4fe3ff;outline-offset:2px }
        .lines { display:grid;gap:5px;width:29px }
        .lines i { display:block;height:3px;border-radius:2px;background:currentColor }
        .badge { position:absolute;right:-8px;bottom:-7px;min-width:23px;height:23px;padding:0 3px;
          border-radius:12px;background:#c80000;color:#fff;font-size:15px;font-weight:700;line-height:23px;
          text-align:center;box-shadow:0 2px 7px #0008 }
        .panel { position:absolute;top:70px;left:0;width:min(360px,calc(100vw - 52px));max-height:min(65vh,500px);
          overflow:auto;padding:16px;background:#151b27;color:#e5ecf5;border:1px solid #586476;
          border-top:2px solid #4fe3ff;box-shadow:0 16px 40px #000a }
        .panel[hidden] { display:none }
        .heading { display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;
          font-size:18px;font-weight:700 }
        .close { border:0;background:none;color:#a8b6ca;font-size:25px;line-height:1 }
        .events { margin:0;padding:0;list-style:none }
        .events li { padding:9px 0;border-top:1px solid #374252;font-size:14px;line-height:1.35 }
        .empty { margin:0;color:#a8b6ca;font-size:14px;line-height:1.4 }
      </style>
      <button class="trigger" type="button" aria-label="Уведомления мониторинга добычи" aria-expanded="false">
        <span class="lines" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="badge" aria-hidden="true"></span>
      </button>
      <section class="panel" aria-label="Уведомления мониторинга добычи" hidden>
        <div class="heading"><span>Уведомления</span><button class="close" type="button" aria-label="Свернуть">×</button></div>
        <ul class="events"></ul>
        <p class="empty">Список уведомлений сейчас недоступен.</p>
      </section>`;

    this.trigger = shadow.querySelector('.trigger');
    this.panel = shadow.querySelector('.panel');
    shadow.querySelector('.badge').textContent = this.getAttribute('count') || '';
    this.trigger.addEventListener('click', () => this.toggle());
    shadow.querySelector('.close').addEventListener('click', () => this.toggle(false));
    this.onOutsideClick = event => { if (!event.composedPath().includes(this)) this.toggle(false); };
    this.onEscape = event => {
      if (event.key === 'Escape' && !this.panel.hidden) { event.stopPropagation(); this.toggle(false); }
    };
    document.addEventListener('pointerdown', this.onOutsideClick);
    shadow.addEventListener('keydown', this.onEscape);
    shadow.addEventListener('keydown', event => {
      if (['Enter', ' ', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown'].includes(event.key)) event.stopPropagation();
    });
  }

  disconnectedCallback() { document.removeEventListener('pointerdown', this.onOutsideClick); }

  toggle(force = this.panel.hidden) {
    this.panel.hidden = !force;
    this.trigger.setAttribute('aria-expanded', String(force));
    if (force && !this.loaded) this.loadEvents();
  }

  async loadEvents() {
    this.loaded = true;
    try {
      const response = await fetch('/notifications/1');
      if (!response.ok) return;
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      const entries = [...doc.querySelectorAll('li')].map(item => item.textContent.trim()).filter(Boolean);
      if (!entries.length) return;
      const list = this.shadowRoot.querySelector('.events');
      list.replaceChildren(...entries.map(text => {
        const item = document.createElement('li');
        item.textContent = text;
        return item;
      }));
      this.shadowRoot.querySelector('.empty').hidden = true;
      this.setAttribute('count', String(entries.length));
    } catch { /* В автономном показе источник уведомлений может быть недоступен. */ }
  }
}

customElements.define('left-head-btns', LeftHeadBtns);
