/* v5's keyboard walk-through for a standalone presentation. The embedded
   slide keeps its parent-controlled keys. TEO now has one video instead of
   three still frames, so it occupies one step. */
import { selection } from '../v4/state.js';
import { openLayer, showLayerContent, switchLayer, closeLayer } from '../v4/transitions.js';
import { MINI } from '../v4/scene/layout.js';
import { IN_FRAME } from '../v4/params.js';

if(!IN_FRAME){
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
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
    },
    async () => { switchLayer('well'); await pause(MINI.transitionMs + 60); },
    async () => { switchLayer('surface'); await pause(MINI.transitionMs + 60); },
    async () => closeLayer(),
  ];
  let current = 0;
  let running = false;
  addEventListener('keydown', async event => {
    if(!['Space','ArrowRight','Enter','NumpadEnter','PageDown'].includes(event.code)) return;
    const target = event.target;
    if(target?.closest?.('button, video, iframe, input, textarea, select, [role="tab"]') || target?.isContentEditable) return;
    event.preventDefault();
    if(running || event.repeat || current >= steps.length) return;
    running = true;
    try {
      await steps[current++]();
    } finally {
      running = false;
    }
  });
}
