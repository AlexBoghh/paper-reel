import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('top frame substitutes width and fills orange', () => {
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/content-frame-top.html', {
    WIDTH: 992
  });
  expect(html).toContain('width:992px');
  expect(html).toContain('height:16px');
  expect(html).toContain('background:#f97316');
});
