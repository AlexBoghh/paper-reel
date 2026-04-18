# GSAP Animation Library

A curated library of 12 scroll-driven GSAP animations, organized in two categories. Each animation folder contains:
- `index.html` — full working page
- `assets/script.js` — the GSAP logic
- `assets/style.css` — styling
- `assets/medias/` — supporting media
- `description.md` — structured metadata for agent-driven citation (technique, use-when, avoid-when, mobile, accessibility, tags)
- `recipe.mjs` — parameterized generator consumed by `tools/compose-export.mjs`

All animations use **ScrollTrigger** and optionally **Lenis** for smooth scroll. All are original tutorials by [Made With GSAP](https://madewithgsap.com) — the source code + annotations are preserved here for agent consumption; see that site for the accompanying written tutorials.

---

## Card Scroll Animations

Motion that moves, pins, or rearranges images and cards as the user scrolls.

| ID | Name | One-liner | Tags |
|---|---|---|---|
| [mwg_001](Card%20Scroll%20Animations/mwg_001/description.md) | Card stack | Horizontal pinned scroll with jittered cards; feels like a deck being spread | card-scroll, pin, horizontal-scrub, editorial |
| [mwg_003](Card%20Scroll%20Animations/mwg_003/description.md) | Card shuffle | Cards rise from below and fan out like a dealer's hand | card-scroll, fan, arc, reveal |
| [mwg_007](Card%20Scroll%20Animations/mwg_007/description.md) | Rounded trajectory | Images travel along a curved path via a rotating oversized div | card-scroll, arc, rotation, cinematic |
| [mwg_023](Card%20Scroll%20Animations/mwg_023/description.md) | Infinite circular movement | Images orbit a circle endlessly, drifting outward on fast scroll | card-scroll, orbit, infinite, velocity |
| [mwg_042](Card%20Scroll%20Animations/mwg_042/description.md) | Smooth stacking images | Stacked cards reveal one-by-one; deck moves forward as top card departs | card-scroll, stack, reveal, storytelling |
| [mwg_045](Card%20Scroll%20Animations/mwg_045/description.md) | Folders | Perspective-stacked slides cycle infinitely with a pointer-driven root tilt | card-scroll, perspective, rolodex, depth |

## Text Animations

Motion that reveals, cycles, or transforms type as the user scrolls.

| ID | Name | One-liner | Tags |
|---|---|---|---|
| [mwg_004](Text%20Animations/mwg_004/description.md) | Simultaneous words | Words slide in from the right edge with an overlapping stack | text, paragraph, reveal, horizontal-slide |
| [mwg_005](Text%20Animations/mwg_005/description.md) | Word by word | Words slide in from the right, each staggered after the previous | text, paragraph, stagger, elegant |
| [mwg_006](Text%20Animations/mwg_006/description.md) | Progressive sentences | Paragraphs disappear word-by-word as the next appears; dynamic, chainable | text, multi-paragraph, cycling, storytelling |
| [mwg_009](Text%20Animations/mwg_009/description.md) | Up & Down | Phrases swap letter-by-letter in opposite directions as you scroll | text, letter-split, chained, directional |
| [mwg_010](Text%20Animations/mwg_010/description.md) | Jazzy letters | Horizontal marquee with letters riding a sine wave; playful | text, letter-split, sine-wave, playful |
| [mwg_011](Text%20Animations/mwg_011/description.md) | Smooth letters | Horizontal marquee where letters settle into place cleanly | text, letter-split, marquee, restrained |

---

## How the agent uses this library

When the user describes motion in plain language, the agent:

1. **Reads this file** to understand the full library at a glance.
2. **Picks candidates** based on tags and one-liners.
3. **Reads the relevant `description.md` files** for the shortlisted candidates to confirm fit (technique, use-when, avoid-when).
4. **Cites them** in the MOTION PLAN zone of the Paper canvas with weights and reasons, quoting from each `description.md`'s "The effect" paragraph.
5. **Reads the actual `index.html`, `script.js`, `style.css`** of the chosen citation(s) when generating the final exportable GSAP code.

The original written tutorials live at [madewithgsap.com](https://madewithgsap.com). The `description.md` files in this repo distill each tutorial's technique, use-when/avoid-when guidance, and mobile/accessibility notes into a format the agent can consume — so the agent never needs to read long-form tutorial prose at runtime.

---

## Conventions

- **Folder name = animation ID** (e.g., `mwg_001`). Always lowercase with underscore.
- **Category folder names** use Title Case with spaces (e.g., `Card Scroll Animations`).
- **All mobile behavior and accessibility notes in description.md files are currently drafts** — they need a human review pass before shipping.
- **Tags** are freeform but consistent across the library — use existing tags before inventing new ones.
