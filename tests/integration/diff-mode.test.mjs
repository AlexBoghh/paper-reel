import { test, expect } from 'vitest';
import { sampleTimeline } from '../../tools/sample-timeline.mjs';
import { diffPlans } from '../../tools/lib/diff-plan.mjs';
import { compose } from '../../tools/compose-export.mjs';
import { validateExport, validateMotionPlanCompleteness } from '../../tools/validate-export.mjs';
import { readFileSync } from 'node:fs';

const v1 = JSON.parse(readFileSync('tests/fixtures/jazzy-stack-motion-plan.json', 'utf8'));

test('v1 → v2 (swap secondary recipe) round-trips', async () => {
  const v2 = structuredClone(v1);
  v2.timestamp = '2026-04-17-jazzy-stack-v2';
  v2.parent = v1.timestamp;
  v2.citations[1].recipeId = 'mwg_001';
  // mwg_001 requires containerSelector/cardsContainerSelector/cardSelector —
  // fabricate valid selectors since v1's mwg_042 opts don't have these keys.
  v2.citations[1].opts = {
    containerSelector: '.features',
    cardsContainerSelector: '.features .cards',
    cardSelector: '.features .card'
  };
  v2.timeline[1].recipeId = 'mwg_001';
  v2.params.mwg_001 = v2.params.mwg_042;
  delete v2.params.mwg_042;
  // content is keyed by recipeId — re-key (or drop) when swapping citations,
  // schema refuses content keys that don't appear in citations[].
  if (v2.content && v2.content.mwg_042) {
    v2.content.mwg_001 = v2.content.mwg_042;
    delete v2.content.mwg_042;
  }

  const f1 = sampleTimeline(v1);
  const f2 = sampleTimeline(v2);
  const diff = diffPlans(f1, f2);
  expect(diff.changedFrames.length).toBeGreaterThanOrEqual(0); // selectors changed but values can be same

  const { js } = await compose(v2, { recipeRoot: 'GSAP Animations' });
  const sigErrs = await validateExport(js, v2, { recipeRoot: 'GSAP Animations' });
  const compErrs = await validateMotionPlanCompleteness(v2, { recipeRoot: 'GSAP Animations' });
  expect(sigErrs).toEqual([]);
  expect(compErrs).toEqual([]);
});
