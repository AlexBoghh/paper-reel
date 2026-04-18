import { test, expect } from 'vitest';
import { pickGlyph } from '../tools/lib/glyph-picker.mjs';

test('translateX → →', () => {
  expect(pickGlyph([{ kind: 'translateX' }])).toBe('→');
});
test('translateY → ↓', () => {
  expect(pickGlyph([{ kind: 'translateY' }])).toBe('↓');
});
test('scale → ⇲', () => {
  expect(pickGlyph([{ kind: 'scale' }])).toBe('⇲');
});
test('opacity → ◌', () => {
  expect(pickGlyph([{ kind: 'opacity' }])).toBe('◌');
});
test('with stagger → ··', () => {
  expect(pickGlyph([{ kind: 'translateX', stagger: { count: 3, amount: 0.1 } }])).toBe('··');
});
test('empty → · (rest)', () => {
  expect(pickGlyph([])).toBe('·');
});
