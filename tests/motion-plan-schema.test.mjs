import { test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { validateMotionPlan } from '../tools/lib/motion-plan-schema.mjs';

const sample = JSON.parse(readFileSync('tests/fixtures/sample-motion-plan.json', 'utf8'));

test('valid plan returns []', () => {
  expect(validateMotionPlan(sample)).toEqual([]);
});

test('missing version errors', () => {
  const { version, ...bad } = sample;
  expect(validateMotionPlan(bad)).toContain('missing version');
});

test('captions must be length 8', () => {
  expect(validateMotionPlan({ ...sample, captions: ['a'] }))
    .toContain('captions must have exactly 8 entries');
});

test('timeline primitive needs ease', () => {
  const bad = structuredClone(sample);
  delete bad.timeline[0].primitives[0].ease;
  expect(validateMotionPlan(bad)).toContain('timeline[0].primitives[0]: missing ease');
});

test('reports multiple errors at once (not just first)', () => {
  const bad = { ...sample };
  delete bad.version;
  delete bad.timestamp;
  const errs = validateMotionPlan(bad);
  expect(errs).toContain('missing version');
  expect(errs).toContain('missing timestamp');
});
