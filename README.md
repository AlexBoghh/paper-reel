# Reel

**Scroll-motion design on [Paper](https://paper.design)'s canvas, orchestrated by an agent.**

Submission for the [Paper × Contra](https://contra.com) challenge.

---

## What it is

Reel turns Paper's static scene graph into a motion-design surface. You describe scroll motion in plain language; an agent matches it against a curated GSAP library, storyboards it spatially across eight keyframes on the Paper canvas, writes a working GSAP preview, captures the real browser render via Browserbase cloud Chromium, and pipes the captures back onto the canvas — so the storyboard is pixel-identical to what the browser actually paints.

No backend, no deployment, no custom agent harness. Just a skill file, a GSAP corpus, and two external services (Browserbase + Cloudinary) stitched together by Claude Code through Paper's MCP.

## The loop

```
user brief (plain language)
        │
        ▼
┌─── agent ────────────────────────────────────────────────┐
│                                                          │
│  1. scan canvas                      (Paper MCP)         │
│  2. match brief against GSAP library (cites, never       │
│                                       invents)           │
│  3. build filmstrip on Paper         (sprockets,         │
│                                       timecodes,         │
│                                       8 frame windows,   │
│                                       SOURCE, slabs)     │
│  4. commit motion-plan.json          (schema-validated)  │
│  5. compose GSAP preview HTML        (from cited         │
│                                       recipes, no hand-  │
│                                       written code)      │
│  6. validate export                  (signatures +       │
│                                       completeness +     │
│                                       content)           │
│  7. capture real render per scroll % (Browserbase)       │
│  8. upload snapshots                 (Cloudinary)        │
│  9. fill filmstrip frames            (Paper MCP)         │
│ 10. (optional) encode GIF of full    (Browserbase +      │
│     scroll arc, drop LIVE PREVIEW     ffmpeg)            │
│     zone on canvas                                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
        │
        ▼
     storyboard on paper, pixel-identical to the browser
```

Eleven stages total, documented in [`_skill_extracted/reel/SKILL.md`](_skill_extracted/reel/SKILL.md).

## What makes it novel

- **Personal corpus is the moat.** The agent matches against a curated library of 12 GSAP animations (with mobile behavior and accessibility notes baked into each `description.md`). Not generic training data.
- **Spatial reasoning for temporal things.** Paper's static canvas enforces the right mental model: motion laid out in space, not time. Eight keyframes side-by-side read like a filmstrip.
- **The canvas → browser → canvas loop.** Storyboard frames aren't hand-drawn approximations. They're real browser screenshots of the actual GSAP preview, captured via headless cloud Chromium and piped back. What the designer sees on Paper is what the deployed animation does.
- **You cite, you don't invent.** Every motion pattern references a specific library entry. The composer (`tools/compose-export.mjs`) mechanically enforces this — unknown recipe IDs are rejected.

## Setup

### Prerequisites

- [Paper Desktop](https://paper.design) with MCP enabled
- [Claude Code](https://claude.com/claude-code)
- Node.js 20+
- [ffmpeg](https://ffmpeg.org) on `PATH` (for the optional LIVE PREVIEW GIF step)
- A [Browserbase](https://www.browserbase.com) account (free tier works)
- A [Cloudinary](https://cloudinary.com) account (free tier works)

### Install

```bash
git clone https://github.com/AlexBoghh/paper-reel.git
cd paper-reel
npm install
```

### Configure credentials

Copy `.env.example` to `.env` and fill in:

```bash
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
BROWSERBASE_API_KEY=bb_...
BROWSERBASE_PROJECT_ID=...
```

- **Cloudinary**: get the combined URL from [Cloudinary Dashboard → Account](https://console.cloudinary.com/console)
- **Browserbase**: get both from [Browserbase Settings → API Keys](https://www.browserbase.com/settings)

### Install the skill

```bash
npm run repack -- --install
```

This packages `_skill_extracted/reel/` into a redistributable `reel.skill` zip AND installs the live skill to `~/.claude/skills/reel/` so Claude Code sessions can load it.

Then `/clear` any running Claude Code session so the updated skill activates.

## Running

Open Paper Desktop with Paper MCP connected, then in a fresh Claude Code session inside this repo:

```
Run the reel skill.

Motion brief: [describe scroll motion in plain language]
```

The skill handles the rest. See `_skill_extracted/reel/SKILL.md` for the full flow, or [EVOLUTION.md](EVOLUTION.md) for the story of how this architecture came to be.

## Repo tour

```
.
├── _skill_extracted/reel/   # Skill source — SKILL.md + references/ + chrome-templates/
├── GSAP Animations/         # Curated library: 12 animations + library.md entry point
├── tools/                   # Compose, validate, sample, capture, repack
│   ├── capture_via_browserbase.mjs   # Cloud Chromium → Cloudinary pipeline
│   ├── compose-export.mjs            # Recipe composer (motion-plan.json → html + js)
│   ├── validate-export.mjs           # Validator gate (signatures + completeness + content)
│   ├── sample-timeline.mjs           # Eased per-element positions sampler
│   ├── repack-skill.mjs              # Package + install the skill
│   └── lib/                          # Shared helpers (template-loader, curve-svg, etc.)
├── tests/                   # Vitest test suite (18 files across chrome, recipes, integration)
├── previews/                # Browser-previewable HTML + GIFs from iteration runs (see README there)
├── exports/                 # Production GSAP modules from the same runs
├── CLAUDE.md                # Agent onboarding
├── EVOLUTION.md             # Project history, pivots, rejected approaches
└── package.json
```

## Credits

- **[Paper](https://paper.design)** — canvas + MCP
- **[Contra](https://contra.com)** — challenge platform
- **[Anthropic](https://anthropic.com)** — Claude Code, the orchestrating agent
- **[Browserbase](https://www.browserbase.com)** — cloud Chromium for invisible, headless capture
- **[Cloudinary](https://cloudinary.com)** — snapshot + GIF hosting; Paper rehosts server-side to its own CDN
- **[Made With GSAP](https://madewithgsap.com)** — original tutorials for all 12 library entries (curated + tagged here for agent consumption)
- **[GSAP](https://gsap.com)** + **[ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)** — the animation runtime

Built by [Alex Bogdan](https://github.com/AlexBoghh).

## License

MIT — see `LICENSE`. GSAP tutorial source material under `GSAP Animations/` belongs to Made With GSAP; the `description.md` annotations and agent-consumption tagging are my contribution.
