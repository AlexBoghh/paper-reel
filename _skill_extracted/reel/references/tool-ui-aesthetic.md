# Tool UI aesthetic (fixed — film slate)

**Read this file whenever you are about to style any chrome element** — zone labels, timecode strips, caption strips, notes strips, citation slabs, sprocket bars, filmstrip ribs, content frames, cinema letterbox bars, scroll-progress pips. These styles are fixed across every run of the Reel motion-design skill regardless of the project's content aesthetic.

## Critical principle

This tool has its own UI — a **film slate language**. Sprocket perforations, reel numerals, cinema transport, orange marquee signage. The SOURCE page and STORYBOARD frame *interiors* can adopt any design aesthetic the user's project calls for, but everything else — every piece of chrome — must use the fixed film-slate system below, unchanged, regardless of the project. A user running a dozen motion projects should see the same tool every time: same palette, same typography voices, same chrome components in the same places.

## Tool palette

Five values, that's the whole system. Every new element picks from this list.

- **Film-dark bg** — `#0a0a0a` (deep cinema-room black; page background for all chrome)
- **Warm cream ink** — `#f0ebe0` (film-stock white; body text, sprocket holes, reel rectangles)
- **Orange accent** — `#f97316` (marquee orange; zone label text, timecodes, citation slab body, content frame bodies, functional callouts)
- **Warm gray subtle** — `#8a7f6e` (muted warm gray; recessive annotation text, unused in most components — reserve)
- **Warm dark well** — `#1e1610` (toasted warm-dark variant; optional slab interior when orange is too bold for content)
- **Dark-on-orange ink** — `#1a0f08` (warm near-black; text and sprocket holes *on* `#f97316` surfaces — citation slabs, content frame strips)

Notes on usage:
- **Default body text**: `#f0ebe0` at full or 55% opacity depending on hierarchy
- **Pure black** `#000000` is used only inside the LIVE PREVIEW cinema letterbox bars (matching film leader black, visually distinct from `#0a0a0a` chrome)
- **Never introduce** new hues. No navy, no burgundy, no cool accents. Orange is the single marquee color.

## Tool typography

Three type voices:
- **Inter** — titles, labels, slab names (display / UI sans)
- **JetBrains Mono** — metadata rails, timecodes, genre tags, category labels (monospace "film lab" voice, used wherever a piece of chrome reads as "instrument readout")
- **Playfair Display** (Georgia fallback) — citation slab numerals and italic quotes only (serif reel-number / epigraph voice)

| Role | Font | Size | Weight | Tracking | Color |
|---|---|---|---|---|---|
| Zone label title | Inter | 12px | 700 | 0.22em uppercase | `#f97316` on `#0a0a0a` |
| Timecode strip (`00:00:00` SMPTE-lite) | JetBrains Mono | 11px | 500 | — | `#f97316` on `#0a0a0a` |
| Citation slab role tag (`PRIMARY` / `SECONDARY`) | Inter | 10px | 700 | 0.24em uppercase | `#1a0f08` on `#f97316` |
| Citation slab category tag | JetBrains Mono | 9px | 700 | 0.22em uppercase | `rgba(26,15,8,0.55)` on `#f97316` |
| Citation slab numeral | Playfair Display | 52px | 500 | −0.02em | `#1a0f08` on `#f97316` |
| Citation slab name | Inter | 18px | 700 | 0.14em uppercase | `#1a0f08` on `#f97316` |
| Citation slab quoted effect | Georgia | 12px | 400 italic | — | `rgba(26,15,8,0.72)` on `#f97316` |
| Citation slab genre tag | JetBrains Mono | 9px | 700 | 0.22em uppercase | `#1a0f08` on `#f97316` |
| Caption strip text | Inter | 13px | 400 | — | `#f0ebe0` on `#0a0a0a` |
| Notes rail — left descriptor | JetBrains Mono | 10px | 700 | 0.2em uppercase | `rgba(240,235,224,0.55)` on `#0a0a0a` |
| Notes rail — right callout (`T0N` take number) | JetBrains Mono | 10px | 700 | 0.2em uppercase | `#f97316` on `#0a0a0a` |
| Content frame bottom metadata rail | JetBrains Mono | 10px | 700 | 0.2em uppercase | `#1a0f08` on `#f97316` |
| Cinema letterbox transport (LIVE / timecode / prompt) | JetBrains Mono | 10px | 700 | 0.2em uppercase | `#f0ebe0` on `#000000` |

