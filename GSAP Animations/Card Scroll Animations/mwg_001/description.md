# mwg_001 — Card stack

**Category:** Card Scroll
**Source:** `index.html`, `assets/script.js`, `assets/style.css`
**Tutorial:** Tutorial 001 — Made With Gsap.pdf

## The effect
Replicates the movement of a stack of cards spreading and sliding across a surface. A section is pinned during a scroll distance while its inner row moves horizontally; each card is also offset by a small random rotation, x and y translation so the deck feels scattered as it passes.

## Technique
- **Pattern:** Horizontal scroll via pinned container + per-card fromTo jitter driven by the container's tween
- **Key plugins:** ScrollTrigger, Lenis (optional smooth scroll)
- **Motion primitives:** `gsap.to(cardsContainer, { x: -distance })` with `pin: true`, `scrub: true`; per-card `gsap.fromTo()` with `containerAnimation` bound to the horizontal tween

## Use when
- Editorial hero or collection strip where a horizontal journey is part of the story
- Showcasing 5–8 pieces where each deserves a moment
- You want the scene to feel crafted and physical, not grid-uniform

## Avoid when
- The row has more than ~10 cards (scroll distance gets punishing)
- On critical above-the-fold content where users may not wait for pin-release
- When content is dense text-heavy cards — the rotation hurts readability

## Mobile behavior *(draft — review)*
- Pinning with horizontal scroll is rough on touch devices; recommend reducing cards shown and shortening pin distance, or switching to a native horizontal snap-scroll carousel below 768px

## Accessibility *(draft — review)*
- `prefers-reduced-motion: reduce` — disable pin + scrub, show cards in a static horizontal scroll or vertical stack
- Ensure card content is keyboard-focusable and readable without the animation

## Tags
card-scroll, pin, horizontal-scrub, jitter, editorial, hero
