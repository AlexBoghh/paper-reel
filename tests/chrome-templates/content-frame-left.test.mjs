import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('left frame substitutes height and fills orange', () => {
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/content-frame-left.html', {
    HEIGHT: 300
  });
  expect(html).toContain('width:16px');
  expect(html).toContain('height:300px');
  expect(html).toContain('background:#f97316');
});
