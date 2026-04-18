# Paper Reel — Claude Code instructions

Agent-driven scroll-motion tooling on Paper's canvas. Pronounced "reel" like a film reel.

## Primary skill

When the user describes scroll-driven motion or asks to build, preview, iterate, or export motion on a Paper canvas, activate the `reel` skill at `_skill_extracted/reel/SKILL.md`. It contains the full eleven-stage flow, canvas layout spec, Paper MCP rules of engagement, and library-read protocols.

The skill must be installed to `~/.claude/skills/reel/` before Claude Code can load it:

```bash
npm install
npm run repack -- --install
```

Then `/clear` the Claude Code session so the updated skill activates.

## GSAP animation library

The curated library lives at `GSAP Animations/`. Start with `library.md` as the top-level index. Never read the PDF tutorials at runtime — they are source material, not runtime data. Always go `library.md` → `<folder>/description.md` → the actual code (`index.html`, `assets/script.js`, `assets/style.css`).

All twelve animations are tutorials by Made With GSAP. The curation, tagging, and `description.md` annotations are this project's contribution.

## Working directories

- `previews/` — generated HTML previews + motion-plan.json + frames.json + optional GIFs (see `previews/README.md`)
- `exports/` — exported GSAP JS modules (see `exports/README.md`)
- `GSAP Animations/` — library (read-only in practice)

## Project history

For the full story of how this project developed — origin pivot away from generic "AI + design tool" ideas, v0 editorial mockup, v1 film-reel aesthetic, four rounds of canvas iteration, Cloudinary hosting breakthrough, Browserbase migration, and the recipe-compose + validator architecture — see `EVOLUTION.md`.
