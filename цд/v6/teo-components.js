/* Standalone NUMEX map and calculated result tables for the TEO slides. */
(() => {
  'use strict';

  const firstHeaders = ['№', 'Кин', 'NPV, млн р', 'PI', 'IRR', 'CAPEX, млн р', 'FLPT, тыс т', 'FOPT, тыс т', 'FGPT, млн м3', 'FWIT, тыс м3', 'Wc, мас', 'Рез, бар', 'ННС доб, шт', 'ГС доб, шт', 'ННС наг, шт', 'ГС наг, шт', '6::0p', '23', '24', '29'];
  const firstRows = [
    [7, '.004', '-222.915', '0.388', '0.0', '367.0', '34.557', '19.622', '0.185', '-0.0', '0.54', '23.238', '6', '0', '0', '0', '1.0', '4.0', '2.3', '0.0'],
    [1, '.005', '-257.838', '0.388', '0.0', '425.5', '42.561', '22.522', '0.213', '0.0', '0.583', '23.165', '9', '0', '0', '0', '1.0', '4.0', '1.5', '30.0'],
    [4, '.004', '-249.979', '0.379', '0.0', '406.0', '52.696', '21.228', '0.201', '-0.0', '0.678', '23.146', '8', '0', '0', '0', '1.0', '4.0', '2.2', '45.0'],
    [3, '.004', '-249.693', '0.379', '0.0', '406.0', '50.227', '21.238', '0.201', '-0.0', '0.662', '23.156', '8', '0', '0', '0', '1.0', '4.0', '2.0', '45.0'],
    [5, '.004', '-250.168', '0.378', '0.0', '406.0', '51.682', '21.204', '0.2', '0.0', '0.671', '23.152', '8', '0', '0', '0', '1.0', '4.0', '2.1', '45.0'],
    [2, '.005', '-265.335', '0.37', '0.0', '425.5', '44.402', '21.768', '0.206', '0.0', '0.61', '23.171', '9', '0', '0', '0', '1.0', '4.0', '1.5', '45.0'],
    [8, '.004', '-250.988', '0.345', '0.0', '386.5', '44.912', '18.95', '0.179', '-0.001', '0.63', '23.181', '7', '0', '0', '0', '1.0', '4.0', '2.5', '45.0']
  ];
  const secondHeaders = [...firstHeaders, '10::0p', '11::0p'];
  const secondRows = [
    [12, '0.006', '61.057', '1.242', '0.247', '253.0', '43.894', '28.152', '0.266', '-0.0', '0.509', '23.151', '0', '2', '0', '0', '3.0', '10.0', '2.5', '0.0', '250.0', '235.0'],
    [11, '0.006', '46.529', '1.154', '0.2', '304.5', '60.866', '30.759', '0.291', '0.0', '0.61', '23.054', '0', '3', '0', '0', '3.0', '10.0', '2.0', '0.0', '250.0', '235.0'],
    [23, '0.006', '45.254', '1.149', '0.196', '304.5', '55.382', '30.702', '0.29', '-0.001', '0.563', '23.084', '0', '3', '0', '0', '3.0', '10.0', '2.0', '30.0', '225.0', '150.0'],
    [22, '0.006', '35.28', '1.116', '0.173', '304.5', '50.738', '29.911', '0.283', '-0.0', '0.516', '23.111', '0', '3', '0', '0', '3.0', '10.0', '1.5', '30.0', '225.0', '150.0'],
    [24, '0.005', '20.59', '1.082', '0.147', '253.0', '33.751', '24.792', '0.234', '-0.0', '0.391', '23.214', '0', '2', '0', '0', '3.0', '10.0', '2.5', '30.0', '225.0', '150.0'],
    [6, '0.006', '20.37', '1.067', '0.142', '304.5', '57.543', '28.647', '0.271', '0.0', '0.576', '23.085', '0', '3', '0', '0', '3.0', '10.0', '2.5', '15.0', '200.0', '280.0']
  ];

  function renderTable(id, caption, headers, rows) {
    const table = document.createElement('table');
    table.className = 'teo-results-table';
    table.setAttribute('aria-label', caption);
    const head = table.createTHead().insertRow();
    headers.forEach(label => {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = label;
      head.append(cell);
    });
    const body = table.createTBody();
    rows.forEach(row => {
      const tr = body.insertRow();
      row.forEach(value => { tr.insertCell().textContent = String(value); });
    });
    document.getElementById(id).append(table);
  }
  renderTable('teo-table-vertical', 'Расчётные показатели — 6 вертикальных', firstHeaders, firstRows);
  renderTable('teo-table-horizontal', 'Расчётные показатели — 2 горизонтальных', secondHeaders, secondRows);

  const svg = document.querySelector('.teo-map-chart');
  const view = svg.querySelector('.teo-map-view');
  const axes = svg.querySelector('.teo-map-axes');
  const grid = svg.querySelector('.teo-map-grid');
  const toolbar = document.querySelector('.teo-map-toolbar');
  const svgNs = 'http://www.w3.org/2000/svg';
  const icons = {
    home: '<path d="M3 10 12 3l9 7v11h-6v-8H9v8H3Z"/>',
    back: '<path d="m10 5-7 7 7 7M3 12h18"/>',
    forward: '<path d="m14 5 7 7-7 7M3 12h18"/>',
    pan: '<path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5M3 3l7 7m4 4 7 7M21 3l-7 7m-4 4-7 7"/>',
    zoomIn: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6M10 6v8M6 10h8"/>',
    zoomOut: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6M6 10h8"/>',
    grid: '<rect x="2" y="2" width="20" height="20"/><path d="M2 9h20M2 16h20M9 2v20M16 2v20"/>',
    center: '<path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5"/><circle cx="12" cy="12" r="4"/>'
  };
  const actions = [
    ['home', 'Исходный вид карты'], ['back', 'Предыдущий вид'], ['forward', 'Следующий вид'],
    ['pan', 'Перемещение карты'], ['zoomIn', 'Увеличить карту'], ['zoomOut', 'Уменьшить карту'],
    ['grid', 'Координатная сетка'], ['center', 'Центрировать карту']
  ];
  const buttons = new Map();
  actions.forEach(([action, label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.title = label;
    button.setAttribute('aria-label', label);
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[action]}</svg>`;
    button.addEventListener('click', event => { event.stopPropagation(); act(action); });
    toolbar.append(button);
    buttons.set(action, button);
  });

  let state = {scale: 1, x: 0, y: 0};
  let history = [{...state}];
  let historyIndex = 0;
  let gridVisible = false;
  let drag = null;
  const unitsPerPixel = 500 / 117.5;
  const xMin = 284500 - 113 * unitsPerPixel;
  const yMax = 5293000 + 97 * unitsPerPixel;

  function el(tag, attrs, label) {
    const node = document.createElementNS(svgNs, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    if (label !== undefined) node.textContent = label;
    return node;
  }
  function render() {
    view.setAttribute('transform', `translate(${state.x} ${state.y}) scale(${state.scale})`);
    axes.replaceChildren();
    const range = 881 * unitsPerPixel / state.scale;
    const step = range < 1200 ? 100 : range < 2500 ? 250 : range < 6000 ? 500 : 1000;
    const left = xMin - state.x / state.scale * unitsPerPixel;
    const top = yMax + state.y / state.scale * unitsPerPixel;
    const lines = [];
    for (let x = Math.ceil(left / step) * step; x < left + range; x += step) {
      const px = (x - xMin) / unitsPerPixel * state.scale + state.x;
      axes.append(el('line', {x1:px, y1:880, x2:px, y2:885, stroke:'#111'}), el('text', {x:px, y:901, 'text-anchor':'middle'}, String(Math.round(x))));
      if (gridVisible) lines.push(`M${px},0V880`);
    }
    for (let y = Math.floor(top / step) * step; y > top - range; y -= step) {
      const py = (yMax - y) / unitsPerPixel * state.scale + state.y;
      if (py < 0 || py > 880) continue;
      axes.append(el('line', {x1:-5, y1:py, x2:0, y2:py, stroke:'#111'}), el('text', {x:-11, y:py+5, 'text-anchor':'end'}, (y / 1e6).toFixed(4)));
      if (gridVisible) lines.push(`M0,${py}H881`);
    }
    grid.setAttribute('d', lines.join(''));
    grid.hidden = !gridVisible;
    buttons.get('back').disabled = historyIndex === 0;
    buttons.get('forward').disabled = historyIndex === history.length - 1;
    buttons.get('grid').setAttribute('aria-pressed', String(gridVisible));
  }
  function remember() {
    const previous = history[historyIndex];
    if (previous.scale !== state.scale || previous.x !== state.x || previous.y !== state.y) {
      history = history.slice(0, historyIndex + 1);
      history.push({...state});
      historyIndex++;
    }
    render();
  }
  function zoom(factor, px = 440, py = 440) {
    const scale = Math.max(.65, Math.min(8, state.scale * factor));
    const ratio = scale / state.scale;
    state = {scale, x: px - (px - state.x) * ratio, y: py - (py - state.y) * ratio};
    remember();
  }
  function act(action) {
    if (action === 'home' || action === 'center') { state = {scale:1, x:0, y:0}; remember(); }
    else if (action === 'back' && historyIndex > 0) { state = {...history[--historyIndex]}; render(); }
    else if (action === 'forward' && historyIndex < history.length - 1) { state = {...history[++historyIndex]}; render(); }
    else if (action === 'zoomIn') zoom(1.3);
    else if (action === 'zoomOut') zoom(1 / 1.3);
    else if (action === 'grid') { gridVisible = !gridVisible; render(); }
    else if (action === 'pan') { svg.focus(); }
  }
  function point(event) {
    const p = svg.createSVGPoint();
    p.x = event.clientX; p.y = event.clientY;
    const local = p.matrixTransform(svg.getScreenCTM().inverse());
    return {x:local.x - 212, y:local.y - 21};
  }
  svg.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const p = point(event);
    drag = {x:p.x, y:p.y, start:{...state}};
    svg.setPointerCapture(event.pointerId);
    svg.classList.add('is-dragging');
  });
  svg.addEventListener('pointermove', event => {
    if (!drag) return;
    const p = point(event);
    state.x = drag.start.x + p.x - drag.x;
    state.y = drag.start.y + p.y - drag.y;
    render();
  });
  function endDrag() { if (drag) { drag = null; svg.classList.remove('is-dragging'); remember(); } }
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);
  svg.addEventListener('wheel', event => {
    event.preventDefault();
    const p = point(event);
    zoom(event.deltaY < 0 ? 1.12 : 1 / 1.12, p.x, p.y);
  }, {passive:false});
  svg.addEventListener('keydown', event => {
    if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(1.3); }
    else if (event.key === '-') { event.preventDefault(); zoom(1 / 1.3); }
    else if (event.key === 'Home') { event.preventDefault(); act('home'); }
  });
  render();
})();
