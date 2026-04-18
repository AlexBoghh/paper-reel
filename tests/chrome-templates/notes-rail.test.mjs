import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('notes rail bottom-aligns descriptor and take', () => {
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/notes-rail.html', {
    DESCRIPTOR: 'NOTE · MARQUEE STARTS', TAKE: 'T01'
  });
  expect(html).toContain('NOTE · MARQUEE STARTS');
  expect(html).toContain('T01');
  expect(html).toContain('align-items:flex-end');
});
