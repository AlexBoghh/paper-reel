import { test, expect } from 'vitest';
import { parseSnapshotPercents } from '../tools/capture_via_browserbase.mjs';

test('parses --snapshots=csv form', () => {
  const argv = ['previews/foo.html', '--snapshots=0,14,28,42,57,71,85,100'];
  expect(parseSnapshotPercents(argv)).toEqual([0, 14, 28, 42, 57, 71, 85, 100]);
});

test('parses --snapshots <csv> space-separated form', () => {
  const argv = ['previews/foo.html', '--snapshots', '0,50,100'];
  expect(parseSnapshotPercents(argv)).toEqual([0, 50, 100]);
});

test('returns null when no flag is present (GIF-mode default)', () => {
  expect(parseSnapshotPercents(['previews/foo.html'])).toBeNull();
});

test('drops non-numeric entries, keeps the rest', () => {
  expect(parseSnapshotPercents(['x', '--snapshots=0,abc,42'])).toEqual([0, 42]);
});

test('returns null when the flag is empty', () => {
  expect(parseSnapshotPercents(['x', '--snapshots='])).toBeNull();
});
