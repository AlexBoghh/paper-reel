// Reel export — rolodex portfolio stack
// A perspective stack of five case-study cards that cycle on scroll,
// with a 1/5 → 5/5 counter advancing as the frontmost card peels to the back.
//
// Citations:
//   PRIMARY    mwg_045  Folders           — perspective stack + pointer-driven root tilt
//   SECONDARY  mwg_042  Smooth stacking   — scrub-driven per-card cascade reveal

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initRolodexPortfolio({
  pinSelector     = '.pin',
  stageSelector   = '.stage',
  cardSelector    = '.card',
  counterSelector = '#num',
  scrollDistance  = 4800,
  scrub           = 0.6,
} = {}) {
  const cards  = gsap.utils.toArray(cardSelector);
  const total  = cards.length;
  const number = document.querySelector(counterSelector);

  // Stack pose — i === 0 is frontmost, larger i recedes into depth.
  const stackPose = (i) => ({
    z:         -i * 140,
    y:         -i * 28,
    rotationX: -6,
    rotationZ: (i % 2 === 0 ? -1 : 1) * 1.8,
    scale:     1 - i * 0.05,
    opacity:   i < 4 ? 1 : 0.55,
  });

  cards.forEach((card, i) => {
    gsap.set(card, { ...stackPose(i), transformOrigin: '50% 60%' });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger:  pinSelector,
      start:    'top top',
      end:      `+=${scrollDistance}`,
      pin:      true,
      scrub,
      onUpdate: (self) => {
        const idx = Math.min(total, Math.floor(self.progress * total) + 1);
        if (number && number.textContent !== String(idx)) number.textContent = idx;
      },
    },
  });

  // One peel per transition — (total - 1) peels across the timeline.
  const step = 1 / (total - 1);

  for (let k = 0; k < total - 1; k++) {
    cards.forEach((card, i) => {
      if (i === k) {
        tl.to(card, {
          z:         280,
          y:         240,
          rotationX: -38,
          opacity:   0,
          ease:      'power2.in',
        }, k * step);
      } else if (i > k) {
        tl.to(card, { ...stackPose(i - k - 1), ease: 'power2.out' }, k * step);
      }
    });
  }

  // Pointer-driven root tilt — the signature touch from mwg_045.
  const stage = document.querySelector(stageSelector);
  if (stage) {
    const qx = gsap.quickTo(stage, 'rotationY', { duration: 0.6, ease: 'power2.out' });
    const qy = gsap.quickTo(stage, 'rotationX', { duration: 0.6, ease: 'power2.out' });
    window.addEventListener('pointermove', (e) => {
      qx((e.clientX / window.innerWidth  - 0.5) * 12);
      qy(-(e.clientY / window.innerHeight - 0.5) * 7);
    });
  }

  return tl;
}
