# exports/

This directory holds the production GSAP modules Reel generates. **Everything here came from iteration and testing runs** — the same motion briefs that produced artifacts in `../previews/`. They're preserved so the jury can read the actual GSAP code the tool emits for different library citations, not just screenshots of it.

Each `.js` file here pairs 1:1 with a `.html` + `.motion-plan.json` + `.frames.json` set in `../previews/` (same basename).

## Format

Each export is a standalone ES module:

```js
// exports/<name>.js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// ... composed from the cited recipes, with params pulled from motion-plan.json ...
```

Drop it into a Vite or Next.js project, mount the host HTML the recipe expects (from each recipe's `generateMarkup(opts)` contract), and the scroll animation runs.

## Two generations

Older runs (`20260415*`, `2026-04-16*`) were written BEFORE the recipe-compose architecture landed. Their code is hand-generated and may contain drift from the cited library entries — e.g., inline values like `innerHeight * 0.18` that don't match the library entry's technique exactly. SKILL.md documents these as historical artifacts:

> Migration note: `exports/*.js` files authored before this skill version are NOT auto-regenerated. They remain as historical artifacts. Only new runs conform to the recipe-and-validator contract.

Newer runs (`2026-04-17*`, `2026-04-18*`) come from `tools/compose-export.mjs`, which mechanically composes each cited recipe's `generate(opts)`. These pass the validator gate (`tools/validate-export.mjs`) before Stage 9 is allowed to run. They are byte-identically reproducible from their `motion-plan.json`.

See `EVOLUTION.md` → *Recipe-compose + validator gate* for why this changed.
