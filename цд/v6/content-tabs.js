/* Each system opens on its video. The embedded application loads only when
   the presenter asks for it, then stays mounted for fast switching back. */
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

  function selectView(view, mode, restart = false){
    const video = view.querySelector('.content-media');
    const frame = view.querySelector('.content-live');
    view.dataset.view = mode;
    for(const tab of view.querySelectorAll('.content-tabs [role="tab"]')){
      const selected = tab.dataset.view === mode;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    if(mode === 'live'){
      video.pause();
      if(!frame.hasAttribute('src')) frame.src = frame.dataset.src;
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
        selectView(view, 'video', true);
      } else if(!visible && view._wasVisible){
        view._wasVisible = false;
        view.querySelector('.content-media').pause();
      }
    }
  }

  for(const view of views){
    selectView(view, 'video');
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
