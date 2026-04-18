# Chrome templates

Pre-rendered HTML for every Reel chrome component. Loaded at Stage 0 of the skill,
substituted, then handed to Paper MCP `write_html` per artboard.

## Substitution

`{UPPER_SNAKE}` placeholders. String replace. Unfilled placeholders throw.
Loader: `tools/lib/template-loader.mjs → renderTemplate(path, vars)`.

## Template index

| Template | Placeholders | Used in stage |
|---|---|---|
| zone-label-slate.html | TITLE, WIDTH, REEL_RECTS | 4 |
| sprocket-bar.html | WIDTH, HOLES | 4 |
| filmstrip-rib.html | (none) | 4 |
| frame-shell.html | SCROLL_PIP_Y, INNER_HTML | 4 |
| caption-strip.html | TEXT | 4 |
| notes-rail.html | DESCRIPTOR, TAKE | 4 |
| timecode-strip.html | TIMECODE | 4 |
| citation-slab.html | ROLE, CATEGORY, NUMERAL, NAME, QUOTE, GENRE, PARAM_RAIL_HTML | 7 |
| content-frame-top.html | WIDTH | 4/9 |
| content-frame-right.html | HEIGHT | 4/9 |
| content-frame-bottom.html | WIDTH, ZONE_NAME, DESCRIPTOR, DIMS | 4/9 |
| content-frame-left.html | HEIGHT | 4/9 |
| cinema-letterbox.html | GIF_URL, RUNTIME | 9 |
| curve-strip.html | WIDTH, SVG_PATH, TICK_MARKERS | 4 (Phase 5) |
| transition-glyph.html | GLYPH | 4 (Phase 5) |
| diff-rail.html | WIDTH, TICK_MARKERS | 10 (Phase 6) |

## Generating reel rectangles, sprocket holes, etc.

The loader does NOT loop — for components with N child elements, the agent
pre-builds the inner HTML string and substitutes a single placeholder
(REEL_RECTS, HOLES, TICK_MARKERS, etc.). Each child element's HTML is itself
a small inline-styled `<div>`.

See `tools/lib/template-loader.mjs` for the exact substitution semantics.
