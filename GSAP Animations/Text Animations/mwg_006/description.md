# mwg_006 — Progressive sentences

**Category:** Text Animation
**Source:** `index.html`, `assets/script.js`, `assets/style.css`

## The effect
A paragraph disappears word by word while the next paragraph appears in the same word-by-word rhythm. The logic is dynamic: add more paragraphs and the effect extends automatically. Reads like sequential captions revealing a continuous thought.

## Technique
- **Pattern:** Paragraph cycling with word-split + cross-fade / translate, driven by scroll progress
- **Key plugins:** ScrollTrigger, Lenis (optional)
- **Motion primitives:** dynamic paragraph array iteration + per-word `gsap.to()` opacity / translate with scrub-driven offsets

## Use when
- Long-form scroll stories, essays, oral-history-style sites
- Multi-beat product pages where each sentence is a distinct message
- Scenes where you want the user to feel they're being told a story in chapters

## Avoid when
- Anything with a dense grid or parallel content — this effect hogs attention
- Short pages (under 1–2 viewport heights of scroll)
- When users need to re-read or jump around

## Mobile behavior *(draft — review)*
- Works well on mobile — the word-by-word rhythm is inherently gentle
- Shorten paragraphs; mobile viewports can't hold long sentences visually

## Accessibility *(draft — review)*
- `prefers-reduced-motion: reduce` — show all paragraphs stacked vertically with normal scroll
- Screen readers should still get each paragraph as a complete sentence, not word tokens

## Tags
text-animation, multi-paragraph, cycling, progressive, storytelling, narrative
