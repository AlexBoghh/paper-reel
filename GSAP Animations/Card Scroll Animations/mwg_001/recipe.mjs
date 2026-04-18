export const id = 'mwg_001';
export const name = 'Card stack';
export const category = 'CARD SCROLL';
// Note: plan signature `cardsContainer.clientWidth - window.innerWidth` omitted the `_${id}`
// disambiguation suffix that `generate()` applies to every locally-scoped variable.
// Signature adjusted to match the actual emission shape; same-precedent as the easings tests.
export const signatures = [
  'pin: true',
  'containerAnimation: scrollTween',
  'scrub: true',
  '.clientWidth - window.innerWidth'
];
export const requiredOpts = {
  containerSelector: 'string — pinned outer container, e.g. ".features"',
  cardsContainerSelector: 'string — horizontal cards track, e.g. ".features .cards"',
  cardSelector: 'string — individual card, e.g. ".features .card"'
};
export const defaultOpts = {
  jitterX: 40,    // 30..50, mwg_001 default range
  jitterY: 13,    // 10..16
  jitterRot: 15   // 10..20
};
export const meaningfulParams = ['pin', 'scrub', 'ease', 'start', 'end'];
export const contentShape = {
  cards: 'array of { label: string, image?: url } — 5-8 cards; mwg_001 colors the first 7 via :nth-child'
};

export function generate(opts) {
  const { containerSelector, cardsContainerSelector, cardSelector,
          jitterX, jitterY, jitterRot } =
    { ...defaultOpts, ...opts };
  return `
const container_${id} = document.querySelector('${containerSelector}');
const cardsContainer_${id} = container_${id}.querySelector('${cardsContainerSelector.replace(containerSelector, '').trim() || cardsContainerSelector}');
const cards_${id} = container_${id}.querySelectorAll('${cardSelector.replace(containerSelector, '').trim() || cardSelector}');
const distance_${id} = cardsContainer_${id}.clientWidth - window.innerWidth;

const scrollTween_${id} = gsap.to(cardsContainer_${id}, {
  x: -distance_${id},
  ease: 'none',
  scrollTrigger: {
    trigger: container_${id},
    pin: true,
    scrub: true,
    start: 'top top',
    end: '+=' + distance_${id}
  }
});

cards_${id}.forEach(card => {
  const v = {
    x: (Math.random() * 20 + ${jitterX - 10}) * (Math.random() < 0.5 ? 1 : -1),
    y: (Math.random() * 6  + ${jitterY - 3}) * (Math.random() < 0.5 ? 1 : -1),
    rotation: (Math.random() * 10 + ${jitterRot - 5}) * (Math.random() < 0.5 ? 1 : -1)
  };
  gsap.fromTo(card,
    { rotation: v.rotation, xPercent: v.x, yPercent: v.y },
    { rotation: -v.rotation, xPercent: -v.x, yPercent: -v.y, ease: 'none',
      scrollTrigger: { trigger: card, containerAnimation: scrollTween_${id},
        start: 'left 120%', end: 'right -20%', scrub: true } });
});
`;
}

export function generateMarkup(opts, content = {}) {
  const container = stripDot(opts.containerSelector);
  const cardsContainer = stripDot(opts.cardsContainerSelector);
  const card = stripDot(opts.cardSelector);
  const cards = Array.isArray(content.cards) && content.cards.length
    ? content.cards
    : [{ label: 'card 1' }, { label: 'card 2' }, { label: 'card 3' },
       { label: 'card 4' }, { label: 'card 5' }, { label: 'card 6' }];
  const cells = cards.map(c => {
    const label = (c && c.label) || 'card';
    const img = c && c.image
      ? `      <img src="${c.image}" alt="">\n`
      : '';
    return `    <div class="${card}">
${img}      <div class="card-content">
        <h2>${label}</h2>
      </div>
    </div>`;
  }).join('\n');
  return `<!-- mwg_001 markup contract -->
<section class="${container}">
  <div class="${cardsContainer}" style="display:flex;flex-wrap:nowrap">
${cells}
  </div>
</section>`;
}

export function generateCSS(opts) {
  const { containerSelector, cardsContainerSelector, cardSelector } =
    { ...defaultOpts, ...opts };
  return `
${containerSelector} {
    overflow: hidden;
    position: relative;
}
${containerSelector} .scroll {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
${containerSelector} .header {
    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;
    font: 500 normal clamp(12px, 0.9vw, 100px) / normal 'IBM Plex Mono', monospace;
    text-transform: uppercase;
    padding: 25px;
    top: 0;
    left: 0;
}
${containerSelector} .header > * {
    flex: 1;
}
${containerSelector} .header > *:nth-child(2) {
    text-align: center;
}
${containerSelector} .header > *:nth-child(3) {
    text-align: right;
}
${containerSelector} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
    width: 100%;
    font-size: clamp(12px, 1vw, 20px);
}
${cardsContainerSelector} {
    display: flex;
    width: max-content;
    white-space: nowrap;
    gap: 1vw;
    will-change: transform;
    padding: 0 120vw;
}
${cardSelector} {
    position: relative;
    width: 25vw;
    min-width: 280px;
    aspect-ratio: 0.75;
    border-radius: 2vw;
    overflow: hidden;
    object-fit: cover;
    text-align: center;
    text-transform: uppercase;
    border: 0.5vw solid currentColor;
}
${cardSelector} img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}
${cardSelector} .card-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}
${cardSelector} .card-content p {
    display: flex;
    justify-content: space-between;
    padding: 0.5em 1em;
}
${cardSelector} .from {
    border: 0.2em solid currentColor;
    border-radius: 100%;
    padding: 0.28em 0.3em 0.12em;
}
${cardSelector} .card-content h2 {
    font: 800 normal 4.5vw/0.8 'Inter', sans-serif;
    text-wrap: auto;
    padding: 0.2em 0 0.12em;
}
${cardSelector}:nth-child(1) { color: #BCEFFF; }
${cardSelector}:nth-child(2) { color: #C9FE6E; }
${cardSelector}:nth-child(3) { color: #FAFF9E; }
${cardSelector}:nth-child(4) { color: #FC4C3B; }
${cardSelector}:nth-child(5) { color: #F1F1F1; }
${cardSelector}:nth-child(6) { color: #8CEDFF; }
${cardSelector}:nth-child(7) { color: #FAFF9E; }

@media (max-width: 900px) {
    ${containerSelector} .header {
        flex-direction: column;
        padding: 15px;
    }
    ${cardsContainerSelector} {
        padding: 0 140vw;
    }
    ${cardSelector} {
        border: 6px solid currentColor;
        border-radius: 23px;
    }
    ${cardSelector} .card-content h2 {
        font-size: 54px;
    }
}
`;
}

export function defaultPrimitives(opts) {
  return [
    { kind: 'translateX', selector: opts.cardsContainerSelector,
      from: 0, to: 'auto', ease: 'none' }
  ];
}

function stripDot(s) {
  const parts = (s || '').trim().split(/\s+/);
  const last = parts[parts.length - 1] || '';
  return last.replace(/^\./, '');
}
