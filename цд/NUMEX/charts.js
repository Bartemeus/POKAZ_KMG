(() => {
  'use strict';
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const panels = new Map();
  // The first calculated project uses the values visible in the supplied NUMEX capture.
  // Only seven result rows are legible there; the remaining points retain the chart's visible profile.
  const capturedScenarioRows = [
    [1, 4, 1.5, 30], [1, 4, 1.5, 45], [1, 4, 2, 45],
    [1, 4, 2.2, 45], [1, 4, 2.1, 45], [1, 4, 2.3, 45],
    [1, 4, 2.3, 0], [1, 4, 2.5, 45]
  ];
  const capturedRecovery = [.005, .005, .004, .004, .004, .004, .004, .004, .004,
    .003, .003, .003, .003, .003, .003, .003, .003, .003, .002, .003,
    .003, .003, .002, .003, .003, .002, .002, .003, .002, .001];
  const capturedPi = [.388, .370, .379, .379, .378, .340, .388, .345, .336,
    .315, .315, .312, .312, .307, .302, .300, .298, .260, .258, .256,
    .253, .252, .237, .236, .235, .145, .235, .234, .187, .024];
  const capturedVisibleResults = [
    [7, '.004', '-222.915', '0.388', '0.0', '367.0', '34.557', '19.622', '0.185', '-0.0', '0.54', '23.238', '6', '0', '0', '0', '1.0', '4.0', '2.3', '0.0'],
    [1, '.005', '-257.838', '0.388', '0.0', '425.5', '42.561', '22.522', '0.213', '0.0', '0.583', '23.165', '9', '0', '0', '0', '1.0', '4.0', '1.5', '30.0'],
    [4, '.004', '-249.979', '0.379', '0.0', '406.0', '52.696', '21.228', '0.201', '-0.0', '0.678', '23.146', '8', '0', '0', '0', '1.0', '4.0', '2.2', '45.0'],
    [3, '.004', '-249.693', '0.379', '0.0', '406.0', '50.227', '21.238', '0.201', '-0.0', '0.662', '23.156', '8', '0', '0', '0', '1.0', '4.0', '2.0', '45.0'],
    [5, '.004', '-250.168', '0.378', '0.0', '406.0', '51.682', '21.204', '0.2', '0.0', '0.671', '23.152', '8', '0', '0', '0', '1.0', '4.0', '2.1', '45.0'],
    [2, '.005', '-265.335', '0.37', '0.0', '425.5', '44.402', '21.768', '0.206', '0.0', '0.61', '23.171', '9', '0', '0', '0', '1.0', '4.0', '1.5', '45.0'],
    [8, '.004', '-250.988', '0.345', '0.0', '386.5', '44.912', '18.95', '0.179', '-0.001', '0.63', '23.181', '7', '0', '0', '0', '1.0', '4.0', '2.5', '45.0']
  ];
  // The second calculated project is transcribed from the horizontal-well capture.
  // Its six readable result rows are exact; the other PI points follow the visible scatter plot.
  const capturedScenarioTwoRows = [
    [3, 10, 1.5, 30, 150, 235], [3, 10, 2, 30, 150, 235],
    [3, 10, 2.5, 30, 150, 235], [3, 10, 3, 30, 150, 235],
    [3, 10, 2, 15, 200, 280]
  ];
  const capturedRecoveryTwo = [.007, .005, .005, .004, .006, .006, .006, .006, .005, .005,
    .006, .006, .004, .005, .005, .006, .006, .007, .006, .006,
    .006, .006, .006, .005, .003, .006, .006, .006, .006, .006];
  const capturedPiTwo = [.83, .92, .95, .89, .98, 1.067, 1.01, 1.02, .97, .98,
    1.154, 1.242, .94, .93, .91, 1, .97, .87, 1.03, 1.01,
    .99, 1.116, 1.149, 1.082, .87, .93, 1, .99, .98, .70];
  const capturedVisibleResultsTwo = [
    [12, '0.006', '61.057', '1.242', '0.247', '253.0', '43.894', '28.152', '0.266', '-0.0', '0.509', '23.151', '0', '2', '0', '0', '3.0', '10.0', '2.5', '0.0', '250.0', '235.0'],
    [11, '0.006', '46.529', '1.154', '0.2', '304.5', '60.866', '30.759', '0.291', '0.0', '0.61', '23.054', '0', '3', '0', '0', '3.0', '10.0', '2.0', '0.0', '250.0', '235.0'],
    [23, '0.006', '45.254', '1.149', '0.196', '304.5', '55.382', '30.702', '0.29', '-0.001', '0.563', '23.084', '0', '3', '0', '0', '3.0', '10.0', '2.0', '30.0', '225.0', '150.0'],
    [22, '0.006', '35.28', '1.116', '0.173', '304.5', '50.738', '29.911', '0.283', '-0.0', '0.516', '23.111', '0', '3', '0', '0', '3.0', '10.0', '1.5', '30.0', '225.0', '150.0'],
    [24, '0.005', '20.59', '1.082', '0.147', '253.0', '33.751', '24.792', '0.234', '-0.0', '0.391', '23.214', '0', '2', '0', '0', '3.0', '10.0', '2.5', '30.0', '225.0', '150.0'],
    [6, '0.006', '20.37', '1.067', '0.142', '304.5', '57.543', '28.647', '0.271', '0.0', '0.576', '23.085', '0', '3', '0', '0', '3.0', '10.0', '2.5', '15.0', '200.0', '280.0']
  ];
  const otherProjectScenario = { parameters: ['6::0p', '23', '24', '29', '10::0p', '11::0p'], rows: [...capturedScenarioTwoRows, ...Array.from({ length: 25 }, () => ['', '', '', '', '', ''])], method: '3', count: 30, selectedType: '', selectedParameter: '', selectedRow: -1, chartType: 'bar', metric: 'recovery', axisX: 'recovery', axisY: 'pi', sort: 'pi', descending: true, optimizer: 'Нелдера-Мида', objective: 'PI', placement: false };
  const initialState = {
    scenario: { parameters: ['6::0p', '23', '24', '29'], rows: [...capturedScenarioRows, ...Array.from({ length: 22 }, () => ['', '', '', ''])], method: '3', count: 30, selectedType: '', selectedParameter: '', selectedRow: -1, chartType: 'bar', metric: 'recovery', axisX: 'recovery', axisY: 'pi', sort: 'pi', descending: true, optimizer: 'Нелдера-Мида', objective: 'PI', placement: false },
    results: { variant: 2, well: '', restart: true, timeUnit: 'days', forecast: 'forecast', economicTime: 'months', topTab: 'rates', bottomTab: 'efficiency', topCurves: { oilHistory: true, liquidHistory: true, injectionHistory: true, waterCutHistory: true, oil: true, liquid: true, gas: false, injection: true, gasInjection: false, waterCut: true, pressure: true }, bottomCurves: { npv: true, cashFlow: true, pi: true, irr: true, capex: true, opex: true, tax: true, ndpi: true, prib: true, ndd: true, imush: true } }
  };
  const clone = value => JSON.parse(JSON.stringify(value));
  let state = clone(initialState);
  let projectResults = null;
  let displayedScenarioVariant = null;
  const scenarioByVariant = new Map();
  const metrics = [ ['index', '№'], ['recovery', 'Кин'], ['npv', 'NPV, млн р'], ['pi', 'PI'], ['irr', 'IRR'], ['capex', 'CAPEX, млн р'], ['liquid', 'FLPT, тыс т'], ['oil', 'FOPT, тыс т'], ['gas', 'FGPT, млн м3'], ['injection', 'FWIT, тыс м3'], ['waterCut', 'Wc, мас'] ];
  const capturedSummaryHeaders = [...metrics.map(([, label]) => label), 'Рез, бар', 'ННС доб, шт', 'ГС доб, шт', 'ННС наг, шт', 'ГС наг, шт', '6::0p', '23', '24', '29'];
  const capturedSummaryHeadersTwo = [...capturedSummaryHeaders, '10::0p', '11::0p'];
  const capturedRank = new Map(capturedVisibleResults.map((row, index) => [row[0], index]));
  const capturedRankTwo = new Map(capturedVisibleResultsTwo.map((row, index) => [row[0], index]));
  const capturedResults = capturedRecovery.map((recovery, index) => ({ index: index + 1, recovery, pi: capturedPi[index] }));
  capturedVisibleResults.forEach(display => {
    capturedResults[display[0] - 1] = { ...capturedResults[display[0] - 1], npv: Number(display[2]), display };
  });
  const capturedResultsTwo = capturedRecoveryTwo.map((recovery, index) => ({ index: index + 1, recovery, pi: capturedPiTwo[index] }));
  capturedVisibleResultsTwo.forEach(display => {
    capturedResultsTwo[display[0] - 1] = { ...capturedResultsTwo[display[0] - 1], npv: Number(display[2]), display };
  });
  const summaryRows = [
    { index: 1, recovery: .004, npv: -634.681, pi: -.077, irr: 0, capex: 595, liquid: 39.29, oil: 19.347, gas: .183, injection: 0, waterCut: .581 },
    { index: 2, recovery: .006, npv: -416.089, pi: .102, irr: 0, capex: 465, liquid: 43.894, oil: 28.152, gas: .266, injection: -0, waterCut: .509 },
    { index: 3, recovery: .004, npv: -699.618, pi: -.084, irr: 0, capex: 652.5, liquid: 46.102, oil: 19.653, gas: .186, injection: 0, waterCut: .609 },
    { index: 4, recovery: .004, npv: -699.618, pi: -.084, irr: 0, capex: 652.5, liquid: 46.102, oil: 19.653, gas: .186, injection: 0, waterCut: .609 },
    { index: 5, recovery: .003 }
  ];
  const parameterTypes = ['1* valr', '2* limpz', '3* limq', '4* skinf', '5* rw', '6* tipwell', '7* xf', '8* kf', '9* wf', '10* lg', '11* gfi', '23', '24'];
  const wells = [['1019', 'producer'], ['1050', 'producer'], ['1128', 'injector'], ['1p', 'producer'], ['2060', 'injector'], ['2505', 'producer'], ['2506', 'producer'], ['2511', 'producer'], ['2513', 'producer'], ['2514', 'injector'], ['2516', 'injector']];
  const icons = { home: '<path d="m3 10 9-7 9 7v11h-7v-8h-4v8H3z"/>', back: '<path d="m10 5-7 7 7 7M3 12h19"/>', forward: '<path d="m14 5 7 7-7 7M2 12h19"/>', pan: '<path d="M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4"/>', zoom: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 6 6"/>', save: '<path d="M3 2h15l4 4v16H3zM7 2v7h10V2M7 22V13h11v9"/>' };
  function element(tag, attributes = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
      else if (key in node && key !== 'role') node[key] = value;
      else node.setAttribute(key, value);
    });
    [].concat(children).forEach(child => child != null && node.append(child));
    return node;
  }
  function notify() { window.dispatchEvent(new CustomEvent('numex:charts-change', { detail: getState() })); }
  function button(text, handler, attributes = {}) { return element('button', { type: 'button', text, onclick: handler, ...attributes }); }
  function select(options, value, handler, label) {
    const node = element('select', { 'aria-label': label, onchange: () => handler(node.value) });
    options.forEach(option => { const [key, text] = Array.isArray(option) ? option : [option, option]; node.append(element('option', { value: key, text })); });
    node.value = value;
    if (options.length === 1) node.disabled = true;
    return node;
  }
  function checkbox(text, checked, handler, attributes = {}) {
    const input = element('input', { type: 'checkbox', checked, onchange: () => handler(input.checked), ...attributes });
    return element('label', {}, [input, text]);
  }
  function textNode(text, x, y, options = '') { return `<text x="${x}" y="${y}" class="nc-chart-label" ${options}>${escapeText(text)}</text>`; }
  function escapeText(value) { return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character])); }
  function plotFrame({ x, y, width, height, xMin, xMax, yMin, yMax, xTicks, yTicks, xLabel = '', yLabel = '', title = '', dashed = false, formatX, formatY }) {
    const sx = value => x + (value - xMin) / (xMax - xMin) * width;
    const sy = value => y + height - (value - yMin) / (yMax - yMin) * height;
    let markup = `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="white" stroke="#151515" stroke-width="1.2"/>`;
    xTicks.forEach(value => { const px = sx(value); markup += `<path d="M${px} ${y}v${height}" stroke="#aaa" stroke-width="1" ${dashed ? 'stroke-dasharray="5 3"' : ''}/><path d="M${px} ${y + height}v5" stroke="#111"/>${textNode(formatX ? formatX(value) : value, px, y + height + 22, 'text-anchor="middle"')}`; });
    yTicks.forEach(value => { const py = sy(value); markup += `<path d="M${x} ${py}h${width}" stroke="#aaa" stroke-width="1" ${dashed ? 'stroke-dasharray="5 3"' : ''}/><path d="M${x - 5} ${py}h5" stroke="#111"/>${textNode(formatY ? formatY(value) : value, x - 9, py + 5, 'text-anchor="end"')}`; });
    if (title) markup += `<text x="${x + width / 2}" y="${y - 12}" class="nc-chart-title" text-anchor="middle">${escapeText(title)}</text>`;
    if (xLabel) markup += textNode(xLabel, x + width / 2, y + height + 48, 'text-anchor="middle"');
    if (yLabel) markup += `<text transform="translate(${x - 58},${y + height / 2}) rotate(-90)" text-anchor="middle" class="nc-chart-label">${escapeText(yLabel)}</text>`;
    return { markup, sx, sy, x, y, width, height };
  }
  function curve(points, frame, color, { dashed = false, step = false } = {}) {
    if (!points.length) return '';
    let path = `M${frame.sx(points[0][0]).toFixed(2)},${frame.sy(points[0][1]).toFixed(2)}`;
    points.slice(1).forEach(([x, y]) => { path += step ? `H${frame.sx(x).toFixed(2)}V${frame.sy(y).toFixed(2)}` : `L${frame.sx(x).toFixed(2)},${frame.sy(y).toFixed(2)}`; });
    return `<path d="${path}" fill="none" stroke="${color}" stroke-width="2.1" ${dashed ? 'stroke-dasharray="5 3"' : ''}/>`;
  }
  function downloadBlob(blob, filename) { const url = URL.createObjectURL(blob); const link = element('a', { href: url, download: filename }); link.click(); setTimeout(() => URL.revokeObjectURL(url), 1500); }
  function chart(width, height, label) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('xmlns', SVG_NS); svg.setAttribute('viewBox', `0 0 ${width} ${height}`); svg.setAttribute('class', 'nc-chart'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', label); svg.setAttribute('tabindex', '0');
    let view = [0, 0, width, height]; let history = [view.slice()]; let historyIndex = 0; let mode = 'pan'; let drag = null;
    const apply = () => svg.setAttribute('viewBox', view.join(' '));
    const remember = () => { history = history.slice(0, historyIndex + 1); history.push(view.slice()); historyIndex++; updateButtons(); };
    const toolbar = element('div', { className: 'nc-toolbar', role: 'toolbar', 'aria-label': `Инструменты: ${label}` });
    const toolbarButtons = {};
    const actions = { home: () => { view = [0, 0, width, height]; apply(); remember(); }, back: () => { if (historyIndex > 0) { view = history[--historyIndex].slice(); apply(); updateButtons(); } }, forward: () => { if (historyIndex < history.length - 1) { view = history[++historyIndex].slice(); apply(); updateButtons(); } }, pan: () => setMode('pan'), zoom: () => setMode('zoom'), save: () => { const source = svg.cloneNode(true); source.removeAttribute('class'); source.removeAttribute('tabindex'); source.setAttribute('width', width); source.setAttribute('height', height); source.innerHTML = '<style>.nc-chart-label{font:15px Arial,sans-serif;fill:#111}.nc-chart-title{font:19px Arial,sans-serif;fill:#111}</style>' + source.innerHTML; downloadBlob(new Blob([new XMLSerializer().serializeToString(source)], { type: 'image/svg+xml;charset=utf-8' }), 'numex-chart.svg'); } };
    const labels = { home: 'Исходный вид графика', back: 'Предыдущий вид графика', forward: 'Следующий вид графика', pan: 'Перемещение графика', zoom: 'Увеличение графика', save: 'Сохранить график SVG' };
    Object.keys(actions).forEach(key => { const control = button('', actions[key], { className: 'nc-tool', title: labels[key], 'aria-label': labels[key] }); control.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[key]}</svg>`; toolbarButtons[key] = control; toolbar.append(control); });
    function updateButtons() { toolbarButtons.back.disabled = historyIndex <= 0; toolbarButtons.forward.disabled = historyIndex >= history.length - 1; }
    function setMode(next) { mode = next; svg.classList.toggle('nc-zoom', mode === 'zoom'); toolbarButtons.pan.setAttribute('aria-pressed', String(mode === 'pan')); toolbarButtons.zoom.setAttribute('aria-pressed', String(mode === 'zoom')); }
    function zoomAt(factor, clientX, clientY) { const rect = svg.getBoundingClientRect(); const rx = (clientX - rect.left) / rect.width; const ry = (clientY - rect.top) / rect.height; const newWidth = Math.max(width / 20, Math.min(width * 2, view[2] * factor)); const newHeight = newWidth * height / width; view = [view[0] + rx * (view[2] - newWidth), view[1] + ry * (view[3] - newHeight), newWidth, newHeight]; apply(); }
    svg.addEventListener('wheel', event => { event.preventDefault(); zoomAt(Math.exp(event.deltaY * .0015), event.clientX, event.clientY); remember(); }, { passive: false });
    svg.addEventListener('pointerdown', event => { if (event.button !== 0) return; if (mode === 'zoom') { zoomAt(event.shiftKey ? 1.3 : .77, event.clientX, event.clientY); remember(); return; } drag = { x: event.clientX, y: event.clientY, view: view.slice() }; svg.setPointerCapture(event.pointerId); svg.classList.add('nc-dragging'); });
    svg.addEventListener('pointermove', event => { if (!drag) return; const rect = svg.getBoundingClientRect(); view = [drag.view[0] - (event.clientX - drag.x) / rect.width * drag.view[2], drag.view[1] - (event.clientY - drag.y) / rect.height * drag.view[3], drag.view[2], drag.view[3]]; apply(); });
    const finish = () => { if (drag) { drag = null; svg.classList.remove('nc-dragging'); remember(); } };
    svg.addEventListener('pointerup', finish); svg.addEventListener('pointercancel', finish); svg.addEventListener('dblclick', actions.home);
    svg.addEventListener('keydown', event => { if (event.key === 'Home') { event.preventDefault(); actions.home(); } else if (event.key === '+' || event.key === '-') { event.preventDefault(); const rect = svg.getBoundingClientRect(); zoomAt(event.key === '+' ? .8 : 1.25, rect.left + rect.width / 2, rect.top + rect.height / 2); remember(); } });
    setMode('pan'); updateButtons();
    return { svg, toolbar, render: markup => { svg.innerHTML = markup; } };
  }
  function table(headers, rows, options = {}) {
    const node = element('table', { className: 'nc-table' });
    node.append(element('thead', {}, element('tr', {}, headers.map(text => element('th', { text })))));
    const body = element('tbody');
    rows.forEach((row, rowIndex) => { const tr = element('tr', { 'aria-selected': String(rowIndex === options.selected), onclick: options.onSelect ? () => options.onSelect(rowIndex) : undefined }); row.forEach((value, columnIndex) => { const td = element('td', { className: columnIndex === 0 ? 'nc-index' : '' }); if (options.editable && columnIndex > 0) { const input = element('input', { type: 'text', inputMode: 'decimal', value, 'aria-label': `Вариант ${rowIndex + 1}, ${headers[columnIndex]}`, oninput: () => options.onEdit(rowIndex, columnIndex - 1, input.value) }); td.append(input); } else td.textContent = value == null ? '' : value; tr.append(td); }); body.append(tr); });
    node.append(body); return node;
  }
  function initialization() {
    const panel = element('section', { className: 'numex-charts-panel nc-initialization', 'aria-label': 'Инициализация: графики свойств флюидов' });
    panel.append(select(['Режим работы'], 'Режим работы', () => {}, 'Тип графика режима работы'));
    const pressure = chart(1200, 330, 'Режим работы добывающих и нагнетательных скважин');
    const productionFrame = plotFrame({ x: 72, y: 37, width: 495, height: 233, xMin: -5, xMax: 105, yMin: 94.5, yMax: 105.5, xTicks: [0, 20, 40, 60, 80, 100], yTicks: [95, 97.5, 100, 102.5, 105], xLabel: 'Время, сут', title: 'Режим работы доб. скв.', formatY: value => value.toFixed(1) });
    const injectionFrame = plotFrame({ x: 674, y: 37, width: 495, height: 233, xMin: -5, xMax: 105, yMin: 378, yMax: 422, xTicks: [0, 20, 40, 60, 80, 100], yTicks: [380, 400, 420], xLabel: 'Время, сут', yLabel: 'Pz, бар', title: 'Режим работы наг. скв.' });
    pressure.render(productionFrame.markup + injectionFrame.markup + curve([[0, 100], [100, 100]], productionFrame, '#9e2433') + curve([[0, 400], [100, 400]], injectionFrame, '#1616f6'));
    panel.append(pressure.toolbar, element('div', { className: 'nc-chart-holder' }, pressure.svg));
    const permeability = chart(1200, 355, 'SWOF и SGOF');
    const swofFrame = plotFrame({ x: 72, y: 40, width: 495, height: 255, xMin: .28, xMax: .82, yMin: -.05, yMax: 1.05, xTicks: [.3, .4, .5, .6, .7, .8], yTicks: [0, .25, .5, .75, 1], title: 'SWOF', xLabel: 'Sw', formatX: value => value.toFixed(1), formatY: value => value.toFixed(2) });
    const sgofFrame = plotFrame({ x: 674, y: 40, width: 495, height: 255, xMin: -.03, xMax: .74, yMin: -.05, yMax: 1.05, xTicks: [0, .2, .4, .6], yTicks: [0, .25, .5, .75, 1], title: 'SGOF', xLabel: 'Sg', yLabel: 'Krg, Kro', formatX: value => value.toFixed(1), formatY: value => value.toFixed(2) });
    const sw = [[.3, 1], [.4, .91], [.5, .81], [.6, .68], [.65, .6], [.7, .5], [.74, .39], [.77, .27], [.79, .14], [.8, 0]];
    const water = [[.3, 0], [.4, 0], [.45, .02], [.5, .09], [.53, .18], [.56, .32], [.6, .54], [.63, .71], [.67, .85], [.7, .91], [.75, .97], [.8, 1]];
    const oil = [[.3, .02], [.4, .021], [.5, .025], [.6, .04], [.65, .064], [.7, .11], [.75, .20], [.8, .33]];
    const gas = [[.3, 0], [.4, 0], [.5, .005], [.6, .02], [.65, .045], [.7, .08], [.75, .15], [.8, .28]];
    permeability.render(swofFrame.markup + sgofFrame.markup + curve(sw, swofFrame, '#9e2433') + curve(water, swofFrame, '#7ec9df') + curve(oil, swofFrame, '#111') + curve(gas, swofFrame, '#2222ff') + curve([[.3, 0], [.3, 1]], swofFrame, '#111', { dashed: true }) + curve([[0, 1], [.05, .76], [.1, .57], [.15, .4], [.2, .25], [.25, .14], [.3, .06], [.35, .02], [.4, 0], [.7, 0]], sgofFrame, '#9e2433') + curve([[0, 0], [.1, .009], [.2, .03], [.3, .06], [.4, .1], [.5, .15], [.6, .22], [.7, .30]], sgofFrame, '#2222ff') + curve([[0, 0], [0, 1]], sgofFrame, '#111', { dashed: true }));
    panel.append(permeability.toolbar, element('div', { className: 'nc-chart-holder' }, permeability.svg));
    const pvt = element('div', { className: 'nc-pvt' });
    [['Нефть:PVDO', ['№', 'Pref', 'Bo', 'Mo'], [[1, 22.9, 1.02727, 46.1341], [2, 25.5, 1.02702, 46.4062]]], ['Вода:PVTW', ['№', 'Pref', 'Bw', 'Cw', 'Mw'], [[1, 22.9, .99876, '3.5947e-05', .82536]]], ['Газ:None', ['№', 'Pref', 'Bg', 'Mg'], [[1, '', '', '']]]].forEach(([title, headers, rows]) => pvt.append(element('div', {}, [element('h4', { text: title }), element('div', { className: 'nc-table-wrap' }, table(headers, rows))])));
    panel.append(pvt); return panel;
  }
  function economics() {
    const panel = element('section', { className: 'numex-charts-panel nc-economics', 'aria-label': 'Графики экономических параметров' });
    const configurations = [
      { yLabel: 'Цена нефти/газа, руб/т', value: 10000, secondary: 500, limits: [0, 10400], ticks: [2500, 5000, 7500, 10000] },
      { yLabel: 'НДПИ н/к, руб/т, НДПИ г, руб/т', value: 2500, secondary: 500, limits: [400, 2580], ticks: [500, 1000, 1500, 2000, 2500] },
      { yLabel: 'Коэфф. дисконт-я', points: [[0, .957], [1, .868], [2, .787], [3, .714], [4, .647], [5, .647]], step: true, limits: [.633, .97], ticks: [.7, .8, .9] },
      { yLabel: 'Стоим. бурения, млн руб/скв', value: 100, xLabel: 'Длина гор. ствола, м', xMax: 1000, xTicks: [0, 500, 1000], limits: [94.5, 105.5], ticks: [95, 97.5, 100, 102.5, 105] },
      { yLabel: 'Стоим. ГРП, млн руб', points: [[1, 4], [7, 28]], xLabel: 'Кол-во стадий ГРП, шт', xMax: 7, xMin: .7, xTicks: [2, 4, 6], limits: [2.5, 29], ticks: [10, 20] },
      { yLabel: 'Темп ввода скв., шт/бур. ст.', value: 20, limits: [18.9, 21.1], ticks: [19, 19.5, 20, 20.5, 21] },
      { yLabel: 'Курс доллара, руб/US', value: 63, limits: [59.5, 66.5], ticks: [60, 62, 64, 66] },
      { yLabel: 'Цена Urals, US/барр', value: 48, limits: [45.4, 50.6], ticks: [46, 48, 50] },
      { yLabel: 'Коэфф. для эксп. пошлины', value: 1, limits: [.945, 1.055], ticks: [.95, .975, 1, 1.025, 1.05], digits: 3 },
      { yLabel: 'Тран-е расходы, US/т', value: 45, limits: [42.5, 47.5], ticks: [43, 44, 45, 46, 47] },
      { yLabel: 'Ст. инд-и убытков, д.е.', value: .12, limits: [.1135, .1265], ticks: [.115, .12, .125], digits: 3 },
      { yLabel: 'Уд. расх. для НДД min, руб/т', value: 9525, limits: [9000, 10040], ticks: [9000, 9250, 9500, 9750, 10000] }
    ];
    configurations.forEach(config => {
      const graph = chart(400, 260, config.yLabel);
      const frame = plotFrame({ x: 75, y: 12, width: 310, height: 184, xMin: config.xMin ?? -.2, xMax: (config.xMax ?? 5) * 1.045, yMin: config.limits[0], yMax: config.limits[1], xTicks: config.xTicks ?? [0, 2, 4], yTicks: config.ticks, xLabel: config.xLabel ?? 'Время, годы', yLabel: config.yLabel, formatY: config.digits ? value => value.toFixed(config.digits) : null });
      let markup = frame.markup + curve(config.points ?? [[0, config.value], [config.xMax ?? 5, config.value]], frame, '#1616f6', { step: config.step });
      if (config.secondary != null) markup += curve([[0, config.secondary], [5, config.secondary]], frame, '#1616f6', { dashed: true });
      graph.render(markup); panel.append(element('div', { className: 'nc-chart-holder' }, graph.svg));
    });
    return panel;
  }
  function scenarios() {
    const panel = element('section', { className: 'numex-charts-panel nc-split', 'aria-label': 'Серийные расчеты' });
    const side = element('div', { className: 'nc-side' }); const main = element('div', { className: 'nc-main' }); panel.append(side, main);
    const config = state.scenario;
    const capturedVariant = [1, 2].includes(projectResults?.variant) ? projectResults.variant : null;
    const captured = capturedVariant !== null;
    panel.classList.toggle('nc-captured-scenario', captured);
    panel.classList.toggle('nc-captured-scenario-two', capturedVariant === 2);
    const activeRows = capturedVariant === 1 ? capturedResults : capturedVariant === 2 ? capturedResultsTwo : projectResults ? [{ ...projectResults.summary, index: projectResults.variant }] : summaryRows;
    side.append(element('p', { className: 'nc-section-title', text: 'Создание сценария серийного расчета:' }));
    const typeList = element('div', { className: 'nc-list', role: 'listbox', 'aria-label': 'Типы параметров' });
    const attributeList = element('div', { className: 'nc-list', role: 'listbox', 'aria-label': 'Признаки параметров' });
    const selectedList = element('div', { className: 'nc-list', role: 'listbox', 'aria-label': 'Выбранные параметры' });
    side.append(element('div', { className: 'nc-scenario-lists' }, [element('div', { className: 'nc-list-column' }, ['Типы параметров', typeList]), element('div', { className: 'nc-list-column' }, ['Признаки параметров для *', attributeList]), element('div', { className: 'nc-list-column' }, ['Выбранные параметры', selectedList])]));
    function drawLists() {
      typeList.replaceChildren(...parameterTypes.map(type => button(type, () => { config.selectedType = type; drawLists(); notify(); }, { className: 'nc-list-row', role: 'option', 'aria-selected': String(config.selectedType === type) })));
      attributeList.replaceChildren(); if (config.selectedType.includes('*')) attributeList.append(button('0p', null, { className: 'nc-list-row', role: 'option', 'aria-selected': 'true', disabled: true }));
      selectedList.replaceChildren(...config.parameters.map(parameter => button(parameter, () => { config.selectedParameter = parameter; drawLists(); notify(); }, { className: 'nc-list-row', role: 'option', 'aria-selected': String(config.selectedParameter === parameter) })));
      const match = config.selectedType.match(/^\d+/); const code = match ? match[0] + (config.selectedType.includes('*') ? '::0p' : '') : '';
      addParameter.disabled = !code || config.parameters.includes(code); removeParameter.disabled = !config.parameters.includes(config.selectedParameter);
    }
    const addParameter = button('Добавить', () => { const match = config.selectedType.match(/^\d+/); if (!match) return; const code = match[0] + (config.selectedType.includes('*') ? '::0p' : ''); if (!config.parameters.includes(code)) { config.parameters.push(code); config.rows.forEach(row => row.push('')); } config.selectedParameter = code; drawLists(); drawTables(); notify(); }, { className: 'nc-grow' });
    const removeParameter = button('Удалить', () => { const index = config.parameters.indexOf(config.selectedParameter); if (index < 0) return; config.parameters.splice(index, 1); config.rows.forEach(row => row.splice(index, 1)); config.selectedParameter = config.parameters[0] || ''; drawLists(); drawTables(); notify(); });
    side.append(element('div', { className: 'nc-button-row' }, [addParameter, removeParameter]));
    const methods = element('fieldset', { className: 'nc-methods' }); methods.append(element('legend', { text: 'Метод перебора параметров' })); const methodOptions = element('div', { className: 'nc-method-options' });
    [['1', '1 Полный перебор'], ['2', '2 Латинский гиперкуб'], ['3', '3 Задать вручную'], ['4', '4 Оптимизация'], ['5', '5 Факторный анализ']].forEach(([value, text]) => { const input = element('input', { type: 'radio', name: 'nc-scenario-method', value, checked: config.method === value, onchange: () => { config.method = value; notify(); } }); methodOptions.append(element('label', {}, [input, text])); });
    methodOptions.append(checkbox('Оптимизация размещения', config.placement, checked => { config.placement = checked; notify(); }));
    const settings = element('div', { className: 'nc-method-settings' });
    const count = element('input', { type: 'number', min: 1, max: 50, value: config.count, 'aria-label': 'Количество вариантов', onchange: () => { config.count = Math.max(1, Math.min(50, Math.round(Number(count.value) || 1))); config.selectedRow = Math.min(config.selectedRow, config.count - 1); count.value = config.count; while (config.rows.length < config.count) config.rows.push(config.parameters.map(() => '')); config.rows.length = config.count; drawTables(); notify(); } });
    settings.append(element('label', {}, ['Кол-во вариантов для 2 и 3', count]), button('Вывод вариантов для 1, 2 и 5', null, { disabled: true }));
    const optimizer = element('fieldset', { className: 'nc-optimization' }, [element('legend', { text: 'Параметры оптимизации' }), 'Метод', select(['Нелдера-Мида'], config.optimizer, value => { config.optimizer = value; notify(); }, 'Метод оптимизации'), 'Функция', select(['PI', 'NPV', 'Кин'], config.objective, value => { config.objective = value; notify(); }, 'Функция оптимизации'), element('div', { className: 'nc-span' }, ['Загрузка данных для mfunc:', button('Загрузить', null, { disabled: true })]), element('div', { className: 'nc-span' }, element('input', { type: 'text', value: 'DesktopTraining/VMB_O5/SRC/Hist_adapt.txt', readOnly: true, 'aria-label': 'Исходный файл mfunc' }))]);
    settings.append(optimizer); methods.append(methodOptions, settings); side.append(methods);
    const fileInput = element('input', { type: 'file', accept: '.json,application/json', hidden: true });
    const fileError = element('p', { className: 'nc-inline-error', hidden: true, role: 'status' });
    fileInput.addEventListener('change', async () => { const file = fileInput.files[0]; if (!file) return; try { const imported = JSON.parse(await file.text()); validateState({ scenario: imported }); state.scenario = { ...clone(initialState.scenario), ...imported }; refreshPanel('scenarios'); notify(); } catch { fileError.textContent = 'Не удалось открыть файл сценария.'; fileError.hidden = false; } fileInput.value = ''; });
    side.append(element('div', { className: 'nc-file-row' }, [element('span', { text: 'Открыть/сохранить сценарий' }), button('Открыть', () => fileInput.click()), button('Сохранить', () => downloadBlob(new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' }), 'numex-scenario.json'))]), fileInput, fileError, element('hr', { className: 'nc-separator' }));
    side.append(select([['bar', 'Баровый график'], ['line', 'Линейный график']], config.chartType, value => { config.chartType = value; drawGraphs(); notify(); }, 'Вид графика вариантов'));
    side.append(element('div', { className: 'nc-option-row' }, ['Параметр', select(metrics.slice(1), config.metric, value => { config.metric = value; drawGraphs(); notify(); }, 'Показатель графика вариантов')]), element('p', { className: 'nc-section-title', text: 'График взаимной зависимости' }));
    side.append(element('div', { className: 'nc-option-row' }, [element('label', {}, ['Ось Y', select(metrics, config.axisY, value => { config.axisY = value; drawGraphs(); notify(); }, 'Ось Y')]), element('label', {}, ['Ось X', select(metrics, config.axisX, value => { config.axisX = value; drawGraphs(); notify(); }, 'Ось X')])]), element('hr', { className: 'nc-separator' }), element('p', { className: 'nc-section-title', text: 'Сортировка' }));
    const direction = element('fieldset');
    [['min', 'Мин'], ['max', 'Макс']].forEach(([value, text]) => { const input = element('input', { type: 'radio', name: 'nc-sort-direction', checked: config.descending === (value === 'max'), onchange: () => { config.descending = value === 'max'; drawTables(); drawGraphs(); notify(); } }); direction.append(element('label', {}, [input, text])); });
    side.append(element('div', { className: 'nc-option-row' }, ['Показатель,', select(metrics, config.sort, value => { config.sort = value; drawTables(); drawGraphs(); notify(); }, 'Сортировать варианты по'), direction]));
    const variants = element('div', { className: 'nc-table-wrap nc-scenario-variants' }); const summaries = element('div', { className: 'nc-table-wrap nc-scenario-summary' });
    main.append(element('p', { className: 'nc-section-title', text: 'Таблица вариантов' }), variants, element('p', { className: 'nc-section-title' }, ['Расчетные показатели', element('span', { className: 'nc-reference-caption', text: captured ? '' : projectResults ? projectResults.label : 'данные из видео' })]), summaries);
    const graphs = chart(1200, 540, 'Сравнение вариантов и график взаимной зависимости'); main.append(graphs.toolbar, element('div', { className: 'nc-scenario-graphs' }, graphs.svg));
    function sortedSummaries() { return activeRows.slice().sort((a, b) => { const av = a[config.sort] ?? Infinity; const bv = b[config.sort] ?? Infinity; const difference = (av - bv) * (config.descending ? -1 : 1); const rank = capturedVariant === 2 ? capturedRankTwo : capturedRank; return difference || (captured ? (rank.get(a.index) ?? 100 + a.index) - (rank.get(b.index) ?? 100 + b.index) : 0); }); }
    function drawTables() {
      variants.replaceChildren(table(['№', ...config.parameters], config.rows.map((row, index) => [index + 1, ...row]), { editable: true, selected: config.selectedRow, onSelect: index => { config.selectedRow = index; variants.querySelectorAll('tbody tr').forEach((row, rowIndex) => row.setAttribute('aria-selected', String(rowIndex === index))); notify(); }, onEdit: (row, column, value) => { config.rows[row][column] = value.trim() === '' ? '' : Number.isFinite(Number(value)) ? Number(value) : value; notify(); } }));
      summaries.replaceChildren(captured
        ? table(capturedVariant === 2 ? capturedSummaryHeadersTwo : capturedSummaryHeaders, sortedSummaries().map(row => row.display ?? [row.index, ...Array(capturedVariant === 2 ? 21 : 19).fill('')]))
        : table(metrics.map(([, label]) => label), sortedSummaries().map(row => metrics.map(([key]) => row[key] ?? ''))));
    }
    function drawGraphs() {
      const graphRows = captured ? activeRows.slice().sort((a, b) => a.index - b.index) : sortedSummaries();
      const values = graphRows.map(row => row[config.metric]).filter(Number.isFinite); const extent = range(values, true);
      const capturedBar = captured && config.metric === 'recovery';
      const capturedScatter = captured && config.axisX === 'recovery' && config.axisY === 'pi';
      const frame = plotFrame({ x: 65, y: 32, width: 500, height: 435, xMin: captured ? -.8 : .35, xMax: captured ? 31.8 : 5.65, yMin: capturedBar ? 0 : extent[0], yMax: capturedBar ? capturedVariant === 2 ? .00735 : .00525 : extent[1], xTicks: captured ? [0, 5, 10, 15, 20, 25, 30] : [1, 2, 3, 4, 5], yTicks: capturedBar ? (capturedVariant === 2 ? [0, .001, .002, .003, .004, .005, .006, .007] : [0, .001, .002, .003, .004, .005]) : ticks(extent[0], extent[1], 6), xLabel: '№', yLabel: capturedBar ? 'Кин' : '', formatY: value => capturedBar ? value.toFixed(3) : formatNumber(value, config.metric) });
      let markup = frame.markup; const points = [];
      graphRows.forEach((row, index) => { const value = row[config.metric]; if (!Number.isFinite(value)) return; points.push([index + 1, value]); if (config.chartType === 'bar') { const baseline = frame.sy(0); const top = frame.sy(value); markup += `<rect x="${frame.sx(index + .62)}" y="${Math.min(top, baseline)}" width="${frame.sx(1.38) - frame.sx(.62)}" height="${Math.max(1, Math.abs(baseline - top))}" fill="${capturedBar ? '#1f77b4' : '#2777aa'}"/>`; } });
      if (config.chartType === 'line') markup += curve(points, frame, '#2777aa');
      const xRange = range(activeRows.map(row => row[config.axisX]).filter(Number.isFinite), false); const yRange = range(activeRows.map(row => row[config.axisY]).filter(Number.isFinite), false);
      const scatter = plotFrame({ x: 670, y: 32, width: 500, height: 435, xMin: capturedScatter ? capturedVariant === 2 ? .0028 : .0008 : xRange[0], xMax: capturedScatter ? capturedVariant === 2 ? .0072 : .0052 : xRange[1], yMin: capturedScatter ? capturedVariant === 2 ? .67 : 0 : yRange[0], yMax: capturedScatter ? capturedVariant === 2 ? 1.27 : .405 : yRange[1], xTicks: capturedScatter ? (capturedVariant === 2 ? [.003, .0035, .004, .0045, .005, .0055, .006, .0065, .007] : [.001, .0015, .002, .0025, .003, .0035, .004, .0045, .005]) : config.axisX === 'index' ? [1, 2, 3, 4, 5] : ticks(...xRange, 4), yTicks: capturedScatter ? (capturedVariant === 2 ? [.7, .8, .9, 1, 1.1, 1.2] : [.05, .1, .15, .2, .25, .3, .35, .4]) : config.axisY === 'index' ? [1, 2, 3, 4, 5] : ticks(...yRange, 4), xLabel: metrics.find(([key]) => key === config.axisX)?.[1], yLabel: capturedScatter ? 'PI' : '', formatX: value => capturedScatter ? value.toFixed(4) : formatNumber(value, config.axisX), formatY: value => capturedScatter ? value.toFixed(2) : formatNumber(value, config.axisY) });
      markup += scatter.markup;
      activeRows.forEach(row => { if (!Number.isFinite(row[config.axisX]) || !Number.isFinite(row[config.axisY])) return; const x = scatter.sx(row[config.axisX]); const y = scatter.sy(row[config.axisY]); markup += `<circle cx="${x}" cy="${y}" r="5" fill="#2777aa"/>${textNode(row.index, x + 3, y - 3)}`; });
      graphs.render(markup);
    }
    drawLists(); drawTables(); drawGraphs(); return panel;
  }
  function range(values, includeZero) { let low = values.length ? Math.min(...values) : 0; let high = values.length ? Math.max(...values) : 1; if (includeZero) { low = Math.min(0, low); high = Math.max(0, high); } if (low === high) { const margin = Math.abs(low) * .1 || 1; low -= margin; high += margin; } else { const margin = (high - low) * .04; if (!includeZero || low !== 0) low -= margin; high += margin; } return [low, high]; }
  function ticks(low, high, count) { return Array.from({ length: count + 1 }, (_, index) => low + (high - low) * index / count); }
  function formatNumber(value, metric) { if (metric === 'index') return Number(value).toFixed(0); if (metric === 'recovery') return Number(value).toFixed(3); return Math.abs(value) >= 10 ? Number(value).toFixed(0) : Number(value).toFixed(2); }
  function validateScenario(value) { if (!value || !Array.isArray(value.parameters) || value.parameters.length > 100 || !value.parameters.every(parameter => typeof parameter === 'string' && parameter.length < 100) || !Array.isArray(value.rows) || value.rows.length > 50 || !value.rows.every(row => Array.isArray(row) && row.length === value.parameters.length && row.every(item => typeof item === 'number' || typeof item === 'string' && item.length < 200))) throw new Error('Invalid scenario'); }
  function results() {
    const panel = element('section', { className: 'numex-charts-panel nc-split', 'aria-label': 'Результаты и графики' }); const side = element('div', { className: 'nc-side' }); const main = element('div', { className: 'nc-main' }); panel.append(side, main); const config = state.results;
    side.append(element('div', { className: 'nc-directory-row' }, [element('strong', { text: 'Рабочая директория' }), button('Выбрать', null, { disabled: true })]), element('input', { type: 'text', className: 'nc-directory', value: 'C:\\NUMEX\\KMG\\VMLDB_O5\\V03_2\\PRED_HW', readOnly: true, 'aria-label': 'Рабочая директория' }), element('div', { className: 'nc-directory-row' }, [checkbox('Использовать точку рестарта', config.restart, checked => { config.restart = checked; notify(); }), button('Выбрать директорию с расчетом', null, { disabled: true })]), element('input', { type: 'text', className: 'nc-directory', value: 'C:\\NUMEX\\KMG\\VMLDB_O5\\V03_2\\0', readOnly: true, 'aria-label': 'Директория с расчетом' }), button('Выгрузка инф. по скв.', () => downloadBlob(new Blob(['Скважина,Тип\n' + wells.map(([well, type]) => `${well},${type === 'producer' ? 'Добывающая' : 'Нагнетательная'}`).join('\n')], { type: 'text/csv;charset=utf-8' }), 'numex-wells.csv'), { className: 'nc-wide-button' }), element('p', { className: 'nc-section-title', text: 'Список скважин' }));
    const wellList = element('div', { className: 'nc-list nc-wells', role: 'listbox', 'aria-label': 'Список скважин' }); side.append(wellList, element('p', { className: 'nc-section-title', text: 'Рассчитанные варианты' }));
    const variantList = element('div', { className: 'nc-list nc-variants', role: 'listbox', 'aria-label': 'Рассчитанные варианты' }); const current = element('p', { className: 'nc-current' }); const stats = element('div', { className: 'nc-stat-summary' }); side.append(variantList, current, stats);
    const top = element('div', { className: 'nc-results-top' }); const bottom = element('div', { className: 'nc-results-bottom' });
    function tabs(labels, currentTab = 0) { return element('div', { className: 'nc-tabs', role: 'tablist' }, labels.map((label, index) => button(label, null, { className: 'nc-tab', role: 'tab', 'aria-selected': String(index === currentTab), disabled: index !== currentTab }))); }
    top.append(tabs(['Доб/зак, мест-е', 'Накоп-я доб/зак, мест-е', 'Среднепл-е давление', 'Хар-ка вытеснения', 'СДФ', 'Доб/зак, скв.']));
    const topChart = chart(1200, 325, 'Добыча и закачка, месторождение'); const bottomChart = chart(1200, 345, 'Показатели эффективности');
    top.append(element('div', { className: 'nc-chart-holder' }, topChart.svg));
    const topDefinitions = [ ['oilHistory', 'Дебит нефти история, м3/сут', '#a32232', true], ['liquidHistory', 'Дебит жидкости история, м3/сут', '#168a12', true], ['injectionHistory', 'Закачка воды история, м3/сут', '#1515ff', true], ['waterCutHistory', 'Обводненность история, м3/м3', '#10b9b4', true], ['oil', 'Дебит нефти, м3/сут', '#a32232'], ['liquid', 'Дебит жидкости, м3/сут', '#168a12'], ['gas', 'Дебит газа, тыс. м3/сут', '#d840d9'], ['injection', 'Закачка воды, м3/сут', '#1515ff'], ['gasInjection', 'Закачка газа, тыс. м3/сут', '#432276'], ['waterCut', 'Обводненность, м3/м3', '#ef7d00'] ];
    function legend(definitions, enabled, redraw) { return element('div', { className: 'nc-legend' }, definitions.map(([key, label, color, dashed]) => { const input = element('input', { type: 'checkbox', checked: !!enabled[key], disabled: key.endsWith('History') || key === 'gas' || key === 'gasInjection', 'aria-label': label, onchange: () => { enabled[key] = input.checked; redraw(); notify(); } }); return element('label', {}, [input, element('span', { className: 'nc-swatch' + (dashed ? ' nc-dashed' : ''), style: `--curve-color:${color}` }), label]); })); }
    top.append(legend(topDefinitions, config.topCurves, drawTop));
    const caption = element('span', { className: 'nc-result-caption' });
    const topControls = element('div', { className: 'nc-results-controls' }, [select([['days', 'Сутки'], ['months', 'Месяцы'], ['years', 'Годы']], config.timeUnit, value => { config.timeUnit = value; drawTop(); notify(); }, 'Единица времени добычи'), select([['forecast', 'Прогноз'], ['history', 'История'], ['all', 'История и прогноз']], config.forecast, value => { config.forecast = value; drawTop(); notify(); }, 'Интервал графика'), caption]);
    topControls.querySelectorAll('select:nth-child(2) option').forEach(option => { option.disabled = option.value !== 'forecast'; });
    topControls.querySelector('select:nth-child(2)').disabled = true;
    bottom.append(tabs(['Показатели эффективности', 'Затраты', 'Налоги', 'BHP, Wc']), element('div', { className: 'nc-chart-holder' }, bottomChart.svg), legend([['npv', 'NPV, млн. руб', '#a32232'], ['cashFlow', 'CF, млн. руб', '#1515ff'], ['pi', 'PI', '#168a12'], ['irr', 'IRR', '#00d5d5']], config.bottomCurves, drawBottom));
    const bottomControls = element('div', { className: 'nc-results-controls' }, select([['months', 'Месяцы'], ['years', 'Годы']], config.economicTime, value => { config.economicTime = value; drawBottom(); notify(); }, 'Единица времени экономики'));
    main.append(top, topControls, bottom, bottomControls);
    // These are digitized screen traces; no reservoir simulation is inferred.
    const oil = [[0, 43], [15, 71], [30, 39], [60, 31], [90, 28], [120, 26], [150, 24], [180, 23], [210, 22], [250, 21], [290, 20], [330, 19], [380, 18], [440, 17.4], [500, 17], [620, 16.2], [760, 15.5], [940, 14.9], [1160, 14.6], [1400, 14.3], [1800, 14.1]];
    const liquid = [[0, 53], [15, 81], [30, 47], [60, 39], [90, 36], [120, 33], [150, 31], [180, 29.7], [210, 28.5], [250, 27.5], [290, 26.5], [340, 25.5], [400, 24], [470, 23], [550, 22.5], [690, 23], [870, 23.5], [1070, 24], [1270, 24.4], [1490, 25], [1800, 25.7]];
    const waterCut = [[0, .2], [15, .16], [30, .165], [90, .18], [180, .195], [300, .22], [420, .245], [560, .27], [700, .29], [850, .315], [1010, .345], [1180, .37], [1360, .395], [1540, .42], [1710, .445], [1800, .46]];
    const npv = [[0, -456], [1, -453], [2, -450], [3, -447], [4, -445], [6, -441], [8, -438], [12, -434], [16, -431], [21, -429], [27, -426], [35, -423], [43, -421], [51, -419], [60, -416.089]];
    const pi = [[0, 0], [1, .027], [2, .034], [3, .04], [4, .045], [5, .05], [6, .055], [7, .059], [8, .062], [9, .065], [10, .068], [12, .072], [14, .076], [17, .08], [20, .083], [24, .086], [29, .09], [35, .093], [41, .096], [49, .1], [60, .102]];
    function isRecordedSeries() { return config.variant === 2; }
    function drawTop() {
      const divisor = config.timeUnit === 'months' ? 30 : config.timeUnit === 'years' ? 365 : 1; const label = config.timeUnit === 'months' ? 'Время, мес' : config.timeUnit === 'years' ? 'Время, лет' : 'Время, сут';
      const frame = plotFrame({ x: 80, y: 20, width: 1030, height: 240, xMin: -80 / divisor, xMax: 1890 / divisor, yMin: -4, yMax: 85, xTicks: [0, 250, 500, 750, 1000, 1250, 1500, 1750].map(value => value / divisor), yTicks: [0, 20, 40, 60, 80], yLabel: 'Добыча/закачка', xLabel: label, dashed: true, formatX: value => config.timeUnit === 'days' ? value : value.toFixed(1) });
      let markup = frame.markup;
      [0, .2, .4, .6, .8, 1].forEach(value => { markup += textNode(value.toFixed(1), 1121, frame.y + frame.height * (1 - value) + 5); }); markup += '<text transform="translate(1180,140) rotate(-90)" text-anchor="middle" class="nc-chart-label">Обводненность</text>';
      if (isRecordedSeries()) {
        const transform = points => points.map(([x, y]) => [x / divisor, y]);
        if (config.forecast !== 'history') {
          if (config.topCurves.oil) markup += curve(transform(oil), frame, '#a32232', { step: true });
          if (config.topCurves.liquid) markup += curve(transform(liquid), frame, '#168a12', { step: true });
          if (config.topCurves.injection) markup += curve([[0, 0], [1800 / divisor, 0]], frame, '#1515ff');
          if (config.topCurves.waterCut) markup += curve(transform(waterCut.map(([x, y]) => [x, -4 + y * 89])), frame, '#ef7d00', { step: true });
        }
      }
      topChart.render(markup); caption.textContent = `Вариант ${config.variant}${config.well ? ' · ' + config.well : ''}`;
    }
    function drawBottom() {
      const divisor = config.economicTime === 'years' ? 12 : 1;
      const frame = plotFrame({ x: 80, y: 22, width: 1030, height: 255, xMin: -3 / divisor, xMax: 63 / divisor, yMin: -480, yMax: 25, xTicks: [0, 10, 20, 30, 40, 50, 60].map(value => value / divisor), yTicks: [-400, -300, -200, -100, 0], yLabel: 'NPV, CF', xLabel: config.economicTime === 'years' ? 'Время, лет' : 'Время, мес', dashed: true, formatX: value => Number(value.toFixed(1)) });
      let markup = frame.markup; [0, .02, .04, .06, .08, .1].forEach(value => { markup += textNode(value.toFixed(2), 1121, frame.sy(-455 + value / .102 * 457) + 5); }); markup += '<text transform="translate(1180,150) rotate(-90)" text-anchor="middle" class="nc-chart-label">PI, IRR</text>';
      if (isRecordedSeries()) {
        if (config.bottomCurves.npv) markup += curve(npv.map(([x, y]) => [x / divisor, y]), frame, '#a32232', { step: true });
        if (config.bottomCurves.cashFlow) markup += curve([[0, 0], [0, -455], [1 / divisor, 4], [5 / divisor, 1], [60 / divisor, 0]], frame, '#1515ff', { step: true });
        if (config.bottomCurves.pi) markup += curve(pi.map(([x, y]) => [x / divisor, -455 + y / .102 * 457]), frame, '#168a12', { step: true });
        if (config.bottomCurves.irr) markup += curve([[0, -455], [60 / divisor, -455]], frame, '#00d5d5');
      }
      bottomChart.render(markup);
    }
    function drawLists() {
      wellList.replaceChildren(...wells.map(([well, type]) => button(well, () => { config.well = config.well === well ? '' : well; drawLists(); drawTop(); notify(); }, { className: `nc-list-row nc-well-${type}`, role: 'option', 'aria-selected': String(config.well === well) })));
      variantList.replaceChildren(...summaryRows.map(row => button(String(row.index), () => { config.variant = row.index; drawLists(); drawTop(); drawBottom(); notify(); }, { className: 'nc-list-row', role: 'option', 'aria-selected': String(config.variant === row.index) })));
      current.textContent = `Текущий вариант: ${config.variant}`;
      const selected = summaryRows.find(row => row.index === config.variant); stats.replaceChildren(...['recovery', 'npv', 'pi'].filter(key => Number.isFinite(selected?.[key])).map(key => element('span', { text: `${metrics.find(([code]) => code === key)[1]}: ${selected[key]}` })));
    }
    drawLists(); drawTop(); drawBottom(); return panel;
  }
  function projectResultPanel() {
    const source = projectResults;
    const data = source.results;
    const config = state.results;
    const plannedWells = data.wells || [];
    const panel = element('section', { className: 'numex-charts-panel nc-split', 'aria-label': 'Результаты и графики' });
    const side = element('div', { className: 'nc-side' });
    const main = element('div', { className: 'nc-main' });
    panel.append(side, main);
    side.append(element('div', { className: 'nc-directory-row' }, [element('strong', { text: 'Проект' }), button('Выбрать', () => window.dispatchEvent(new CustomEvent('numex:open-project')))]), element('input', { type: 'text', className: 'nc-directory', value: source.label, readOnly: true, 'aria-label': 'Проект расчета' }), element('p', { className: 'nc-section-title', text: 'Проектные скважины' }));
    const wellList = element('div', { className: 'nc-list nc-wells', role: 'listbox', 'aria-label': 'Список проектных скважин' });
    const variantList = element('div', { className: 'nc-list nc-variants', role: 'listbox', 'aria-label': 'Рассчитанные варианты' });
    const current = element('p', { className: 'nc-current' });
    const stats = element('div', { className: 'nc-stat-summary' });
    side.append(wellList, element('p', { className: 'nc-section-title', text: 'Рассчитанные варианты' }), variantList, current, stats);
    const top = element('div', { className: 'nc-results-top' });
    const bottom = element('div', { className: 'nc-results-bottom' });
    const topChart = chart(1200, 325, 'Результаты проекта: добыча и закачка');
    const bottomChart = chart(1200, 345, 'Результаты проекта: экономика');
    [topChart, bottomChart].forEach(graph => graph.svg.setAttribute('data-project-id', source.id));
    const topTabs = element('div', { className: 'nc-tabs', role: 'tablist', 'aria-label': 'Графики добычи' });
    const bottomTabs = element('div', { className: 'nc-tabs', role: 'tablist', 'aria-label': 'Графики экономики' });
    const topLegend = element('div', { className: 'nc-legend' });
    const bottomLegend = element('div', { className: 'nc-legend' });
    const caption = element('span', { className: 'nc-result-caption', text: source.label });
    top.append(topTabs, element('div', { className: 'nc-chart-holder' }, topChart.svg), topLegend);
    bottom.append(bottomTabs, element('div', { className: 'nc-chart-holder' }, bottomChart.svg), bottomLegend);
    const topControls = element('div', { className: 'nc-results-controls' }, [topChart.toolbar, select([['days', 'Сутки'], ['months', 'Месяцы'], ['years', 'Годы']], config.timeUnit, value => { config.timeUnit = value; drawTop(); notify(); }, 'Единица времени добычи'), select([['forecast', 'Прогноз']], 'forecast', () => {}, 'Интервал графика'), caption]);
    const bottomControls = element('div', { className: 'nc-results-controls' }, [bottomChart.toolbar, select([['months', 'Месяцы'], ['years', 'Годы']], config.economicTime, value => { config.economicTime = value; drawBottom(); notify(); }, 'Единица времени экономики')]);
    main.append(top, topControls, bottom, bottomControls);
    const rateDefinitions = [ ['oil', 'Дебит нефти', '#a32232', 'м3/сут'], ['liquid', 'Дебит жидкости', '#168a12', 'м3/сут'], ['gas', 'Дебит газа', '#d840d9', 'тыс. м3/сут'], ['injection', 'Закачка воды', '#1515ff', 'м3/сут'], ['gasInjection', 'Закачка газа', '#432276', 'тыс. м3/сут'], ['waterCut', 'Обводненность', '#ef7d00', 'м3/м3', true] ];
    const cumulativeDefinitions = [ ['oil', 'Накопленная нефть', '#a32232', 'м3'], ['liquid', 'Накопленная жидкость', '#168a12', 'м3'], ['gas', 'Накопленный газ', '#d840d9', 'тыс. м3'], ['injection', 'Накопленная закачка воды', '#1515ff', 'м3'], ['gasInjection', 'Накопленная закачка газа', '#432276', 'тыс. м3'] ];
    const efficiencyDefinitions = [['npv', 'NPV', '#a32232', 'млн. руб'], ['cashFlow', 'CF', '#1515ff', 'млн. руб'], ['pi', 'PI', '#168a12', '', true], ['irr', 'IRR', '#00b7b7', '', true]];
    const costDefinitions = [['capex', 'CAPEX', '#a32232', 'млн. руб'], ['opex', 'OPEX', '#1515ff', 'млн. руб']];
    const taxDefinitions = [['tax', 'Налоги всего', '#a32232', 'млн. руб'], ['ndpi', 'НДПИ', '#1515ff', 'млн. руб'], ['prib', 'Налог на прибыль', '#168a12', 'млн. руб'], ['ndd', 'НДД', '#d840d9', 'млн. руб'], ['imush', 'Налог на имущество', '#ef7d00', 'млн. руб']];
    const hasSeries = group => group && Object.values(group).some(values => Array.isArray(values) && values.some(Number.isFinite));
    const selectedWell = () => plannedWells.find(well => well.name === config.well) || plannedWells[0];
    const topOptions = [ ['rates', 'Доб/зак, мест-е', hasSeries(data.rates)], ['cumulative', 'Накоп-я доб/зак, мест-е', hasSeries(data.cumulative)], ['pressure', 'Среднепл-е давление', Array.isArray(data.pressure)], ['displacement', 'Хар-ка вытеснения', false], ['sdf', 'СДФ', false], ['wells', 'Доб/зак, скв.', plannedWells.length > 0] ];
    const bottomOptions = [ ['efficiency', 'Показатели эффективности', hasSeries(data.economics)], ['costs', 'Затраты', hasSeries(data.economics?.costs)], ['taxes', 'Налоги', hasSeries(data.economics?.taxes)], ['bhp', 'BHP, Wc', plannedWells.some(well => Array.isArray(well.pressure))] ];
    if (!topOptions.some(([key, , enabled]) => key === config.topTab && enabled)) config.topTab = 'rates';
    if (!bottomOptions.some(([key, , enabled]) => key === config.bottomTab && enabled)) config.bottomTab = 'efficiency';
    function drawTabs() {
      const makeTabs = (container, options, property, redraw) => container.replaceChildren(...options.map(([key, label, enabled]) => button(label, () => { config[property] = key; drawTabs(); redraw(); notify(); }, { className: 'nc-tab', role: 'tab', 'aria-selected': String(config[property] === key), disabled: !enabled })));
      makeTabs(topTabs, topOptions, 'topTab', drawTop);
      makeTabs(bottomTabs, bottomOptions, 'bottomTab', drawBottom);
    }
    function drawLegend(container, definitions, values, choices, redraw) {
      container.replaceChildren(...definitions.filter(([key]) => Array.isArray(values?.[key])).map(([key, label, color, unit]) => {
        const input = element('input', { type: 'checkbox', checked: choices[key] !== false, 'aria-label': `${label}${unit ? ', ' + unit : ''}`, onchange: () => { choices[key] = input.checked; redraw(); notify(); } });
        return element('label', {}, [input, element('span', { className: 'nc-swatch', style: `--curve-color:${color}` }), `${label}${unit ? ', ' + unit : ''}`]);
      }));
    }
    function numericLabel(value) { return Number(value.toPrecision(4)).toLocaleString('ru-RU', { maximumFractionDigits: 4 }); }
    function axisTicks(low, high, count = 6) {
      const target = (high - low) / count;
      const power = 10 ** Math.floor(Math.log10(target || 1));
      const step = ([1, 2, 2.5, 5, 10].find(value => value >= target / power) || 10) * power;
      const first = Math.ceil(low / step) * step;
      return Array.from({ length: Math.max(1, Math.floor((high - first) / step + 1e-8) + 1) }, (_, index) => Number((first + index * step).toPrecision(10)));
    }
    function renderSeries(graph, time, values, definitions, choices, options) {
      const visible = definitions.filter(([key]) => choices[key] !== false && Array.isArray(values?.[key]));
      const primary = visible.filter(definition => !definition[4]);
      const secondary = visible.filter(definition => definition[4]);
      const primaryValues = primary.flatMap(([key]) => values[key]).filter(Number.isFinite);
      const extent = range(primaryValues, options.includeZero !== false);
      const secondaryValues = secondary.flatMap(([key]) => values[key]).filter(Number.isFinite);
      const secondaryExtent = options.secondaryRange || range(secondaryValues, true);
      const times = time.map(value => value / options.divisor);
      const maxTime = Math.max(1, ...times);
      const frame = plotFrame({ x: 82, y: 24, width: 1020, height: options.height || 235, xMin: -maxTime * .035, xMax: maxTime * 1.025, yMin: extent[0], yMax: extent[1], xTicks: axisTicks(0, maxTime, options.xTickCount || 6), yTicks: axisTicks(...extent), xLabel: options.timeLabel, yLabel: options.yLabel, dashed: true, formatX: numericLabel, formatY: numericLabel });
      let markup = frame.markup;
      if (secondary.length) {
        axisTicks(...secondaryExtent).forEach(value => { markup += textNode(numericLabel(value), 1114, frame.y + frame.height * (1 - (value - secondaryExtent[0]) / (secondaryExtent[1] - secondaryExtent[0])) + 5); });
        markup += `<text transform="translate(1180,145) rotate(-90)" text-anchor="middle" class="nc-chart-label">${escapeText(options.secondaryLabel)}</text>`;
      }
      visible.forEach(([key, , color, , isSecondary]) => {
        const points = values[key].flatMap((value, index) => Number.isFinite(value) && Number.isFinite(times[index]) ? [[times[index], isSecondary ? extent[0] + (value - secondaryExtent[0]) / (secondaryExtent[1] - secondaryExtent[0]) * (extent[1] - extent[0]) : value]] : []);
        markup += curve(points, frame, color, { step: options.step !== false });
      });
      graph.svg.setAttribute('data-series-count', visible.length);
      graph.render(markup);
    }
    function drawTop() {
      const divisor = config.timeUnit === 'months' ? 30 : config.timeUnit === 'years' ? 365 : 1;
      const timeLabel = config.timeUnit === 'months' ? 'Время, мес' : config.timeUnit === 'years' ? 'Время, лет' : 'Время, сут';
      const well = selectedWell();
      let values = data.rates; let definitions = rateDefinitions; let time = data.timeDays; let yLabel = 'Добыча/закачка'; let secondaryLabel = 'Обводненность';
      if (config.topTab === 'cumulative') { values = data.cumulative; definitions = cumulativeDefinitions; yLabel = 'Накопленная добыча/закачка'; }
      if (config.topTab === 'pressure') { values = { pressure: data.pressure }; definitions = [['pressure', 'Среднепластовое давление', '#a32232', 'бар']]; yLabel = 'Давление, бар'; }
      if (config.topTab === 'wells' && well) { values = well.rates; time = well.timeDays || time; }
      drawLegend(topLegend, definitions, values, config.topCurves, drawTop);
      renderSeries(topChart, time, values, definitions, config.topCurves, { divisor, timeLabel, yLabel, secondaryLabel, secondaryRange: [0, 1], includeZero: config.topTab !== 'pressure', xTickCount: config.timeUnit === 'days' ? 8 : 6 });
      topChart.svg.setAttribute('data-chart-tab', config.topTab);
      caption.textContent = `Вариант ${source.variant}${config.topTab === 'wells' && well ? ' · ' + well.name : ''}`;
    }
    function drawBottom() {
      const economy = data.economics || { timeMonths: [] };
      let values = economy; let definitions = efficiencyDefinitions; let time = economy.timeMonths; let divisor = config.economicTime === 'years' ? 12 : 1;
      let yLabel = 'NPV, CF, млн. руб'; let secondaryLabel = 'PI, IRR'; let secondaryRange;
      if (config.bottomTab === 'costs') { values = economy.costs; definitions = costDefinitions; yLabel = 'Затраты, млн. руб'; }
      if (config.bottomTab === 'taxes') { values = economy.taxes; definitions = taxDefinitions; yLabel = 'Налоги, млн. руб'; }
      if (config.bottomTab === 'bhp') { const well = selectedWell(); values = { pressure: well?.pressure, waterCut: well?.rates?.waterCut }; definitions = [['pressure', 'Забойное давление', '#a32232', 'бар'], rateDefinitions[5]]; time = well?.timeDays || data.timeDays; divisor *= 30; yLabel = 'Давление, бар'; secondaryLabel = 'Обводненность'; secondaryRange = [0, 1]; }
      const choices = config.bottomTab === 'bhp' ? config.topCurves : config.bottomCurves;
      drawLegend(bottomLegend, definitions, values, choices, drawBottom);
      renderSeries(bottomChart, time, values, definitions, choices, { divisor, timeLabel: config.economicTime === 'years' ? 'Время, лет' : 'Время, мес', yLabel, secondaryLabel, secondaryRange, height: 255 });
      bottomChart.svg.setAttribute('data-chart-tab', config.bottomTab);
    }
    function drawLists() {
      wellList.replaceChildren(...plannedWells.map(well => button(well.name, () => { config.well = well.name; config.topTab = 'wells'; drawLists(); drawTabs(); drawTop(); if (config.bottomTab === 'bhp') drawBottom(); notify(); }, { className: `nc-list-row nc-well-${well.kind}`, role: 'option', 'aria-selected': String(config.well === well.name) })));
      variantList.replaceChildren(...[1, 2].map(variant => button(String(variant), () => { if (variant !== source.variant) window.dispatchEvent(new CustomEvent('numex:variant-select', { detail: { variant } })); }, { className: 'nc-list-row', role: 'option', 'aria-selected': String(source.variant === variant) })));
      current.textContent = `Текущий вариант: ${source.variant}`;
      stats.replaceChildren(...['recovery', 'npv', 'pi', 'capex'].filter(key => Number.isFinite(source.summary?.[key])).map(key => element('span', { text: `${metrics.find(([code]) => code === key)[1]}: ${numericLabel(source.summary[key])}` })));
    }
    drawTabs(); drawLists(); drawTop(); drawBottom();
    return panel;
  }
  function validateProjectResults(value) {
    if (value == null) return true;
    if (!value || typeof value !== 'object' || ![1, 2].includes(value.variant) || typeof value.id !== 'string' || typeof (value.label ?? value.name) !== 'string' || !value.results || !value.summary) throw new Error('Invalid project result');
    const data = value.results;
    const validateTime = time => {
      if (!Array.isArray(time) || time.length > 20000 || !time.every((value, index) => Number.isFinite(value) && (index === 0 || value >= time[index - 1]))) throw new Error('Invalid result time');
    };
    const validateSeries = (series, length) => {
      if (!series || typeof series !== 'object' || Array.isArray(series)) throw new Error('Invalid result series');
      Object.values(series).forEach(values => { if (!Array.isArray(values) || values.length !== length || !values.every(value => value === null || Number.isFinite(value))) throw new Error('Invalid result points'); });
    };
    validateTime(data.timeDays);
    validateSeries(data.rates, data.timeDays.length);
    if (data.cumulative) validateSeries(data.cumulative, data.timeDays.length);
    if (data.pressure) validateSeries({ pressure: data.pressure }, data.timeDays.length);
    if (data.economics) {
      validateTime(data.economics.timeMonths);
      const { timeMonths, costs, taxes, ...series } = data.economics;
      validateSeries(series, timeMonths.length);
      if (costs) validateSeries(costs, timeMonths.length);
      if (taxes) validateSeries(taxes, timeMonths.length);
    }
    if (data.wells) {
      if (!Array.isArray(data.wells) || data.wells.length > 500) throw new Error('Invalid result wells');
      data.wells.forEach(well => {
        if (typeof well.name !== 'string' || well.name.length > 100) throw new Error('Invalid result well name');
        const time = well.timeDays || data.timeDays; validateTime(time); validateSeries(well.rates, time.length);
        if (well.pressure) validateSeries({ pressure: well.pressure }, time.length);
      });
    }
    return true;
  }
  function setProjectResults(value) {
    validateProjectResults(value);
    const nextVariant = value?.variant ?? null;
    if (nextVariant !== displayedScenarioVariant) {
      if (displayedScenarioVariant != null) scenarioByVariant.set(displayedScenarioVariant, clone(state.scenario));
      state.scenario = clone(scenarioByVariant.get(nextVariant) ?? (nextVariant === 1 ? initialState.scenario : otherProjectScenario));
      displayedScenarioVariant = nextVariant;
    }
    projectResults = value == null ? null : clone(value);
    if (projectResults) {
      projectResults.label = projectResults.label ?? projectResults.name;
      state.results.variant = projectResults.variant;
      if (!(projectResults.results.wells || []).some(well => well.name === state.results.well)) state.results.well = '';
    }
    refreshPanel('results'); refreshPanel('scenarios');
  }
  const creators = { initialization, reservoir: initialization, economics, scenarios, results: () => projectResults ? projectResultPanel() : results() };
  function refreshPanel(pageId) { const existing = panels.get(pageId); if (!existing) return; const replacement = creators[pageId](); existing.replaceChildren(...replacement.childNodes); }
  function createPanel(pageId) { if (panels.has(pageId)) return panels.get(pageId); const creator = creators[pageId]; if (!creator) return null; const panel = creator(); panel.dataset.page = pageId; panels.set(pageId, panel); return panel; }
  function getState() { return clone(state); }
  function validateState(next) {
    if (!next || typeof next !== 'object' || Array.isArray(next)) throw new Error('Invalid chart state');
    if (next.scenario) {
      validateScenario(next.scenario);
      const config = { ...initialState.scenario, ...next.scenario };
      if (!['1', '2', '3', '4', '5'].includes(config.method) || !['bar', 'line'].includes(config.chartType) || !Number.isInteger(config.count) || config.count < 1 || config.count > 50 || config.rows.length !== config.count || !Number.isInteger(config.selectedRow) || config.selectedRow < -1 || config.selectedRow >= config.count || typeof config.descending !== 'boolean' || typeof config.placement !== 'boolean' || !['Нелдера-Мида'].includes(config.optimizer) || !['PI', 'NPV', 'Кин'].includes(config.objective)) throw new Error('Invalid scenario settings');
      if (![config.metric, config.axisX, config.axisY, config.sort].every(metric => metrics.some(([key]) => key === metric)) || typeof config.selectedType !== 'string' || typeof config.selectedParameter !== 'string') throw new Error('Invalid scenario chart selection');
    }
    if (next.results) {
      const config = { ...initialState.results, ...next.results };
      if (![1, 2, 3, 4, 5].includes(config.variant) || typeof config.well !== 'string' || config.well.length > 100 || typeof config.restart !== 'boolean' || !['days', 'months', 'years'].includes(config.timeUnit) || !['forecast', 'history', 'all'].includes(config.forecast) || !['months', 'years'].includes(config.economicTime) || !['rates', 'cumulative', 'pressure', 'wells'].includes(config.topTab) || !['efficiency', 'costs', 'taxes', 'bhp'].includes(config.bottomTab)) throw new Error('Invalid result selection');
      for (const key of ['topCurves', 'bottomCurves']) if (!config[key] || typeof config[key] !== 'object' || Array.isArray(config[key]) || !Object.entries(config[key]).every(([name, enabled]) => name in initialState.results[key] && typeof enabled === 'boolean')) throw new Error('Invalid curve selection');
    }
    return true;
  }
  function setState(next) { validateState(next); if (next.scenario) state.scenario = { ...clone(initialState.scenario), ...clone(next.scenario) }; if (next.results) state.results = { ...clone(initialState.results), ...clone(next.results), topCurves: { ...initialState.results.topCurves, ...next.results.topCurves }, bottomCurves: { ...initialState.results.bottomCurves, ...next.results.bottomCurves } }; [...panels.keys()].forEach(refreshPanel); }
  function resetState() { state = clone(initialState); scenarioByVariant.clear(); displayedScenarioVariant = null; [...panels.keys()].forEach(refreshPanel); }
  window.NUMEXCharts = { createPanel, getState, validateState, setState, resetState, validateProjectResults, setProjectResults };
})();
