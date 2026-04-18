import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('letterbox has both bars and substitutes GIF src + runtime', () => {
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/cinema-letterbox.html', {
    GIF_URL: 'https://example.com/reel.gif', RUNTIME: '00:00:12'
  });
  expect(html).toContain('src="https://example.com/reel.gif"');
  expect(html).toContain('00:00:00 / 00:00:12');
  expect(html).toContain('LIVE · NOW PLAYING');
  expect(html).toContain('SCROLL TO PLAY');
  expect((html.match(/height:40px/g) || []).length).toBe(2);
  expect(html).toContain('width:720px');
  expect(html).toContain('height:450px');
});
