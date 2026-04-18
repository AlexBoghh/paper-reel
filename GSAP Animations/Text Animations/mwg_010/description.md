# mwg_010 — Jazzy letters

**Category:** Text Animation
**Source:** `index.html`, `assets/script.js`, `assets/style.css`
**Tutorial:** Tutorial 010 — Made With Gsap.pdf

## The effect
A sentence scrolls from right to left as the user scrolls. Letters appear and disappear dynamically at the viewport edges, and are arranged along a tweakable sine wave so the line undulates — "a bit of a jazz vibe," in the author's words. Scat-singing energy.

## Technique
- **Pattern:** Horizontal scroll-linked marquee + per-letter sine-wave y offset
- **Key plugins:** ScrollTrigger, Lenis (optional)
- **Motion primitives:** horizontal `x` translation of the text container via scrub + per-letter `y = amplitude * sin(index * frequency + phase)` computed on update

## Use when
- Music, entertainment, creative / experimental brands
- Scenes that want personality and a bit of whimsy
- Section breaks or interstitials between more restrained zones

## Avoid when
- Corporate, finance, health — tonal mismatch
- Important informational copy — the wave hurts readability
- Long sentences (the wave math gets visually chaotic)

## Mobile behavior *(draft — review)*
- Works on mobile; scale the wave amplitude with viewport height so it doesn't clip
- Shorter sentences perform better on narrow screens

## Accessibility *(draft — review)*
- `prefers-reduced-motion: reduce` — show the sentence statically on a straight baseline
- Letter-split text needs `aria-label` with full text on the container and `aria-hidden` on the split letters

## Tags
text-animation, letter-split, sine-wave, marquee, horizontal-scroll, playful, experimental
