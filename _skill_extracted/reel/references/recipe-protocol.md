# Recipe protocol

Every `GSAP Animations/<Category>/<id>/recipe.mjs` exports the same twelve names. Stage 8 of Reel composes the export by importing one recipe per citation and calling `generate(opts)`, `generateMarkup(opts, content)`, and `generateCSS(opts)`.

## Required exports

| Export | Type | Purpose |
|---|---|---|
| `id` | string | folder name, e.g. `'mwg_010'` |
| `name` | string | display name |
| `category` | `'CARD SCROLL' \| 'TEXT'` | shown in citation slab CATEGORY tag |
| `signatures` | `string[]` | substrings every emission MUST contain — the validator greps for these |
| `requiredOpts` | `{ [key]: 'description' }` | opts the caller must supply |
| `defaultOpts` | `{ [key]: any }` | opts that fall through if not supplied |
| `meaningfulParams` | `string[]` | keys `motion-plan.params[recipeId]` must set — completeness gate |
| `contentShape` | `{ [key]: 'description' }` | documents the narrative content this recipe can consume from `motion-plan.content[recipeId]` (e.g. `{ headline: 'string — displayed in the paragraph element' }` for TEXT recipes, `{ cards: 'array of { label, image? }' }` for CARD SCROLL) |
| `generate(opts)` | `(opts) => string` | returns the GSAP code block (ported from the library entry's `script.js`) |
| `generateMarkup(opts, content?)` | `(opts, content?) => string` | returns the HTML markup contract — class hooks matched to `opts.*Selector`. When `content` is supplied per `contentShape`, uses it; otherwise falls back to the library's demo placeholder. Backward-compatible: single-arg calls still work |
| `generateCSS(opts)` | `(opts) => string` | returns the baseline CSS (ported from the library entry's `style.css`) — creates scroll-space via pin-height, sizes and positions the elements GSAP animates |
| `defaultPrimitives(opts)` | `(opts) => primitive[]` | scaffold timeline primitives for motion-plan.json |

## Authoring rules

1. **Port `script.js` verbatim, then template the selectors.** The signatures are extracted from the original code — preserve them.
2. **Port `style.css` verbatim, then template the top-level selectors.** Replace library-native class selectors (`.mwg_effectNNN`, `.container`, `.pin-height`, etc.) with the recipe's opts selectors. Keep runtime-generated descendant classes (`.word`, `.letter`) as-is — they're children of the templated root. Without this, the browser preview has no scroll space and no sized elements.
3. **Magic numbers become opts.** Anything you might want to tune (sinus amplitude, jitter range, gap) goes in `defaultOpts`. Applies to both JS and CSS ports.
4. **`contentShape` is the narrative content channel.** TEXT recipes take `{ headline: string }` (or `{ sentences: string[] }` for multi-phrase recipes like mwg_009). CARD SCROLL recipes take `{ cards: [{ label: string, image?: url }, ...] }`. Stage 5 of the skill extracts matching content from SOURCE on the Paper canvas and writes it to `plan.content[recipeId]`. When `generateMarkup` is called with `(opts, content)`, it populates the template from content; when called with `(opts)` or `(opts, {})`, it falls back to the library's demo placeholder. Contract: `generateMarkup(opts)` and `generateMarkup(opts, {})` must return identical strings so the fallback is unambiguous.
5. **No invention.** If the library entry doesn't do something, the recipe doesn't either.
6. **Signatures are short and stable.** Pick 3–5 substrings that uniquely identify this recipe's pattern (e.g. `'pin: true'`, `'containerAnimation: scrollTween'`, `'Math.sin(sinusIncr)'`).
7. **`meaningfulParams` lists every ScrollTrigger param that materially changes the motion** — typically `pin`, `scrub`, `ease`, and `start`/`end` for scroll-driven recipes. The plan-completeness gate refuses any plan that omits a key in this list.

## Adding a new recipe

1. Confirm there's a `script.js`, `style.css`, `index.html` in the folder.
2. Copy `recipe.mjs` from the nearest neighbor in the same category.
3. Replace the body of `generate` with the templated `script.js`.
4. Replace the body of `generateCSS` with the templated `style.css`.
5. Define `contentShape` — what narrative fields this recipe accepts. Match the category convention (`headline` for TEXT paragraphs, `cards` for CARD SCROLL).
6. Update `generateMarkup(opts, content)` to populate from content when present, fall back to demo placeholder otherwise.
7. Pick 3–5 signature substrings that survive any reasonable opt change.
8. Add the recipe's row to §2.0 of this plan (or the equivalent table in this file).
9. Run `npm test -- recipes` — the loop test will exercise the new recipe (4 assertions per recipe: loader, signature, CSS non-empty, markup-with-empty-content matches no-arg).
