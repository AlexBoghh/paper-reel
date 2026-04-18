import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('rib is 20×300 black', () => {
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/filmstrip-rib.html', {});
  expect(html).toContain('width:20px');
  expect(html).toContain('height:300px');
  expect(html).toContain('background:#0a0a0a');
});
