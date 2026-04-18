import { test, expect } from 'vitest';
import { renderTemplate } from '../../tools/lib/template-loader.mjs';
import { generateCurveSVG, generatePositionMarker } from '../../tools/lib/curve-svg.mjs';

test('curve strip composes width, label, SVG, and empty position marker', () => {
  const svg = generateCurveSVG({ ease: 'power2.out', width: 3924, height: 32 });
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/curve-strip.html', {
    WIDTH: 3924,
    LABEL: 'R01 · MWG_042 · BACK.INOUT(3)',
    SVG: svg,
    POSITION_MARKER: ''
  });
  expect(html).toContain('width:3924px');
  expect(html).toContain('height:48px');
  expect(html).toContain('R01 · MWG_042 · BACK.INOUT(3)');
  expect(html).toContain('<svg');
  expect(html).toContain('data-tick="42"');
});

test('curve strip composes with a position marker overlay', () => {
  const svg = generateCurveSVG({ ease: 'none', width: 3924, height: 32 });
  const marker = generatePositionMarker({ markerPct: 28, width: 3924 });
  const html = renderTemplate('_skill_extracted/reel/chrome-templates/curve-strip.html', {
    WIDTH: 3924,
    LABEL: 'R01 · MWG_010 · POWER1.INOUT',
    SVG: svg,
    POSITION_MARKER: marker
  });
  expect(html).toContain('data-marker="28"');
});
