import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('frame contains pip at given y and inner content', () => {
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/frame-shell.html', {
    SCROLL_PIP_Y: 142, INNER_HTML: '<p>scene</p>'
  });
  expect(html).toContain('top:142px');
  expect(html).toContain('background:#f97316');
  expect(html).toContain('<p>scene</p>');
});
