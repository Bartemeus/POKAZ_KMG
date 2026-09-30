// Visible East Moldabek well-table fixture reconstructed from the supplied image.
// This replaces the Uaz demo cards only in ?focus=wells; the rest of the portal stays intact.
if (new URLSearchParams(location.search).get('focus') === 'wells') {
  document.documentElement.classList.add('wells-focus');
  const rows = `
VMB_2777|28|36.63|20|20%|g
VMB_2746|30|29.80|19|30%|n
VMB_2783|30|41.00|19|30%|g
VMB_2787|35|37.48|19|40%|n
VMB_2769|30|54.80|15|45%|g
VMB_2788|20|15.05|15|20%|r
VMB_2791|20|2.70|15|20%|r
VMB_2795|22|50.66|15|25%|g
VMB_2796|22|233.00|15|25%|g
VMB_2790|20|7.03|14|25%|r
VMB_1286|105|107.74|14|85%|n
VMB_2789|20|21.07|14|25%|n
VMB_2744|35|35.32|14|55%|n
VMB_2757|30|26.37|14|50%|y
VMB_2759|40|40.80|14|60%|n
VMB_2772|24|146.04|14|35%|g
VMB_2793|20|12.88|14|25%|r
VMB_2004|75|81.80|13|80%|n
VMB_2024|95|103.46|13|85%|n
VMB_0406|100|104.06|13|85%|n
VMB_2741|50|65.50|13|70%|g
VMB_2770|25|36.50|13|45%|g
VMB_2703|95|103.04|12|85%|n
VMB_2743|45|46.50|12|70%|n
VMB_2781|27|36.40|12|50%|g
VMB_0220|25|26.25|11|50%|n
VMB_2775|20|2.12|11|40%|m
VMB_0605|90|72.82|11|86%|y
VMB_2745|15|7 430.67|10|30%|g
VMB_2748|20|10.39|10|45%|r
VMB_2773|15|18.50|10|30%|g
VMB_2780|20|24.82|10|45%|g
VMB_2786|25|58.97|10|55%|g
VMB_2035|50|9.00|9|80%|m
VMB_0401|100|90.91|9|90%|n
VMB_0418|100|93.00|9|90%|l
VMB_0423|65|67.23|9|85%|n
VMB_2758|15|17.10|9|35%|n
VMB_2764|40|11.37|9|75%|m
VMB_0615|30|36.33|9|65%|g
VMB_2655|80|85.50|8|88%|n
VMB_0417|45|71.00|8|80%|g
  `.trim().split('\n');
  const tones = { g: 'success-evaluate', n: '', r: 'danger-evaluate',
    y: 'warning-evaluate', m: 'focus-muted-red', l: 'instop-evaluate' };
  const table = document.getElementById('normTable');
  const cards = rows.map((row, index) => {
    const [name, fluid, measured, oil, water, tone] = row.split('|');
    const card = document.createElement('div');
    card.className = `normative-cell ${tones[tone]}`;
    card.id = name;
    card.dataset.id = name;
    card.dataset.i = index;
    card.dataset.title = `Скважина ${name}`;
    card.innerHTML = `<div class="well-number">${name}</div><div class="tech-mode-fluid">${fluid}</div>`
      + `<div class="tech-mode-oil">${oil}</div><div class="water-loading">${water}</div>`
      + `<div class="evaluate">${measured}</div>`;
    return card;
  });
  table.replaceChildren(...cards, document.createElement('div'));
  table.lastElementChild.className = 'clearfix';

  const counts = [
    ['.norm_border1', ['14', '77', '19']],
    ['.norm_border2', ['3.8%', '20.8%', '5.1%']],
    ['.norm_border3', ['107', '127', '27']],
    ['.norm_border4', ['28.8%', '34.2%', '7.3%']],
  ];
  for (const [selector, values] of counts) {
    document.querySelectorAll(`#normativeTable ${selector}`).forEach((element, index) => {
      element.textContent = values[index];
    });
  }
}
