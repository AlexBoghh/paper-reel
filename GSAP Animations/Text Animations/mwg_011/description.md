# mwg_011 — Smooth letters

**Category:** Text Animation
**Source:** `index.html`, `assets/script.js`, `assets/style.css`
**Tutorial:** Tutorial 011 — Made With Gsap.pdf

## The effect
A sentence scrolls from right to left as the user scrolls. As the sentence moves across the viewport, letters gradually settle into their correct positions — starting slightly jittered or offset, then resolving. The smooth version of mwg_010's jazz energy — same mechanic, no wave, letters just "land" cleanly.

## Technique
- **Pattern:** Horizontal scroll-linked marquee + per-letter smoothing toward final position
- **Key plugins:** ScrollTrigger, Lenis (optional)
- **Motion primitives:** horizontal `x` translation via scrub + per-letter lerp / interpolation of offset toward zero based on scroll progress

## Use when
- Marquee-style taglines that should feel considered, not gimmicky
- Hero or mid-page moments where the type itself is the hero
- Brands that want motion without whimsy

## Avoid when
- Long sentences — the settle mechanic stops reading once the line is off-screen
- Body copy
- Any place where the user expects to read the text before scrolling further

## Mobile behavior *(draft — review)*
- Fine on mobile; check that the horizontal scroll distance equals the text width + viewport width so the full sentence passes through
- Consider reducing letter-level jitter amplitude on small screens

## Accessibility *(draft — review)*
- `prefers-reduced-motion: reduce` — show the sentence statically
- Letter-split needs `aria-label` on container with full text + `aria-hidden` on letters

## Tags
text-animation, letter-split, marquee, settle, horizontal-scroll, restrained, typographic
