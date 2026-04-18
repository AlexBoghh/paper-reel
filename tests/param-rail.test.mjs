import { test, expect } from 'vitest';
import { buildParamRail } from '../tools/lib/param-rail.mjs';

test('renders 5 lines for typical params', () => {
  const html = buildParamRail({
    pin: true, scrub: true, ease: 'none', start: 'top top', end: '+=distance'
  }, { stagger: { count: 3, amount: 0.15 } });
  for (const k of ['pin', 'scrub', 'ease', 'stagger', 'start']) {
    expect(html).toContain(k);
  }
  expect(html).toContain('3 × 0.15');
  expect(html).toContain("'JetBrains Mono'");
});
