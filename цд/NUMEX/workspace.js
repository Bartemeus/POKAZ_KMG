'use strict';

(() => {
  const root = document.querySelector('#приложение');
  const navigation = [...document.querySelectorAll('.разделы [data-page]')];
  const pageIds = navigation.map(button => button.dataset.page);
  const mapPages = new Set(['calculation', 'development', 'completion']);
  const widePages = new Set(['scenarios', 'results']);
  const panels = new Map();
  const development = document.querySelector('.средняя-панель');
  const map = document.querySelector('.панель-карты');
  let activePage = 'calculation';

  function createHost(name) {
    const host = document.createElement('section');
    host.id = `workspace-${name}`;
    host.className = `workspace-${name}`;
    host.hidden = true;
    root.append(host);
    return host;
  }
  const details = createHost('details');
  const visual = createHost('visual');
  const wide = createHost('wide');

  function createBlankViewer() {
    const panel = document.createElement('div');
    panel.className = 'workspace-blank';
    const toolbar = document.createElement('div');
    toolbar.className = 'workspace-blank-toolbar';
    for (const source of document.querySelectorAll('.инструменты button')) {
      const button = source.cloneNode(true);
      button.removeAttribute('id');
      button.removeAttribute('aria-pressed');
      button.disabled = true;
      toolbar.append(button);
    }
    const canvas = document.createElement('div');
    canvas.className = 'workspace-blank-canvas';
    panel.append(toolbar, canvas);
    return panel;
  }

  function mountPage(pageId) {
    if (panels.has(pageId) || pageId === 'development') return;
    const mounted = [];
    if (widePages.has(pageId)) {
      const panel = window.NUMEXCharts.createPanel(pageId);
      wide.append(panel);
      mounted.push(panel);
    } else {
      const form = window.NUMEXPages.createPanel(pageId);
      details.append(form);
      mounted.push(form);
      if (!mapPages.has(pageId)) {
        const panel = pageId === 'gathering' ? createBlankViewer() : window.NUMEXCharts.createPanel(pageId);
        visual.append(panel);
        mounted.push(panel);
      }
    }
    panels.set(pageId, mounted);
  }

  function navigate(pageId, announce = true) {
    if (!pageIds.includes(pageId)) throw new Error('Unknown NUMEX page.');
    window.NUMEXCore.cancelMapGesture();
    mountPage(pageId);
    for (const [id, mounted] of panels) mounted.forEach(panel => { panel.hidden = id !== pageId; });
    development.hidden = pageId !== 'development';
    map.hidden = !mapPages.has(pageId);
    details.hidden = widePages.has(pageId) || pageId === 'development';
    visual.hidden = widePages.has(pageId) || mapPages.has(pageId);
    wide.hidden = !widePages.has(pageId);
    for (const button of navigation) {
      const selected = button.dataset.page === pageId;
      button.classList.toggle('выбран', selected);
      button.tabIndex = selected ? 0 : -1;
      if (selected) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
    activePage = pageId;
    const title = navigation.find(button => button.dataset.page === pageId).textContent;
    document.title = `Nedra.NUMEX — ${title}`;
    details.setAttribute('aria-label', title);
    visual.setAttribute('aria-label', title);
    wide.setAttribute('aria-label', title);
    if (announce) window.NUMEXCore.report(title);
  }

  navigation.forEach((button, index) => {
    button.addEventListener('click', () => navigate(button.dataset.page));
    button.addEventListener('keydown', event => {
      if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? navigation.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + navigation.length) % navigation.length;
      navigation[next].click();
      navigation[next].focus();
    });
  });
  document.addEventListener('numex:page-change', () => window.NUMEXCore.report('Параметры изменены.'));
  window.addEventListener('numex:charts-change', () => window.NUMEXCore.report('Параметры графиков и сценариев изменены.'));

  function getState() {
    return { page: activePage, forms: window.NUMEXPages.getState(), charts: window.NUMEXCharts.getState(), project: window.NUMEXProjects?.getState() };
  }
  function validateState(state) {
    if (!state || typeof state !== 'object' || Array.isArray(state)) throw new Error('Invalid workspace state.');
    if (!pageIds.includes(state.page)) throw new Error('Invalid workspace page.');
    window.NUMEXPages.validateState(state.forms);
    window.NUMEXCharts.validateState(state.charts);
    if (state.project !== undefined) window.NUMEXProjects.validateState(state.project);
  }
  function setState(state) {
    validateState(state);
    if (state.project !== undefined) window.NUMEXProjects.setState(state.project);
    else if ([1, 2].includes(state.charts.results?.variant)) window.NUMEXProjects.setState({ activeId: state.charts.results.variant === 2 ? 'project2' : 'project', custom: null });
    window.NUMEXPages.setState(state.forms);
    window.NUMEXCharts.setState(state.charts);
    navigate(state.page, false);
  }
  function resetState() {
    window.NUMEXPages.resetState();
    window.NUMEXCharts.resetState();
    window.NUMEXProjects?.resetState();
    navigate('calculation', false);
  }
  window.NUMEXWorkspace = { navigate, getState, validateState, setState, resetState };
  const requestedPage = new URLSearchParams(location.search).get('page');
  navigate(pageIds.includes(requestedPage) ? requestedPage : 'calculation', false);
})();
