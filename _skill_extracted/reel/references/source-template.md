# SOURCE template (canonical)

**Read this during Stage 4 step 3.** SOURCE is no longer free-styled. The agent picks one of the three canonical templates below based on the citation set, then only varies the literal copy and image URLs. Structure, palette, typography, and layout are fixed so SOURCE↔preview parity is mechanical — the preview HTML will render with the same visual language because the recipes' default markup + CSS were chosen to match this template, not the other way around.

The whole point of pinning SOURCE: every cold run produces a composition where SOURCE on Paper and the rendered preview HTML look like the same designed page. No drift, no improvisation, no "Claude got creative this run" surprises in the demo.

## Three templates

Pick one based on the cited recipes:

| Citations | Template | Layout |
|---|---|---|
| One text recipe (mwg_004 / 005 / 006 / 009 / 010 / 011) only | **A — Hero text** | One artboard. Full-bleed hero, headline centered |
| One card-scroll recipe (mwg_001 / 003 / 007 / 023 / 042 / 045) only | **B — Card stack** | One artboard. Full-bleed card composition |
| One text + one card recipe (most common) | **C — Two scenes** | **One `960 × 600` artboard** containing three stacked sections (Scene 1 hero, SCENE BREAK band, Scene 2 deck), rendered by a single `write_html` call |

The cold-run brief in the canonical demo (`headline with simultaneous-words reveal, then three stacking cards`) hits **Template C**.

**Why Template C shows two scenes, not one unified page.** A text+card brief composes into two sequential pinned ScrollTrigger sections. Only one section is in the viewport at any given scroll position — the headline scene hands off to the card scene, but the viewer never sees them onscreen together. A single unified-page mock would promise a rest state the animation has no mechanism to reach. Template C depicts the animation truthfully: here is scene 1 at rest, here is scene 2 at rest, this seam is the scroll handoff. The demo narration becomes "scene 1 → SCENE BREAK → scene 2," which is exactly what the preview renders. **Implementation-wise it is still ONE Paper artboard** — the two scenes are stacked absolutely-positioned `<section>` blocks inside that single artboard's single `write_html` payload, not separate Paper artboards.

## Fixed design tokens (all templates)

These match the recipes' default `generateCSS` and `generateMarkup` output exactly. The agent does NOT modify these — the only freedom is content (literal headline text, literal card labels, image URLs).

- **Background:** `#f1ebdc` (sandy cream)
- **Ink:** `#14120f` (near-black text)
- **Card surface:** `#1a0f08` (deep brown-black)
- **Card text:** `#f0ebe0` (cream)
- **Accent (orange, used for tool chrome only — NOT inside SOURCE):** `#f97316`
- **Body type:** Inter (400, 500, 700)
- **Display type:** Inter 700 for headlines, Inter 700 for card labels
- **Mono type:** JetBrains Mono (500, 700) for metadata strips
- **No emojis. No raster background graphics. No improvised colors.**

## Template A — Hero text (text recipe alone)

SOURCE artboard: `960 × 600`, background `#f1ebdc`, padding `0`.

Internal structure (all positions relative to SOURCE artboard top-left):

| Element | x | y | w | h | Style |
|---|---|---|---|---|---|
| Header strip | 0 | 0 | 960 | 48 | flex row space-between, padding 0 24px, JetBrains Mono 11/500 0.18em uppercase #6b6155 |
|   ↳ Left text |  |  |  |  | series name (e.g. `VOLUMES — A SERIES`) |
|   ↳ Right text |  |  |  |  | issue + date (e.g. `04 / 2026`) |
| Headline | 64 | 240 | 832 | 120 | Inter 700, font-size 52px, letter-spacing -0.02em, color `#14120f`, line-height 1.0. Single line if it fits, two lines max. |
| Footer strip | 0 | 552 | 960 | 48 | flex row space-between, padding 0 24px, JetBrains Mono 10/500 0.14em uppercase #6b6155 |
|   ↳ Left text |  |  |  |  | byline (use real name from user memory; never invent) |
|   ↳ Right text |  |  |  |  | scroll cue (e.g. `↓ SCROLL`) |

## Template B — Card stack (card recipe alone)

SOURCE artboard: `960 × 600`, background `#f1ebdc`, padding `0`.

| Element | x | y | w | h | Style |
|---|---|---|---|---|---|
| Header strip | 0 | 0 | 960 | 48 | same as Template A |
| Card row | 64 | 120 | 832 | 360 | flex row gap 32px, justify-content center |
|   ↳ Card 1 | (auto) | 0 | ~256 | 360 | bg `#1a0f08`, border-radius 8px, padding 24px, flex column justify-content space-between |
|   ↳ Card 2 | (auto) | 0 | ~256 | 360 | same |
|   ↳ Card 3 | (auto) | 0 | ~256 | 360 | same |
| Footer strip | 0 | 552 | 960 | 48 | same as Template A |

