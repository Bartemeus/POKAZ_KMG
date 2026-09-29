(() => {
  const content = document.getElementById('content');
  const surface = content.querySelector('.content-view-surface');
  const video = document.getElementById('content-im-video');
  const tabs = [...surface.querySelectorAll('.content-tabs [role="tab"]')];
  let active = false;

  function selectView(view, restart = false) {
    content.dataset.surfaceView = view;
    for (const tab of tabs) {
      const selected = tab.dataset.view === view;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    if (view === 'video' && active) {
      if (restart && video.readyState) video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function syncVisibility() {
    const visible = surface.classList.contains('is-current') && content.classList.contains('is-visible');
    if (visible && !active) {
      active = true;
      selectView('video', true);
    } else if (!visible && active) {
      active = false;
      video.pause();
    }
  }

  for (const tab of tabs) {
    tab.addEventListener('click', () => {
      if (!active || tab.dataset.view === content.dataset.surfaceView) return;
      selectView(tab.dataset.view);
    });
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const next = tabs.find(candidate => candidate !== tab);
      next.click();
      next.focus();
    });
  }

  new MutationObserver(syncVisibility).observe(content, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(syncVisibility).observe(surface, { attributes: true, attributeFilter: ['class'] });
  selectView('video');
  syncVisibility();
})();
