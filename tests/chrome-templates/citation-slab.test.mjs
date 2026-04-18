import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';

test('slab contains all 6 metadata fields', () => {
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/citation-slab.html', {
    ROLE: 'PRIMARY', CATEGORY: 'TEXT', NUMERAL: '010',
    NAME: 'JAZZY LETTERS', QUOTE: 'Letters riding a sine wave',
    GENRE: 'MARQUEE · SINE · LETTER-SPLIT', PARAM_RAIL_HTML: ''
  });
  for (const expected of ['PRIMARY', 'TEXT', '010', 'JAZZY LETTERS',
                          'Letters riding a sine wave', 'MARQUEE · SINE · LETTER-SPLIT']) {
    expect(html).toContain(expected);
  }
  expect(html).toContain('background:#f97316');
});
