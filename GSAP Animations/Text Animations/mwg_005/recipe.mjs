export const id = 'mwg_005';
export const name = 'Word by word';
export const category = 'TEXT';
// Note: signature `pin: container` references the locally-scoped var that
// generate() suffixes with `_${id}`. Emit the exact literal `pin: container_${id}`
// wouldn't contain `pin: container` as a strict prefix -- we use `pin: container_${id}`
// which DOES contain `pin: container` as a prefix substring. Keep the signature
// short so the substring is found either way.
export const signatures = [
  'wrapWordsInSpan',
  'stagger: 0.02',
  'power4.inOut',
  'pin: container',
  'scrub: true'
];
export const requiredOpts = {
  rootSelector: 'string — outer section, e.g. ".mwg_effect005"',
  pinHeightSelector: 'string — tall scroller, e.g. ".mwg_effect005 .pin-height"',
  containerSelector: 'string — pinned viewport wrapper, e.g. ".mwg_effect005 .container"',
  paragraphSelector: 'string — paragraph to wrap words in, e.g. ".mwg_effect005 .paragraph"'
};
export const defaultOpts = {
  staggerEach: 0.02
};
export const meaningfulParams = ['pin', 'scrub', 'ease', 'stagger'];
export const contentShape = {
  headline: 'string — rendered in the paragraph element; wrapWordsInSpan splits it so each word animates in sequence, word by word'
};

export function generate(opts) {
  const { rootSelector, pinHeightSelector, containerSelector, paragraphSelector,
          staggerEach } =
    { ...defaultOpts, ...opts };
  return `
const paragraph_${id} = document.querySelector('${paragraphSelector}');
wrapWordsInSpan(paragraph_${id});

const pinHeight_${id} = document.querySelector('${pinHeightSelector}');
const container_${id} = document.querySelector('${containerSelector}');
const words_${id} = document.querySelectorAll('${rootSelector} .word');

gsap.to(words_${id}, {
  x: 0,
  stagger: ${staggerEach},
  ease: 'power4.inOut',
  scrollTrigger: {
    trigger: pinHeight_${id},
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    pin: container_${id}
  }
});
`;
}

export function generateMarkup(opts, content = {}) {
  const headline = typeof content.headline === 'string' && content.headline
    ? content.headline
    : 'Your paragraph text here. Words animate in sequence, word by word.';
  return `<!-- mwg_005 markup contract -->
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
    width: auto;
    height: 4.6vw;
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
}
`;
}

export function defaultPrimitives(opts) {
  return [
    { kind: 'translateX', selector: opts.paragraphSelector + ' .word',
      from: 'auto', to: 0, ease: 'power4.inOut' }
  ];
}

function stripDot(s) {
  const parts = (s || '').trim().split(/\s+/);
  const last = parts[parts.length - 1] || '';
  return last.replace(/^\./, '');
}
