# mwg_007 — Rounded trajectory

**Category:** Card Scroll
**Source:** `index.html`, `assets/script.js`, `assets/style.css`
**Tutorial:** Tutorial 007 — Made With Gsap.pdf

## The effect
Images appear to follow a rounded trajectory as the user scrolls. Each image is positioned at the edge of an oversized div that extends past the viewport; rotating the div produces a curved conveyor-belt effect. A container is pinned for the entire pin-height duration.

## Technique
- **Pattern:** Oversized rotating div with children placed on its circumference
- **Key plugins:** ScrollTrigger, Lenis (optional)
- **Motion primitives:** `gsap.to(div, { rotate: ... })` with `pin` + `scrub`; each child is counter-rotated so the image stays upright

## Use when
- You want a single hero-style sequence that feels physical / mechanical
- Showcasing 5–8 images or cards as one unified object
- Scenes where the curve itself is part of the mood (fashion, cinema, music)

## Avoid when
- Page transitions or footers — too big a gesture for a sub-zone
- Small viewports where the arc flattens out and loses the effect
- Copy-heavy content (the curve is the star)

## Mobile behavior *(draft — review)*
- The rotating oversized div is fine on mobile as long as `overflow: clip` and GPU accel are in place
- Consider reducing the rotation range or falling back to a vertical scroll of stacked images below 768px

## Accessibility *(draft — review)*
- `prefers-reduced-motion: reduce` — render items in a straight horizontal row, no rotation
- Check focus order matches visual order along the arc

## Tags
card-scroll, arc, rotation, trajectory, pin, hero, cinematic
