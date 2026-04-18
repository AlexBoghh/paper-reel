import { test, expect } from 'vitest';
import { sampleTimeline } from '../../tools/sample-timeline.mjs';
import { compose } from '../../tools/compose-export.mjs';
import { validateExport, validateMotionPlanCompleteness } from '../../tools/validate-export.mjs';
import { readFileSync } from 'node:fs';

const plan = JSON.parse(readFileSync('tests/fixtures/jazzy-stack-motion-plan.json', 'utf8'));

test('plan → frames → compose → validate round-trips clean', async () => {
  const frames = sampleTimeline(plan);
  expect(frames.samplePoints).toEqual([0,14,28,42,57,71,85,100]);
  expect(frames.elements['.hero .text']).toBeTruthy();

  const { js } = await compose(plan, { recipeRoot: 'GSAP Animations' });
  const sigErrs = await validateExport(js, plan, { recipeRoot: 'GSAP Animations' });
  const compErrs = await validateMotionPlanCompleteness(plan, { recipeRoot: 'GSAP Animations' });
  expect(sigErrs).toEqual([]);
  expect(compErrs).toEqual([]);
});
