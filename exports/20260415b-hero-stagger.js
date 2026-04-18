// Paper Motion Tool — exported GSAP module (1440 × 900 target viewport)
// Composition: hero scales from full-bleed to 60% card while three project
// cards stagger in from the right. Target viewport 1440 × 900 (16:10 desktop).
//
// Citations:
//   PRIMARY   mwg_042  Smooth stacking images  — pin + scrub-driven scale/translate
//   SECONDARY mwg_005  Word by word            — per-item stagger from right, scrub
//
// Requires: gsap 3.12+, ScrollTrigger. Lenis is optional.
//
// DOM contract:
//   .hero-cards
//     .pin-height               (tall scroll track — e.g. 280vh)
//       .container              (viewport-height scene that gets pinned)
//         .hero                 (the hero block being scaled)
//         .cards
//           .card (×3)          (three project cards entering from the right)

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHeroStagger(root = document) {
  const scene = root.querySelector('.hero-cards');
  if (!scene) return () => {};

  const hero      = scene.querySelector('.hero');
  const cards     = scene.querySelectorAll('.card');
  const pin       = scene.querySelector('.pin-height');
  const container = scene.querySelector('.container');

  const triggers = [];

  triggers.push(
    ScrollTrigger.create({
      trigger: pin,
      start: 'top top',
      end: 'bottom bottom',
      pin: container,
    })
  );

  // Citation mwg_042 — scrub-driven hero scale via real width/height.
  triggers.push(
    gsap.fromTo(
      hero,
      { width: '100%', height: '62vh' },
      {
        width: '60%',
        height: '37vh',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: 'top+=70% top',
          scrub: 0.5,
        },
      }
    ).scrollTrigger
  );

  // Citation mwg_005 — per-item stagger from the right, scrub-driven.
  cards.forEach((card, i) => {
    triggers.push(
      gsap.fromTo(
        card,
        { xPercent: 140, autoAlpha: 0 },
        {
          xPercent: 0,
          autoAlpha: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: pin,
            start: `top+=${25 + i * 15}% top`,
            end:   `top+=${60 + i * 15}% top`,
            scrub: 0.6,
          },
        }
      ).scrollTrigger
    );
  });

  return () => {
    triggers.forEach((t) => t && t.kill && t.kill());
  };
}

export function initHeroStaggerStatic(root = document) {
  const scene = root.querySelector('.hero-cards');
  if (!scene) return;
  const hero = scene.querySelector('.hero');
  const cards = scene.querySelectorAll('.card');
  gsap.set(hero, { width: '60%', height: '37vh' });
  gsap.set(cards, { xPercent: 0, autoAlpha: 1 });
}
