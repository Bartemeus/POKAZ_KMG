/* TEO opens on the three v5 overview images; other systems open on video.
   Embedded applications load only when the presenter asks for them. */
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
  const images = [...carousel.querySelectorAll('img')];
  const previous = document.getElementById('teo-prev');
  const next = document.getElementById('teo-next');
  const count = document.getElementById('teo-count');
  let imageIndex = 0;

  function showTeoImage(index){
    imageIndex = Math.max(0, Math.min(images.length - 1, index));
    images.forEach((image, i) => {
      image.classList.toggle('is-active', i === imageIndex);
      image.setAttribute('aria-hidden', String(i !== imageIndex));
    });
    count.textContent = `${imageIndex + 1} / ${images.length}`;
    previous.disabled = imageIndex === 0;
    next.setAttribute('aria-label', imageIndex === images.length - 1 ? 'Следующий слой' : 'Следующий кадр');
  }
  window.__teoCarousel = { show:showTeoImage, get index(){ return imageIndex; } };
  showTeoImage(0);

  previous.addEventListener('click', event => {
    event.stopPropagation();
    showTeoImage(imageIndex - 1);
  });
  next.addEventListener('click', event => {
    event.stopPropagation();
    if(imageIndex < images.length - 1){ showTeoImage(imageIndex + 1); return; }
    if(window.__advancePresentation){ window.__advancePresentation(); return; }
    if(window.parent !== window){ window.parent.postMessage({ слайд:true, шаг:+1 }, '*'); return; }
    document.querySelector('#stack .stack-item[data-zone="well"]:not(.step)').click();
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
      if(restart) showTeoImage(0);
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
