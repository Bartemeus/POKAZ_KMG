/* Content of the open layer on the right. The views (title + data-video) are
   written in v4.html; this module picks the current one and plays its video
   in the shared <video>, or loads the local application in its frame. */
import { state, selection } from '../state.js';

const contentEl = document.getElementById('content');
const videoEl = document.getElementById('content-video');
const tumarVideoEl = document.getElementById('content-tumar');
const hasViewTabs = document.body.dataset.version === 'v6';
const views = [...contentEl.querySelectorAll('.content-view')];
const SWAP_MS = 260;
let swapTimer = null;

/* The reservoir has a view per step; other zones have one view. */
function viewFor(zoneId, step){
  return views.find(view => view.dataset.zone === zoneId &&
    (view.dataset.step === undefined || view.dataset.step === String(step)));
}

/* Reads state at fill time: on a switch the fill runs after a delay, and the
   open zone or the reservoir step may have changed by then. */
function fill(){
  const zoneId = state.openZone;
  const current = viewFor(zoneId, selection.step);
  for(const view of views) view.classList.toggle('is-current', view === current);
  contentEl.dataset.zone = zoneId;
  const isApp = current?.classList.contains('content-view-app') || false;
  const showsTumar = current?.dataset.zone === 'well';
  contentEl.classList.toggle('is-app', isApp);
  contentEl.inert = false;
  videoEl.hidden = isApp;
  if(showsTumar){
    tumarVideoEl.currentTime = 0;
    tumarVideoEl.play().catch(() => {});
  } else {
    tumarVideoEl.pause();
  }
  for(const view of views){
    const iframe = view.querySelector('iframe');
    if(!iframe) continue;
    if(view === current && isApp && !hasViewTabs && !iframe.hasAttribute('src')) iframe.src = iframe.dataset.src;
  }
  const file = current?.dataset.video;
  if(file){
    // same file: rewind instead of reloading
    if(videoEl.getAttribute('src') !== file){
      videoEl.setAttribute('src', file);
      videoEl.load();
    }
    videoEl.currentTime = 0;
    videoEl.play().catch(() => {});
  } else {
    videoEl.pause();
    videoEl.removeAttribute('src');
    videoEl.load();
  }
  contentEl.classList.add('is-visible');
}

export function showContent(isSwitch){
  clearTimeout(swapTimer);
  if(isSwitch){
    // old content fades, the new one follows — otherwise text would just swap mid-show without a gesture
    contentEl.classList.remove('is-visible');
    swapTimer = setTimeout(() => { if(state.openZone) fill(); }, SWAP_MS);
  } else {
    fill();
  }
}

export function hideContent(){
  clearTimeout(swapTimer);
  videoEl.pause();
  tumarVideoEl.pause();
  contentEl.inert = true;
  contentEl.classList.remove('is-visible');
}
