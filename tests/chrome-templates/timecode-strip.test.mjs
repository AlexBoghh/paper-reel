import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('timecode renders mono orange', () => {
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/timecode-strip.html', {
    TIMECODE: '00:00:42'
  });
  expect(html).toContain('00:00:42');
  expect(html).toContain('color:#f97316');
  expect(html).toContain('font-family:\'JetBrains Mono\'');
});
