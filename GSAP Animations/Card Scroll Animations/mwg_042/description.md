# mwg_042 — Smooth stacking images

**Category:** Card Scroll
**Source:** `index.html`, `assets/script.js`, `assets/style.css`
**Tutorial:** Tutorial 042 — Made With Gsap.pdf

## The effect
A series of cards is revealed one by one on scroll. As the topmost card disappears, the remaining deck moves forward toward the viewer, producing a smooth, weighted stacking sensation. The container is pinned for the full height of the pin-height sibling.

## Technique
- **Pattern:** Stacked z-sorted cards with per-card scrub-driven transforms (scale + translate)
- **Key plugins:** ScrollTrigger, Lenis (optional)
- **Motion primitives:** per-card `gsap.fromTo()` with individual `start` / `end` offsets along the scrub timeline so reveals cascade

## Use when
- Long-form storytelling pages — each card holds a beat
- Showing 4–8 key moments in sequence where order matters
- Scenes where you want a "weighted" feeling, not a breezy horizontal scroll

## Avoid when
- Quick browse-y experiences (user has to scroll slowly through each card)
- Above-the-fold sections where pin-release might feel slow
- Content that needs to be scanned non-linearly

## Mobile behavior *(draft — review)*
- Works decently on mobile because the transform math is simple; main concern is pin duration (feels long on small screens)
- Consider reducing card count or tightening scrub range below 768px

## Accessibility *(draft — review)*
- `prefers-reduced-motion: reduce` — show cards stacked vertically with no transform, native scroll
- Card contents should be fully readable without the reveal

## Tags
card-scroll, stack, reveal, pin, weighted, storytelling
