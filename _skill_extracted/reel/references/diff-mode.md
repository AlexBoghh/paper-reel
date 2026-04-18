# Diff mode (Stage 10)

Triggered by phrases like "iterate this run", "v2 of this", "redo this with X". Reads the most recent `previews/*.motion-plan.json` (by mtime), applies the user's requested change, and places v2 directly below v1 with a 56 px gap (48 px diff rail + 8 px breathing room) and a loud DIFF rail between them that reads from across the room in a video frame.

## Flow

1. **Load v1.** `tools/load-prior-motion-plan.mjs → loadMostRecentPlan('previews')`. If null, tell the user there's no prior run to iterate from and stop.
2. **Apply user's delta.** Mutate v1 into v2: change citations, change timeline primitives, change params. Keep `parent: v1.timestamp`.
3. **Validate v2.** `validateMotionPlan(v2)` must return `[]`.
4. **Write v2 motion-plan.json** to `previews/<v2-timestamp>.motion-plan.json`.
5. **Sample both.** `sampleTimeline(v1)` and `sampleTimeline(v2)`.
6. **Diff.** `diffPlans(framesV1, framesV2)` → `{ changedFrames, kindsByFrame, summary }`.
7. **Place v2 chrome below v1.**
   - Find v1's bounding box on canvas.
   - v2.x = v1.x; v2.y = v1.y + v1.height + 56 (48 diff rail + 8 breathing room).
   - Render the diff rail at `(v1.x, v1.y + v1.height + 8)`, full STORYBOARD width, 48 tall.
8. **For each frame column 0..7:**
   - If `SAMPLE_POINTS[i] not in changedFrames`: render a `·` placeholder artboard (`480 × 300`, background `#0a0a0a`, single centered `↑` glyph in `#f97316` pointing at v1's frame above).
   - Else: render the frame normally from v2's frames.json (or, when Stage 9 phase A runs for v2, fill from v2's snapshots).
9. **For chrome zones (SOURCE, MOTION PLAN, etc.) in v2:** render normally — don't placeholder these. The user is iterating the storyboard, not the source.
10. **Compose v2 export.** `compose-export.mjs` → `previews/<v2-timestamp>.html` + `exports/<v2-timestamp>.js`.
11. **Validate v2 export** before allowing Stage 9.

## Diff-rail shape (video-legible)

Template: `chrome-templates/diff-rail.html`. Two rows, 48 px total:

| Row | Height | Content |
|---|---|---|
| Top | 24 px | `DIFF · <N> / 8` label on the left, `{TICK_MARKERS}` flex row on the right |
| Bottom | 24 px | `CHANGES` label (dim, 55 % opacity), `{CHANGE_ANNOTATIONS}` flex row on the right |

**TICK_MARKERS** — 8 children, one per scroll %. For each position:
- **Changed frame:** `<div style="width:10px;height:10px;border-radius:50%;background:#1a0f08"></div>` (dark solid dot = "this frame changed")
- **Unchanged frame:** `<div style="width:6px;height:6px;border-radius:50%;background:rgba(10,10,10,0.22)"></div>` (dim smaller dot = "nothing moved here")

**CHANGE_ANNOTATIONS** — 8 children, one per scroll %. For each position:
- **Changed frame:** `<span style="color:#1a0f08;font-size:9px;font-weight:700;letter-spacing:0.14em">{kinds.join(' · ')}</span>` — where `kinds` comes from `kindsByFrame[pct]` (e.g. `["translateX"]` renders `TRANSLATE-X`; `["rotate", "scale"]` renders `ROTATE · SCALE`). Convert camelCase to HYPHENATED-UPPER for display (`translateX` → `TRANSLATE-X`).
- **Unchanged frame:** `<span style="color:rgba(10,10,10,0.22)">·</span>` (dim middle-dot filler so the flex spacing stays consistent).

Top row and bottom row use the same 16 px horizontal padding and `margin-left: 24px` gap after the label so the tick column centers line up vertically with the annotation column centers.

## What this buys you in video

Without the bottom annotation row, v2's diff rail tells you *how many* frames changed but not *what* changed. Viewers can't read "frame 14 had a translateX change, frame 42 had a rotate added" from a row of dots alone. The bottom row names the primitive kinds in 9 px mono per column, so a one-second pan across the diff rail communicates "motion X swapped for motion Y, here, here, and here."

## Constraints

- Diff mode does NOT modify v1 on the canvas. v1 is read-only.
- v2's parent chain is recorded — `loadMostRecentPlan` should follow `parent` to support "iterate the iteration."
- Maximum chain depth visualized: 3 (v1, v2, v3). Deeper chains exist in JSON but only the most recent two are placed adjacent on canvas; user can ask to "compare v1 to v3" to override.
- The diff rail is full STORYBOARD width, not zone width. It bridges v1's storyboard bottom and v2's storyboard top — viewers read it as the hinge between the two runs.
