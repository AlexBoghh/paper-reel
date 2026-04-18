/**
 * Latchkey hero + feature stack
 * Cites: mwg_010 (Jazzy letters — PRIMARY) · mwg_042 (Smooth stacking — SECONDARY)
 *
 * Requires GSAP 3.12+, ScrollTrigger, and (optionally) Lenis.
 * Markup contract:
 *   <section class="hero"><div class="container"><h1 class="text">...</h1></div></section>
 *   <section class="features"><div class="pin-height"><div class="container">
 *     <div class="deck"><article class="media">...</article> × 3</div>
 *   </div></div></section>
 *
 * CSS contract for the feature stack (critical — required for the 3D
 * stacking to render visible depth):
 *   .features .deck  { perspective: 1200px; position: relative; }
 *   .features .media { position: absolute; inset: 0; }
 * Perspective MUST live on the direct parent of .media. Placing it on an
 * outer ancestor without `transform-style: preserve-3d` on every element
 * in the chain down to .media will flatten the 3D rendering and the
 * z transforms GSAP animates below will produce no visible depth.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initMotion({ useLenis = true } = {}) {
  if (useLenis) {
    const lenis = new Lenis({ autoRaf: false, duration: 1.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  document.fonts.ready.then(initHeroMarquee);
  initFeatureStack();
}

/* ---------- HERO — jazzy letter marquee (mwg_010) ---------- */
function initHeroMarquee() {
  const heroText = document.querySelector('.hero .text');
  if (!heroText) return;

  wrapLettersInSpan(heroText);
  const letters = document.querySelectorAll('.hero .letter');
  const distance = heroText.clientWidth - document.body.clientWidth;

  const scrollTween = gsap.to(heroText, {
    x: -distance + 'px',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero .container',
      pin: true,
      end: '+=' + distance,
      scrub: true
    }
  });

  let sinusIncr = 0;
  letters.forEach((letter) => {
    gsap.set(letter, {
      y: Math.sin(sinusIncr) * (window.innerHeight * 0.18),
      yPercent: (Math.random() - 0.5) * 80,
      rotation: (Math.random() - 0.5) * 28,
      autoAlpha: 1,
      immediateRender: false,
      scrollTrigger: {
        trigger: letter,
        containerAnimation: scrollTween,
        toggleActions: 'play reverse play reverse',
        start: 'right 90%',
        end: 'left 10%'
      }
    });
    sinusIncr += 0.3;
  });
}

/* ---------- FEATURES — smooth stacking (mwg_042) ---------- */
function initFeatureStack() {
  const root = document.querySelector('.features');
  if (!root) return;

  const pinHeight = root.querySelector('.pin-height');
  const container = root.querySelector('.container');
  const medias = root.querySelectorAll('.media');

  ScrollTrigger.create({
    trigger: pinHeight,
    start: 'top top',
    end: 'bottom bottom',
    pin: container
  });

  const gap = 30;
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
      rotation: (Math.random() - 0.5) * 40,
      ease: 'power4.in'
    });
  });

  ScrollTrigger.refresh();
}

/* ---------- Utility ---------- */
function wrapLettersInSpan(element) {
  const text = element.textContent;
  element.innerHTML = text
    .split('')
    .map((c) => (c === ' ' ? '<span>&nbsp;</span>' : `<span class="letter">${c}</span>`))
    .join(' ');
}
