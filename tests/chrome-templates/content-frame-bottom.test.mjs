import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('bottom frame renders both spans with mono dark-on-orange', () => {
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/content-frame-bottom.html', {
    WIDTH: 992, ZONE_NAME: 'SOURCE', DESCRIPTOR: 'RECIPE INPUT', DIMS: '992×300'
  });
  expect(html).toContain('width:992px');
  expect(html).toContain('R01 · SOURCE · RECIPE INPUT');
  expect(html).toContain('992×300');
  expect(html).toContain('background:#f97316');
  expect(html).toContain('color:#1a0f08');
  expect(html).toContain("font-family:'JetBrains Mono'");
});
