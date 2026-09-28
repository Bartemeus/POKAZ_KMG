'use strict';

(() => {
  const field = (id, label, value, extra = {}) => ({ id, label, value, ...extra });
  const flag = (id, label, checked = false, extra = {}) => ({ id, label, checked, ...extra });
  const group = (id, label, children, extra = {}) => ({ id, label, children, ...extra });
  const choice = (id, label, value, extra = {}) => field(id, label, value, { options: [value], ...extra });
  const action = (id, label, caption = 'Загрузить', extra = {}) => ({ id, label, action: caption, ...extra });
  const definitions = {
    calculation: {
      title: 'Параметры расчета',
      rows: [
        group('duration', 'Время расчета, мес', [choice('startDateType', 'Тип даты запуска', 'Относительная')], { value: '60' }),
        group('simulator', 'Параметры симулятора', [
          field('cellCount', 'К-во ячеек (n cell), шт', '50'),
          flag('autoScale', 'AUTO_SCALE'),
          group('gridRefinement', 'GREFINE', [field('nrefine', 'NREFINE', '2'), field('mrefine', 'MREFINE', '1.5')], { checked: false }),
          flag('cutWells', 'CUT_WELLS'), flag('ecllin', 'ECLLIN'), flag('timeStepTte', 'TS_TTE'), flag('timeStepHalf', 'TS_HALF'),
          flag('wellEquation', 'ECLWELLEQ', true), field('tsmchp', 'TSMCHP', '1e-09'), flag('nativeOutput', 'NATIVE_OUTPUT'),
          flag('cutFractures', 'CUT_FRACTURES', false, { value: '1.0' }),
          group('endScale', 'Масштабирование ОФП (ENDSCALE)', [
            flag('sowcr', 'SOWCR', true), flag('sogcr', 'SOGCR'), flag('swcr', 'SWCR', true), flag('sgcr', 'SGCR'),
            flag('kro', 'KRO'), flag('krw', 'KRW', true), flag('krg', 'KRG'),
            group('scaleCrs', 'Трехточечное (SCALECRS)', ['KRORW', 'KRORG', 'KRWR', 'KRGR', 'SWL', 'SWU', 'SGL', 'SGU'].map(name => flag(name.toLowerCase(), name)), { checked: false })
          ], { checked: true }),
          group('wellDrawn', 'WELDRAWN, WBPR', [field('radiusXY', 'Rxy, м', '100.0'), field('radiusZ', 'Rz, м', '10.0')])
        ]),
        group('dynamicMaps', 'Динамические кубы и карты', [
          group('restart', 'rstrt', [field('exportInterval', 'Интервал выгрузки в днях', '120'), field('exportFrequency', 'Частота выгрузки', '6')], { checked: false }),
          choice('irap', 'irap', 'LAST', { checked: true })
        ]),
        group('wecon', 'Проверка выполнения WECON', [field('checkPeriod', 'Период проверки, мес', '12')], { checked: false }),
        group('modelActions', 'Действия с объектами модели', [
          group('contour', 'Контур', [field('scaleStep', 'Шаг масштабирования, м', '100'), action('upscale', 'Масштабирование', 'Upscale')]),
          group('horizontalWells', 'Горизонтальные скважины', [
            group('minimumWellShare', 'Мин. доля ГС в контуре', [flag('removeAllBranches', 'Удалять все ств. для МЗГС', true)], { value: '0.99' }),
            flag('fixT1', 'Зафиксировать T1', true)
          ]),
          flag('removeSimulation', 'Удалять расчет ГД сим-ра')
        ]),
        group('optimization', 'Оптимизация', [
          group('nelderMead', 'Метод Нелдера-Мида', [field('nelderTolerance', 'tol', '0.0001'), field('nelderMaxEvaluations', 'maxfev', '100')]),
          group('genetic', 'Генетический метод', [
            field('population', 'npop', '10'), field('generations', 'ngen', '10'), field('tournamentSize', 'tournsize', '3'),
            field('crossoverProbability', 'cxpb', '0.7'), field('crossoverIndividualProbability', 'cxpb_indpb', '0.7'),
            field('mutationProbability', 'mutpb', '0.4'), field('mutationIndividualProbability', 'mutpb_indpb', '0.5')
          ]),
          group('particleSwarm', 'Метод роя частиц', [
            field('swarmTolerance', 'tol', '0.0001'), field('omega', 'omega', '0.5'), field('phip', 'phip', '0.5'),
            field('phig', 'phig', '0.5'), field('swarmSize', 'swarmsize', '10'), field('swarmMaxIterations', 'maxiter', '10')
          ]),
          group('bfgs', 'Градиентный метод (BFGS)', [field('bfgsTolerance', 'tol', '0.0001'), field('bfgsMaxIterations', 'maxiter', '100')]),
          group('powell', 'Метод Пауэлла', [field('powellTolerance', 'tol', '0.0001'), field('powellMaxEvaluations', 'maxfev', '100')])
        ])
      ]
    },
    reservoir: {
      title: 'Описание пласта',
      rows: [
        group('hydrodynamicModel', 'ГДМ', [
          flag('gridDimensions', 'Размерность сетки (DIMENS)'),
          flag('mergeLayers', 'Объединить слои (CRD2PEBI)', false, { value: '/' }),
          action('reservoirGeometry', 'Геометрия пласта (GRID)', 'Загрузить', { checked: false }),
          field('geometryFile', 'Файл геометрии пласта', '', { disabled: true }),
          action('petrophysicalProperties', 'Петрофизические свойства (GRID)', 'Загрузить', { checked: false }),
          choice('petrophysicalFiles', 'Файлы петрофизических свойств', 'Файлов: 0'),
          action('relativePermeabilityEndpoints', 'Концевые точки ОФП (PROPS)', 'Загрузить', { checked: false }),
          choice('endpointFiles', 'Файлы концевых точек', 'Файлов: 0')
        ], { checked: false, action: 'Загрузить', strong: true }),
        group('reservoirLayer', 'Пласт', [
          group('permeability', 'Проницаемость, мД', [field('permeabilityValue', 'Постоянное значение', '2.0'), action('permeabilityMap', 'Карта проницаемости: PERMX_0.grd', 'Загрузить', { checked: true })]),
          group('effectiveThickness', 'Эфф. толщина, м', [field('effectiveThicknessValue', 'Постоянное значение', '3.0'), action('effectiveThicknessMap', 'Карта эфф. толщины: DZNET_0.grd', 'Загрузить', { checked: true })]),
          group('porosity', 'Пористость, д.е.', [field('porosityValue', 'Постоянное значение', '0.2'), action('porosityMap', 'Карта пористости: PORO_0.grd', 'Загрузить', { checked: true })]),
          group('waterSaturation', 'Начальная водонасыщенность, д.е.', [field('waterSaturationValue', 'Постоянное значение', '0.3'), action('waterSaturationMap', 'Карта нач. водонасыщенности: SWAT_v2.gr…', 'Загрузить', { checked: true })]),
          group('gasSaturation', 'Начальная газонасыщенность, д.е.', [field('gasSaturationValue', 'Постоянное значение', '0.0'), action('gasSaturationMap', 'Карта нач. газонасыщенности', 'Загрузить', { checked: false })]),
          group('layerBase', 'Структурная подошва слоя, м', [field('layerThickness', 'Толщина слоя', '27.8643'), action('baseMap', 'Карта подошвы', 'Загрузить', { checked: false })]),
          group('initialPressure', 'Начальное давление, бар', [field('initialPressureValue', 'Постоянное значение', '250.0'), action('initialPressureMap', 'Карта нач. давления: PRESSURE_0.grd', 'Загрузить', { checked: true })]),
          group('permeabilityAnisotropy', 'Неоднородность проницаемости', [field('permeabilityXZ', 'Отношение Kx/Kz', '10.0'), field('permeabilityXY', 'Отношение Kx/Ky', '1.0')]),
          field('layerCount', 'Количество слоев', '2', { strong: true }),
          group('structuralSurface', 'Структурная поверхность', [group('topSurface', 'Кровля, м', [field('topSurfaceValue', 'Постоянное значение', '405.3'), action('topSurfaceMap', 'Карта кровли: Z_0.grd', 'Загрузить', { checked: true })])]),
          group('maximumOilPermeability', 'Макс. отн. проницаемость (KRO/KRORW/KRORG)', [field('maximumOilPermeabilityValue', 'Постоянное значение KRO', '1.0')])
        ], { value: 'Слой 1', options: ['Слой 1'], strong: true })
      ]
    },
    initialization: {
      title: 'Инициализация',
      rows: [
        group('regionType', 'Тип региона', [
          action('regionImport', 'Импорт из файла (REGIONS)', 'Загрузить', { radio: 'regionSource', checked: false }),
          action('regionMap', 'Карта регионов', 'Загрузить', { radio: 'regionSource', checked: false }),
          flag('mergedLayers', 'Объединение слоев (CRD2PEBI)', false, { radio: 'regionSource' }),
          choice('copyRegion', 'Копировать из', 'Флюидов (PVT)', { radio: 'regionSource', checked: false })
        ], { value: 'ОФП зависимостей (SAT)', options: ['ОФП зависимостей (SAT)'], strong: true }),
        group('pvt', 'Свойства флюидов PVT', [
          group('oil', 'Нефть', [
            group('oilProperties', 'PVT свойства', [
              group('pvcdo', 'PVCDO', [field('oilReferencePressure', 'Опорное давление, бар', '59.0'), field('oilVolumeFactor', 'Объемный коэфф., м3/м3', '1.024'), field('oilCompressibility', 'Сжимаемость, 1/бар', '0.0001'), field('oilViscosity', 'Вязкость, сП', '49.0')]),
              group('oilTable', 'Табличный вид: PVDO_23.INC', [action('oilTableLoad', 'PVDO')], { checked: true })
            ]),
            field('oilDensity', 'Плотность, т/м3 с. у.', '0.8833'), field('gasOilRatio', 'Газосодержание: RSCONST, м3/м3', '8.346'),
            group('oilGasMixture', 'Параметры смеси газа и нефти', [field('bubblePressure', 'Давление насыщения: PBUB, бар', '20.0'), field('initialOilContent', 'Нач-е нефтесодер-е: RV, м3/м3', '0.0001')]),
            field('oilCriticalGradient', 'Критический градиент, бар/м', '0.0')
          ], { checked: true }),
          group('water', 'Вода', [
            group('waterProperties', 'PVT свойства', [group('pvtw', 'PVTW', [
              field('waterReferencePressure', 'Опорное давление, бар', '22.9'), field('waterVolumeFactor', 'Объемный коэфф., м3/м3', '0.99876'),
              field('waterCompressibility', 'Сжимаемость, 1/бар', '3.5947e-05'), field('waterViscosity', 'Вязкость, сП', '0.82536')
            ])]),
            field('waterDensity', 'Плотность, т/м3 с. у.', '1.1000999999999999'), field('waterCriticalGradient', 'Критический градиент, бар/м', '0.0')
          ], { checked: true }),
          group('gas', 'Газ', [group('gasProperties', 'PVT свойства', [group('gasTable', 'Табличный вид', [], { checked: false, unavailable: true })])], { checked: false })
        ], { value: 'Регион PVT 1', options: ['Регион PVT 1'], strong: true })
      ]
    },
    completion: {
      title: 'Заканчивание',
      rows: [
        group('producers', 'Добывающие', [
          group('producerControl', 'Режим управления', [
            field('producerTarget', 'Значение для соотв. режима', '100.0'),
            action('producerTimeDependence', 'Зависимость от времени', 'Загрузить', { checked: false }),
            action('producerVfpLoad', 'Загрузка VFP таблиц (VFPPROD)'),
            flag('producerVfp', 'Использование VFP таблицы', false, { value: '1' })
          ], { value: 'Дебит, (тыс.) м3/сут', options: ['Дебит, (тыс.) м3/сут'] }),
          group('producerLimits', 'Ограничения', [
            field('minimumBottomPressure', 'Минимальное заб. давление, бар', '20.0'), field('minimumWellheadPressure', 'Минимальное устьевое давление, бар', '0.0'),
            field('maximumProductionRate', 'Макс. дебит, (тыс.) м3/сут', '10000.0', { disabled: true }),
            flag('maximumDrawdown', 'Максимальная депрессия, бар', false, { value: '100.0' })
          ]),
          field('producerSkin', 'Скин фактор (ННС без ГРП)', '0.0'), field('producerRadius', 'Радиус скважины, м', '0.1'),
          choice('producerType', 'Тип скважины', 'ГС'), group('fractureParameters', 'Параметры трещины', [], { unavailable: true }),
          group('horizontalParameters', 'Параметры гор. скважины/осн. ствола', [], { unavailable: true }),
          field('producerAvailability', 'Коэфф. эксплуатации, д.е.', '1.0'),
          group('producerConnection', 'Коэфф. связи (WPIMULT)', [field('producerConnectionValue', 'Постоянное значение', '1.0'), action('producerConnectionTime', 'Зависимость от времени', 'Загрузить', { checked: false })]),
          field('producerDFactor', 'D-фактор (для газа)', '0.0'),
          group('perforation', 'Задание перфораций и интервала ГРП', [choice('perforationLayer', 'Перфорации', 'Слой 1', { checked: false }), group('fractureInterval', 'Интервал ГРП', [], { checked: false, unavailable: true })]),
          group('productivityDegradation', 'Деградация продуктивности', [choice('degradationFunction', 'Тип функции', 'Exp'), field('degradationK', 'Параметр k', '0.1'), field('degradationA', 'Параметр a', '0.1')], { checked: false }),
          choice('gasInflow', 'Уравнение притока (для газа)', 'STD')
        ], { rightCheck: 'Газовая скважина', checked: false, strong: true }),
        group('injectors', 'Нагнетательные', [
          group('injectorControl', 'Режим управления', [
            field('injectorTarget', 'Значение для соотв. режима', '400.0'), action('injectorTimeDependence', 'Зависимость от времени', 'Загрузить', { checked: false }),
            action('injectorVfpLoad', 'Загрузка VFP таблиц (VFPINJ)'), flag('injectorVfp', 'Использование VFP таблицы', false, { value: '1' })
          ], { value: 'Забойное давление, бар', options: ['Забойное давление, бар'] }),
          group('injectorLimits', 'Ограничения', [field('maximumBottomPressure', 'Максимальное заб. давление, бар', '500.0', { disabled: true }), field('maximumWellheadPressure', 'Максимальное устьевое давление, бар', '10000.0'), field('maximumInjectionRate', 'Макс. дебит, (тыс.) м3/сут', '10000.0')]),
          field('injectorSkin', 'Скин фактор (ННС без ГРП)', '0.0'), field('injectorRadius', 'Радиус скважины, м', '0.1')
        ], { rightCheck: 'Газовая скважина', checked: false, strong: true })
      ]
    },
    economics: {
      title: 'Экономика',
      rows: [
        group('economicIndicators', 'Экономические показатели', [
          field('oilPrice', 'Цена нефти/конд., руб/т', '10000.0'), action('oilPriceHistory', 'Цена нефти/конд. по годам', 'Загрузить', { checked: false }),
          field('discountRate', 'Ставка дисконтирования, д.е. в год', '0.1'),
          group('depreciationPeriod', 'Срок амортизации, годы', [field('wellDepreciation', 'Скважины', '7'), field('equipmentDepreciation', 'ОНСС', '4'), field('infrastructureDepreciation', 'Обустройство', '10')]),
          field('oilLoss', 'Потери нефти, %', '0.0'), field('gasPrice', 'Цена ПНГ/газа, руб/тыс. м3', '500.0'),
          action('gasPriceHistory', 'Цена ПНГ/газа по годам', 'Загрузить', { checked: false }), field('gasSales', 'ПНГ/газ к реализации, %', '100.0')
        ], { strong: true }),
        group('capitalCosts', 'Капитальные расходы', [
          group('drilling', 'Бурение', [
            field('verticalWellCost', 'Стоимость ННС, млн. руб/скв', '50.0'), field('horizontalWellCost', 'Стоимость ГС, млн. руб/скв', '100.0'),
            group('lengthDrillingCost', 'Стоимость ГС от длины ствола', [field('verticalSectionCost', 'Стоимость верт. уч-ка, млн. руб', '0.0')], { checked: false, action: 'Загрузить' }),
            field('rigMobilization', 'Мобил-я станка, млн. руб/станок', '50.0')
          ]),
          group('infrastructure', 'Обустройство', [
            field('wellInfrastructureCost', 'Скважина, млн. руб/скв', '5.0'),
            group('padCost', 'Куст, млн. руб/куст', [field('newPadCost', 'Новый', '200.0'), field('existingPadCost', 'Старый', '20.0'), field('padPressureMaintenance', 'Затраты на ППД', '0.0')]),
            group('fieldCost', 'Месторождение, млн. руб', [field('totalPressureMaintenance', 'Общие затраты на ППД', '0.0')], { value: '0.0' }),
            field('liquidCapacityCost', 'Qlmax, млн. руб/(тыс. т/год)', '0.0'), field('oilCapacityCost', 'Qomax, млн. руб/(тыс. т/год)', '0.0'),
            field('wellEquipmentCost', 'ОНСС, млн. руб/скв', '2.5'), field('processingUnitCost', 'УКПГ, млн. руб/уст', '1000.0', { disabled: true }),
            group('pipelineCost', 'Стоимость трубопровода, руб/км', [], { value: '13810.1', disabled: true, unavailable: true })
          ]),
          group('hydraulicFracturing', 'ГРП', [field('fractureStageCost', 'Стоим-ть стадии ГРП, млн. руб/стад.', '4.0'), action('fractureStageCostCurve', 'Стоимость ГРП от к-ва стадий', 'Загрузить', { checked: false }), group('proppantAccounting', 'Учет проппанта', [], { checked: false, unavailable: true })])
        ], { strong: true }),
        group('operatingCosts', 'Операционные расходы', [group('productionInjectionCosts', 'Затраты на добычу/закачку', [field('liquidProductionCost', 'Добыча жидкости, руб/т', '40.0'), field('oilProductionCost', 'Добыча нефти/конд., руб/т', '30.0'), field('waterProductionCost', 'Добыча воды, руб/т', '5.0')])], { strong: true })
      ]
    },
    gathering: {
      title: 'Сеть сбора',
      rows: [group('automaticNetwork', 'Автоматическая конф-я сети сбора', [
        choice('networkType', 'Тип сети', 'Лучевая'),
        group('processingUnit', 'УКПГ', [
          group('manualCoordinates', 'Ручное задание координат', [field('unitX', 'X', '284909.71', { italic: true }), field('unitY', 'Y', '5290979.25', { italic: true })], { checked: false }),
          group('unitPressure', 'Давление на УКПГ', [field('unitPressureValue', 'Постоянное значение', '50.0'), action('unitPressureTime', 'Зависимость от времени', 'Загрузить', { checked: false })], { italic: true }),
          field('temperature', 'Температура, C', '10.0', { italic: true }),
          group('maximumUnitRate', 'Макс. дебит, млн. м3/сут', [field('unitRate', 'Постоянное значение', '-1.0'), action('unitRateTime', 'Зависимость от времени', 'Загрузить', { checked: false })], { italic: true }),
          field('unitCount', 'Количество УКПГ', '1'),
          group('maximumTotalRate', 'Общий макс. дебит, млн. м3/сут', [field('totalRate', 'Постоянное значение', '-1.0'), action('totalRateTime', 'Зависимость от времени', 'Загрузить', { checked: false })])
        ], { value: 'УКПГ 1', options: ['УКПГ 1'] }),
        group('pipeline', 'Газопровод', [
          group('flowline', 'Шлейф', [choice('flowlineDiameter', 'Диаметр(х)толщина, мм', '1: 114x10'), field('flowlineRoughness', 'Коэфф. шероховатости, м', '0.0001'), action('applyAllPads', 'Задать для всех кустов', 'Применить'), group('pad', 'Куст', [action('applyPad', 'Задать для куста', 'Применить')], { value: '1', options: ['1'] })]),
          group('collector', 'Коллектор', [field('collectorCount', 'Количество, шт', '1', { italic: true }), choice('collectorDiameter', 'Диаметр(х)толщина, мм', '1: 114x10'), field('collectorRoughness', 'Коэфф. шероховатости, м', '0.0001'), action('applyAllCollectors', 'Задать для всех коллекторов', 'Применить'), group('selectedCollector', 'Коллектор', [action('applyCollector', 'Задать для коллектора', 'Применить')], { value: '1', options: ['1'] })]),
          flag('showLengths', 'Отобразить длины'), flag('showRoughness', 'Отобразить коэф-ты шерох-ти')
        ]),
        group('choke', 'Штуцер', [choice('chokeDiameter', 'Диаметр, мм', '1: -1'), action('applyAllChokes', 'Задать для всех скважин', 'Применить'), group('chokePad', 'Куст', [action('applyPadChokes', 'Задать для скважин куста', 'Применить'), group('chokeWell', 'Скважина', [action('applyWellChoke', 'Задать для скважины куста', 'Применить')], { value: '1p', options: ['1p'] })], { value: '1', options: ['1'] }), flag('showChokes', 'Отобразить штуцеры')])
      ], { checked: false, strong: true })]
    }
  };

  const panels = new Map();
  const states = new Map();
  const rowsByPage = new Map();
  const flatten = (rows, depth = 0, parents = []) => rows.flatMap(row => [{ ...row, depth, parents }, ...flatten(row.children || [], depth + 1, [...parents, row.id])]);
  const clone = value => JSON.parse(JSON.stringify(value));

  function initializeState(pageId) {
    const rows = flatten(definitions[pageId].rows);
    const values = {};
    rows.forEach(row => {
      if (row.value !== undefined) values[`${row.id}.value`] = row.value;
      if (row.checked !== undefined) values[`${row.id}.checked`] = row.checked;
    });
    rowsByPage.set(pageId, rows);
    states.set(pageId, { values, collapsed: rows.filter(row => row.unavailable || row.collapsed).map(row => row.id) });
  }

  function emitChange(pageId, fieldId) {
    const panel = panels.get(pageId);
    panel?.dispatchEvent(new CustomEvent('numex:page-change', { bubbles: true, detail: { pageId, fieldId, values: { ...states.get(pageId).values } } }));
  }

  function refreshPanel(pageId) {
    const panel = panels.get(pageId);
    if (!panel) return;
    const state = states.get(pageId);
    for (const row of rowsByPage.get(pageId)) {
      const element = panel.querySelector(`[data-row-id="${row.id}"]`);
      element.hidden = row.parents.some(parent => state.collapsed.includes(parent));
      element.querySelector('.numex-tree-toggle')?.setAttribute('aria-expanded', String(!state.collapsed.includes(row.id)));
    }
    panel.querySelectorAll('[data-field-id]').forEach(control => {
      const value = state.values[control.dataset.fieldId];
      if (control.type === 'checkbox' || control.type === 'radio') control.checked = value;
      else control.value = value;
    });
  }

  function createPanel(pageId) {
    if (!definitions[pageId]) throw new Error(`Unknown NUMEX page: ${pageId}`);
    if (panels.has(pageId)) return panels.get(pageId);
    const panel = document.createElement('section');
    panel.className = 'numex-page';
    panel.dataset.pageId = pageId;
    panel.setAttribute('aria-label', definitions[pageId].title);
    const table = document.createElement('table');
    table.className = 'numex-property-table';
    table.setAttribute('aria-label', definitions[pageId].title);
    table.innerHTML = '<colgroup><col class="numex-label-column"><col></colgroup><thead><tr><th>Параметры</th><th>Значения</th></tr></thead><tbody></tbody>';
    const body = table.querySelector('tbody');
    for (const row of rowsByPage.get(pageId)) {
      const element = document.createElement('tr');
      element.dataset.rowId = row.id;
      element.classList.toggle('numex-strong-row', !!row.strong);
      element.classList.toggle('numex-italic-row', !!row.italic);
      element.classList.toggle('numex-disabled-row', !!row.unavailable || !!row.disabled);
      element.addEventListener('click', () => {
        panel.querySelectorAll('.numex-selected-row').forEach(selected => selected.classList.remove('numex-selected-row'));
        element.classList.add('numex-selected-row');
      });
      const labelCell = document.createElement('td');
      const labelLine = document.createElement('div');
      labelLine.className = 'numex-property-label';
      labelLine.style.paddingLeft = `${row.depth * 20 + 3}px`;
      if (row.children) {
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'numex-tree-toggle';
        toggle.setAttribute('aria-label', `${row.label}: свернуть или развернуть`);
        toggle.disabled = !!row.unavailable || row.children.length === 0;
        toggle.addEventListener('click', () => {
          const state = states.get(pageId);
          state.collapsed = state.collapsed.includes(row.id) ? state.collapsed.filter(id => id !== row.id) : [...state.collapsed, row.id];
          refreshPanel(pageId);
          emitChange(pageId, row.id);
        });
        labelLine.append(toggle);
      } else {
        const spacer = document.createElement('span');
        spacer.className = 'numex-tree-spacer';
        labelLine.append(spacer);
      }
      const valueCell = document.createElement('td');
      const label = document.createElement('label');
      label.title = row.label;
      if (row.checked !== undefined && !row.rightCheck) label.append(createControl(pageId, row, 'checked'));
      label.append(document.createTextNode(row.label));
      if (row.value !== undefined) label.htmlFor = `numex-${pageId}-${row.id}`;
      labelLine.append(label);
      labelCell.append(labelLine);
      if (row.rightCheck) {
        const rightLabel = document.createElement('label');
        rightLabel.className = 'numex-right-check';
        rightLabel.append(createControl(pageId, row, 'checked'), document.createTextNode(row.rightCheck));
        valueCell.append(rightLabel);
      } else if (row.action) {
        const button = document.createElement('button');
        button.className = 'numex-property-action';
        button.textContent = row.action;
        button.disabled = true;
        valueCell.append(button);
      } else if (row.value !== undefined) valueCell.append(createControl(pageId, row, 'value'));
      element.append(labelCell, valueCell);
      body.append(element);
    }
    panel.append(table);
    panels.set(pageId, panel);
    refreshPanel(pageId);
    return panel;
  }

  function createControl(pageId, row, kind) {
    const control = document.createElement(kind === 'value' && row.options ? 'select' : 'input');
    control.dataset.fieldId = `${row.id}.${kind}`;
    control.setAttribute('aria-label', row.rightCheck && kind === 'checked' ? `${row.label}: ${row.rightCheck}` : row.label);
    if (kind === 'checked') {
      control.type = row.radio ? 'radio' : 'checkbox';
      if (row.radio) control.name = `numex-${pageId}-${row.radio}`;
      control.disabled = !!row.unavailable || !!row.disabled;
    } else {
      control.id = `numex-${pageId}-${row.id}`;
      control.className = 'numex-property-value';
      if (row.options) {
        row.options.forEach(value => control.add(new Option(value, value)));
        control.disabled = row.options.length < 2 || !!row.disabled;
      } else {
        control.type = 'text';
        control.inputMode = 'decimal';
        control.maxLength = 499;
        control.disabled = !!row.disabled;
        control.addEventListener('input', () => {
          states.get(pageId).values[`${row.id}.value`] = control.value;
          emitChange(pageId, `${row.id}.value`);
        });
      }
    }
    control.addEventListener('change', () => {
      const state = states.get(pageId);
      if (kind === 'checked' && row.radio) rowsByPage.get(pageId).filter(candidate => candidate.radio === row.radio).forEach(candidate => state.values[`${candidate.id}.checked`] = candidate.id === row.id);
      else state.values[`${row.id}.${kind}`] = kind === 'checked' ? control.checked : control.value;
      refreshPanel(pageId);
      emitChange(pageId, `${row.id}.${kind}`);
    });
    return control;
  }

  function getState() {
    return Object.fromEntries([...states].map(([pageId, state]) => [pageId, clone(state)]));
  }

  function validateState(nextState) {
    if (!nextState || typeof nextState !== 'object' || Array.isArray(nextState)) throw new Error('Некорректные параметры разделов.');
    const changes = [];
    for (const [pageId, incoming] of Object.entries(nextState)) {
      if (!definitions[pageId]) continue;
      if (!incoming || typeof incoming !== 'object' || !incoming.values || typeof incoming.values !== 'object' || Array.isArray(incoming.values)) throw new Error('Некорректные параметры раздела.');
      const current = clone(states.get(pageId));
      for (const [key, value] of Object.entries(incoming.values)) {
        if (!Object.hasOwn(current.values, key)) continue;
        if (typeof value !== typeof current.values[key] || (typeof value === 'string' && value.length >= 500)) throw new Error('Некорректное значение параметра.');
        const row = rowsByPage.get(pageId).find(candidate => `${candidate.id}.value` === key);
        if (row?.options && !row.options.includes(value)) continue;
        current.values[key] = value;
      }
      if (incoming.collapsed !== undefined) {
        if (!Array.isArray(incoming.collapsed) || incoming.collapsed.some(id => typeof id !== 'string')) throw new Error('Некорректное состояние раздела.');
        current.collapsed = incoming.collapsed.filter(id => rowsByPage.get(pageId).some(row => row.id === id && row.children));
      }
      const radioGroups = new Set(rowsByPage.get(pageId).map(row => row.radio).filter(Boolean));
      for (const name of radioGroups) {
        if (rowsByPage.get(pageId).filter(row => row.radio === name && current.values[`${row.id}.checked`]).length > 1) throw new Error('В группе можно выбрать только один вариант.');
      }
      changes.push([pageId, current]);
    }
    return changes;
  }

  function setState(nextState) {
    validateState(nextState).forEach(([pageId, state]) => { states.set(pageId, state); refreshPanel(pageId); emitChange(pageId); });
  }

  function resetState() {
    Object.keys(definitions).forEach(pageId => {
      initializeState(pageId);
      refreshPanel(pageId);
      if (panels.has(pageId)) {
        const panel = panels.get(pageId);
        panel.scrollTop = 0;
        panel.querySelectorAll('.numex-selected-row').forEach(selected => selected.classList.remove('numex-selected-row'));
      }
    });
  }

  Object.keys(definitions).forEach(initializeState);
  window.NUMEXPages = { createPanel, getState, validateState, setState, resetState };
})();
