export const id = 'mwg_010';
export const name = 'Jazzy letters';
export const category = 'TEXT';
// NUMERICS LOCKED per §2.0: `innerHeight * 0.2` and `* 32` must appear LITERALLY
// in the emission. sinusAmplitude=0.2 interpolates to "0.2" so `innerHeight * 0.2`
// is preserved. rotationRange=32 interpolates to "32" so `* 32` is preserved.
export const signatures = [
  'wrapLettersInSpan',
  'Math.sin(sinusIncr',
  'innerHeight * 0.2',
  '* 32',
  'containerAnimation: scrollTween'
];
export const requiredOpts = {
  textSelector: 'string — horizontal text line, e.g. ".mwg_effect010 .text"',
  containerSelector: 'string — pinned container wrapping the horizontal track, e.g. ".mwg_effect010 .container"'
};
export const defaultOpts = {
  sinusAmplitude: 0.2,
  sinusStep: 0.3,
  yPercentRange: 100,
  rotationRange: 32
};
export const meaningfulParams = ['pin', 'scrub', 'ease'];
export const contentShape = {
  headline: 'string — rendered in the horizontal text line; wrapLettersInSpan splits into .letter spans that scroll sideways with sine-wave jittery offsets'
};

export function generate(opts) {
  const { textSelector, containerSelector,
          sinusAmplitude, sinusStep, yPercentRange, rotationRange } =
    { ...defaultOpts, ...opts };
  return `
const text_${id} = document.querySelector('${textSelector}');
wrapLettersInSpan(text_${id});
const letters_${id} = document.querySelectorAll('${textSelector} .letter');

const distance_${id} = text_${id}.clientWidth - document.body.clientWidth;
let sinusIncr_${id} = 0;

const scrollTween_${id} = gsap.to(text_${id}, {
  x: - distance_${id} + 'px',
  ease: 'none',
  scrollTrigger: {
    trigger: '${containerSelector}',
    pin: true,
    end: '+=' + distance_${id},
    scrub: true
  }
});

letters_${id}.forEach(letter => {
  gsap.set(letter, {
    y: Math.sin(sinusIncr_${id}) * (window.innerHeight * ${sinusAmplitude}),
    yPercent: (Math.random() - 0.5) * ${yPercentRange},
    rotation: (Math.random() - 0.5) * ${rotationRange},
    autoAlpha: 1,
    immediateRender: false,
    scrollTrigger: {
      trigger: letter,
      containerAnimation: scrollTween_${id},
      toggleActions: "play reverse play reverse",
      start: 'right 90%',
      end: 'left 10%'
    }
  });

  sinusIncr_${id} += ${sinusStep};
});
`;
}

export function generateMarkup(opts, content = {}) {
  const headline = typeof content.headline === 'string' && content.headline
    ? content.headline
    : 'Your horizontal jazzy text line here, scrolls sideways with jittery letters.';
  return `<!-- mwg_010 markup contract -->
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
    height: 100vh;
    align-items: center;
    position: relative;
}
${containerSelector} .scroll {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
${containerSelector} .header {
    position: absolute;
    width: 100%;
    white-space: initial;
    top: 0;
    left: 0;
    padding: 25px;
    display: flex;
    justify-content: space-between;
}
${containerSelector} .header .left {
    font-size: 1.2vw;
    width: 25vw;
}
${containerSelector} .header .right {
    display: flex;
    align-items: flex-start;
    gap: 25px;
}
${containerSelector} .header .right p {
    font: 500 normal 0.9vw / normal 'IBM Plex Mono', monospace;
    text-transform: uppercase;
    text-align: right;
}
${containerSelector} .header .right img {
    width: 4.4vw;
    height: auto;
}
${textSelector} {
    display: flex;
    font: 500 normal 12vw/0.9 'Inter', sans-serif;
    padding: 0 100vw;
    white-space: nowrap;
    width: max-content;
}
${containerSelector} span:not(.letter) {
    padding: 0 2vw;
}
${textSelector} .letter {
    display: inline-block;
    visibility: hidden;
    padding: 0 0.2vw;
}

@media (max-width: 768px) {
    ${containerSelector} .header {
        flex-direction: column;
        padding: 15px;
        gap: 15px;
    }
    ${containerSelector} .header .left {
        order: 2;
        font-size: 16px;
        width: 100%;
    }
    ${containerSelector} .header .right {
        gap: 15px;
    }
    ${containerSelector} .header .right p {
        order: 2;
        font-size: 13px;
        text-align: left;
    }
    ${containerSelector} .header .right img {
        width: 62px;
        height: auto;
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
