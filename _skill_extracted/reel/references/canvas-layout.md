# Canvas layout spec

**Read this file during Stage 3 (Compose the canvas layout) and Stage 4 (Build the STORYBOARD row).** It contains exact coordinates, dimensions, and spacing rules for the four-zone composition.

## Target viewport (critical)

Before sizing anything, fix the target viewport the motion will run at.

- **Default:** desktop `1440 × 900` (16:10)
- Tablet: `1024 × 768` (4:3)
- Mobile: `390 × 844` (~16:35)
- Or a user-specified viewport

Every zone that represents a rendered scene (SOURCE and STORYBOARD frames) must share the same aspect ratio as the target viewport so motion translates honestly between canvas and real browser. Report the chosen target viewport in the end-of-run summary.

## Zone sizing (derived from target viewport)

For the default desktop 1440 × 900 target:

- **SOURCE** at 1/1.5 scale → `960 × 600`
- **STORYBOARD frame** at 1/3 scale → `480 × 300`
- **MOTION PLAN** portrait citation stack → `400 × 660` (not tied to viewport)
- **LIVE PREVIEW** (Stage 8) at 1/2 scale → `720 × 450`

If the user specifies a different target viewport, recompute all scaled dimensions proportionally before placing artboards.

**No EXPORT zone on canvas.** Stage 7 still writes `previews/<timestamp>.html` and `exports/<timestamp>.js` to disk, but the code is not rendered as chrome on the canvas. The composition is L-shaped: SOURCE and LIVE PREVIEW stacked vertically in a left column, STORYBOARD spanning right, MOTION PLAN as a compact band below the left column. See `## Deprecated: EXPORT zone` at the bottom of this file for the removed pattern.

## Zone coordinates (relative to composition's top-left origin)

Coordinates below are for the **content artboard only**. SOURCE and LIVE PREVIEW also receive a 4-strip orange content frame (`## Content frame chrome` below) that extends 16 px on top/left/right and 32 px on the bottom — factor the frame into any composition-width math.

| Zone | x | y | width | height |
|---|---|---|---|---|
| SOURCE content | 0 | 0 | 960 | 600 |
| LIVE PREVIEW content (Stage 9 phase B) | 0 | 680 | 720 | 450 |
| STORYBOARD (frame row region) | 1120 | 0 | 3924 | 700 |
| MOTION PLAN | 0 | 1210 | 400 | 660 |

**Layout shape:** L. The left column (`x ∈ [0, 960]`) holds SOURCE on top and LIVE PREVIEW directly below — the most important visual comparison ("what I designed" vs "what got animated") sits in one glance. STORYBOARD spans the right (`x ∈ [1120, 5044]`). MOTION PLAN tucks below the left column at `y = 1210`. Composition extent ≈ `5044 × 1870` (was `6500 × 1130` in the old single-row layout).

**Zone horizontal gap:** `160px` between the left column and STORYBOARD (generous by design — Paper displays artboard node-names above each artboard, and tight spacing causes names to pile up at zoom-out).

