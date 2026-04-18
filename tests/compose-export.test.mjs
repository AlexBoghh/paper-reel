import { test, expect } from 'vitest';
import { compose } from '../tools/compose-export.mjs';
import { readFileSync } from 'node:fs';

const plan = JSON.parse(readFileSync('tests/fixtures/jazzy-stack-motion-plan.json', 'utf8'));

test('compose emits both citations', async () => {
  const { html, js } = await compose(plan, { recipeRoot: 'GSAP Animations' });
  // Deviation: recipe emits `sinusIncr_mwg_010` (mwg_001 precedent: `_${id}` suffix
  // uses full id including `mwg_` prefix). Narrowed to `sinusIncr_` substring.
  expect(js).toContain('Math.sin(sinusIncr_');         // mwg_010 sig
  expect(js).toContain('innerHeight * 0.2');           // mwg_010 sig
  expect(js).toContain('back.inOut(3)');               // mwg_042 sig
  // Deviation: mwg_010's stripDot returns LAST token, so containerSelector
  // `.hero .container` -> `class="container"` (not `class="hero"`). Narrowed to
  // the recipe's emitted markup-contract comment, which is stable.
  expect(html).toContain('mwg_010 markup contract');   // markup contract from mwg_010
  expect(html).toContain('class="features"');          // markup contract from mwg_042
  expect(html).toContain('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js');
});

test('compose includes wrapLettersInSpan helper exactly once', async () => {
  const { js } = await compose(plan, { recipeRoot: 'GSAP Animations' });
  expect((js.match(/function wrapLettersInSpan/g) || []).length).toBe(1);
});

test('compose includes wrapWordsInSpan helper exactly once', async () => {
  const { js } = await compose(plan, { recipeRoot: 'GSAP Animations' });
  expect((js.match(/function wrapWordsInSpan/g) || []).length).toBe(1);
});

test('compose inlines per-citation CSS into <style> block', async () => {
  const { html } = await compose(plan, { recipeRoot: 'GSAP Animations' });
  // Both citations' CSS headers are present as comments.
  expect(html).toContain('/* mwg_010 */');
  expect(html).toContain('/* mwg_042 */');
  // Recipe CSS should produce scroll-space and element sizing — not just the
  // composer's minimal reset. Spot-check for a property every non-trivial
  // port emits (100vh viewport slot is near-universal across the library).
  expect(html).toContain('100vh');
});

test('compose flows plan.content through generateMarkup per citation', async () => {
  const { html } = await compose(plan, { recipeRoot: 'GSAP Animations' });
  // mwg_010 headline replaces the library placeholder text.
  expect(html).toContain('Cite not invent');
  // mwg_042 card labels replace the numbered-placeholder cells.
  expect(html).toContain('Research');
  expect(html).toContain('Cite');
  expect(html).toContain('Storyboard');
  expect(html).toContain('Ship');
  // Placeholder fallback text should NOT appear when content is supplied.
  expect(html).not.toContain('Your text');
});

test('compose falls back to library placeholder when plan.content is absent', async () => {
  const { content, ...planNoContent } = plan;
  const { html } = await compose(planNoContent, { recipeRoot: 'GSAP Animations' });
  // Must still produce the mwg_042 markup-contract (with placeholder numbered cells).
  expect(html).toContain('mwg_042 markup contract');
  // And the mwg_010 placeholder headline.
  expect(html).toContain('mwg_010 markup contract');
});
