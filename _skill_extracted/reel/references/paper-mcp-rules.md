# Paper MCP rules of engagement

**Read this file before the first Paper MCP call of the session.** These rules are learned from prior sessions and are not discoverable from the MCP tool docs. Violating any of them produces a broken or incomplete composition.

## Core rules

1. **`create_artboard` ignores `left` / `top` at creation.** Auto-placement always runs first regardless of what you pass. Always follow every `create_artboard` call with an immediate `update_styles` call to set the final position. Batch the updates when possible, but never skip the update step.

2. **`<script>` tags are stored as literal Text nodes, not executed.** Paper is a static scene graph. No JS runs on the canvas. Never try to use scripts for rendering logic.

3. **`<style>` blocks and class-based CSS are stripped on import.** Only inline `style=""` attributes survive. Do not write stylesheets and expect them to apply.

4. **`@keyframes` and the `animation` CSS property are stripped entirely.** Never use them — they won't survive the import and won't animate anything.

5. **`overflow: scroll` is coerced to `overflow: clip`.** There is no scroll state inside a frame. Paper owns all pointer input.

6. **`transform: translateY` / `scale` / `rotate` is accepted syntactically but does not render.** The property survives `write_html` and shows up in computed styles, but the element renders as if transform is identity. Use real layout properties instead: `margin-top`, `margin-left`, actual `width` / `height` value changes, `position: absolute` + `top` / `left`.

7. **A `<div>` whose only child is a text string collapses to a Text node on import.** Width set on the wrapper is preserved on the resulting Text node. But the result is a Text node, not a Frame — you cannot nest additional children inside it later. Plan text structure accordingly.

8. **Images need public HTTPS URLs.** Paper's server fetches the URL, rehosts to `app.paper.design/file-assets/`, and the rehosted copy persists permanently. `file://`, absolute local paths, and `paper-asset://` do not work — especially on Windows. Use CDN-hosted images or upload to a host first.

9. **`<pre>` with `white-space: pre` preserves leading whitespace and monospace alignment.** HTML entity escapes like `&lt;` survive correctly. (Historical note: used to matter for the EXPORT code pane, which has been removed — keep the rule documented for any future monospace-block needs.)

10. **`repeating-linear-gradient` (and any `linear-gradient` / `radial-gradient`) in inline `style="background:..."` is silently stripped.** The element renders as if the background is `transparent` or falls through to the parent's color. Don't rely on gradients for striped patterns, sprocket rows, or diagonal fills. For striped patterns, use real child `<div>`s with solid backgrounds and flex layout.

11. **`transform: rotate` and `transform: skew` are silently stripped** (same class of issue as `translateY` / `scale` in rule #6). The only reliable path to a rotated visual is: (a) author the visual as an SVG, (b) upload it to a public HTTPS host (see rule #8), (c) reference it in a `<img>` tag. **Do not** attempt to fake rotation with staircase-offset rectangles — the result is pixelated, node-expensive, and hard to codify in a skill rule.

12. **`overflow: clip` on a `position: relative` container successfully clips absolute-positioned children** that extend beyond the container's bounds. Use this for visuals that need cropping (letterbox bars, masked elements, bleeding content). `overflow: hidden` is coerced to `overflow: clip` automatically.

13. **`position: absolute` children with negative `top` / `left` values render correctly** and can bleed past the parent's bounds (useful combined with rule #12 for letterbox bars, bleed-crop effects, or filmstrip ribs that extend slightly into adjacent frames).

14. **Cloudinary / asset upload dependencies belong to Stage 8 only.** Never add a runtime asset upload to a chrome-build step (Stages 3–6). The chrome build must be pure HTML with no network calls — if a visual requires an external asset, pick a different visual approach. Stage 8's GIF capture → Cloudinary → Paper rehost is the single sanctioned external-asset path in the flow.

15. **Inline `<svg>` with static shapes (rect, line, path, circle) survives `write_html`** and renders correctly when the SVG has explicit `width`/`height` attributes and inline `style=""` on its children. This is the only path to curves and diagonals on the canvas without an external asset upload — used by the curve strip in Phase 5.

## What not to do

- Do not rebuild from scratch if a valid composition already exists on the canvas — create a new composition adjacent to it. Never modify a prior run unless the user explicitly asks.
- Do not use opacity-only changes to represent motion; always use real layout changes (see rule #6).
- Do not leak internal naming (`-label`, `-strip`, `-captions`) as visible text. Node names appear above artboards. Keep them clean: `SOURCE`, `STORYBOARD`, `0%`, etc.
- Do not invent animations that aren't in the library. You cite; you don't invent.
- Do not introduce anime.js or any other motion library. GSAP only.
- Do not run `create_artboard` without the follow-up `update_styles` (see rule #1).
- **Do not fake diagonals with staircase-offset rectangles.** If the design needs real diagonal lines or rotated elements, upload an SVG to Cloudinary (or any public HTTPS host) and reference via `<img>`. Staircase hacks are pixelated, node-expensive (~20+ rectangles per element), and don't codify cleanly as skill rules.
- Do not use `repeating-linear-gradient` (or any `-gradient` function) expecting it to render — it's silently stripped (see rule #10).
- Do not add Cloudinary / network calls to Stage 3–6 chrome builds (see rule #14).

## Schema recovery

If a Paper MCP call returns a validation error (e.g., "Invalid styles object", missing required fields), call ToolSearch first to load the current schemas for `create_artboard`, `update_styles`, `write_html`, and other Paper MCP tools. Do not guess the schema — it changes, and guessing wastes tool calls. Once you have the accurate schema, retry with all required fields explicit.
