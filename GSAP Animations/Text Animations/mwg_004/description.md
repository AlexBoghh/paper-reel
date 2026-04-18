# mwg_004 — Simultaneous words

**Category:** Text Animation
**Source:** `index.html`, `assets/script.js`, `assets/style.css`

## The effect
Words in a paragraph slide in from the right edge of the screen to their final position, with a stacking effect — each word overlaps slightly with the next. The reveal is tied to user scroll, so the paragraph assembles as the page moves. No manual `<span>` wrapping required; the script splits words automatically.

## Technique
- **Pattern:** Auto-split paragraph into word spans + scrub-driven horizontal slide
- **Key plugins:** ScrollTrigger, Lenis (optional)
- **Motion primitives:** JS word-splitting + `gsap.to()` per word with staggered `x` offsets driven by scrub

## Use when
- Editorial hero paragraphs, manifestos, brand statements
- Long-form intros where each word should land with weight
- Scenes where the text itself is the focal point, not an accessory

## Avoid when
- Body copy — this is a moment-making effect, not a reading effect
- Very long paragraphs (sliding stagger gets tedious past ~15 words)
- Multilingual sites where word lengths vary wildly and break the stack rhythm

## Mobile behavior *(draft — review)*
- Works on mobile; main concern is that the slide-in distance needs to scale with viewport width
- Consider tightening stagger or reducing offset magnitude below 768px

## Accessibility *(draft — review)*
- `prefers-reduced-motion: reduce` — show the paragraph statically, no word slides
- Word-splitting should preserve semantics — the full paragraph text must remain readable by screen readers (assistive tech shouldn't read word-by-word)

## Tags
text-animation, paragraph, reveal, horizontal-slide, stagger, editorial
