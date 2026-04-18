# mwg_045 — Folders

**Category:** Card Scroll
**Source:** `index.html`, `assets/script.js`, `assets/style.css`
**Tutorial:** Tutorial 045 — Made With Gsap.pdf

## The effect
Slides are arranged one behind the other with perspective. As the user scrolls, the slides scroll infinitely — the closest slide disappears and is re-placed at the back of the queue. The root also picks up a slight rotation from the cursor position for a subtle parallax-feel.

## Technique
- **Pattern:** Perspective-stacked slides (like a Rolodex) cycling on scroll + pointer-driven root tilt
- **Key plugins:** ScrollTrigger, optional pointer events listener
- **Motion primitives:** scrub-driven translate-Z / translate-Y on each slide, with queue recycling logic; `gsap.quickTo()` for the mouse-tilt

## Use when
- Portfolio detail views where each slide is a distinct project
- Playful hero or landing sequences where interaction feels earned
- Scenes where the perspective / depth itself is part of the brand

## Avoid when
- Enterprise-serious contexts where the tilt and perspective feel unearned
- Users need to scan all items simultaneously (only ~3 slides visible at a time)
- Screen readers will struggle with the cycling stack

## Mobile behavior *(draft — review)*
- Pointer tilt obviously doesn't exist on touch; swap for gyroscope or disable on mobile
- Perspective stack works fine but reduce number of layers for perf

## Accessibility *(draft — review)*
- `prefers-reduced-motion: reduce` — show slides as a flat vertical list
- Ensure DOM order = intended reading order; the visual z-stack hides ordering
- Disable the pointer-tilt when reduced motion is requested

## Tags
card-scroll, perspective, rolodex, depth, pointer-tilt, portfolio
