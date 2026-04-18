// tools/lib/frame-builder.mjs
//
// FALLBACK / DEBUG ONLY. This module produces generic black-rectangle motion
// diagrams — useful for sanity-checking sampler output, not for shipping in a
// showcase run. The storyboard's primary path (per SKILL.md Stage 6) is
// design-rich frame authoring using SOURCE design tokens + frames.json
// positions. See SKILL.md Stage 6 and CLAUDE.md "showcase project" section.

/**
 * Resolve staggered selector keys (".sel[N]") to real text from
 * plan.content[recipeId]. Shape-based, recipe-agnostic — works for any
 * recipe whose contentShape declares either `headline: string` or
 * `cards: array of { label, … }` (the two patterns used across the
 * mwg_* corpus).
 *
 * Selectors with no resolvable content get no entry; buildFrameInner
 * falls back to its selector-derived label for those.
 *
 * Future: when each recipe gains a `frameLabel(content, index)` export
 * (part of the larger styleShape work), replace this shape sniff with
 * a delegated call.
 */
export function buildContentByKey(plan) {
  const map = {};
  if (!plan || !Array.isArray(plan.timeline)) return map;
  for (const entry of plan.timeline) {
    const content = plan.content?.[entry.recipeId];
    if (!content) continue;
    for (const prim of entry.primitives ?? []) {
      if (!prim.stagger?.count) continue;
      const labelAt = pickLabelResolver(content);
      if (!labelAt) continue;
      for (let i = 0; i < prim.stagger.count; i++) {
        const value = labelAt(i);
        if (typeof value === 'string' && value.length > 0) {
          map[`${prim.selector}[${i}]`] = value;
        }
      }
    }
  }
  return map;
}

function pickLabelResolver(content) {
  if (typeof content.headline === 'string' && content.headline.trim()) {
    const words = content.headline.trim().split(/\s+/);
    return (i) => words[i];
  }
  if (Array.isArray(content.cards)) {
    return (i) => content.cards[i]?.label;
  }
  return null;
}

export function buildFrameInner(stateAtPct, { width, height }, options = {}) {
  const contentByKey = options.contentByKey ?? {};
  const layers = Object.entries(stateAtPct).map(([sel, props]) => {
    const left = props.translateX ?? 0;
    const top  = props.translateY ?? 0;
    const w = props.width ?? 80;
    const h = props.height ?? 12;
    const opacity = props.opacity ?? 1;
    const labelText = contentByKey[sel] ?? sel.replace(/^\./, '');
    const label = labelText.slice(0, 14);
    return `<div data-sel="${sel}" style="position:absolute;left:${left}px;top:${top}px;width:${w}px;height:${h}px;background:#0a0a0a;color:#f0ebe0;font-family:'JetBrains Mono',monospace;font-size:8px;display:flex;align-items:center;justify-content:center;opacity:${opacity};border-radius:2px">${label}</div>`;
  }).join('');
  return `<div style="position:relative;width:${width}px;height:${height}px;background:#f0ebe0;overflow:clip">${layers}</div>`;
}
