import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';
import { generateCurveSVG } from '../../tools/lib/curve-svg.mjs';
import { buildParamRail, deriveFromTimeline } from '../../tools/lib/param-rail.mjs';
import { pickGlyph, primitivesActiveAt } from '../../tools/lib/glyph-picker.mjs';
import { readFileSync } from 'node:fs';

const plan = JSON.parse(readFileSync('tests/fixtures/jazzy-stack-motion-plan.json', 'utf8'));

test('curve strips render for both citations', () => {
  for (const cit of plan.citations) {
    const ease = plan.params[cit.recipeId].ease;
    const svg = generateCurveSVG({ ease, width: 3924, height: 32 });
    const html = renderTemplate('_skill_extracted/reel/chrome-templates/curve-strip.html', {
      WIDTH: 3924,
      LABEL: `R01 · ${cit.recipeId.toUpperCase()} · ${ease.toUpperCase()}`,
      SVG: svg,
      POSITION_MARKER: ''
    });
    expect(html).toContain('<svg');
    expect(html).toContain(cit.recipeId.toUpperCase());
  }
});

test('param rail populates from plan.params', () => {
  const html = buildParamRail(plan.params.mwg_042, deriveFromTimeline(plan.timeline, 'mwg_042'));
  expect(html).toContain('pin');
  expect(html).toContain('back.inOut(3)');
  expect(html).toContain('3 × 0.15');
});

test('glyph picks based on midpoint', () => {
  const mid = (28 + 42) / 2; // gap between frames 2 and 3, in mwg_010 marquee range [0,50]
  const primitives = primitivesActiveAt(plan.timeline, mid);
  expect(pickGlyph(primitives)).toBe('→');
});
