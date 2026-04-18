export const id = 'mwg_007';
export const name = 'Rounded trajectory';
export const category = 'CARD SCROLL';
export const signatures = [
  'rotation: 30',
  'rotation: -30',
  'power2.inOut',
  'stagger: 0.06',
  'pin: container'
];
export const requiredOpts = {
  rootSelector: 'string — outer effect root, e.g. ".mwg_effect007"',
  pinHeightSelector: 'string — scroll-height driver inside root, e.g. ".pin-height"',
  containerSelector: 'string — pinned container inside root, e.g. ".container"',
  circleSelector: 'string — each circle/card, e.g. ".circle"'
};
export const defaultOpts = {
  startRot: 30,
  endRot: -30,
  staggerEach: 0.06
};
export const meaningfulParams = ['pin', 'scrub', 'ease', 'stagger'];
export const contentShape = {
  cards: 'array of { label: string, image?: url } — 5-8 cards arrayed along the arc'
};

export function generate(opts) {
  const { rootSelector, pinHeightSelector, containerSelector, circleSelector,
          startRot, endRot, staggerEach } =
    { ...defaultOpts, ...opts };
  return `
const root_${id} = document.querySelector('${rootSelector}');
const pinHeight_${id} = root_${id}.querySelector('${stripPrefix(pinHeightSelector, rootSelector)}');
const container_${id} = root_${id}.querySelector('${stripPrefix(containerSelector, rootSelector)}');
const circles_${id} = root_${id}.querySelectorAll('${stripPrefix(circleSelector, rootSelector)}');

ScrollTrigger.create({
  trigger: pinHeight_${id},
  start: 'top top',
  end: 'bottom bottom',
  pin: container_${id}
});

gsap.fromTo(circles_${id}, {
  rotation: ${startRot}
}, {
  rotation: ${endRot},
  ease: 'power2.inOut',
  stagger: ${staggerEach},
  scrollTrigger: {
    trigger: pinHeight_${id},
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
});
`;
}

export function generateMarkup(opts, content = {}) {
  const circle = stripDot(opts.circleSelector);
  const cards = Array.isArray(content.cards) && content.cards.length
    ? content.cards
    : [{ label: 'circle' }];
  const circles = cards.map(c => {
    const label = (c && c.label) || 'circle';
    const img = c && c.image
      ? `<img class="media" src="${c.image}" alt="">`
      : '';
    return `      <div class="${circle}">${img}${label}</div>`;
  }).join('\n');
  return `<!-- mwg_007 markup contract -->
<section class="${stripDot(opts.rootSelector)}">
  <div class="${stripDot(opts.pinHeightSelector)}">
    <div class="${stripDot(opts.containerSelector)}">
${circles}
      <!-- repeat 5-8 circles -->
    </div>
  </div>
</section>`;
}

export function generateCSS(opts) {
  const { rootSelector, pinHeightSelector, containerSelector, circleSelector } =
    { ...defaultOpts, ...opts };
  return `
${rootSelector} .scroll {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
${rootSelector} .header {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 25px;
    left: 0;
    font: 500 normal 13px/0.9 'IBM Plex Mono', monospace;
    text-transform: uppercase;
}
${pinHeightSelector} {
    height: 400vh;
}
${containerSelector} {
    position: relative;
    height: 100vh;
    overflow: hidden;
}
${circleSelector} {
    width: 300%;
    aspect-ratio: 1;
    position: absolute;
    top: 50%;
    left: -100%;
}
${rootSelector} .media {
    width: 25vw;
    aspect-ratio: 0.74;
    border-radius: 0.6vw;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%,-50%);
}

@media (max-width: 768px) {
    ${circleSelector} {
        width: 400%;
        left: -150%;
    }
    ${rootSelector} .media {
        width: 55vw;
    }
}
`;
}

export function defaultPrimitives(opts) {
  return [
    { kind: 'rotation', selector: opts.circleSelector,
      from: 30, to: -30, ease: 'power2.inOut' }
  ];
}

function stripDot(s) {
  const parts = (s || '').trim().split(/\s+/);
  const last = parts[parts.length - 1] || '';
  return last.replace(/^\./, '');
}
function stripPrefix(sel, root) {
  const s = (sel || '').trim();
  const r = (root || '').trim();
  if (r && s.startsWith(r + ' ')) return s.slice(r.length + 1);
  return s;
}
