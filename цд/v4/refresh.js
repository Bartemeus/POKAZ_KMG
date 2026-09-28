/* UI redraw after any state change. Registered as the `refresh()` handler
   in state.js. */
import { state, onRefresh } from './state.js';
import { updateStack, updateNavLine } from './ui/stack.js';
import { hidePanel, setPanelReplacesStack } from './ui/panel.js';
import { setKeyEffectsDocked, positionKeyEffects } from './ui/key-effects.js';
import { updateFraming } from './scene/camera-rig.js';

const miniResetEl = document.getElementById('mini-reset');

function redraw(){
  miniResetEl.classList.toggle('is-visible', Boolean(state.openZone));
  const replacesStack = Boolean(state.selectedZone || state.openZone);
  setKeyEffectsDocked(replacesStack);
  setPanelReplacesStack(replacesStack);
  updateStack();

  /* 25.09: the descriptive panel on hover was removed from the main version.
     The layer itself and its name in the stack are the explanation now. */
  hidePanel();

  updateNavLine();
  // the stack changes height and re-centres — refine once the layout has settled
  requestAnimationFrame(updateNavLine);
  requestAnimationFrame(positionKeyEffects);
  updateFraming();
}

onRefresh(redraw);
