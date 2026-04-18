export const id = 'mwg_004';
export const name = 'Simultaneous words';
export const category = 'TEXT';
// Note: signatures avoid literal `container` / `paragraph` which collide with
// the `_${id}` disambiguation suffix applied to locally-scoped variables in
// generate(). Pick substrings that survive the suffixing.
export const signatures = [
  'wrapWordsInSpan',
  'pin: container',
  'power1.inOut',
  'stagger: 0.2',
  'scrub: true'
];
export const requiredOpts = {
  rootSelector: 'string — outer section, e.g. ".mwg_effect004"',
  pinHeightSelector: 'string — tall scroller, e.g. ".mwg_effect004 .pin-height"',
  containerSelector: 'string — pinned viewport wrapper, e.g. ".mwg_effect004 .container"',
  paragraphSelector: 'string — paragraph to wrap words in, e.g. ".mwg_effect004 .paragraph"'
};
export const defaultOpts = {
  staggerEach: 0.2
};
export const meaningfulParams = ['pin', 'scrub', 'ease', 'stagger', 'start', 'end'];
export const contentShape = {
  headline: 'string — rendered in the paragraph element; wrapWordsInSpan splits words so they animate in per line, staggered'
};

export function generate(opts) {
  const { rootSelector, pinHeightSelector, containerSelector, paragraphSelector,
          staggerEach } =
    { ...defaultOpts, ...opts };
  return `
const pinHeight_${id} = document.querySelector('${pinHeightSelector}');
const container_${id} = document.querySelector('${containerSelector}');
const paragraph_${id} = document.querySelector('${paragraphSelector}');
wrapWordsInSpan(paragraph_${id});

const words_${id} = paragraph_${id}.querySelectorAll('.word');

ScrollTrigger.create({
  trigger: pinHeight_${id},
  start: 'top top',
  end: 'bottom bottom',
  pin: container_${id}
});

const lines_${id} = [[]];
let lineIndex_${id} = 0;

for (let i = 0; i < words_${id}.length; i++) {
  const word = words_${id}[i];
  const offsetTop = word.offsetTop;
  if (i > 0 && offsetTop !== words_${id}[i - 1].offsetTop) {
    lines_${id}.push([]);
    lineIndex_${id}++;
  }
  lines_${id}[lineIndex_${id}].push(word);
}

lines_${id}.forEach(lineWords => {
  gsap.to(lineWords, {
    x: 0,
    stagger: ${staggerEach},
    ease: 'power1.inOut',
    scrollTrigger: {
      trigger: '${rootSelector}',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    }
  });
});
`;
}

export function generateMarkup(opts, content = {}) {
  const headline = typeof content.headline === 'string' && content.headline
    ? content.headline
    : 'Your paragraph text here. Words animate in per line, staggered.';
  return `<!-- mwg_004 markup contract -->
<section class="${stripDot(opts.rootSelector)}">
  <div class="${stripDot(opts.pinHeightSelector)}">
    <div class="${stripDot(opts.containerSelector)}">
      <p class="${stripDot(opts.paragraphSelector)}">${headline}</p>
    </div>
  </div>
</section>`;
}

export function generateCSS(opts) {
  const { rootSelector, pinHeightSelector, containerSelector, paragraphSelector } =
    { ...defaultOpts, ...opts };
  return `
${rootSelector} .scroll {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
${pinHeightSelector} {
    height: 500vh;
}
${rootSelector} .header {
    position: absolute;
    display: flex;
    justify-content: space-between;
    top: 25px;
    left: 25px;
    right: 25px;
}
${rootSelector} .header .left {
    font-size: 1.2vw;
}
${rootSelector} .header .right {
    display: flex;
    gap: 1em;
    text-align: right;
    font: 500 normal 0.9vw / normal 'IBM Plex Mono', monospace;
    text-transform: uppercase;
    align-items: center;
}
${rootSelector} .header img {
    border-radius: 0.2em;
    aspect-ratio: 1;
    height: 4.6vw;
    object-fit: cover;
}
${containerSelector} {
    height: 100vh;
    display: flex;
    align-items: center;
    padding: 0 25px;
    overflow: hidden;
}
${paragraphSelector} {
    width: 60%;
    font: 500 normal 3.9vw/0.9 'Inter', sans-serif;
    letter-spacing: -0.03em;
}
${paragraphSelector} .word {
    display: inline-block;
    transform: translate(calc(100vw - 25px), 0);
}

@media (max-width: 900px) {
    ${rootSelector} .header {display: block;}
    ${rootSelector} .header .left {font-size: 16px}
    ${rootSelector} .header .right {
        font-size: 13px;
        margin: 15px 0 0;
    }
    ${rootSelector} .header .right p {
        order: 2;
        text-align: left;
    }
    ${rootSelector} .header img {
        height: 58px;
        order: 1;
    }
    ${paragraphSelector} {
        font-size: 30px;
    }
}
@media (max-width: 768px) {
    ${rootSelector} .header {
        top: 15px;
        left: 15px;
        right: 15px;
    }
    ${paragraphSelector} .word {
        transform: translate(calc(100vw - 15px), 0);
    }
}
@media (max-width: 500px) {
    ${containerSelector} {
        align-items: flex-end;
        padding: 0 15px 74px;
    }
    ${paragraphSelector} {
        width: 100%;
    }
    ${paragraphSelector} .word {
        display: inline-block;
    }
}
`;
}

export function defaultPrimitives(opts) {
  return [
    { kind: 'translateX', selector: opts.paragraphSelector + ' .word',
      from: 'auto', to: 0, ease: 'power1.inOut' }
  ];
}

function stripDot(s) {
  const parts = (s || '').trim().split(/\s+/);
  const last = parts[parts.length - 1] || '';
  return last.replace(/^\./, '');
}
