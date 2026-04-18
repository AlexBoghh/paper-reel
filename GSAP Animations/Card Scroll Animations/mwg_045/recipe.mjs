export const id = 'mwg_045';
export const name = 'Folders';
export const category = 'CARD SCROLL';
export const signatures = [
  'gsap.timeline({ paused: true })',
  'back.out(1.05)',
  'power3.in',
  'gsap.utils.snap',
  'gsap.quickTo'
];
export const requiredOpts = {
  rootSelector: 'string — outer root element, e.g. ".mwg_effect045 .root"',
  slideSelector: 'string — each slide card, e.g. ".mwg_effect045 .slide"',
  contentSelector: 'string — content inside each slide, e.g. ".mwg_effect045 .content"'
};
export const defaultOpts = {
  staggerEach: 0.5,
  deltaDuration: 0.8
};
export const meaningfulParams = ['ease', 'stagger'];
export const contentShape = {
  slides: 'array of { title: string, body?: string } — folder-reveal slide deck; each slide becomes a .content panel'
};

export function generate(opts) {
  const { rootSelector, slideSelector, contentSelector,
          staggerEach, deltaDuration } =
    { ...defaultOpts, ...opts };
  return `
let incr_${id} = 0;

const root_${id} = document.querySelector('${rootSelector}');
const slides_${id} = document.querySelectorAll('${slideSelector}');
const slideContent_${id} = document.querySelectorAll('${contentSelector}');
const deltaObject_${id} = { delta: 0 };

const baseDuration_${id} = slides_${id}.length / 2;
const staggerEach_${id} = ${staggerEach};
const repeatDelay_${id} = baseDuration_${id} - staggerEach_${id};

const deltaTo_${id} = gsap.quickTo(deltaObject_${id}, 'delta', {
  duration: ${deltaDuration},
  ease: 'power1',
  onUpdate: () => {
    tl_${id}.time(deltaObject_${id}.delta);
  }
});
const rotY_${id} = gsap.quickTo(root_${id}, 'rotationY', { duration: 0.3, ease: 'power3' });
const rotX_${id} = gsap.quickTo(root_${id}, 'rotationX', { duration: 0.3, ease: 'power3' });

const tl_${id} = gsap.timeline({ paused: true });

tl_${id}.from(slides_${id}, {
  y: '-15vw',
  z: '-60vw',
  ease: 'none',
  duration: baseDuration_${id},
  stagger: {
    each: staggerEach_${id},
    repeat: -1
  }
});

tl_${id}.fromTo(slideContent_${id}, {
  y: '10vh'
}, {
  y: 0,
  ease: 'back.out(1.05)',
  duration: staggerEach_${id},
  stagger: {
    each: staggerEach_${id},
    repeat: -1,
    repeatDelay: repeatDelay_${id},
    onRepeat() {
      this.targets()[0].style.transform = 'translateY(100vh)';
    }
  }
}, '<');

tl_${id}.fromTo(slideContent_${id}, {
  y: 0
}, {
  y: '200vh',
  ease: 'power3.in',
  duration: staggerEach_${id},
  delay: repeatDelay_${id},
  stagger: {
    each: staggerEach_${id},
    repeat: -1,
    repeatDelay: repeatDelay_${id},
    onRepeat() {
      this.targets()[0].style.transform = 'translateY(0vh)';
    }
  }
}, '<');

const beginDistance_${id} = slides_${id}.length * 100;

tl_${id}.time(beginDistance_${id});

deltaTo_${id}(beginDistance_${id} + 0.01, beginDistance_${id});

const snap_${id} = gsap.utils.snap(baseDuration_${id} / slides_${id}.length);

window.addEventListener('wheel', (e) => {
  incr_${id} += e.deltaY / 1000;
  deltaTo_${id}(snap_${id}(incr_${id} + beginDistance_${id}));
}, { passive: true });

root_${id}.addEventListener('mousemove', (e) => {
  const valX = (e.clientY / window.innerHeight - 0.5) * 5;
  const valY = (e.clientX / window.innerWidth - 0.5) * 10;
  rotX_${id}(-valX);
  rotY_${id}(valY);
});
`;
}

export function generateMarkup(opts, content = {}) {
  const slide = stripDot(stripPrefixSimple(opts.slideSelector, '.mwg_effect045'));
  const contentCls = stripDot(stripPrefixSimple(opts.contentSelector, '.mwg_effect045'));
  const slides = Array.isArray(content.slides) && content.slides.length
    ? content.slides
    : [{ title: 'content' }];
  const slideMarkup = slides.map(s => {
    const title = (s && s.title) || 'content';
    const body = s && s.body
      ? `<p>${s.body}</p>`
      : '';
    return `    <div class="${slide}">
      <div class="${contentCls}">${title}${body}</div>
    </div>`;
  }).join('\n');
  return `<!-- mwg_045 markup contract -->
<section class="mwg_effect045">
  <div class="${stripDot(stripPrefixSimple(opts.rootSelector, '.mwg_effect045'))}">
${slideMarkup}
    <!-- repeat slides -->
  </div>
</section>`;
}

export function generateCSS(opts) {
  const { rootSelector, slideSelector, contentSelector } =
    { ...defaultOpts, ...opts };
  // mwg_045 opts selectors are compound ("<outer> <inner>"). Derive the outer
  // effect scope from rootSelector's first token so `.text` rules still land.
  const outer = (rootSelector || '').trim().split(/\s+/)[0] || rootSelector;
  return `
${outer} {
    height: 100vh;
    perspective: 150vw;
    overflow: hidden;
    position: relative;
}
${outer} .text {
    position: absolute;
    top: 0%;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 25px;
    text-transform: uppercase;
    font: 500 normal clamp(18px, 2vw, 40px) / normal 'Inter', sans-serif;
    letter-spacing: -0.03em;
}
${rootSelector} {
    height: 100%;
    transform-style: preserve-3d;
}
${slideSelector} {
    width: 56vw;
    aspect-ratio: 1.75;
    position: absolute;
    top: calc(50% - 14vw);
    left: calc(50% - 30vw);
}
${contentSelector} {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
`;
}

export function defaultPrimitives(opts) {
  return [
    { kind: 'translateY', selector: opts.slideSelector,
      from: '-15vw', to: 0, ease: 'none' }
  ];
}

function stripDot(s) {
  const parts = (s || '').trim().split(/\s+/);
  const last = parts[parts.length - 1] || '';
  return last.replace(/^\./, '');
}
function stripPrefixSimple(sel, root) {
  const s = (sel || '').trim();
  const r = (root || '').trim();
  if (r && s.startsWith(r + ' ')) return s.slice(r.length + 1);
  return s;
}
