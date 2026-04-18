# Evolution

How Reel became Reel. Preserves pivots, rejected approaches, and the reasons why — so the architecture can be read as a sequence of decisions rather than a flat structure.

---

## Origin (late February 2026)

The challenge brief from Paper × Contra asked: *what new flows emerge when a canvas talks to your agents, repos, and data?*

Early ideation surfaced a dozen generic answers — Type Tester, Color Negotiator, Layout Roulette, Component Inventory, Spacing Diagnostic, Portfolio Stress Test, Crit Room (a multi-agent design jury). All parked. None of them came from personal pain, and every one of them had direct competitors in the "AI + design tool" space.

The idea that stuck came from describing frustration with GSAP iteration in plain language: *scroll-driven motion is brutal to iterate on because you can't see it until you build it, and you forget what frame 20% looked like by the time you reach frame 80%.*

Paper's static scene graph — which looks like a constraint — turned out to be the feature. Break motion out of time. Put it in space. The storyboard becomes the thinking surface.

## v0 — editorial mockup (April 14)

First composition on the Paper canvas at bounds `(8000, 0) → (12520, 1466)`. 19 top-level artboards across 5 zones: SOURCE, MOTION PLAN, STORYBOARD (8 frames at scroll positions 0/14/28/42/57/71/85/100 %), PREVIEW, EXPORT.

Palette was warm off-white + near-black serif + ochre accent. Editorial, not dashboard. Individual pieces looked good. Four known problems:

