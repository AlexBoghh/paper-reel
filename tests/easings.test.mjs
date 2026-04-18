import { test, expect } from 'vitest';
import { evalEase } from '../tools/lib/easings.mjs';

// GSAP convention: powerN ease is t^(N+1) — power2 is cubic, power4 is quintic.

test('linear (none) at 0.5 = 0.5', () => {
  expect(evalEase('none', 0.5)).toBeCloseTo(0.5, 4);
});

test('power2.out at 0.5 = 0.875 (= 1 - 0.5^3)', () => {
  expect(evalEase('power2.out', 0.5)).toBeCloseTo(0.875, 4);
});

test('power4.in at 0.5 = 0.03125 (= 0.5^5)', () => {
  expect(evalEase('power4.in', 0.5)).toBeCloseTo(0.03125, 4);
});

test('back.inOut(3) at 0.5 = 0.5', () => {
  expect(evalEase('back.inOut(3)', 0.5)).toBeCloseTo(0.5, 4);
});

test('throws on unknown ease', () => {
  expect(() => evalEase('definitely.not.an.ease(99)', 0.5)).toThrow(/Unknown ease/);
});
