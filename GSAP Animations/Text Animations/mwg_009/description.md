# mwg_009 — Up & Down

**Category:** Text Animation
**Source:** `index.html`, `assets/script.js`, `assets/style.css`

## The effect
Short phrases are displayed letter by letter. The letters of one phrase disappear upward (or downward) at the same time as the letters of the next phrase appear from the opposite direction. Dynamic logic — add phrases and the effect continues to chain.

## Technique
- **Pattern:** Letter-split with directional enter/exit driven by scroll
- **Key plugins:** ScrollTrigger, Lenis (optional)
- **Motion primitives:** JS letter-splitting + `gsap.to()` per letter with `y` or `yPercent` stagger, cross-faded between phrases

## Use when
- Short, punchy taglines or quotes in sequence (3–8 words each)
- Scroll-driven hero sections that want to feel typographic and confident
- Scenes where you want the type itself to carry the drama

## Avoid when
- Long phrases (letter-level animation on 10+ words looks noisy)
- Body copy — reading is the enemy of letter-by-letter reveals
- Brands that want a minimal, restrained feel

## Mobile behavior *(draft — review)*
- Letter-level animations are fine on mobile, but limit characters per phrase to avoid overflow
- Reduce stagger delay on smaller screens to keep pacing

## Accessibility *(draft — review)*
- `prefers-reduced-motion: reduce` — show phrases as a static vertical stack
- CRITICAL: letter-split text can break screen readers; use `aria-label` on the container with the full text and `aria-hidden="true"` on the split letters

## Tags
text-animation, letter-split, multi-phrase, chained, directional, hero, typographic
