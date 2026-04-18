import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('caption renders Inter 13 cream', () => {
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/caption-strip.html', {
    TEXT: 'marquee enters from right'
  });
  expect(html).toContain('marquee enters from right');
  expect(html).toContain('font-size:13px');
  expect(html).toContain('color:#f0ebe0');
});
