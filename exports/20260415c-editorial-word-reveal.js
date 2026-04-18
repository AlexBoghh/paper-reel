/*
 * Reel export — "Quiet willow · at dusk whispers"
 * Editorial headline word-by-word reveal + body paragraph fade-in.
 *
 * Citations (from GSAP Animations/library.md):
 *   PRIMARY    mwg_005 "Word by word"        — staggered word slide-in, scrub-driven
 *   SECONDARY  mwg_004 "Simultaneous words"  — stacking reveal for lower block
 *
 * Target viewport: 1440 × 900 desktop (16:10).
 *
 * Expected DOM (authored to match the SOURCE page in Paper):
 *   .pin-height
 *     .container (pinned)
 *       .topbar
 *       .headline-wrap
 *         .headline.line-1 > .word > .word-inner
 *         .headline.line-2 > .word > .word-inner
 *       .lower
 *         .body-paragraph
 *         .byline
 */

gsap.registerPlugin(ScrollTrigger);

export function initQuietWillow() {
  // Optional smooth scroll — drop in if your app does not already own a Lenis instance.
  if (window.Lenis && !window.__lenisOwned) {
    const lenis = new window.Lenis({ autoRaf: true });
    lenis.on('scroll', ScrollTrigger.update);
  }

  // Scroll hint dismissal on first scroll tick.
  gsap.to('.scroll', {
    autoAlpha: 0,
    duration: 0.2,
    scrollTrigger: {
      trigger: '.pin-height',
      start: 'top top',
      end: 'top top-=1',
      toggleActions: 'play none reverse none'
    }
  });

  // Collect headline word wrappers (one per word across both lines).
  const words = gsap.utils.toArray('.headline .word .word-inner');

  // Initial state — words off-screen right, lower block held until the headline
  // has had time to breathe.
  gsap.set(words, { xPercent: 120, autoAlpha: 0 });
  gsap.set('.body-paragraph, .byline', { autoAlpha: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.pin-height',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      pin: '.container'
    }
  });

  // PRIMARY · mwg_005 — each word lands with weight, slightly after the last.
  // power4.out gives the paced editorial feel; stagger 0.9 (in timeline-time) means
  // the five words land across roughly the first 70% of scroll distance.
  tl.to(words, {
    xPercent: 0,
    autoAlpha: 1,
    stagger: 0.9,
    duration: 1.0,
    ease: 'power4.out'
  }, 0);

  // SECONDARY · mwg_004 (in spirit) — body paragraph resolves once the last word
  // has settled. Overlap by -0.4 so there's no dead pause between stages.
  tl.to('.body-paragraph', {
    autoAlpha: 1,
    duration: 1.6,
    ease: 'power2.out'
  }, '>-0.4')
    .to('.byline', {
      autoAlpha: 1,
      duration: 1.0,
      ease: 'power2.out'
    }, '<+0.4');
}

// Auto-init on DOMContentLoaded when loaded directly (not as a module import).
if (typeof window !== 'undefined' && document.readyState !== 'loading') {
  initQuietWillow();
} else if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initQuietWillow);
}
