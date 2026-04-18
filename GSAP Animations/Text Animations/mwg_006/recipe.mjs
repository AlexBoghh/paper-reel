export const id = 'mwg_006';
export const name = 'Progressive sentences';
export const category = 'TEXT';
// Note: signature `pin: container` matches the prefix of the suffixed local
// var `container_${id}` -- same precedent as mwg_001 for matching substrings
// that survive the `_${id}` disambiguation.
export const signatures = [
  'wrapWordsInSpan',
  "y:'100%'",
  'power4.in',
  'power4.out',
  'pin: container'
];
export const requiredOpts = {
  rootSelector: 'string — outer section, e.g. ".mwg_effect006"',
  pinHeightSelector: 'string — tall scroller, e.g. ".mwg_effect006 .pin-height"',
  containerSelector: 'string — pinned viewport wrapper, e.g. ".mwg_effect006 .container"',
  paragraphSelector: 'string — repeated paragraph rows, e.g. ".mwg_effect006 .paragraph"'
};
export const defaultOpts = {
  staggerEach: 0.2,
  delay: 1.4
};
export const meaningfulParams = ['pin', 'scrub', 'ease', 'stagger'];
export const contentShape = {
  sentences: 'array of string — each rendered as its own <p class="paragraph">; the timeline cross-fades from sentence N to N+1 as scroll progresses'
};

export function generate(opts) {
  const { rootSelector, pinHeightSelector, containerSelector, paragraphSelector,
          staggerEach, delay } =
    { ...defaultOpts, ...opts };
  return `
const root_${id} = document.querySelector('${rootSelector}');
const pinHeight_${id} = document.querySelector('${pinHeightSelector}');
const container_${id} = document.querySelector('${containerSelector}');
const paragraphs_${id} = document.querySelectorAll('${paragraphSelector}');

paragraphs_${id}.forEach(paragraph => {
  wrapWordsInSpan(paragraph);
});

ScrollTrigger.create({
  trigger: pinHeight_${id},
  start: 'top top',
  end: 'bottom bottom',
  pin: container_${id},
  scrub: true
});

const tl_${id} = gsap.timeline({
  scrollTrigger: {
    trigger: root_${id},
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
});

paragraphs_${id}.forEach((paragraph, index) => {
  if (paragraphs_${id}[index + 1]) {
    tl_${id}.to(paragraphs_${id}[index].querySelectorAll('.word span'), {
      y:'100%',
      stagger: ${staggerEach},
      duration: 1,
      ease: 'power4.in'
    });
    tl_${id}.to(paragraphs_${id}[index + 1].querySelectorAll('.word span'), {
      y: '0%',
      duration: 1,
      delay: ${delay},
      stagger: ${staggerEach},
      ease: 'power4.out'
    }, '<');
  }
});
`;
}

export function generateMarkup(opts, content = {}) {
  const sentences = Array.isArray(content.sentences) && content.sentences.length
    ? content.sentences
    : ['First sentence.',
       'Second sentence replaces the first.',
       'Third sentence replaces the second.'];
  const paragraphClass = stripDot(opts.paragraphSelector);
  const rows = sentences
    .map(s => `      <p class="${paragraphClass}">${s}</p>`)
    .join('\n');
  return `<!-- mwg_006 markup contract -->
<section class="${stripDot(opts.rootSelector)}">
  <div class="${stripDot(opts.pinHeightSelector)}">
    <div class="${stripDot(opts.containerSelector)}">
${rows}
    </div>
  </div>
</section>`;
}

export function generateCSS(opts) {
  const { rootSelector, pinHeightSelector, containerSelector, paragraphSelector } =
    { ...defaultOpts, ...opts };
  return `
${rootSelector} {
    letter-spacing: -0.03em;
    overflow: hidden;
    font: 500 normal 3vw/0.9 'Inter', sans-serif;
}
${pinHeightSelector} {
    height: 400vh;
}
${containerSelector} {
    height: 100vh;
    align-items: center;
    padding: 0 3vw;
    column-gap: 15px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
}
${containerSelector} .name {
    position: absolute;
    top: 15vh;
    left: calc(2 * 15px);
}
${containerSelector} .left {
    position: relative;
    padding: 0 0 0 15px;
    width: 40%;
}
${containerSelector} .right {
    height: 100%;
    width: auto;
    object-fit: cover;
}
${paragraphSelector}:not(:first-child) {
    position: absolute;
    top: 0;
}
${rootSelector} .word {
    position: relative;
    overflow: hidden;
    display: inline-block;
    margin: -0.14em 0; /* depends on the font */
}
${rootSelector} .word span {
    display: block;
    padding: 0.14em 0; /* depends on the font */
}
${paragraphSelector}:not(:first-child) .word span {
    transform: translate(0, -100%);
}

@media (max-width: 500px) {
    ${rootSelector} {font-size: 30px;}
    ${containerSelector} {
        flex-direction: column;
        justify-content: flex-start;
    }
    ${containerSelector} .left {
        order: 2;
        width: 100%;
        padding: 0;
        margin: 15px 0 0 0;
    }
    ${containerSelector} .right {
        order: 1;
        width: 100%;
        max-width: initial;
        height: auto;
        max-height: 55%;
    }
    ${containerSelector} .name {
        top: auto;
        bottom: 20px;
        left: 15px;
    }
}
`;
}

export function defaultPrimitives(opts) {
  return [
    { kind: 'translateY', selector: opts.paragraphSelector + ' .word span',
      from: '0%', to: '100%', ease: 'power4.in' }
  ];
}

function stripDot(s) {
  const parts = (s || '').trim().split(/\s+/);
  const last = parts[parts.length - 1] || '';
  return last.replace(/^\./, '');
}
