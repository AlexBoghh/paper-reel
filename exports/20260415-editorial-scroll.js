/**
 * Editorial Scroll — 5 Photographs · 3 Taglines
 *
 * Citations:
 *   PRIMARY   — mwg_042  Smooth stacking images  (Card Scroll Animations)
 *   SECONDARY — mwg_009  Up & Down               (Text Animations)
 *
 * Requires: GSAP 3 + ScrollTrigger plugin
 * Target:   desktop 1440×900
 *
 * Expected DOM structure:
 *   .scroll-section          — 700vh wrapper (drives scroll distance)
 *     .stage                 — sticky 100vh panel (position:sticky; top:0)
 *       .tagline#t1          — first tagline (plain text; split by this script)
 *       .tagline#t2          — second tagline
 *       .tagline#t3          — third tagline
 *       .photo-col
 *         .photo#ph1–ph5     — five editorial photographs
 *
 * Expected CSS on .tagline: display:flex; justify-content:center; white-space:nowrap
 * Expected CSS on .tagline span: display:inline-block
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initEditorialScroll() {
  const section = document.querySelector('.scroll-section');
  const photos  = Array.from(document.querySelectorAll('.photo'));
  if (!section || !photos.length) return;

  // ── Letter-split taglines (mwg_009 technique) ──────────────────────────
  // Splits each tagline's text into individually animatable <span> letters.
  document.querySelectorAll('.tagline').forEach(el => {
    el.innerHTML = el.textContent.split('').map(c =>
      c === ' ' ? '<span>&nbsp;</span>' : `<span>${c}</span>`
    ).join('');
  });

  // t2 and t3 wait below the viewport until their swap fires
  gsap.set(['#t2', '#t3'], { yPercent: 50, y: '50vh' });

  // ── Tagline swap timeline (mwg_009 technique) ────────────────────────────
  // A 12-unit scrub timeline maps the full section scroll to three tagline states.
  // swap1 label at unit 2 (~17% scroll): BEAUTIFULLY STILL → QUIETLY ALIVE
  // swap2 label at unit 7 (~58% scroll): QUIETLY ALIVE    → ENDLESSLY YOURS
  const tlSwap = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end:   'bottom bottom',
      scrub: true,
    }
  });

  tlSwap
    .addLabel('swap1', 2)
    .to('#t1',      { yPercent: -50, y: '-50vh', ease: 'power4.in',  duration: 1 }, 'swap1')
    .to('#t1 span', { yPercent: -50, y: '-50vh', stagger: -0.02, ease: 'power2.in',  duration: 1 }, 'swap1')
    .fromTo('#t2',      { yPercent: 50, y: '50vh' }, { yPercent: 0, y: 0, ease: 'power4.out', duration: 1 }, 'swap1')
    .fromTo('#t2 span', { yPercent: 50, y: '50vh' }, { yPercent: 0, y: 0, stagger: -0.02, ease: 'power2.out', duration: 1 }, 'swap1')
    .addLabel('swap2', 7)
    .to('#t2',      { yPercent: -50, y: '-50vh', ease: 'power4.in',  duration: 1 }, 'swap2')
    .to('#t2 span', { yPercent: -50, y: '-50vh', stagger: -0.02, ease: 'power2.in',  duration: 1 }, 'swap2')
    .fromTo('#t3',      { yPercent: 50, y: '50vh' }, { yPercent: 0, y: 0, ease: 'power4.out', duration: 1 }, 'swap2')
    .fromTo('#t3 span', { yPercent: 50, y: '50vh' }, { yPercent: 0, y: 0, stagger: -0.02, ease: 'power2.out', duration: 1 }, 'swap2')
    .addLabel('end', 12);

  // ── Photo stagger reveals (mwg_042 technique, adapted) ─────────────────
  // All five photos start at y:100vh (below viewport) with opacity:0.
  // Each photo has its own ScrollTrigger with a unique start offset so they
  // cascade into position sequentially — the weighted stagger of mwg_042
  // adapted from exit-to-top into enter-from-below.
  const sectionH    = section.offsetHeight;
  const photoWindow = sectionH * 0.60; // reveals complete within first 60% of scroll
  const perPhoto    = photoWindow / photos.length;

  gsap.set(photos, { y: '100vh', opacity: 0 });

  photos.forEach((ph, i) => {
    gsap.to(ph, {
      y:       0,
      opacity: 1,
      ease:    'power4.out',
      scrollTrigger: {
        trigger: section,
        start:   `top+=${i * perPhoto} top`,
        end:     `top+=${i * perPhoto + perPhoto * 0.85} top`,
        scrub:   0.6,
      }
    });
  });
}