Card interior structure (each card):
- **Top:** small uppercase label, JetBrains Mono 11/700 0.18em color `#f0ebe0` (e.g. `01`)
- **Bottom:** main label, Inter 700 22px color `#f0ebe0` (e.g. `Marfa, TX`)
- **Optional middle:** image cropped to `aspect-ratio: 0.75` filling top half of card. If imagery used, agent must supply Unsplash / hosted URLs in `plan.content[recipeId].cards[i].image`.

## Template C — Two scenes (text + card combo)

**Template C is ONE Paper artboard at `960 × 600` — same as Templates A and B.** The "two scenes" live *inside* that single artboard as three absolutely-positioned HTML sections (Scene 1, SCENE BREAK, Scene 2), written by a **single `write_html` call** on the one SOURCE content artboard. There are no Paper sub-artboards. The 4-strip orange content frame wraps the one artboard exactly as it does for Templates A and B. The envelope size is fixed so `canvas-layout.md`'s L-shape math (LIVE PREVIEW at `y = 680`, MOTION PLAN at `y = 1210`) stays unchanged for every template.

Each internal section depicts one scene at its rest state — Scene 1 is the pinned hero section after the words-in animation settles, Scene 2 is the pinned card section at its rest state. The SCENE BREAK band between them represents the scroll handoff where one section unpins and the next takes over.

**Vertical budget within the 600-tall envelope:** Scene 1 section = 280 tall (y `0–280`), SCENE BREAK band = 40 tall (y `280–320`), Scene 2 section = 280 tall (y `320–600`). Zero gap — they sit flush.

**HTML skeleton for the single `write_html` call** (positions are within the 960 × 600 content artboard; all three sections share the same parent):

```html
<div style="position:relative;width:960px;height:600px;background:#f1ebdc;font-family:'Inter',sans-serif;">
  <!-- Scene 1 section: 960 × 280 at y=0 -->
  <section style="position:absolute;top:0;left:0;width:960px;height:280px;background:#f1ebdc;">
    <!-- header / scene label / hero headline / footer per table below -->
  </section>

  <!-- SCENE BREAK band: 960 × 40 at y=280 -->
  <div style="position:absolute;top:280px;left:0;width:960px;height:40px;background:#14120f;display:flex;align-items:center;justify-content:space-between;padding:0 24px;">
    <!-- left + right labels per table below -->
  </div>

  <!-- Scene 2 section: 960 × 280 at y=320 -->
  <section style="position:absolute;top:320px;left:0;width:960px;height:280px;background:#f1ebdc;">
    <!-- header / scene label / card row / footer per table below -->
  </section>
</div>
```

Fill in the inner markup per the three tables below. Do NOT split this into multiple `write_html` calls or multiple Paper artboards — the ONE artboard + ONE write_html pattern is load-bearing for the content frame wiring and for Stage 5 content extraction.

### Scene 1 section — Hero

Section: `960 × 280`, absolute position `top: 0; left: 0` within the SOURCE artboard. Background `#f1ebdc`, padding `0`.

| Element | x | y | w | h | Style |
|---|---|---|---|---|---|
| Header strip | 0 | 0 | 960 | 32 | JetBrains Mono 11/500 0.18em uppercase `#6b6155`, padding 0 24px, flex row space-between |
|   ↳ Left text |  |  |  |  | series name (e.g. `VOLUMES — A SERIES`) |
|   ↳ Right text |  |  |  |  | issue + date (e.g. `04 / 2026`) |
| Scene label | 24 | 48 | 240 | 14 | JetBrains Mono 10/700 0.18em uppercase `#f97316`, text: `SCENE 1 · HERO` |
| Hero headline | 64 | 88 | 832 | 120 | Inter 700, font-size 30px, letter-spacing -0.02em, color `#14120f`, line-height 1.1. 2–3 lines. |
| Footer strip | 0 | 240 | 960 | 32 | JetBrains Mono 10/500 0.14em uppercase `#6b6155`, padding 0 24px, flex row space-between |
|   ↳ Left text |  |  |  |  | byline (real name from user memory) |
|   ↳ Right text |  |  |  |  | `PINNED · SCROLL 0–42` |

### SCENE BREAK band

Band: `960 × 40`, absolute position `top: 280px; left: 0` within the SOURCE artboard. Background `#14120f` (near-black), padding `0 24px`.

