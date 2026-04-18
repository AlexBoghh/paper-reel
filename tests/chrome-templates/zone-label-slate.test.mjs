import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('renders SOURCE label with 17 reel rects', () => {
  const rects = Array(17).fill('<div style="width:32px;height:20px;border-radius:3px;background:#f0ebe0;flex-shrink:0"></div>').join('');
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/zone-label-slate.html', {
    TITLE: 'SOURCE', WIDTH: 992, REEL_RECTS: rects
  });
  expect(html).toContain('SOURCE');
  expect(html).toContain('width:992px');
  expect((html.match(/background:#f0ebe0/g) || []).length).toBe(17);
});