Use `px` for font-size, `em` for letter-spacing, `px` for line-height (Paper's requirement).

## Filmstrip chrome (STORYBOARD)

The STORYBOARD row is rendered as a literal filmstrip. Every component is pure HTML — no external assets, no rotation, no gradients.

### Top and bottom sprocket bars
Two identical artboards above and below the frame row:
- Dimensions: `storyboard_width × 28`
- Background: `#0a0a0a`
- Children: 40 cream hole rectangles
  - Each hole: `20 × 14`, `border-radius: 2px`, `background: #f0ebe0`, `flex-shrink: 0`
  - Parent flex: `display:flex, alignItems:center, justifyContent:space-between, padding:0 20px`
  - `justify-content: space-between` auto-distributes the holes evenly across the bar width — works for any composition width

### Filmstrip ribs
Seven narrow black rectangles between the 8 frame columns:
- Each rib: `20 × 300`, `background: #0a0a0a`
- Positioned at `col_right − 4` (overlapping 4 px into each adjacent frame), `top: frame_y`
- The rib width (20) is intentionally wider than the column gap (12) so the ribs bleed slightly into the frame edges, reading as physical filmstrip ribs rather than empty gutters

### Frame windows
- Border-radius: `8px` on each frame artboard (reads as a rounded filmstrip window cut into the film base)
- Column gap: **12 px** (tighter than the old 32 px — gives the filmstrip continuity; any wider and the frames read as discrete tiles)
- Scroll-progress pip: a `4 × 16` rounded rect in `#f97316`, absolute-positioned on the left edge of each frame at `y = scroll% × (frame_height − pip_height)`

### Vertical stack anatomy (within STORYBOARD zone, relative to y=0)
| Row | y | height | Notes |
|---|---|---|---|
| Timecode strip | 0 | 32 | SMPTE `00:00:00` format, `#f97316` mono text |
| (8 px gap) | 32 | — | |
| Top sprocket bar | 40 | 28 | 40 cream holes |
| Frame row | 68 | 300 | 8 frames, flush to both sprockets |
| Bottom sprocket bar | 368 | 28 | 40 cream holes |
| (8 px gap) | 396 | — | |
| Caption strip | 404 | 48 | Inter 13 cream body text |
| (8 px gap) | 452 | — | |
| Notes rail strip | 460 | 64 | Bottom-aligned metadata rail |

New STORYBOARD zone bottom edge: `524`.

### Timecode format
Scroll-% strips now show SMPTE-lite timecodes instead of percentages. For a 100-second reel:
`00:00:00 / 00:00:14 / 00:00:28 / 00:00:42 / 00:00:57 / 00:01:11 / 00:01:25 / 00:01:40`
Formula: `seconds = scroll_pct × total_duration`, format as `HH:MM:SS`. Artboards are still *named* `0%` / `14%` / … per the naming rules — only the displayed text changes.

## Curve strip (STORYBOARD)

A **48-px-tall block** above the timecode strip, one per active citation, full STORYBOARD width. Each block is two rows:

- **Top 16 px — recipe label.** Format: `R01 · MWG_042 · BACK.INOUT(3)` (reel ID · recipe ID · ease name). Typography: `JetBrains Mono 11/700 0.18em uppercase #f97316`. Padded `0 16px`. This makes motion *feel* legible at video resolution — viewers can read which recipe and which ease from across the room.
- **Bottom 32 px — curve SVG**, plus an optional position marker overlay.
  - Background: `#0a0a0a`
  - Inline SVG, `stroke: #f97316`, `stroke-width: 1.5`, `fill: none`
  - 8 vertical tick lines at sample positions, `stroke: #f97316` at 0.4 opacity
  - Path baselines bottom = ease 0, top = ease 1

**Position marker (optional).** A 2-px-wide vertical orange line with a soft glow, sitting at `x = scroll_pct/100 × width`. Reads as "you are here on the easing curve." Useful when the storyboard is being scrubbed (e.g. one frame is in focus during the demo) — the marker tracks across all curve strips at the focused scroll %. Generated by `tools/lib/curve-svg.mjs::generatePositionMarker({ markerPct, width, height })`. Pass `markerPct: null` (or omit) to skip the overlay; the template's `{POSITION_MARKER}` placeholder is filled with empty string in that case.

When multiple citations are present, stack curve blocks top-down in citation order with 0 px gap (so the bottom of one curve butts the top of the next label cleanly). For default 2-citation runs the total curve-area height is `48 × 2 = 96 px`; for 3 citations it's `144 px`. Storyboard content height accommodates up to 3 curves with headroom.

## Parameter rail (MOTION PLAN)

Lives inside each citation slab body, beneath the genre tag. 4–6 lines, monospace, dark-on-orange.

- 1 px top border `rgba(26,15,8,0.15)`
- Each line: `display:flex;justify-content:space-between` with key (left, 55% opacity) and value (right, full opacity)
- Font: `'JetBrains Mono' 9px 500 0.08em`
- Keys rendered in lower-case (matches GSAP API)

## Transition glyphs (overlay STORYBOARD)

Single Unicode glyph centered in a 20 × 24 black artboard, overlaying each rib at frame-row vertical-mid. Color `#f97316`, `Inter 14px 700`. Glyph map:

| Primitive | Glyph |
|---|---|
| translateX | → |
| translateY | ↓ |
| scale | ⇲ |
| opacity | ◌ |
| rotate | ↻ |
| width | ↔ |
| height | ↕ |
| (any with stagger) | ·· |
| (no active primitive) | · |

Picked by `tools/lib/glyph-picker.mjs → pickGlyph(primitives)`.

## Citation slab (MOTION PLAN)

Each citation is a self-contained filmstrip canister slab with negative-space sprocket perforations top and bottom — the Karlovy Vary festival poster language.

- **Outer slab**: `352 × ~265`, `background: #f97316`, `border-radius: 6px`, `display: flex, flex-direction: column`
- **Top sprocket strip**:
  - `352 × 30`, flex row, `alignItems: center, justifyContent: space-between, padding: 0 24px`
  - 5 dark hole rectangles: each `40 × 18`, `border-radius: 3px`, `background: #0a0a0a`, `flex-shrink: 0`
  - The dark holes read as negative space punching through the orange slab to the dark page behind
- **Body content** (flex column, `gap: 14px`, `padding: 18px 22px 20px`):
  1. **Header row** — flex `justify-content: space-between, alignItems: baseline`
     - Left: role tag (`PRIMARY` / `SECONDARY`)
     - Right: category tag (`CARD SCROLL`, etc.)
  2. **Numeral + name pair** — nested flex column, `gap: 2px` (tight pairing)
     - Numeral: 52 px Playfair `#1a0f08`, `line-height: 1, font-weight: 500`
     - Name: 18 px Inter 700 uppercase `#1a0f08`, `padding-top: 4px`
  3. **Italic Georgia quote** — 2 lines max, `line-height: 1.55`, `#1a0f08` at 72% opacity
  4. **Genre tag line** — JetBrains Mono `#1a0f08` 700 uppercase, left-aligned (`ROLODEX · DEPTH · POINTER-TILT`)
- **Bottom sprocket strip**: mirror of top
- **Two slabs stacked** with `gap: 20px` in the outer MOTION PLAN flex column

Quotes and names are left-aligned (not centered) — reads as editorial credit block, not theatrical title card.

## Zone label slate (all zones)

Every zone label strip (SOURCE, MOTION PLAN, STORYBOARD, LIVE PREVIEW) follows the same structure: title on the left, reel rectangles filling the rest to the right.

- **Artboard**: `zone_width × 48`, `background: #0a0a0a`, `padding: 0` (remove any padding Paper applied at creation — the inner flex owns all spacing)
- **Outer flex row**: `display: flex, alignItems: stretch, width: zone_width, height: 48, background: #0a0a0a`
- **Title section** (left):
  - `flex-shrink: 0` (natural width, sized to content)
  - `padding: 0 24px`, `alignItems: center`
  - Inter 12 px 700 uppercase 0.22em `#f97316`
- **Reel-rectangles section** (right):
  - `flex: 1` (fills remaining space after title)
  - `display: flex, alignItems: center, justifyContent: space-between, padding: 0 18px`
  - Contains N cream rounded rectangles, each `32 × 20`, `border-radius: 3px`, `background: #f0ebe0`, `flex-shrink: 0`
  - `justify-content: space-between` distributes them evenly with auto-calculated gaps

**Rectangle count formula**:
```
title_width_est ≈ char_count × 11 + 48     // rough estimate at 12/700/0.22em + 48 px padding
right_section   ≈ zone_width − title_width_est
N               ≈ floor((right_section + 16) / 48)
```
Round down for safety — under-fill looks better than overflow. `N` should never be less than 4. For reference: SOURCE (960) ≈ 17, MOTION PLAN (400) ≈ 5, STORYBOARD (3924) ≈ 78, LIVE PREVIEW (720) ≈ 11.

## Content frame chrome (SOURCE + LIVE PREVIEW)

Both SOURCE and LIVE PREVIEW content artboards are wrapped in a 4-strip orange frame — a physical "film festival reference plate" container.

Given a content artboard at `(x, y, w, h)`:

| Strip | Position | Size | Background |
|---|---|---|---|
| Top | `(x − 16, y − 16)` | `(w + 32) × 16` | `#f97316` |
| Right | `(x + w, y)` | `16 × h` | `#f97316` |
| Bottom | `(x − 16, y + h)` | `(w + 32) × 32` | `#f97316` |
| Left | `(x − 16, y)` | `16 × h` | `#f97316` |

Top, left, right are solid orange mats. The bottom strip is taller (32 px) and holds a **metadata rail**:
- Flex row, `alignItems: center, justifyContent: space-between, padding: 0 20px`
- Left: `R01 · ZONE NAME · DESCRIPTOR` (e.g., `R01 · SOURCE REFERENCE · EDITORIAL MOCKUP`)
- Right: dimension label (e.g., `1440 × 900`)
- Both in JetBrains Mono 10 px 700 uppercase 0.2em `#1a0f08`

**Zone label strip adjustment**: when a zone's content gets the 4-strip frame, the zone label strip must extend 32 px wider and shift −16 px horizontally to align with the frame's outer bounds:
```
label.width = content.width + 32
label.x     = content.x − 16
label.y     = content.y − 80   (unchanged — 48 tall label strip 32 px above the top frame strip)
```

## Cinema view (LIVE PREVIEW content interior)

The LIVE PREVIEW content artboard wraps its GIF `<img>` in a letterboxed cinema view with transport chrome.

- **Outer wrapper**: `position: relative, width: 720, height: 450, background: #000000`
- **GIF img**: full `720 × 450`, `display: block`, normal flow
- **Top letterbox bar**: absolute-positioned, `top: 0, left: 0, width: 720, height: 40`
  - Background `#000000`, flex row `alignItems: center, justifyContent: space-between, padding: 0 20px`
  - Left: live indicator — 8 × 8 `#f97316` circle (`border-radius: 50%`) + JetBrains Mono label (`LIVE · NOW PLAYING`)
  - Right: aspect ratio metadata (`1.85 : 1`) in mono cream at 55%
- **Bottom letterbox bar**: absolute-positioned, `bottom: 0, left: 0, width: 720, height: 40`
  - Background `#000000`, same flex + padding
  - Left: transport timecode (`00:00:00 / 00:01:40`) in mono cream
  - Right: interaction prompt (`SCROLL TO PLAY`) in mono cream at 55%

The top and bottom bars cover the top and bottom 40 px of the GIF. Visible playback area becomes `720 × 370` ≈ 1.95 : 1, close to standard widescreen.

## Bottom metadata rail principle

Every strip that sits beneath content as annotation — notes strips, content frame bottom strips, cinema letterbox bars — follows the same pattern. This is the tool's single "metadata rail voice."

- **Parent artboard**: `alignItems: flex-end`, appropriate bottom padding (12 px for a 64 px strip)
- **Inner flex row**: `display: flex, alignItems: center, justifyContent: space-between, width: 100%`
- **Typography**: JetBrains Mono 10 px 700 uppercase 0.2em (all rails use identical type)
- **Left descriptor** at 55% opacity of the foreground color — recedes as annotation
- **Right callout** at full color (or accent color) — pops as the functional identifier

Applied to:
- Notes strips (`NOTE · [descriptor]` + `T0N` take number, cream @ 55% + orange)
- SOURCE bottom frame strip (`R01 · SOURCE REFERENCE · ...` + `1440 × 900`, dark-on-orange)
- LIVE PREVIEW bottom frame strip (`R01 · LIVE PREVIEW · 00:01:40` + `1440 × 900`, dark-on-orange)
- LIVE PREVIEW cinema top letterbox (`● LIVE · NOW PLAYING` + `1.85 : 1`, cream-on-black)
- LIVE PREVIEW cinema bottom letterbox (`00:00:00 / 00:01:40` + `SCROLL TO PLAY`, cream-on-black)

## Scroll-progress pip (inside each frame)

Unchanged conceptually: a `4 × 16` rounded rectangle on the left edge of each frame, positioned vertically at `y = scroll% × (frame_height − 16)`. Color is now `#f97316` (the new accent), not the old archival slate. Never adapts to content.

## Ownership — who controls what aesthetic

| Element | Owner |
|---|---|
| SOURCE content interior | User's design (project aesthetic) |
| STORYBOARD frame interiors | User's design (project aesthetic) |
| Zone label strips (all zones) | **Tool (fixed — this file)** |
| Timecode strips | **Tool (fixed — this file)** |
| Top + bottom sprocket bars | **Tool (fixed — this file)** |
| Filmstrip ribs | **Tool (fixed — this file)** |
| Caption strips | **Tool (fixed — this file)** |
| Notes rail strips | **Tool (fixed — this file)** |
| Citation slabs (MOTION PLAN, all parts) | **Tool (fixed — this file)** |
| Content frame chrome (SOURCE + LIVE PREVIEW strips) | **Tool (fixed — this file)** |
| LIVE PREVIEW cinema view letterbox | **Tool (fixed — this file)** |
| Scroll-progress pips | **Tool (fixed — this file)** |

## General guardrails

- Editorial, not dashboard. No Tailwind defaults. No gradient blobs. No `rounded-xl` everywhere.
- Corner radii: `0` on most zone/sprocket strips; `2–3 px` on sprocket hole rectangles and reel rects; `6–8 px` on frames and citation slabs; `50%` only on the LIVE indicator dot.
- Hairlines: never thicker than `1 px` (reserved for dividers that rarely appear — most structure comes from the sprocket + filmstrip language itself).
- STORYBOARD is the largest zone and the hero of the composition — everything else supports it.
- Should look like a designer made it, not a wireframe. Specifically: should read as a film festival poster meeting a post-production scope.
