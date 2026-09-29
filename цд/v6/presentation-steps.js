/* v5's keyboard walk-through for a standalone presentation. The embedded
   slide keeps its parent-controlled keys. The TEO video keeps the three beats
   of v5's still frames: start, middle and end. Left, PageUp and Backspace undo
   the matching forward step without replaying the whole presentation. */
import { selection } from '../v4/state.js';
import { openLayer, showLayerContent, switchLayer, closeLayer } from '../v4/transitions.js?v6-back-1';
import { MINI } from '../v4/scene/layout.js';
import { IN_FRAME } from '../v4/params.js';
import { hideAssetCard } from '../v4/ui/asset-card.js';
import { showInitialKeyEffects } from '../v4/ui/key-effects.js?v6-back-1';

if(!IN_FRAME){
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const teoVideo = document.getElementById('content-teo-video');
  function showTeoBeat(beat){
    const seek = () => {
      if(Number.isFinite(teoVideo.duration) && teoVideo.duration > 0){
        teoVideo.currentTime = Math.min(teoVideo.duration - 0.1, teoVideo.duration * beat / 3);
      }
    };
    if(teoVideo.readyState) seek();
    else teoVideo.addEventListener('loadedmetadata', seek, { once:true });
  }
  const steps = [
    async () => document.querySelector('#stack .stack-item[data-zone="reservoir"]:not(.step)').click(),
    async () => document.querySelector('#stack .stack-item[data-zone="well"]:not(.step)').click(),
    async () => document.querySelector('#stack .stack-item[data-zone="surface"]:not(.step)').click(),
    async () => document.getElementById('asset-toggle').click(),
    async () => {
      selection.zone = 'reservoir'; selection.step = 1;
      openLayer('reservoir');
      await pause(MINI.transitionMs + 60);
    },
    async () => {
      selection.step = 2;
      showLayerContent('reservoir');
      await pause(400);
      showTeoBeat(0);
    },
    async () => { showTeoBeat(1); await pause(720); },
    async () => { showTeoBeat(2); await pause(720); },
    async () => { switchLayer('well'); await pause(MINI.transitionMs + 60); },
    async () => { switchLayer('surface'); await pause(MINI.transitionMs + 60); },
    async () => { closeLayer(); await pause(MINI.transitionMs + 150); },
  ];
  const back = [
    async () => document.querySelector('#stack .stack-item[data-zone="reservoir"]:not(.step)').click(),
    async () => document.querySelector('#stack .stack-item[data-zone="reservoir"]:not(.step)').click(),
    async () => document.querySelector('#stack .stack-item[data-zone="well"]:not(.step)').click(),
    async () => {
      hideAssetCard();
      document.querySelector('#stack .stack-item[data-zone="surface"]:not(.step)').click();
    },
    async () => {
      closeLayer({ restoreFirstAsset:true });
      await pause(MINI.transitionMs + 150);
    },
    async () => {
      selection.step = 1;
      showLayerContent('reservoir');
      await pause(400);
    },
    async () => { showTeoBeat(0); await pause(720); },
    async () => { showTeoBeat(1); await pause(720); },
    async () => {
      selection.zone = 'reservoir'; selection.step = 2;
      switchLayer('reservoir');
      await pause(400);
      showTeoBeat(2);
    },
    async () => { switchLayer('well'); await pause(400); },
    async () => {
      window.__resetFinal?.();
      showInitialKeyEffects();
      openLayer('surface');
      await pause(MINI.transitionMs + 60);
    },
  ];
  let current = 0;
  let running = false;
  addEventListener('keydown', async event => {
    const backwards = ['ArrowLeft','PageUp','Backspace'].includes(event.code);
    if(!backwards && !['Space','ArrowRight','Enter','NumpadEnter','PageDown'].includes(event.code)) return;
    const target = event.target;
    if(target?.closest?.('video, iframe, input, textarea, select, [role="tab"]') || target?.isContentEditable) return;
    event.preventDefault();
    if(running || event.repeat || (backwards ? current <= 0 : current >= steps.length)) return;
    running = true;
    try {
      if(backwards) await back[--current]();
      else await steps[current++]();
    } catch(error){
      console.error('v6 presentation step', current, error);
    } finally {
      running = false;
    }
  });
}
