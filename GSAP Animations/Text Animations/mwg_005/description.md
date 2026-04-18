# mwg_005 — Word by word

**Category:** Text Animation
**Source:** `index.html`, `assets/script.js`, `assets/style.css`

## The effect
Words enter from the right edge of the screen and slide to their final positions, but with a staggered start — each word begins moving slightly after the previous, producing a more elegant, paced reveal than a simultaneous slide. Tied to user scroll via ScrollTrigger.

## Technique
- **Pattern:** Auto-split paragraph + per-word stagger driven by scrub
- **Key plugins:** ScrollTrigger, Lenis (optional)
- **Motion primitives:** `gsap.from()` on word elements with `stagger` property, `scrub: true`

## Use when
- Restrained editorial hero copy where pacing matters
- Single-sentence manifestos or taglines
- When you want a slower, more deliberate feel than mwg_004 delivers

## Avoid when
- Body copy, always
- Paragraphs longer than ~15 words (stagger becomes boring)
- Fast-paced product pages where users want info now

## Mobile behavior *(draft — review)*
- Staggered reveals feel fine on touch because the pacing is natural to swipe-scroll
- Shorten the per-word stagger delay on smaller screens

## Accessibility *(draft — review)*
- `prefers-reduced-motion: reduce` — show the full text statically
- Preserve readable-order semantics; screen readers should get the whole sentence at once

## Tags
text-animation, paragraph, stagger, elegant, paced, editorial
