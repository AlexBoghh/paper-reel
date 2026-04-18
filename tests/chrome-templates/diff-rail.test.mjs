import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('diff rail with 3 changed frame ticks + annotations', () => {
  const ticks = [14, 42, 85].map(pct =>
    `<span style="font-size:8px">▾ ${pct}%</span>`
  ).join('');
  const annotations = [14, 42, 85].map(pct =>
    `<span>TRANSLATE-X</span>`
  ).join('');
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/diff-rail.html', {
    WIDTH: 3924,
    CHANGED_COUNT: 3,
    TICK_MARKERS: ticks,
    CHANGE_ANNOTATIONS: annotations
  });
  expect(html).toContain('DIFF · 3 / 8');
  expect(html).toContain('CHANGES');
  expect(html).toContain('▾ 14%');
  expect(html).toContain('▾ 42%');
  expect(html).toContain('▾ 85%');
  expect(html).toContain('TRANSLATE-X');
});