1. Artboard internal names (`SOURCE-label`, etc.) leaked as visible text
2. STORYBOARD label strip was over-specified at 3480px
3. 44px baseline misalignment between zones
4. Motion progression was too subtle — opacity-only, because `transform: translateY` was stripped by Paper (documented constraint #2 below)

The v0 proved the tool was technically buildable and design-directionally right. Fixes were queued for the next session.

## v1 — film-reel pivot (April 15, the big day)

~12 hours of iterative building. The single most productive session of the project.

**Library cleanup first.** Flattened nested tutorial folders. Removed OS cruft. Extracted 12 PDF tutorials into `description.md` files per animation (with "Use when", "Avoid when", mobile behavior, and accessibility notes). Wrote `GSAP Animations/library.md` as the agent entry point. The library became the moat — a curated corpus the agent can cite instead of inventing from training data.

**Skill authored from zero.** Wrote a 7-stage flow (later grown to 11) into `.claude/skills/reel/SKILL.md`, split progressively-disclosed reference material into `paper-mcp-rules.md`, `canvas-layout.md`, `tool-ui-aesthetic.md`. Root `CLAUDE.md` pointed fresh sessions at the skill.

**Four rounds of live-canvas iteration.** Each round surfaced a constraint that got baked back into the skill:

| Round | Motion tested | What broke | What got locked |
|---|---|---|---|
| 1 | Hero + cards stagger | Frames were 386×386 squares, not 16:10 | Target viewport = 1440×900; frames at 1/3 scale = 480×300; SOURCE at 1/1.5 = 960×600 |
| 2 | Editorial posters | Tool chrome inherited content aesthetic | Tool UI is fixed. Only SOURCE + frame *interiors* adapt to the user's design |
| 3 | Five photos + headline | New composition overlapped prior runs | Stage 1 safe-origin scan: compute union bbox of existing artboards, enforce 400px clearance |
| 4 | Jazzy text marquee | Node-name labels (`frame-0`, `caption-14`) appeared as floating text when zoomed out | Silent middle-dot (`·`) naming for all sub-artboards |

**The aesthetic pivot.** Palette shifted warm-paper → film-dark: background `#0a0a0a`, cream ink `#f5e6d3`, orange accent `#f97316`. Scroll-% strips reformatted as SMPTE timecodes (`00:00` / `00:14` / ... / `01:40`). Sprocket-hole bars bracketing every STORYBOARD frame. Cinema letterbox wrapping the LIVE PREVIEW GIF. Orange 4-strip content frames around SOURCE and LIVE PREVIEW with JetBrains Mono metadata rails. Zone label slates with title + reel rectangles. Citation slabs as orange filmstrip canisters with negative-space sprocket holes top and bottom — Karlovy Vary film-poster language.

**EXPORT zone removed from canvas.** Stage 7 writes HTML + JS to disk; the code no longer occupies canvas real estate. Keeping it on-canvas had been a habit from v0, not a requirement.

## Stage 8 — Cloudinary + Playwright breakthrough

The hardest question throughout the project was hosting: how do you get a GIF of the real GSAP scroll motion back onto the Paper canvas?

Rejected approaches, in order of discovery:

| Approach | Why rejected |
|---|---|
| Data URIs for GIFs | ~300K tokens per 1MB GIF kills agent context |
| Localtunnel | Interstitial warning page blocks Paper's server-side fetcher |
| 0x0.st, anonymous hosts | Triggers antivirus heuristics |
| GitHub gists | Refuses binary files |
| `paper-asset://` protocol | Windows build lacks native file bridge |
| Netlify drop-deploy | Account + CLI auth fails distributability |
| Cloudflare R2 | Account + API credentials fail distributability |
| cloudflared tunnel | Binary install fails distributability (borderline) |
| GitHub ephemeral repo | Commit overhead per iteration, pollutes account |

The unlock was realizing **Paper rehosts server-side**. Paper fetches the image URL, rehosts to `app.paper.design/file-assets/…` permanently. Which means hosting only needs to work for the moment Paper fetches — not forever. That reframed the problem from "find permanent hosting" to "find public URL for ~10 seconds."

Cloudinary's free tier solved it. 25 credits, sufficient for hundreds of GIFs. Public HTTPS URLs. Paper fetches server-side within ~10s and the Cloudinary URL can expire afterward — Paper's rehost is permanent.

**Capture pipeline (initial): Playwright + ffmpeg + Cloudinary Python SDK.** Local headless Chromium captures 90 frames, ffmpeg two-pass palette encodes the GIF, Cloudinary SDK uploads. ~33s end-to-end.

**Key debugging insight**: Lenis smooth-scroll was fighting `window.scrollTo()` per frame, adding 1–2s per frame. Solution: intercept the Lenis CDN fetch via `page.route()`, return a no-op stub, native scroll becomes the source of truth for ScrollTrigger scrubbing. Capture went from "impossibly slow" to 19s for 90 frames.

Hard requirement documented in the skill: `headless=True`. If the user sees a browser window flash on their screen during capture, Stage 8 has failed its UX contract.

## Stage 9 — Browserbase migration

After the initial Playwright pipeline shipped, Browserbase appeared as a cleaner alternative: cloud Chromium over CDP. No local browser to launch, no headless flag to enforce (cloud = invisible by construction), no local Playwright install needed for end users running the skill. The `@browserbasehq/sdk` + `playwright-core` combination gave the same programmatic control.

Migration from `previews/capture_gif.py` (Python) to `tools/capture_via_browserbase.mjs` (Node) gave two modes on one script:

- **Snapshot mode** (Stage 9 phase A): `--snapshots=0,14,28,42,57,71,85,100` captures one PNG per scroll %, uploads each, prints `CLOUDINARY_SNAPSHOTS={...}`. Fills the empty storyboard frames with real browser renders.
- **GIF mode** (Stage 9 phase B): default, captures 90-frame scroll GIF, prints `CLOUDINARY_URL=...`. Drops the LIVE PREVIEW zone on the canvas.

This is when the storyboard stopped being "hand-authored approximations of motion" and became "real browser screenshots piped back onto the canvas." Pixel-identical to what the browser paints.

## Recipe-compose + validator gate

Early runs hand-wrote GSAP code at Stage 8. Every run drifted slightly from the cited animation — a timing change here, an easing swap there. The drift was invisible until someone compared a run's export against the library entry it claimed to cite.

**Fix**: recipes. Each animation in the library exposes `generate(opts)` + `generateMarkup(opts)` + `generateCSS(opts)` + `meaningfulParams` + `contentShape`. Stage 8 becomes mechanical — the composer dynamically imports cited recipes, calls `generate()`, concatenates with the GSAP/Lenis bootstrap.

**Plus a validator gate**: `tools/validate-export.mjs` unions three checks:
- **Signatures**: cited recipe patterns survived into the JS
- **Completeness**: `plan.params[recipeId]` sets every `meaningfulParams` key
- **Content**: `plan.content[recipeId]` sets every `contentShape` key, non-empty

Stage 9 refuses to run if the validator doesn't exit 0. "You cite, you don't invent" stopped being a skill policy and became a mechanical constraint.

## Today

11 stages, 12 library citations, 18 Vitest test files. Compose-validate-capture pipeline end-to-end in ~3 minutes. SKILL.md at 362 lines, within Anthropic's 500-line budget per their skill-authoring best-practices. Skill passes the full Anthropic + superpowers writing-skills checklist.

The agent does orchestration. The designer does the brief, the library curation, and the taste calls. That framing — personal corpus + canvas + browser + agent as the glue — generalizes far beyond motion design.

## Session principles crystallized

Preserved from the iterative process, in no particular order:

- **Trust your eyes over tool reports.** Self-critique is noisy; visual inspection wins.
- **Design the output before building the engine.** Infrastructure work before canvas work was the wrong order.
- **Distributability is a design constraint, not an engineering afterthought.** The moment another designer is imagined using the tool, every account-gated dependency becomes a dealbreaker.
- **Ideas from personal pain beat ideas from ideation.** Every generic "AI + design tool" idea was median. The motion tool came from describing a real frustration.
- **Paper's constraints are often features.** The static-scene-graph constraint is what made spatial storyboarding the right answer.
- **Don't close options prematurely.** The GIF pipeline was dropped and later revived via Cloudinary + Paper-rehost. Rejected options deserve notes, not erasure.
- **Progressive disclosure in skills matters.** Monolithic SKILL.md chokes context on smaller models. Splitting into SKILL.md + references/ saves ~50k tokens per run.
- **Agent-native beats human-in-the-loop.** Every manual step that can be automated should be — especially for competition submissions where the agent-nativeness *is* the point.
- **Iterate visually on the canvas before codifying.** The film-reel aesthetic couldn't be spec'd upfront. It emerged from direct iteration.
- **Document drift is real.** SKILL.md evolved across ~10 iterations; reference files went stale. Cold-run stress tests are the only way to surface the drift before shipping.
