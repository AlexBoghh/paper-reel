export const id = 'mwg_009';
export const name = 'Up & Down';
export const category = 'TEXT';
export const signatures = [
  'wrapLettersInSpan',
  'yPercent: -50',
  "y: '-50vh'",
  'power4.in',
  'stagger: -0.02'
];
export const requiredOpts = {
  rootSelector: 'string — outer section, e.g. ".mwg_effect009"',
  pinHeightSelector: 'string — tall scroller, e.g. ".mwg_effect009 .pin-height"',
  containerSelector: 'string — pinned viewport wrapper, e.g. ".mwg_effect009 .container"',
  sentenceSelector: 'string — per-sentence rows, e.g. ".mwg_effect009 .sentence"'
};
export const defaultOpts = {
  staggerEach: -0.02
};
export const meaningfulParams = ['pin', 'scrub', 'ease', 'stagger'];
export const contentShape = {
  sentences: 'array of string — each rendered as its own <p class="sentence">; each sentence animates vertically (up & down) with per-letter stagger between successive sentences'
};

export function generate(opts) {
  const { pinHeightSelector, containerSelector, sentenceSelector,
          staggerEach } =
    { ...defaultOpts, ...opts };
  return `
const sentences_${id} = document.querySelectorAll('${sentenceSelector}');
const pinHeight_${id} = document.querySelector('${pinHeightSelector}');
const container_${id} = document.querySelector('${containerSelector}');

sentences_${id}.forEach(sentence => {
  wrapLettersInSpan(sentence);
});

ScrollTrigger.create({
  trigger: pinHeight_${id},
  start: 'top top',
  end: 'bottom bottom',
  pin: container_${id}
});

const tl_${id} = gsap.timeline({
  scrollTrigger: {
    trigger: pinHeight_${id},
    start: 'top top',
    end: 'bottom bottom',
    scrub: true
  }
});

sentences_${id}.forEach((sentence, index) => {
  if (sentences_${id}[index + 1]) {
    tl_${id}.to(sentences_${id}[index], {
      yPercent: -50,
      y: '-50vh',
      ease: 'power4.in'
    });

    tl_${id}.to(sentences_${id}[index].querySelectorAll('span'), {
      yPercent: -50,
      y: '-50vh',
      stagger: ${staggerEach},
      ease: 'power2.in'
    }, '<');

    tl_${id}.from(sentences_${id}[index + 1], {
      yPercent: 50,
      y: '50vh',
      ease: 'power4.out'
    }, '<');

    tl_${id}.from(sentences_${id}[index + 1].querySelectorAll('span'), {
      yPercent: 50,
      y: '50vh',
      ease: 'power2.out',
      stagger: ${staggerEach}
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
  const sentenceClass = stripDot(opts.sentenceSelector);
  const rows = sentences
    .map(s => `      <p class="${sentenceClass}">${s}</p>`)
    .join('\n');
  return `<!-- mwg_009 markup contract -->
<section class="${stripDot(opts.rootSelector)}">
  <div class="${stripDot(opts.pinHeightSelector)}">
    <div class="${stripDot(opts.containerSelector)}">
${rows}
    </div>
  </div>
</section>`;
}

export function generateCSS(opts) {
  const { rootSelector, pinHeightSelector, containerSelector, sentenceSelector } =
    { ...defaultOpts, ...opts };
  return `
${rootSelector} .text {
    position: absolute;
    font: 500 normal clamp(14px, 1.15vw, 100px) / 1.2 'Inter', sans-serif;
    letter-spacing: -0.01em;
    top: 25px;
    left: 25px;
    width: 23%;
    min-width: 300px;
}
${rootSelector} .visual {
    position: absolute;
    top: 25px;
    right: 25px;
    width: 12vw;
}
${pinHeightSelector} {
    height: 600vh;
}
${containerSelector} {
    display: flex;
    align-items: center;
    height: 100vh;
}
${rootSelector} .center {
    position: relative;
    width: 100%;
}
${sentenceSelector} {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    font: 500 normal 10vw/0.9 'Inter', sans-serif;
}
${sentenceSelector} span {
    display: inline-block;
    letter-spacing: -0.06em;
}
${sentenceSelector}:not(:first-child) {
    position: absolute;
    left: 0;
    top: 0;
}
`;
}

export function defaultPrimitives(opts) {
  return [
    { kind: 'translateY', selector: opts.sentenceSelector,
      from: 0, to: '-50vh', ease: 'power4.in' }
  ];
}

function stripDot(s) {
  const parts = (s || '').trim().split(/\s+/);
  const last = parts[parts.length - 1] || '';
  return last.replace(/^\./, '');
}
