// Reel R01 · Portfolio Index — Curved Trajectory into Infinite Carousel
// Composition of two MWG animations: mwg_007 (arc scrub) + mwg_023 (infinite orbit via wheel velocity)
//
// DOM expectation:
//   <section class="stage-section">
//     <div class="stage">
//       <div class="container">
//         <div class="circle"><div class="tile tile-01">…</div></div>
//         … × 8 circles, tile classes tile-01 through tile-08
//       </div>
//     </div>
//   </section>
//
// Each .circle is an oversized square whose child .tile is anchored at the top edge —
// rotating the circle arcs the tile through space (mwg_007). In Phase B, the whole
// .container rotation is driven by wheel velocity (mwg_023).
//
// Dependencies: gsap, ScrollTrigger, Lenis (optional but recommended).

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initPortfolioReel(opts = {}) {
  const {
    stageSectionSelector = '.stage-section',
    stageSelector        = '.stage',
    containerSelector    = '.container',
    circleSelector       = '.circle',
    arcEndScroll         = '75% bottom', // ScrollTrigger end for Phase A (give the arc breathing room)
    scrubSmoothing       = 1,            // seconds of catch-up smoothing on the scrub
    onPhaseChange        = null,         // (phase: 'arc' | 'orbit') => void
    useLenis             = true,
    tileCount            = 8,
  } = opts;

  if (useLenis) {
    const lenis = new Lenis({ autoRaf: true });
    lenis.on('scroll', ScrollTrigger.update);
  }

  const stage     = document.querySelector(stageSelector);
  const container = document.querySelector(containerSelector);
  const circles   = gsap.utils.toArray(`${stageSectionSelector} ${circleSelector}`);

  // Pin the stage through the entire stage-section scroll.
  ScrollTrigger.create({
    trigger: stageSectionSelector,
    start:   'top top',
    end:     'bottom bottom',
    pin:     stage,
  });

  // PHASE A — arc: each circle scrubs rotation from +30° → -30° with stagger.
  gsap.fromTo(
    circles,
    { rotation: 30 },
    {
      rotation: -30,
      ease:     'power2.inOut',
      stagger:  0.06,
      scrollTrigger: {
        trigger: stageSectionSelector,
        start:   'top top',
        end:     arcEndScroll,
        scrub:   scrubSmoothing,
      },
    }
  );

  // PHASE B — orbit: wheel-driven continuous rotation of the container.
  let incr = 0;
  let orbitActive = false;
  const rotTo = gsap.quickTo(container, 'rotation', { duration: 0.8, ease: 'power4' });

  ScrollTrigger.create({
    trigger: stageSectionSelector,
    start:   arcEndScroll,
    end:     'bottom bottom',
    onEnter: () => {
      orbitActive = true;
      onPhaseChange && onPhaseChange('orbit');
      // Rearrange circles into equidistant ring positions.
      circles.forEach((c, i) => {
        gsap.to(c, {
          rotation: (360 / tileCount) * i - 90,
          duration: 1.1,
          ease:     'power2.inOut',
        });
      });
    },
    onLeaveBack: () => {
      orbitActive = false;
      onPhaseChange && onPhaseChange('arc');
      // Restore end-of-arc rotation (−30° for all).
      circles.forEach((c) => {
        gsap.to(c, { rotation: -30, duration: 0.9, ease: 'power2.inOut' });
      });
      incr = 0;
      rotTo(0);
    },
  });

  // Wheel-driven orbit rotation (mwg_023 pattern) + per-tile velocity drift.
  const driftA = gsap.quickTo('.tile-01, .tile-05', 'y', { duration: 0.9, ease: 'power3' });
  const driftB = gsap.quickTo('.tile-03, .tile-07', 'y', { duration: 1.6, ease: 'power3' });
  const driftC = gsap.quickTo('.tile-02, .tile-04, .tile-06, .tile-08', 'y', { duration: 2.4, ease: 'power3' });

  window.addEventListener(
    'wheel',
    (e) => {
      if (!orbitActive) return;
      incr -= e.deltaY / 40;
      rotTo(incr);

      const driftVal = -Math.abs(e.deltaY / 6);
      driftA(driftVal);
      driftB(driftVal * 0.6);
      driftC(driftVal * 0.3);
    },
    { passive: true }
  );

  return {
    get orbitActive() { return orbitActive; },
    destroy() {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    },
  };
}
