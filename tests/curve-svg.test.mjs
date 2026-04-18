import { test, expect } from 'vitest';
import { generateCurveSVG, generatePositionMarker } from '../tools/lib/curve-svg.mjs';

test('linear ease produces a straight path', () => {
  const svg = generateCurveSVG({ ease: 'none', width: 3924, height: 24 });
  expect(svg).toContain('<svg');
  expect(svg).toContain('width="3924"');
  expect(svg).toContain('M 0 24 L 3924 0'); // straight from bottom-left to top-right
});

test('curve includes 8 tick markers', () => {
  const svg = generateCurveSVG({ ease: 'power2.out', width: 3924, height: 24 });
  expect((svg.match(/<line[^>]*data-tick/g) || []).length).toBe(8);
});

test('default height is 32 (matches curve-strip bottom row)', () => {
  const svg = generateCurveSVG({ ease: 'none', width: 100 });
  expect(svg).toContain('height="32"');
});

test('generatePositionMarker returns absolute-positioned line at given pct', () => {
  const marker = generatePositionMarker({ markerPct: 50, width: 1000 });
  expect(marker).toContain('left:500.0px');
  expect(marker).toContain('background:#f97316');
  expect(marker).toContain('data-marker="50"');
});

test('generatePositionMarker returns empty string when markerPct is null', () => {
  expect(generatePositionMarker({ markerPct: null, width: 1000 })).toBe('');
  expect(generatePositionMarker({ markerPct: undefined, width: 1000 })).toBe('');
});

test('generatePositionMarker clamps out-of-range values', () => {
  const m1 = generatePositionMarker({ markerPct: -10, width: 1000 });
  const m2 = generatePositionMarker({ markerPct: 150, width: 1000 });
  expect(m1).toContain('left:0.0px');
  expect(m2).toContain('left:1000.0px');
});
