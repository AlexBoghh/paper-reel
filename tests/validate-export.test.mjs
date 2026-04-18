import { test, expect } from 'vitest';
import { validateExport, validateMotionPlanCompleteness, validateMotionPlanContent } from '../tools/validate-export.mjs';
import { readFileSync } from 'node:fs';

const plan = JSON.parse(readFileSync('tests/fixtures/jazzy-stack-motion-plan.json', 'utf8'));

test('returns [] when all signatures present', async () => {
  const goodJs = `
    Math.sin(sinusIncr_010) * (window.innerHeight * 0.2)
    (Math.random() - 0.5) * 32
    containerAnimation: scrollTween
    wrapLettersInSpan(x)
    back.inOut(3)
    ScrollTrigger.create({ trigger: pinHeight, pin: container })
    yPercent: -80
    z: -gap
    scrub: 0.5
    power4.in
  `;
  const errs = await validateExport(goodJs, plan, { recipeRoot: 'GSAP Animations' });
  expect(errs).toEqual([]);
});

test('reports missing signature when JS has wrong numeric', async () => {
  const badJs = `Math.sin(sinusIncr_010) * (window.innerHeight * 0.18)`; // wrong amplitude
  const errs = await validateExport(badJs, plan, { recipeRoot: 'GSAP Animations' });
  expect(errs.some(e => e.includes('mwg_010') && e.includes('innerHeight * 0.2'))).toBe(true);
});

test('completeness OK when every meaningful param present', async () => {
  const errs = await validateMotionPlanCompleteness(plan, { recipeRoot: 'GSAP Animations' });
  // jazzy-stack fixture sets all meaningfulParams for both recipes
  expect(errs).toEqual([]);
});

test('completeness FAILS when a meaningful param is missing', async () => {
  const broken = structuredClone(plan);
  delete broken.params.mwg_042.start;  // mwg_042 lists 'start' as meaningful
  const errs = await validateMotionPlanCompleteness(broken, { recipeRoot: 'GSAP Animations' });
  expect(errs.some(e => e.includes('mwg_042') && e.includes('start'))).toBe(true);
});

test('content OK when every contentShape key is populated', async () => {
  const errs = await validateMotionPlanContent(plan, { recipeRoot: 'GSAP Animations' });
  // jazzy-stack fixture has content.mwg_010.headline + content.mwg_042.cards
  expect(errs).toEqual([]);
});

test('content FAILS when an entire content entry is missing', async () => {
  const broken = structuredClone(plan);
  delete broken.content.mwg_010;
  const errs = await validateMotionPlanContent(broken, { recipeRoot: 'GSAP Animations' });
  expect(errs.some(e => e.includes('mwg_010') && e.includes('missing content entry'))).toBe(true);
});

test('content FAILS when a contentShape key is missing on an existing entry', async () => {
  const broken = structuredClone(plan);
  delete broken.content.mwg_042.cards;
  const errs = await validateMotionPlanContent(broken, { recipeRoot: 'GSAP Animations' });
  expect(errs.some(e => e.includes('mwg_042') && e.includes('cards') && e.includes('required'))).toBe(true);
});

test('content FAILS when a string content field is blank', async () => {
  const broken = structuredClone(plan);
  broken.content.mwg_010.headline = '   ';
  const errs = await validateMotionPlanContent(broken, { recipeRoot: 'GSAP Animations' });
  expect(errs.some(e => e.includes('mwg_010') && e.includes('headline') && e.includes('empty'))).toBe(true);
});

test('content FAILS when an array content field is empty', async () => {
  const broken = structuredClone(plan);
  broken.content.mwg_042.cards = [];
  const errs = await validateMotionPlanContent(broken, { recipeRoot: 'GSAP Animations' });
  expect(errs.some(e => e.includes('mwg_042') && e.includes('cards') && e.includes('empty array'))).toBe(true);
});
