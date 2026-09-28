'use strict';

(() => {
  const source = window.NUMEXProjectData;
  const presets = source.presets;
  const clone = value => JSON.parse(JSON.stringify(value));
  const select = document.querySelector('#numex-project-select');
  const calculateButton = document.querySelector('#numex-calculate');
  const economicsButton = document.querySelector('#numex-calculate-economics');
  const progress = document.querySelector('.прогресс progress');
  const progressText = document.querySelector('.прогресс span');
  const calculationTimeDisplay = document.querySelector('.время');
  const calculationTime = new Date(performance.timeOrigin - 60 * 60 * 1000);
  const calculationTimestamp = document.createElement('time');
  calculationTimestamp.dateTime = calculationTime.toISOString();
  calculationTimestamp.textContent = calculationTime.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
  calculationTimeDisplay.classList.add('numex-calculation-time');
  calculationTimeDisplay.replaceChildren('Время расчета:', calculationTimestamp);
  const title = document.querySelector('.заголовок>span:nth-child(2)');
  const mapImage = document.querySelector('#изображение-карты');
  const svgNamespace = 'http://www.w3.org/2000/svg';
  let active = presets[0];
  let custom = null;
  let generation = 0;

  function svg(tag, attributes) {
    const node = document.createElementNS(svgNamespace, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }
  const wellLayer = svg('g', { id: 'numex-project-wells' });
  mapImage.append(wellLayer);
  // Replace the two traced planned wells, retaining the five historical trajectories.
  const tracedPaths = mapImage.querySelector('#стволы-скважин path');
  if (tracedPaths) tracedPaths.setAttribute('d', tracedPaths.getAttribute('d').split(/(?=M)/).filter(Boolean).slice(2).join(' '));
  mapImage.querySelectorAll('#метки-скважин circle').forEach(marker => {
    if (Number(marker.getAttribute('cy')) === 424 && [172.5, 212].includes(Number(marker.getAttribute('cx')))) marker.setAttribute('display', 'none');
  });
  mapImage.querySelectorAll('#подписи-скважин text').forEach(label => {
    if (/^[12][pр]::0[pр]$/u.test(label.textContent)) label.setAttribute('display', 'none');
  });

  function projectLabel(project) {
    return `${project.name} · ${project.map.wells.length} ${project.development.wellTypeIndex === 2 ? 'ГС' : 'ННС'}`;
  }
  function updateChoices() {
    const choices = presets.map(project => [projectLabel(project), project.id]);
    if (custom) choices.push([projectLabel(custom), 'custom']);
    const existing = [...select.options].map(option => [option.textContent, option.value]);
    if (JSON.stringify(existing) !== JSON.stringify(choices)) select.replaceChildren(...choices.map(([label, id]) => new Option(label, id)));
    select.value = custom && active === custom ? 'custom' : active.id;
  }
  function resolveProject(id, customValue = custom) {
    return id === 'custom' ? customValue : presets.find(project => project.id === id);
  }
  function mapPoint(point) {
    const units = 500 / 117.5;
    return [(point[0] - (284500 - 113 * units)) / units - 35, ((5293000 + 97 * units) - point[1]) / units - 124];
  }
  function renderWells() {
    const nodes = [];
    active.map.wells.forEach(well => {
      const head = mapPoint(well.points[1]);
      const toe = mapPoint(well.points[well.points.length - 1]);
      const group = svg('g', { 'data-well': well.name });
      if (well.wellTypeIndex === 2) group.append(svg('path', {
        class: 'numex-well-trajectory', d: `M${head.join(' ')}L${toe.join(' ')}`,
        fill: 'none', stroke: '#868474', 'stroke-width': 2.7, 'stroke-linecap': 'round'
      }));
      group.append(svg('circle', { cx: head[0], cy: head[1], r: 4.6, fill: well.kind === 'injector' ? '#0000db' : '#b12b2b' }));
      const label = svg('text', { x: head[0] + 6, y: head[1] - 5, 'font-family': 'DejaVu Sans, Arial, sans-serif', 'font-size': 13, fill: '#171717' });
      label.textContent = `${well.name}::0p`;
      group.append(label);
      nodes.push(group);
    });
    wellLayer.replaceChildren(...nodes);
    wellLayer.dataset.variant = active.variant;
  }
  function applyProjectParameters() {
    const data = active.development;
    const values = {};
    const mapping = { density: 'плотность', ratio: 'отношение', spacingX: 'a0', spacingY: 'b0', rowOffset: 'смещение', stressAngle: 'стресс', fractureAngle: 'трещины', deformation: 'деформация', minimumDistance: 'расстояние', systemAngle: 'направление', width: 'ширина', height: 'высота', centerX: 'dx', centerY: 'dy', radius: 'радиус' };
    for (const [key, field] of Object.entries(mapping)) values[`параметр-${field}`] = String(data[key]);
    values['флаг-плотность-режим'] = true;
    values['флаг-шаги'] = false;
    const system = document.querySelector('#параметр-тип');
    const systemName = `Тип ${data.systemTypeIndex + 1}`;
    if (![...system.options].some(option => option.value === systemName)) system.add(new Option(systemName, systemName));
    values['параметр-тип'] = systemName;
    window.NUMEXCore.applyParameters(values);
    const completion = {
      'producerType.value': data.wellTypeIndex === 2 ? 'ГС' : 'ННС',
      'horizontalLength.value': String(data.horizontalLength), 'horizontalAngle.value': String(data.horizontalAngle),
      'producerTarget.value': String(data.producerTarget), 'minimumBottomPressure.value': String(data.producerMinimumPressure),
      'maximumProductionRate.value': String(data.producerMaximumRate), 'producerSkin.value': String(data.producerSkin),
      'producerRadius.value': String(data.producerRadius), 'producerAvailability.value': String(data.producerAvailability),
      'producerConnectionValue.value': String(data.producerConnection), 'producerDFactor.value': String(data.producerDFactor)
    };
    window.NUMEXPages.setState({ calculation: { values: { 'duration.value': String(active.calculation.duration), 'cellCount.value': String(active.calculation.cellCount) } }, completion: { values: completion } });
    title.textContent = `Nedra.NUMEX — ${active.name} · Вариант ${active.variant}`;
  }
  function applyResults() {
    renderWells();
    window.NUMEXCharts.setProjectResults(active);
  }
  function stopProgress() {
    generation++;
    calculateButton.disabled = false;
    economicsButton.disabled = false;
    select.disabled = false;
    progress.value = 0;
    progressText.textContent = '0%';
  }
  function loadProject(project, announce = true) {
    stopProgress();
    active = project;
    applyProjectParameters();
    applyResults();
    updateChoices();
    if (announce) window.NUMEXCore.report(`Открыт ${active.name} · Вариант ${active.variant}`);
  }
  function calculate(economicsOnly = false) {
    const token = ++generation;
    calculateButton.disabled = true;
    economicsButton.disabled = true;
    select.disabled = true;
    progress.value = 25;
    progressText.textContent = '25%';
    window.NUMEXCore.report(`Подготовка результатов: ${active.name}`);
    // The supplied JSON contains completed runs; display those results without inventing a solver.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (token !== generation) return;
      applyResults();
      progress.value = 100;
      progressText.textContent = '100%';
      calculateButton.disabled = false;
      economicsButton.disabled = false;
      select.disabled = false;
      window.NUMEXCore.report(`Сохраненные результаты: ${active.name} · Вариант ${active.variant}`);
      if (economicsOnly) window.NUMEXWorkspace.navigate('results', false);
    }));
  }
  function validateCompact(project) {
    if (!project || typeof project !== 'object' || typeof project.id !== 'string' || project.id.length > 150 || typeof project.name !== 'string' || project.name.length > 150 || !Number.isInteger(project.variant) || project.variant < 1 || project.variant > 1000) throw new Error('Некорректный проект.');
    if (!project.map || !Array.isArray(project.map.wells) || !project.map.wells.length || project.map.wells.length > 200) throw new Error('Некорректная геометрия проекта.');
    for (const well of project.map.wells) {
      if (typeof well.name !== 'string' || well.name.length > 120 || !['producer', 'injector'].includes(well.kind) || !Number.isInteger(well.wellTypeIndex) || !Array.isArray(well.points) || well.points.length < 3 || well.points.length > 1000 || !well.points.every(point => Array.isArray(point) && point.length === 2 && point.every(value => Number.isFinite(value) && Math.abs(value) < 1e8))) throw new Error('Некорректная траектория скважины.');
    }
    for (const [key, defaultValue] of Object.entries(presets[0].development)) if (typeof defaultValue === 'number' && !Number.isFinite(project.development?.[key])) throw new Error('Некорректные параметры проекта.');
    if (!Number.isFinite(project.calculation?.duration) || !Number.isFinite(project.calculation?.cellCount)) throw new Error('Некорректные параметры расчета.');
    window.NUMEXCharts.validateProjectResults(project);
  }
  function importProject(raw, filename) {
    const project = source.parseProject(raw, filename);
    validateCompact(project);
    custom = project;
    loadProject(custom);
  }
  function getState() { return { activeId: active === custom ? 'custom' : active.id, custom: custom ? clone(custom) : null }; }
  function validateState(state) {
    if (!state || typeof state !== 'object' || Array.isArray(state) || typeof state.activeId !== 'string') throw new Error('Некорректное состояние проекта.');
    if (state.custom !== null && state.custom !== undefined) validateCompact(state.custom);
    if (!resolveProject(state.activeId, state.custom)) throw new Error('Неизвестный проект.');
  }
  function setState(state) { validateState(state); custom = state.custom ? clone(state.custom) : null; loadProject(resolveProject(state.activeId), false); }
  function resetState() { custom = null; loadProject(presets[0], false); }

  select.addEventListener('change', () => loadProject(resolveProject(select.value)));
  calculateButton.addEventListener('click', () => calculate());
  economicsButton.addEventListener('click', () => calculate(true));
  window.addEventListener('numex:variant-select', event => {
    const project = custom?.variant === event.detail.variant && active === custom ? custom : presets.find(candidate => candidate.variant === event.detail.variant);
    if (project && project !== active) loadProject(project);
  });
  window.addEventListener('numex:open-project', () => document.querySelector('#загрузка-параметров').click());
  window.NUMEXProjects = { getState, validateState, setState, resetState, importProject, calculate };
  loadProject(presets[0]);
})();
