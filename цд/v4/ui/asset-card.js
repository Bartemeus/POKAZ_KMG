/* First-asset card (East Moldabek), markup in v4.html.

   18.09 (Adil): "a card should come out, but the 3D stays". Tier 1 is the
   asset passport, tier 2 adds "already done". 25.09: the card opens with the
   "First asset" button, both tiers at once. Opening a layer folds it; closing
   brings it back. */
import { state, refresh } from '../state.js';
import { getParam } from '../params.js';

const cardEl = document.getElementById('asset-card');
const toggleEl = document.getElementById('asset-toggle');
const passportEl = cardEl.querySelector('.passport');
const doneEl = cardEl.querySelector('.done');
let tier = 0;

export function setCardTier(n){
  tier = Math.max(0, Math.min(2, n));
  cardEl.classList.toggle('is-visible', tier > 0);
  passportEl.classList.toggle('is-visible', tier >= 1);
  doneEl.classList.toggle('is-visible', tier >= 2);
  toggleEl.classList.toggle('is-active', tier > 0);
  // while the card is out the zone panel isn't needed — it would sit under the card
  if(tier > 0){ state.selectedZone = null; state.hoveredZone = null; refresh(); }
}

export const isCardOpen = () => tier > 0;
export const hideAssetCard = () => setCardTier(0);
export const showAssetCard = () => setCardTier(2);

export function initAssetCard(){
  // `?справка=N` — open with N tiers (screenshots)
  const requested = +(getParam('справка') || 0);
  toggleEl.addEventListener('click', event => {
    event.stopPropagation();
    setCardTier(tier > 0 ? 0 : 2);
  });
  if(requested > 0) setTimeout(() => setCardTier(requested), 400);
}
