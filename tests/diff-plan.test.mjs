import { test, expect } from 'vitest';
import { diffPlans } from '../tools/lib/diff-plan.mjs';
import { sampleTimeline } from '../tools/sample-timeline.mjs';

const base = {
  version: 1, timestamp: 'v1', parent: null,
  viewport: { w: 1440, h: 900 }, duration: 100,
  citations: [{ recipeId: 'mwg_010', role: 'PRIMARY', category: 'TEXT', opts: {} }],
  timeline: [{ id: 'a', recipeId: 'mwg_010', scrollRange: [0, 100],
    primitives: [{ kind: 'translateX', selector: '.t', from: 0, to: 100, ease: 'none' }] }],
  params: {}, captions: ['1','2','3','4','5','6','7','8']
};

test('identical plans → all 8 frames unchanged', () => {
  const v1 = sampleTimeline(base);
  const v2 = sampleTimeline(structuredClone(base));
  const diff = diffPlans(v1, v2);
  expect(diff.changedFrames).toEqual([]);
  expect(diff.kindsByFrame).toEqual({});
  expect(diff.summary).toEqual({ total: 8, changed: 0, unchanged: 8 });
});

test('changing to-value → all frames after start change', () => {
  const b2 = structuredClone(base);
  b2.timeline[0].primitives[0].to = 200;
  const v1 = sampleTimeline(base);
  const v2 = sampleTimeline(b2);
  const diff = diffPlans(v1, v2);
  expect(diff.changedFrames.length).toBeGreaterThan(0);
  expect(diff.summary.changed).toBe(diff.changedFrames.length);
});

test('kindsByFrame reports the primitive kinds that changed per frame', () => {
  const b2 = structuredClone(base);
  b2.timeline[0].primitives[0].to = 200;
  const v1 = sampleTimeline(base);
  const v2 = sampleTimeline(b2);
  const diff = diffPlans(v1, v2);
  // every changed frame should have translateX in its kinds set
  for (const pct of diff.changedFrames) {
    expect(diff.kindsByFrame[pct]).toContain('translateX');
  }
});

test('adding a second primitive kind surfaces both kinds in kindsByFrame', () => {
  const b2 = structuredClone(base);
  b2.timeline[0].primitives.push({
    kind: 'rotate', selector: '.t', from: 0, to: 45, ease: 'none'
  });
  const v1 = sampleTimeline(base);
  const v2 = sampleTimeline(b2);
  const diff = diffPlans(v1, v2);
  // at least one changed frame should mention rotate (v1 has no rotate at all, so every v2 sample differs)
  const allKinds = new Set();
  for (const pct of diff.changedFrames) {
    for (const kind of diff.kindsByFrame[pct] || []) allKinds.add(kind);
  }
  expect(allKinds.has('rotate')).toBe(true);
});

test('summary counts reflect changedFrames length', () => {
  const b2 = structuredClone(base);
  b2.timeline[0].primitives[0].to = 200;
  const v1 = sampleTimeline(base);
  const v2 = sampleTimeline(b2);
  const diff = diffPlans(v1, v2);
  expect(diff.summary.total).toBe(8);
  expect(diff.summary.changed + diff.summary.unchanged).toBe(8);
});
