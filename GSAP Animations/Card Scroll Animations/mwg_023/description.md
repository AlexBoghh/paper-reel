# mwg_023 — Infinite circular movement

**Category:** Card Scroll
**Source:** `index.html`, `assets/script.js`, `assets/style.css`

## The effect
Images continuously orbit around a large circle based on the user's scroll. The faster the user scrolls, the more certain images drift outward from their orbit before snapping back, giving a subtle elastic-velocity feel. Container extends beyond the screen to create the curved path.

## Technique
- **Pattern:** Continuous (looping) rotation tied to scroll velocity + per-image drift reactive to scroll speed
- **Key plugins:** ScrollTrigger (with velocity), Lenis (recommended for smooth velocity)
- **Motion primitives:** modulo-based rotation, `ScrollTrigger.getVelocity()` or `onUpdate` delta to drive per-image drift offset

## Use when
- Portfolio or collection pages where "endless content" is the vibe
- Showcases where you want the user to feel the scroll, not just see it
- Experimental / editorial sites that reward exploration

## Avoid when
- E-commerce product grids — users need to compare items side by side
- Performance-sensitive contexts (velocity-reactive transforms stress the GPU)
- Sites targeting older mobile hardware

## Mobile behavior *(draft — review)*
- Velocity-reactive effects feel odd with touch scrolling (momentum is native)
- Consider dampening the drift or switching to a static orbit below 768px

## Accessibility *(draft — review)*
- `prefers-reduced-motion: reduce` — show images in a static horizontal or grid layout, no rotation
- Infinite loops can be disorienting; give users a clear way out

## Tags
card-scroll, orbit, infinite, velocity, drift, loop, experimental