| Element | x | y | w | h | Style |
|---|---|---|---|---|---|
| Left label | 24 | 0 | 480 | 40 | JetBrains Mono 10/700 0.18em uppercase `#f97316`, centered vertically, text: `↓ SCENE BREAK · SCROLL HANDS OFF AT 42%` |
| Right label | — | 0 | 400 | 40 | right-aligned (padding-right 24), JetBrains Mono 10/500 0.14em uppercase `#f0ebe0` at 0.5 opacity, centered vertically, text: `SECTION 1 UNPINS · SECTION 2 PINS` |

The dark band reads as a literal cut — scene 1 ends, scene 2 begins. It is not a hairline divider.

### Scene 2 section — Card deck

Section: `960 × 280`, absolute position `top: 320px; left: 0` within the SOURCE artboard. Background `#f1ebdc`, padding `0`.

| Element | x | y | w | h | Style |
|---|---|---|---|---|---|
| Header strip | 0 | 0 | 960 | 32 | same type treatment as Scene 1. Left text: series name continued. Right text: issue + date repeated. |
| Scene label | 24 | 48 | 240 | 14 | JetBrains Mono 10/700 0.18em uppercase `#f97316`, text: `SCENE 2 · DECK` |
| Card row | 64 | 80 | 832 | 168 | flex row gap 24px, justify-content center |
|   ↳ Card 1 | (auto) | 0 | ~261 | 168 | bg `#1a0f08`, border-radius 8px, padding 16px, flex column justify-content space-between |
|   ↳ Card 2 | (auto) | 0 | ~261 | 168 | same |
|   ↳ Card 3 | (auto) | 0 | ~261 | 168 | same |
| Footer strip | 0 | 248 | 960 | 32 | JetBrains Mono 10/500 0.14em uppercase `#6b6155`, padding 0 24px, flex row space-between. Left: byline. Right: `PINNED · SCROLL 42–100` |

Card interior structure matches Template B but at reduced scale:
- **Top:** small uppercase label, JetBrains Mono 10/700 0.18em color `#f0ebe0` (e.g. `01`)
- **Bottom:** main label, Inter 700 16px color `#f0ebe0` (e.g. `Marfa, TX`)
- **Optional middle:** image cropped to `aspect-ratio: 1.55` filling top half of card.

### Why two scenes, not one

The two recipes that hit this template (one text + one card-scroll) compose into two sequential pinned `ScrollTrigger` sections. Each section has its own `pin-height: 500vh` and `container: 100vh`. During scroll 0–42% the text section is pinned; the viewport shows only the hero. At ~42% the text section unpins and scrolls out of view while the card section pins in. From 42–100% the viewport shows only the card deck. **The hero and the cards are never on screen together at any scroll percentage.**

A single-artboard "hero above cards" layout would imply a unified magazine page at rest — a destination the animation has no mechanism to reach. Worse, every card-scroll recipe in the catalog (mwg_001/003/007/023/042/045) is an exit-based motion recipe: cards move, rotate, or fly off; none terminate at a static grid. Template C therefore depicts the scroll composition truthfully: two rest states separated by an explicit scroll handoff. SOURCE and preview now share the same temporal story.

Side-by-side hero/cards (both in one pinned viewport) would require multi-recipe layout composition — filed separately as future work.

## What the agent IS allowed to vary per run

- **Headline string** — literal text, authored from the brief or the user's hero copy
- **Card labels** — `01 / 02 / 03` numbering or named (`MARFA, TX` / `TASMANIA` / etc.) per the brief
- **Card images** — Unsplash or other hosted URLs in `plan.content.<recipeId>.cards[i].image`. Always omit if no real URL is available.
- **Header / footer text** — series name, issue, byline (user's real name from memory), scroll cue. The format stays uppercase mono per the spec; the words vary.

## What the agent is NOT allowed to vary

- Background color, ink color, card colors, accent color
- Font families, weights, sizes, letter-spacing
- The structural layout: Template A = header / hero / footer in one artboard; Template B = header / cards / footer in one artboard; Template C = one artboard containing Scene 1 hero section (y 0–280) + SCENE BREAK band (y 280–320) + Scene 2 deck section (y 320–600), all with the spec dimensions
- The number of cards in Template B/C (always 3 unless brief explicitly says otherwise)
- The aspect ratio (always 16:10 for default desktop)

If the brief implies a layout outside these three templates (e.g., "two text columns side by side", "card carousel"), stop and tell the user the template doesn't cover that case — don't improvise. Then either pick the closest fit or file it as a new template needed.
