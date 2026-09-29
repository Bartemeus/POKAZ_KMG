/* TEO presents three live NUMEX states; other systems open on video.
   The three states preload when TEO opens so slide changes do not flash blank. */
(() => {
  const content = document.getElementById('content');
  const top12 = document.getElementById('top12');
  window.__openTop12 = () => {
    document.body.classList.add('is-final');
    top12.classList.add('is-visible');
  };
  window.__hideTop12 = () => top12.classList.remove('is-visible');
  window.__resetFinal = () => {
    document.body.classList.remove('is-final');
    top12.classList.remove('is-visible');
  };
  const views = [...content.querySelectorAll('.content-view')]
    .filter(view => view.querySelector('.content-tabs'));
  const carousel = document.getElementById('content-teo-overview');
  const screens = [...carousel.querySelectorAll('.teo-screen')];
  const previous = document.getElementById('teo-prev');
  const next = document.getElementById('teo-next');
  const expand = document.getElementById('teo-expand');
  const count = document.getElementById('teo-count');
  let screenIndex = 0;

  function showTeoScreen(index){
    screenIndex = Math.max(0, Math.min(screens.length - 1, index));
    const teoVisible = content.classList.contains('is-visible') && carousel.closest('.content-view').classList.contains('is-current');
    screens.forEach((screen, i) => {
      const active = i === screenIndex;
      screen.classList.toggle('is-active', active);
      screen.classList.toggle('is-past', i < screenIndex);
      screen.classList.toggle('is-future', i > screenIndex);
      screen.setAttribute('aria-hidden', String(!active));
      screen.inert = !active;
      screen.tabIndex = active ? 0 : -1;
      if(teoVisible && !screen.hasAttribute('src')) screen.src = screen.dataset.src;
    });
    count.textContent = `${screenIndex + 1} / ${screens.length}`;
    previous.disabled = screenIndex === 0;
    next.setAttribute('aria-label', screenIndex === screens.length - 1 ? 'Следующий слой' : 'Следующий экран');
  }
  window.__teoCarousel = { show:showTeoScreen, get index(){ return screenIndex; } };
  showTeoScreen(0);

  previous.addEventListener('click', event => {
    event.stopPropagation();
    showTeoScreen(screenIndex - 1);
  });
  next.addEventListener('click', event => {
    event.stopPropagation();
    if(screenIndex < screens.length - 1){ showTeoScreen(screenIndex + 1); return; }
    if(window.__advancePresentation){ window.__advancePresentation(); return; }
    if(window.parent !== window){ window.parent.postMessage({ слайд:true, шаг:+1 }, '*'); return; }
    document.querySelector('#stack .stack-item[data-zone="well"]:not(.step)').click();
  });
  expand.addEventListener('click', event => {
    event.stopPropagation();
    screens[screenIndex].requestFullscreen?.().catch(console.error);
  });

  function selectView(view, mode, restart = false){
    const video = view.querySelector('video.content-media');
    const frame = view.querySelector('.content-live');
    view.dataset.view = mode;
    for(const tab of view.querySelectorAll('.content-tabs [role="tab"]')){
      const selected = tab.dataset.view === mode;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    if(mode === 'live'){
      video?.pause();
      if(!frame.hasAttribute('src')) frame.src = frame.dataset.src;
    } else if(mode === 'overview'){
      if(restart) showTeoScreen(0);
    } else if(view.classList.contains('is-current') && content.classList.contains('is-visible')){
      if(restart && video.readyState) video.currentTime = 0;
      video.play().catch(() => {});
    }
  }

  function syncVisibility(){
    for(const view of views){
      const visible = view.classList.contains('is-current') && content.classList.contains('is-visible');
      if(visible && !view._wasVisible){
        view._wasVisible = true;
        selectView(view, view.querySelector('.content-carousel') ? 'overview' : 'video', true);
      } else if(!visible && view._wasVisible){
        view._wasVisible = false;
        view.querySelector('video.content-media')?.pause();
      }
    }
  }

  for(const view of views){
    selectView(view, view.querySelector('.content-carousel') ? 'overview' : 'video');
    const tabs = [...view.querySelectorAll('.content-tabs [role="tab"]')];
    for(const tab of tabs){
      tab.addEventListener('click', () => {
        if(!view._wasVisible || tab.dataset.view === view.dataset.view) return;
        selectView(view, tab.dataset.view);
      });
      tab.addEventListener('keydown', event => {
        if(event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const next = tabs.find(candidate => candidate !== tab);
        next.click();
        next.focus();
      });
    }
    new MutationObserver(syncVisibility).observe(view, {attributes:true, attributeFilter:['class']});
  }
  new MutationObserver(syncVisibility).observe(content, {attributes:true, attributeFilter:['class']});
  syncVisibility();
})();
