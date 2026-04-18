# mwg_003 — Card shuffle

**Category:** Card Scroll
**Source:** `index.html`, `assets/script.js`, `assets/style.css`

## The effect
Cards appear one by one from the bottom of the screen, move toward the center, then fan out in a clockwise arc like a dealer spreading a hand. Each card sits on the edge of a large circle and the circles rotate, producing the fan. Pinned for the full height of a tall pin-height sibling.

## Technique
- **Pattern:** Multiple concentric rotating wheels + translate-in on scroll
- **Key plugins:** ScrollTrigger, Lenis (optional)
- **Motion primitives:** per-circle `gsap.fromTo()` rotation driven by scrub, combined with card enter transforms

## Use when
- Playful hero reveal — casino, editorial, fashion lookbook openers
- Sequence where 6–10 items should all end on screen together
- Scenes that benefit from a "flourish" moment at the end of the reveal

## Avoid when
- Minimal / editorial brands where a big gesture reads gimmicky
- High-density content where the fan obscures type
- When card size doesn't scale well (circles get huge on wide screens)

## Mobile behavior *(draft — review)*
- Fan arc scales poorly on narrow viewports; reduce card count or collapse into a vertical reveal for < 768px
- Pinning duration should be shortened on mobile (fewer scroll ticks tolerated)

## Accessibility *(draft — review)*
- `prefers-reduced-motion: reduce` — fade cards in statically at their final rotated positions, no arc animation
- Ensure card order in the DOM matches visual order for screen readers

## Tags
card-scroll, fan, arc, reveal, rotation, hero, flourish
