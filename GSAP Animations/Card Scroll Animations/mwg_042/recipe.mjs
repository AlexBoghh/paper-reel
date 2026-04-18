export const id = 'mwg_042';
export const name = 'Smooth stacking images';
export const category = 'CARD SCROLL';
export const signatures = [
  'pin: container',
  'back.inOut(3)',
  'power4.in',
  'yPercent: -80',
  'scrub: 0.5'
];
export const requiredOpts = {
  rootSelector: 'string — outer effect root, e.g. ".mwg_effect042"',
  pinHeightSelector: 'string — scroll-height driver inside root, e.g. ".pin-height"',
  containerSelector: 'string — pinned container inside root, e.g. ".container"',
  mediaSelector: 'string — each media card, e.g. ".media"'
};
export const defaultOpts = {
  gap: 30
};
export const meaningfulParams = ['pin', 'scrub', 'ease', 'start', 'end'];
export const contentShape = {
  cards: 'array of { label: string, image?: url } — depth-stacked media; when absent, falls back to 4 numbered cells'
};

export function generate(opts) {
  const { rootSelector, pinHeightSelector, containerSelector, mediaSelector,
          gap } =
    { ...defaultOpts, ...opts };
  return `
const root_${id} = document.querySelector('${rootSelector}');
const pinHeight_${id} = root_${id}.querySelector('${stripPrefix(pinHeightSelector, rootSelector)}');
const container_${id} = root_${id}.querySelector('${stripPrefix(containerSelector, rootSelector)}');

ScrollTrigger.create({
  trigger: pinHeight_${id},
  start: 'top top',
  end: 'bottom bottom',
  pin: container_${id}
});

let gap_${id} = ${gap};
const medias_${id} = root_${id}.querySelectorAll('${stripPrefix(mediaSelector, rootSelector)}');
const distPerMedia_${id} = (pinHeight_${id}.clientHeight - window.innerHeight) / medias_${id}.length;

gsap.set(medias_${id}, {
  y: gap_${id} * (medias_${id}.length - 1),
  z: -gap_${id} * (medias_${id}.length - 1)
});

medias_${id}.forEach((media, index) => {
  const tl_${id} = gsap.timeline({
    scrollTrigger: {
      trigger: pinHeight_${id},
      start: 'top top+=' + (distPerMedia_${id} * index),
      end: 'bottom bottom+=' + (distPerMedia_${id} * index),
      scrub: 0.5
    }
  });

  for (let i = 0; i < medias_${id}.length - 1; i++) {
    tl_${id}.to(media, {
      y: '-=' + gap_${id},
      z: '+=' + gap_${id},
      ease: 'back.inOut(3)'
    });
  }

  tl_${id}.to(media, {
    yPercent: -80,
    y: '-50vh',
    scale: 1.2,
    rotation: (Math.random() - 0.5) * 50,
    ease: 'power4.in'
  });
});
`;
}

export function generateMarkup(opts, content = {}) {
  const media = stripDot(opts.mediaSelector);
  const hasContent = Array.isArray(content.cards) && content.cards.length;
  const cells = hasContent
    ? content.cards.map(c => {
        const label = (c && c.label) || '';
        const img = c && c.image
          ? `<img src="${c.image}" alt="">`
          : '';
        return `      <div class="${media}" style="background:#1a0f08;color:#f0ebe0;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;">${img}${label}</div>`;
      }).join('\n')
    : Array.from({ length: 4 }, (_, i) =>
        `      <div class="${media}" style="background:#1a0f08;color:#f0ebe0;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;">${i + 1}</div>`
      ).join('\n');
  return `<!-- mwg_042 markup contract -->
<section class="${stripDot(opts.rootSelector)}">
  <div class="${stripDot(opts.pinHeightSelector)}">
    <div class="${stripDot(opts.containerSelector)}">
      <div class="medias">
${cells}
      </div>
    </div>
  </div>
</section>`;
}

export function generateCSS(opts) {
  const { rootSelector, pinHeightSelector, containerSelector, mediaSelector } =
    { ...defaultOpts, ...opts };
  return `
${pinHeightSelector} {
    height: 500vh;
}
${containerSelector} {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
${rootSelector} .text {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    padding: 0 25px;
    display: flex;
    justify-content: space-between;
    font: 500 normal 1.6vw / normal 'Inter', sans-serif;
    letter-spacing: -0.03em;
    transform: translate(0, -50%);
}
${rootSelector} .medias {
    width: 22%;
    aspect-ratio: 0.75;
    perspective: 25vw;
}
${mediaSelector} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1vw;
}

@media (max-width: 768px) {
    ${rootSelector} .text {
        display: none;
    }
    ${rootSelector} .medias {
        width: 50%;
        perspective: 50vw;
    }
}
`;
}

export function defaultPrimitives(opts) {
  return [
    { kind: 'translateY', selector: opts.mediaSelector,
      from: 'auto', to: '-=30', ease: 'back.inOut(3)' }
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
