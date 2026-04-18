import { test, expect } from 'vitest';
import { sampleTimeline } from '../tools/sample-timeline.mjs';

const plan = {
  version: 1, timestamp: 't', parent: null,
  viewport: { w: 1440, h: 900 }, duration: 100,
  citations: [{ recipeId: 'mwg_010', role: 'PRIMARY', category: 'TEXT', opts: {} }],
  timeline: [
    { id: 'a', recipeId: 'mwg_010', scrollRange: [0, 100],
      primitives: [
        { kind: 'translateX', selector: '.text', from: 0, to: 100, ease: 'none' },
        { kind: 'translateY', selector: '.box', from: 0, to: 100, ease: 'power2.out' }
      ] }
  ],
  params: {}, captions: ['1','2','3','4','5','6','7','8']
};

test('linear sample at 50% = 50', () => {
  const f = sampleTimeline(plan);
  const x = f.elements['.text'].find(s => s.scrollPct === 57).translateX;
  expect(x).toBeCloseTo(57, 0);
});

test('power2.out at 50% > 50 (eased ahead)', () => {
  const f = sampleTimeline(plan);
  const y = f.elements['.box'].find(s => s.scrollPct === 57).translateY;
  expect(y).toBeGreaterThan(70);
});

test('stagger spreads element indices', () => {
  const staggered = {
    ...plan,
    timeline: [{ id: 's', recipeId: 'mwg_010', scrollRange: [0, 100],
      primitives: [{ kind: 'translateY', selector: '.media', from: 0, to: 100,
                     ease: 'none', stagger: { count: 3, amount: 0.2 } }] }]
  };
  const f = sampleTimeline(staggered);
  const at50_first  = f.elements['.media[0]'].find(s => s.scrollPct === 57).translateY;
  const at50_third  = f.elements['.media[2]'].find(s => s.scrollPct === 57).translateY;
  expect(at50_first).toBeGreaterThan(at50_third);  // index 0 ahead of index 2
});
