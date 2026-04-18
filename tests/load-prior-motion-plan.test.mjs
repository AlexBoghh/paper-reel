import { test, expect } from 'vitest';
import { loadMostRecentPlan } from '../tools/load-prior-motion-plan.mjs';
import { writeFileSync, mkdirSync, rmSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = join(tmpdir(), 'reel-priors');

test('returns the most recent motion-plan by mtime', () => {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'a.motion-plan.json'), JSON.stringify({ timestamp: 'a' }));
  writeFileSync(join(dir, 'b.motion-plan.json'), JSON.stringify({ timestamp: 'b' }));
  // Force a later mtime on b (Windows fs mtime resolution can be coarser than two
  // successive writeFileSync calls; explicitly set times to guarantee ordering).
  const now = Date.now() / 1000;
  utimesSync(join(dir, 'a.motion-plan.json'), now - 10, now - 10);
  utimesSync(join(dir, 'b.motion-plan.json'), now, now);
  const p = loadMostRecentPlan(dir);
  expect(p.timestamp).toBe('b');
});

test('returns null when no plans found', () => {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  expect(loadMostRecentPlan(dir)).toBe(null);
});
