export const id = 'mwg_023';
export const name = 'Infinite circular movement';
export const category = 'CARD SCROLL';
export const signatures = [
  'gsap.quickTo',
  "'rotation'",
  'power4',
  '360 / mediasTotal',
  "'wheel'"
];
export const requiredOpts = {
  rootSelector: 'string — outer effect root, e.g. ".mwg_effect023"',
  mediaSelector: 'string — outer media wrapper, e.g. ".media"',
  containerSelector: 'string — rotating container inside root, e.g. ".container"',
  innerMediaSelector: 'string — inner media element inside wrapper, e.g. ".inner-media"'
};
export const defaultOpts = {
  rotDuration: 0.8,
  wheelDivisor: 40
};
export const meaningfulParams = ['ease'];
export const contentShape = {
  cards: 'array of { label: string, image?: url } — radial gallery items; one inner-media per card arrayed around 360°'
};

export function generate(opts) {
  const { rootSelector, mediaSelector, containerSelector, innerMediaSelector,
          rotDuration, wheelDivisor } =
    { ...defaultOpts, ...opts };
  const mediaPath = `${rootSelector} ${stripPrefix(mediaSelector, rootSelector)}`;
  const containerPath = `${rootSelector} ${stripPrefix(containerSelector, rootSelector)}`;
  const innerMediaPath = `${rootSelector} ${stripPrefix(innerMediaSelector, rootSelector)}`;
  return `
gsap.set('${mediaPath}', { yPercent: -50 });

const medias_${id} = document.querySelectorAll('${innerMediaPath}');
const mediasTotal_${id} = medias_${id}.length;

medias_${id}.forEach((media, index) => {
  media.classList.add('media-' + (Math.floor(Math.random() * 3) + 1));
  gsap.set(media, {
    rotation: 360 / mediasTotal_${id} * index
  });
});

const rotTo_${id} = gsap.quickTo('${containerPath}', 'rotation', {
  duration: ${rotDuration},
  ease: 'power4'
});

const yTo1_${id} = gsap.quickTo('${rootSelector} .media-1 ${stripPrefix(mediaSelector, rootSelector)}', 'yPercent', {
  duration: 1,
  ease: 'power3'
});
const yTo2_${id} = gsap.quickTo('${rootSelector} .media-2 ${stripPrefix(mediaSelector, rootSelector)}', 'yPercent', {
  duration: 2,
  ease: 'power3'
});
const yTo3_${id} = gsap.quickTo('${rootSelector} .media-3 ${stripPrefix(mediaSelector, rootSelector)}', 'yPercent', {
  duration: 3,
  ease: 'power3'
});

let incr_${id} = 0;
window.addEventListener('wheel', (e) => {
  const deltaY = e.deltaY;
  incr_${id} -= deltaY / ${wheelDivisor};
  rotTo_${id}(incr_${id});

  const val = -Math.abs(deltaY / 4) - 50;
  yTo1_${id}(val);
  yTo2_${id}(val);
  yTo3_${id}(val);
}, { passive: true });
`;
}

export function generateMarkup(opts, content = {}) {
  const media = stripDot(opts.mediaSelector);
  const innerMedia = stripDot(opts.innerMediaSelector);
  const cards = Array.isArray(content.cards) && content.cards.length
    ? content.cards
    : [{ label: 'media' }];
  const wrappers = cards.map(c => {
    const label = (c && c.label) || 'media';
    const img = c && c.image
      ? `<img src="${c.image}" alt="">`
      : '';
    return `    <div class="${media}">
      <div class="${innerMedia}">${img}${label}</div>
    </div>`;
  }).join('\n');
  return `<!-- mwg_023 markup contract -->
<section class="${stripDot(opts.rootSelector)}">
  <div class="${stripDot(opts.containerSelector)}">
${wrappers}
    <!-- repeat media wrappers -->
  </div>
</section>`;
}

export function generateCSS(opts) {
  const { rootSelector, mediaSelector, containerSelector, innerMediaSelector } =
    { ...defaultOpts, ...opts };
  return `
${rootSelector} {
    height: 100vh;
    overflow: hidden;
    position: relative;
}
${containerSelector} {
    position: absolute;
    width: 300vw;
    height: 300vw;
    left: -100vw;
    will-change: transform;
}
${innerMediaSelector} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}
${mediaSelector} {
    width: 20vw;
    height: 26vw;
    margin: 50vh 0 0;
    object-fit: contain;
    object-position: 50% 100%;
    will-change: transform;
}
${rootSelector} .header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 25px;
    font: 500 normal clamp(20px, 2.2vw, 40px) / normal 'Inter', sans-serif;
    letter-spacing: -0.03em;
}
${rootSelector} .header p:last-child {
    text-align: right;
}

@media (max-width: 900px) {
    ${rootSelector} .header {
        display: flex;
        flex-direction: column;
        line-height: 1.3;
    }
    ${containerSelector} {
        width: 800vw;
        height: 800vw;
        left: -350vw;
    }
    ${mediaSelector} {
        width: 40vw;
        height: 52vw;
    }
}
`;
}

export function defaultPrimitives(opts) {
  return [
    { kind: 'rotation', selector: opts.containerSelector,
      from: 0, to: 'auto', ease: 'power4' }
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
