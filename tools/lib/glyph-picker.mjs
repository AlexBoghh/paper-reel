// tools/lib/glyph-picker.mjs
//
// Picks a single Unicode glyph that telegraphs the dominant motion primitive
// active in a given scroll-% slice. Consumed by the STORYBOARD transition-glyph
// overlay (7 glyphs, one per rib gap between the 8 frame columns).
//
// `pickGlyph(primitives)` — given the primitives active at the midpoint of a
// rib gap, return the canonical glyph. Stagger takes precedence over kind.
//
// `primitivesActiveAt(timeline, scrollPctMidpoint)` — flatten all primitives
// whose scrollRange straddles the midpoint; returns [] if no entry covers it.

export function pickGlyph(primitives) {
  if (!primitives.length) return '·';
  const firstStaggered = primitives.find(p => p.stagger);
  if (firstStaggered) return '··';
  const map = {
    translateX: '→',
    translateY: '↓',
    scale: '⇲',
    opacity: '◌',
    rotate: '↻',
    width: '↔',
    height: '↕'
  };
  const p = primitives[0];
  return map[p.kind] || '·';
}

export function primitivesActiveAt(timeline, scrollPctMidpoint) {
  const out = [];
  for (const entry of timeline) {
    const [s, e] = entry.scrollRange;
    if (scrollPctMidpoint < s || scrollPctMidpoint > e) continue;
    out.push(...entry.primitives);
  }
  return out;
}
