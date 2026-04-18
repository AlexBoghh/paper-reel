export const id = 'mwg_011';
export const name = 'Smooth letters';
export const category = 'TEXT';
export const signatures = [
  'wrapLettersInSpan',
  'pin: true',
  'containerAnimation: scrollTween',
  'elastic.out(1.2, 1)',
  'scrub: 0.5'
];
export const requiredOpts = {
  textSelector: 'string — horizontal text line, e.g. ".mwg_effect011 .text"',
  containerSelector: 'string — pinned container wrapping the horizontal track, e.g. ".mwg_effect011 .container"'
};
export const defaultOpts = {
  yPercentRange: 400,
  rotationRange: 60
};
export const meaningfulParams = ['pin', 'scrub', 'ease'];
export const contentShape = {
  headline: 'string — rendered in the horizontal text line; wrapLettersInSpan splits into .letter spans that reveal with an elastic ease as the track scrolls sideways'
};

export function generate(opts) {
  const { textSelector, containerSelector,
          yPercentRange, rotationRange } =
    { ...defaultOpts, ...opts };
  return `
const text_${id} = document.querySelector('${textSelector}');
wrapLettersInSpan(text_${id});

const letters_${id} = document.querySelectorAll('${textSelector} .letter');
const distance_${id} = text_${id}.clientWidth - document.body.clientWidth;

const scrollTween_${id} = gsap.to(text_${id}, {
  x: - distance_${id},
  ease: 'none',
  scrollTrigger: {
    trigger: '${containerSelector}',
    pin: true,
    end: '+=' + distance_${id},
    scrub: true
  }
});

letters_${id}.forEach(letter => {
  gsap.from(letter, {
    yPercent: (Math.random() - 0.5) * ${yPercentRange},
    rotation: (Math.random() - 0.5) * ${rotationRange},
    ease: "elastic.out(1.2, 1)",
    scrollTrigger: {
      trigger: letter,
      containerAnimation: scrollTween_${id},
      start: 'left 90%',
      end: 'left 10%',
      scrub: 0.5
    }
  });
});
`;
}

export function generateMarkup(opts, content = {}) {
  const headline = typeof content.headline === 'string' && content.headline
    ? content.headline
    : 'Your horizontal smooth-letter text line here, scrolls sideways with elastic letter reveal.';
  return `<!-- mwg_011 markup contract -->
<section>
  <div class="${stripDot(opts.containerSelector)}">
    <p class="${stripDot(opts.textSelector)}">${headline}</p>
  </div>
</section>`;
}

export function generateCSS(opts) {
  const { textSelector, containerSelector } =
    { ...defaultOpts, ...opts };
  return `
${containerSelector} {
    overflow: hidden;
    display: flex;
    align-items: center;
    height: 100vh;
    position: relative;
    width: 100%;
}
${containerSelector} .scroll {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
${containerSelector} .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 0;
    left: 0;
    padding: 25px;
}
${containerSelector} .header p:first-child {
    width: 30%;
    font-size: 1.2vw;
}
${containerSelector} .header p:last-child {
    font: 500 normal 0.9vw / normal 'IBM Plex Mono', monospace;
    text-transform: uppercase;
    text-align: right;
}
${textSelector} {
    padding: 0 101vw;
    display: flex;
    width: max-content;
    white-space: nowrap;
    font: 500 normal 12vw/0.9 'Inter', sans-serif;
}
${textSelector} .letter {
    display: inline-block;
    letter-spacing: -0.06em;
}

@media (max-width: 768px) {
    ${containerSelector} .header {
        flex-direction: column;
        padding: 15px;
        gap: 15px;
    }
    ${containerSelector} .header p:first-child {
        order: 2;
        font-size: 16px;
        width: 100%;
    }
    ${containerSelector} .header p:last-child {
        font-size: 13px;
        text-align: left;
    }
    ${textSelector} {
        font-size: 100px;
    }
}
`;
}

export function defaultPrimitives(opts) {
  return [
    { kind: 'translateX', selector: opts.textSelector,
      from: 0, to: 'auto', ease: 'none' }
  ];
}

function stripDot(s) {
  const parts = (s || '').trim().split(/\s+/);
  const last = parts[parts.length - 1] || '';
  return last.replace(/^\./, '');
}