**Vertical gaps inside the left column:** SOURCE bottom = `600`, LIVE PREVIEW top = `680` → `80 px` gap (factors in SOURCE's bottom content-frame strip at `+32`, the LIVE PREVIEW label slate at `−80` reaches up to `y = 600` exactly, no overlap). MOTION PLAN top = `1210` sits below LIVE PREVIEW's bottom content-frame strip (`450 + 32 = 482` from its top → `680 + 482 = 1162`), with a 48 px gap for the MOTION PLAN label slate at `y = 1130`.

**Label strips:** each zone has a 48px-tall label strip **above it at y = −80**. Label strip widths for SOURCE and LIVE PREVIEW must extend `+32` px wider and shift `−16` px horizontally to align with the outer bounds of the 4-strip content frame (see `## Content frame chrome` below).

## Artboard naming (strict — critical)

**Paper displays every artboard's name above it as a floating label when the canvas is zoomed out.** Any name with internal metadata (suffixes like `-0`, `-14`, `-label`, `-caption`, `-notes`, or underscore-numbered variants) will leak as ugly visible text across the storyboard row. This has been the single ugliest artifact of prior runs — fix it at naming time, not after.

Rules:

- **Zone label artboards:** `SOURCE`, `MOTION PLAN`, `STORYBOARD`, `LIVE PREVIEW`. Clean, no suffixes.
- **Timecode strip artboards:** still name them with the *percentage* — `0%`, `14%`, `28%`, `42%`, `57%`, `71%`, `85%`, `100%`. The artboard name stays functional for the designer even though the visible text displays a SMPTE timecode (`00:00:00`, `00:00:14`, …). Name is the functional identifier; displayed text is chrome.
- **Frame artboards:** name each with a single middle-dot character `·` (U+00B7) — minimal floating label, no leaky text.
- **Caption strip artboards:** name each with `·`.
- **Notes strip artboards:** name each with `·`.
- **Top + bottom sprocket bar artboards:** name each with `·`.
- **Filmstrip rib artboards:** name each with `·`.
- **Content frame strip artboards** (top/right/bottom/left around SOURCE and LIVE PREVIEW): name each with `·`.
- **NEVER use:** `frame-0`, `caption-14`, `notes-42`, `sprocket-top`, `rib-0`, `-label`, `-strip`, `-captions`, or any numbered/descriptive suffix on sub-artboards. These all leak.

The designer identifies sub-artboards by position on the canvas, not by name. The hierarchy panel will show many artboards named `·` — that's intentional, the scroll-% strip above each column provides the functional label.

## STORYBOARD row structure (filmstrip)

The STORYBOARD row is rendered as a literal filmstrip. Eight frame columns, bracketed by top + bottom sprocket bars and separated by seven filmstrip ribs. Timecodes above, caption + notes rail beneath.

**Eight columns at scroll positions** `0%, 14%, 28%, 42%, 57%, 71%, 85%, 100%`.

**Column horizontal gap:** `12 px` (tighter than the old 32 — gives the filmstrip continuity; any wider and the frames read as discrete tiles rather than a continuous strip).

**Computed STORYBOARD zone width:** `8 × frame_width + 7 × 12`. For default 480-wide frames: `3840 + 84 = 3924`.

### Vertical anatomy (y-coordinates relative to STORYBOARD zone top)

| Row | y | height | Artboard(s) | Background | Notes |
|---|---|---|---|---|---|
| Curve strip block(s) | 0 | 48 × N | N × `STORYBOARD_WIDTH × 48` | `#0a0a0a` | one per active citation, stacked, 0 gap. Each block = 16 label row + 32 curve SVG row (see `tool-ui-aesthetic.md → Curve strip`). |
| (8 px gap) | 48N | — | — | — | — |
| Timecode strips | 48N+8 | 32 | 8 × `480 × 32` | `#0a0a0a` | SMPTE `HH:MM:SS` |
| (8 px gap) | 48N+40 | — | — | — | — |
| Top sprocket bar | 48N+48 | 28 | 1 × `STORYBOARD_WIDTH × 28` | `#0a0a0a` | 40 cream holes |
| Frame row | 48N+76 | 300 | 8 × `480 × 300` | content | `border-radius: 8px` |
| Bottom sprocket bar | 48N+376 | 28 | mirror of top | | |
| (8 px gap) | 48N+404 | — | — | — | — |
| Caption strip row | 48N+412 | 48 | 8 × `480 × 48` | `#0a0a0a` | |
| (8 px gap) | 48N+460 | — | — | — | — |
| Notes rail row | 48N+468 | 64 | 8 × `480 × 64` | `#0a0a0a` | bottom-aligned rail |

**N = number of active citations** (max 3 in practice). For default 2-citation runs, N=2 and the bottom edge becomes 48·2 + 532 = **628** (well within the 700-tall STORYBOARD content area; ~72 px headroom). For N=3 the bottom is 676 — still inside the 700-tall zone.

### Transition glyph row (overlaid)

7 small artboards positioned in the column gaps between frames 0..6 and 1..7, layered above the filmstrip ribs. Each glyph is `20 × 24` and sits at `y = 48N + 76 + 138` (vertical mid of the frame row), `x = col_N_right - 0` (centered on the rib).

The glyph for gap `i` is determined by `glyph-picker.pickGlyph(primitivesActiveAt(timeline, midpoint))`, where midpoint is `(SAMPLE_POINTS[i] + SAMPLE_POINTS[i+1]) / 2`.

### Frame border-radius

Each frame artboard sets `borderRadius: 8px`. The rounded corners read as filmstrip windows cut into the film base, rather than hard-edge tiles. Part of the filmstrip metaphor and must not be removed.

### Filmstrip ribs (between frame columns)

Seven narrow black rectangles positioned in the gaps between the 8 frame columns. Each rib is **20 px wide × 300 px tall**, `#0a0a0a`, same top as the frame row (`y = 68`).

Rib `left` positions (for default 480-wide frames, column gap 12):
```
col_N_right = storyboard_x + N × (480 + 12) + 480    // right edge of frame N (N=0..6)
rib_left    = col_N_right − 4                          // 4 px bleed into the adjacent frame
```

For default STORYBOARD at `x = 1120`, the 7 rib left positions are: `1596, 2088, 2580, 3072, 3564, 4056, 4548`.

The rib width is intentionally wider than the 12 px column gap so the rib bleeds 4 px into the right edge of the left-adjacent frame and the left edge of the right-adjacent frame. This gives the filmstrip physical filmstrip-rib legibility instead of reading as an empty gutter.

**Side effect:** the rib overlaps the leftmost 4 px of frames 1–7, partially clipping each frame's scroll-progress pip (which sits at `left: 0`). Accept this — the sprocket bars + ribs are the primary filmstrip language; the pips are secondary.

### Frame aspect-ratio rule

The frame aspect ratio must exactly match the target viewport. Frames are half the width of SOURCE (same aspect ratio, smaller scale). This keeps the filmstrip visually coherent with the reference scene.

### Scroll-progress pip placement

On the left edge of each frame, add a `4 × 16` rounded rect in `#f97316` (tool accent). Its vertical position within the frame equals `scroll% × (frame_height − 16)` — so the 0% frame has the pip at the top, the 100% frame has it at the bottom. Partially occluded by the filmstrip ribs on frames 1–7 (see above).

## Recomputing for non-default viewports

If the user specifies a target viewport other than 1440 × 900, derive all dimensions proportionally:

- Let `(Tw, Th)` be target viewport dimensions.
- SOURCE content = `(Tw / 1.5, Th / 1.5)`
- Frame = `(Tw / 3, Th / 3)`
- Timecode strip, caption, notes strip widths = frame width
- MOTION PLAN stays `400 × 660` regardless
- LIVE PREVIEW content = `(Tw / 2, Th / 2)` — halfway between SOURCE and a frame
- **Column gap `12px`; zone gap `160px`**
- STORYBOARD zone width = `8 × frame_width + 7 × 12`
- **Sprocket bar width = STORYBOARD zone width**; top and bottom sprocket bars both sit on the STORYBOARD's left edge
- **Filmstrip ribs**: 7 ribs, each `20 × frame_height`, positioned at `col_right − 4` for gaps 0..6
- **Content frame chrome** adds `32 px` to both width and height of any framed zone (SOURCE, LIVE PREVIEW); factor this into composition-width math
- Recompute overall composition width accordingly

## LIVE PREVIEW zone (Stage 9 phase B)

Only present when Stage 9 phase B runs (the user explicitly asks for the live preview GIF). Displays the rendered GSAP animation as an animated GIF, wrapped in a letterboxed cinema view with transport chrome, and surrounded by the 4-strip orange content frame.

**Default dimensions** (for 1440 × 900 target viewport):
- Content artboard: **720 × 450**
- Label strip: **752 × 48** (includes +32 widening for the content frame outer bounds)

**Placement:** **below SOURCE in the left column.** This puts the static design and the live motion adjacent so the viewer's eye sees both at once — the L-shape layout's whole point.
- `x_content = 0` (left edge of the composition, same column as SOURCE)
- `y_content = 680` (80 px below SOURCE's bottom edge, accounting for SOURCE bottom content-frame strip at `+32` and LIVE PREVIEW label slate at `−80`)
- Label strip: `(x_content − 16, y_content − 80) = (−16, 600)`, size `752 × 48`

**Content artboard interior (cinema view).** The content artboard does NOT hold a plain `<img>` anymore. It wraps the GIF in a `position: relative` container with absolute-positioned letterbox bars top and bottom. Full structural spec in `tool-ui-aesthetic.md → Cinema view`. Summary:

```html
<div style="position:relative;width:720px;height:450px;background:#000;">
  <img src="{cloudinary_url}" style="width:720px;height:450px;display:block;" />
  <div style="position:absolute;top:0;left:0;width:720px;height:40px;background:#000;...">
    ● LIVE · NOW PLAYING ... 1.85 : 1
  </div>
  <div style="position:absolute;bottom:0;left:0;width:720px;height:40px;background:#000;...">
    00:00:00 / 00:01:40 ... SCROLL TO PLAY
  </div>
</div>
```

**Content frame chrome (mandatory).** LIVE PREVIEW always receives the 4-strip orange content frame around its content artboard — same formula as SOURCE. See `## Content frame chrome` below.

**Composition-extent impact of LIVE PREVIEW + its frame.**
LIVE PREVIEW lives entirely inside the left column — its right edge is `x_content + 720 + 16 = 736`, well inside STORYBOARD's left edge at `1120`. The composition's right edge stays at STORYBOARD's right (`1120 + 3924 = 5044`). The composition's bottom edge is determined by MOTION PLAN at `y = 1210 + 660 = 1870`.

**Artboard naming.**
- Label strip: `LIVE PREVIEW`
- Content artboard: `·`
- Frame strips (4): `·` each

**Do not:**
- Place LIVE PREVIEW outside the left column. Below-SOURCE placement is canonical — the static-vs-motion comparison only works when the two zones are vertically adjacent.
- Skip the cinema view wrapper. Every Stage 9 phase B run gets letterbox bars + transport chrome by default.
- Skip the content frame chrome. Every Stage 9 phase B run gets the 4-strip orange frame.
- Cache multiple LIVE PREVIEW zones per composition. One per composition only; if refreshing, delete the existing zone first.
- Scale the GIF up beyond 720 × 450 via CSS (results in blurry playback; re-capture at target dimensions if needed).

## Content frame chrome (SOURCE + LIVE PREVIEW)

Both SOURCE and LIVE PREVIEW content artboards are wrapped in a 4-strip orange frame — a "film festival reference plate" container. **Apply to both zones by default on every run.**

**Formula.** Given a content artboard at `(x, y, w, h)`, create 4 strips:

| Strip | Position | Size | Content |
|---|---|---|---|
| Top | `(x − 16, y − 16)` | `(w + 32) × 16` | solid `#f97316` |
| Right | `(x + w, y)` | `16 × h` | solid `#f97316` |
| Bottom | `(x − 16, y + h)` | `(w + 32) × 32` | `#f97316` with metadata rail |
| Left | `(x − 16, y)` | `16 × h` | solid `#f97316` |

**Bottom strip metadata rail** — JetBrains Mono 10 px 700 uppercase 0.2em `#1a0f08`, flex row `space-between`, 20 px horizontal padding:
- Left: `R01 · ZONE NAME · DESCRIPTOR` (e.g., `R01 · SOURCE REFERENCE · EDITORIAL MOCKUP`, `R01 · LIVE PREVIEW · 00:01:40`)
- Right: dimension label (e.g., `1440 × 900`)

**Zone label strip adjustment**. When a zone's content gets the 4-strip frame, the zone label strip must also widen and shift left to align with the frame's outer bounds:

```
label.width = content.width + 32
label.x     = content.x − 16
label.y     = content.y − 80   (unchanged)
```

Naming: frame strip artboards use `·` each. Don't suffix them.

## Zone label slate — reel rectangle count

Every zone label (48 px tall, full zone width) uses the same "title left + reel rectangles right" slate layout (see `tool-ui-aesthetic.md → Zone label slate`). The number of reel rectangles per label depends on the zone width minus the title section width.

**Formula:**
```
title_width_est ≈ char_count × 11 + 48
right_section   ≈ zone_width − title_width_est
N               ≈ floor((right_section + 16) / 48)
```
Round down for safety — under-fill is fine, overflow is not. `N` should never be less than 4.

**Reference counts** at default 1440×900 viewport:
- SOURCE (framed → 992 wide): ~17–18
- MOTION PLAN (400 wide): 5
- STORYBOARD (3924 wide): ~78
- LIVE PREVIEW (framed → 752 wide): ~11–12

## Deprecated: EXPORT zone

**The on-canvas EXPORT code pane is no longer part of the Reel composition.** Prior versions of this spec included a 5744+ × 200 monospace code strip at the bottom of the composition that rendered the GSAP export script as styled text. That zone has been removed entirely.

What changed:
- Stage 7 still writes `previews/<timestamp>.html` and `exports/<timestamp>.js` to disk. The files are identical to before.
- Stage 7 no longer renders the code as a chrome strip on the Paper canvas.
- Stage 9's GIF capture pipeline (`tools/capture_via_browserbase.mjs` → Browserbase cloud Chromium → ffmpeg → Cloudinary → place as LIVE PREVIEW) is unaffected. It reads `previews/*.html`, not the EXPORT zone.

What this removes from past specs: the `EXPORT` row from the zone coordinates table, the `EXPORT.width = live_preview_x + 720` widening step in Stage 8, and any reference to "render the export script as styled monospace text inside the EXPORT zone."

The composition is now an L-shape: SOURCE + LIVE PREVIEW stacked in the left column, STORYBOARD spanning right, MOTION PLAN below the left column. No EXPORT row at the bottom.