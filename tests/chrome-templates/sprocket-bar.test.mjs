import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('renders 40 holes at width 3924', () => {
  const holes = Array(40).fill('<div style="width:20px;height:14px;border-radius:2px;background:#f0ebe0;flex-shrink:0"></div>').join('');
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/sprocket-bar.html', {
    WIDTH: 3924, HOLES: holes
  });
  expect(html).toContain('width:3924px');
  expect((html.match(/background:#f0ebe0/g) || []).length).toBe(40);
});
