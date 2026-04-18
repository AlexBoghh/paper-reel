# previews/

This directory holds the browser-previewable artifacts Reel generates. **Everything here came from iteration and testing runs** — multiple motion briefs tried across multiple skill versions. They are preserved so the jury (and curious future readers) can see what the output actually looks like across different motion types and library citations, not polished final deliverables.

## What's in each run

A complete run produces four files per motion brief (same basename, different extensions):

| File | Contents |
|---|---|
| `<name>.motion-plan.json` | The single creative artifact. Citations, timeline, params, content extracted from SOURCE. Validated by `tools/lib/motion-plan-schema.mjs`. |
| `<name>.frames.json` | Eased per-element positions at every scroll % in `[0, 14, 28, 42, 57, 71, 85, 100]`. Motion-math authority. Produced by `tools/sample-timeline.mjs`. |
| `<name>.html` | Working GSAP preview. Open in Chrome, scroll, watch. Composed by `tools/compose-export.mjs` from the motion-plan. |
| `<name>.gif` | ~9 second scroll-animated GIF from `tools/capture_via_browserbase.mjs`. Not all runs have one — only those where Stage 9 phase B was exercised. |

Older runs (`20260415*`, `2026-04-16*`) predate the recipe-compose + validator architecture. The SKILL.md migration note explicitly calls these out: "remain as historical artifacts. Only new runs conform to the recipe-and-validator contract." They're here for completeness; do not treat them as representative of the current pipeline.

## What's NOT here

- `frames_tmp/` and `frames_tmp_bb/` — per-frame PNG intermediates from capture runs. Not committed (see `.gitignore`). Regenerated each time `capture_via_browserbase.mjs` runs.
- `capture_gif.py` — the pre-Browserbase Python capture script. Removed when the skill migrated to cloud Chromium; see `EVOLUTION.md` → *Stage 9 Browserbase migration*.

## How to regenerate

Pick a motion-plan.json, then:

```bash
# Sample the timeline (frames.json)
node tools/sample-timeline.mjs previews/<name>.motion-plan.json

# Compose + validate (html + exports/<name>.js)
node tools/compose-export.mjs previews/<name>.motion-plan.json previews/<name>.html exports/<name>.js
node tools/validate-export.mjs exports/<name>.js previews/<name>.motion-plan.json

# Optional: capture the GIF (needs .env configured + ffmpeg on PATH)
node tools/capture_via_browserbase.mjs previews/<name>.html
```

Or just run the full `reel` skill via Claude Code on a fresh motion brief and let it produce a new run end-to-end.
