// VOLUMES IN MOTION. — scroll-driven motion export
// Composed from two MWG citations:
//   PRIMARY   — mwg_004  Simultaneous words   (text reveal)
//   SECONDARY — mwg_042  Smooth stacking      (card scroll)
//
// Required HTML structure:
//   <section class="mwg_effect004">
//     <div class="pin-height"><div class="container">
//       <p class="paragraph">YOUR HEADLINE HERE</p>
//     </div></div>
//   </section>
//   <section class="mwg_effect042">
//     <div class="pin-height"><div class="container">
//       <div class="medias">
//         <div class="media">…</div>  (3 children — order = reveal order)
//         <div class="media">…</div>
//         <div class="media">…</div>
//       </div>
//     </div></div>
//   </section>
//
// Required CSS contracts:
//   .mwg_effect004 .pin-height          { height: 500vh; }
//   .mwg_effect004 .container           { height: 100vh; overflow: hidden; }
//   .mwg_effect004 .word                { display: inline-block;
//                                          transform: translate(calc(100vw - 64px), 0); }
//   .mwg_effect042 .pin-height          { height: 500vh; }
//   .mwg_effect042 .container           { height: 100vh;
//                                          display:flex; align-items:center;
//                                          justify-content:center; }
//   .mwg_effect042 .medias              { width: 22%; aspect-ratio: 0.75;
//                                          perspective: 25vw; position: relative; }
//   .mwg_effect042 .media               { position: absolute; top:0; left:0;
//                                          width:100%; height:100%; }
//
// Plugins: GSAP + ScrollTrigger (CDN). Lenis optional.

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("DOMContentLoaded", () => {
  if (window.Lenis) new Lenis({ autoRaf: true });

  document.fonts.ready.then(() => {
    initHero();
    initCards();
  });
});

// HERO — simultaneous words (mwg_004 cite)
function initHero() {
  const root = document.querySelector('.mwg_effect004');
  if (!root) return;

  const pinHeight = root.querySelector('.pin-height');
  const container = root.querySelector('.container');
  const paragraph = root.querySelector('.paragraph');
  wrapWordsInSpan(paragraph);

  const words = paragraph.querySelectorAll('.word');

  ScrollTrigger.create({
    trigger: pinHeight,
    start: 'top top',
    end: 'bottom bottom',
    pin: container
  });

  const lines = [[]];
  let lineIndex = 0;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const offsetTop = word.offsetTop;
    if (i > 0 && offsetTop !== words[i - 1].offsetTop) {
      lines.push([]);
      lineIndex++;
    }
    lines[lineIndex].push(word);
  }

  lines.forEach(lineWords => {
    gsap.to(lineWords, {
      x: 0,
      stagger: 0.2,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });
  });
}

// CARDS — smooth stacking (mwg_042 cite)
function initCards() {
  const root = document.querySelector('.mwg_effect042');
  if (!root) return;

  const pinHeight = root.querySelector('.pin-height');
  const container = root.querySelector('.container');

  ScrollTrigger.create({
    trigger: pinHeight,
    start: 'top top',
    end: 'bottom bottom',
    pin: container
  });

  const gap = 30;
  const medias = root.querySelectorAll('.media');
  const distPerMedia = (pinHeight.clientHeight - window.innerHeight) / medias.length;

  gsap.set(medias, {
    y: gap * (medias.length - 1),
    z: -gap * (medias.length - 1)
  });

  medias.forEach((media, index) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinHeight,
        start: 'top top+=' + (distPerMedia * index),
        end: 'bottom bottom+=' + (distPerMedia * index),
        scrub: 0.5
      }
    });

    for (let i = 0; i < medias.length - 1; i++) {
      tl.to(media, {
        y: '-=' + gap,
        z: '+=' + gap,
        ease: 'back.inOut(3)'
      });
    }

    tl.to(media, {
      yPercent: -80,
      y: '-50vh',
      scale: 1.2,
      rotation: (Math.random() - 0.5) * 50,
      ease: 'power4.in'
    });
  });
}

// Split a text node's words into <span class="word"> children using safe DOM ops.
function wrapWordsInSpan(element) {
  const text = element.textContent;
  const tokens = text.split(' ');
  while (element.firstChild) element.removeChild(element.firstChild);
  tokens.forEach((token, i) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = token;
    element.appendChild(span);
    if (i < tokens.length - 1) element.appendChild(document.createTextNode(' '));
  });
}
