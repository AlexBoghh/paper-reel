export const id = 'mwg_003';
export const name = 'Card shuffle';
export const category = 'CARD SCROLL';
export const signatures = [
  'pin:',
  'power1.out',
  'distPerCard',
  "start: 'top top-='",
  'scrub: true'
];
export const requiredOpts = {
  rootSelector: 'string — outer effect root, e.g. ".mwg_effect003"',
  pinHeightSelector: 'string — scroll-height driver inside root, e.g. ".pin-height"',
  containerSelector: 'string — pinned container inside root, e.g. ".container"',
  circleSelector: 'string — each circle/card, e.g. ".circle"'
};
export const defaultOpts = {
  angle: 3
};
export const meaningfulParams = ['pin', 'scrub', 'ease', 'start', 'end'];
export const contentShape = {
  cards: 'array of { label: string, image?: url } — 5-8 cards; mwg_003 colors first 6 via :nth-child on the .card inside each circle'
};

export function generate(opts) {
  const { rootSelector, pinHeightSelector, containerSelector, circleSelector,
          angle } =
    { ...defaultOpts, ...opts };
  return `
const root_${id} = document.querySelector('${rootSelector}');
const pinHeight_${id} = root_${id}.querySelector('${stripPrefix(pinHeightSelector, rootSelector)}');
const container_${id} = root_${id}.querySelector('${stripPrefix(containerSelector, rootSelector)}');
const circles_${id} = root_${id}.querySelectorAll('${stripPrefix(circleSelector, rootSelector)}');

gsap.fromTo(root_${id}.querySelectorAll('.circles'), {
  y: '5%'
}, {
  y: '-5%',
  ease: 'none',
  scrollTrigger: {
    trigger: pinHeight_${id},
    start: 'top top',
    end: 'bottom bottom',
    pin: container_${id},
    scrub: true
  }
});

let angle_${id} = ${angle},
    halfRange_${id} = (circles_${id}.length - 1) * angle_${id} / 2,
    rot_${id} = -halfRange_${id};

const distPerCard_${id} = (pinHeight_${id}.clientHeight - window.innerHeight) / circles_${id}.length;

circles_${id}.forEach((circle, index) => {
  gsap.to(circle, {
    rotation: rot_${id},
    ease: 'power1.out',
    scrollTrigger: {
      trigger: pinHeight_${id},
      start: 'top top-=' + (distPerCard_${id}) * index,
      end: '+=' + (distPerCard_${id}),
      scrub: true
    }
  });
  gsap.to(circle.querySelector('.card'), {
    rotation: rot_${id},
    y: '-50%',
    ease: 'power1.out',
    scrollTrigger: {
      trigger: pinHeight_${id},
      start: 'top top-=' + (distPerCard_${id}) * index,
      end: '+=' + (distPerCard_${id}),
      scrub: true
    }
  });
  rot_${id} += angle_${id};
});
`;
}

export function generateMarkup(opts, content = {}) {
  const circle = stripDot(opts.circleSelector);
  const cards = Array.isArray(content.cards) && content.cards.length
    ? content.cards
    : [{ label: 'card' }];
  const circles = cards.map(c => {
    const label = (c && c.label) || 'card';
    const img = c && c.image
      ? `<img src="${c.image}" alt="">`
      : '';
    return `        <div class="${circle}"><div class="card">${img}${label}</div></div>`;
  }).join('\n');
  return `<!-- mwg_003 markup contract -->
<section class="${stripDot(opts.rootSelector)}">
  <div class="${stripDot(opts.pinHeightSelector)}">
    <div class="${stripDot(opts.containerSelector)}">
      <div class="circles">
${circles}
        <!-- repeat 5-8 circles -->
      </div>
    </div>
  </div>
</section>`;
}

export function generateCSS(opts) {
  const { rootSelector, pinHeightSelector, containerSelector, circleSelector } =
    { ...defaultOpts, ...opts };
  return `
${rootSelector} {
    position: relative;
    overflow: hidden;
}
${rootSelector} .header {
    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;
    font: 500 normal clamp(12px, 0.9vw, 100px) / normal 'IBM Plex Mono', monospace;
    text-transform: uppercase;
    padding: 25px;
}
${rootSelector} .header > * {
    flex: 1;
}
${rootSelector} .header > *:nth-child(2) {
    text-align: center;
}
${rootSelector} .header > *:nth-child(3) {
    text-align: right;
}
${rootSelector} .scroll {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
${pinHeightSelector} {
    height: 500vh;
}
${containerSelector} {
    position: relative;
    height: 100vh;
}
${rootSelector} .circles {
    height: 100%;
}
${circleSelector} {
    width: 250vw;
    height: 250vw;
    border-radius: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,0);
    will-change: transform;
}
${circleSelector} .card {
    width: 25vw;
    aspect-ratio: 0.75;
    border-radius: 0.7vw;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%,55vh);
    will-change: transform;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    text-transform: uppercase;
    padding: 1vw;
}
${circleSelector} .card p {
    font-size: 1vw;
    line-height: 0.94;
}
${circleSelector} .card .aka {
    display: inline-block;
    font-size: 0.85vw;
    border: 0.15em solid currentColor;
    border-radius: 100%;
    padding: 0.30em 1em 0.15em;
    margin: 0 0 1em;
}
${circleSelector} .card .top p {
    display: flex;
    justify-content: space-between;
}
${circleSelector} .card h2 {
    font: 800 normal 4.6vw / 0.8 'Inter', sans-serif;
    letter-spacing: -0.03em;
}
${circleSelector}:nth-child(1) .card { background-color: #FC4C3B; color: #702626; }
${circleSelector}:nth-child(2) .card { background-color: #FF8308; color: #FFDF40; }
${circleSelector}:nth-child(3) .card { background-color: #DEDA8D; color: #3D4331; }
${circleSelector}:nth-child(4) .card { background-color: #71CFA3; color: #184739; }
${circleSelector}:nth-child(5) .card { background-color: #C4EF7A; color: #184739; }
${circleSelector}:nth-child(6) .card { background-color: #BCEFFF; color: #0C3FD3; }

@media (max-width: 900px) {
    ${rootSelector} .header {
        flex-direction: column;
    }
    ${rootSelector} .circles {
        height: 100%;
        transform: scale(1.6, 1.6);
    }
}
`;
}

export function defaultPrimitives(opts) {
  return [
    { kind: 'rotation', selector: opts.circleSelector,
      from: 0, to: 'auto', ease: 'power1.out' }
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
