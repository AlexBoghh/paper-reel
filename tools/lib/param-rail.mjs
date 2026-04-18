// tools/lib/param-rail.mjs
//
// Builds the 4–6 line mono micro-table that populates the {PARAM_RAIL_HTML}
// slot inside each citation-slab. Rows are emitted in fixed order (pin,
// scrub, ease, stagger, start, end); any row whose value is undefined is
// skipped. The rail self-wraps in a flex-column container because the
// citation-slab body is already a flex-column with gap:14px, so the container
// + its 1px top border reads as the divider between the cited block and the
// params.
//
// No <style> blocks — Paper requires inline styles only.

export function buildParamRail(params = {}, derived = {}) {
  const rows = [];
  if (params.pin !== undefined)   rows.push(['pin',    String(params.pin)]);
  if (params.scrub !== undefined) rows.push(['scrub',  String(params.scrub)]);
  if (params.ease)                rows.push(['ease',   params.ease]);
  if (derived.stagger)            rows.push(['stagger', `${derived.stagger.count} × ${derived.stagger.amount}`]);
  if (params.start)               rows.push(['start',  params.start]);
  if (params.end)                 rows.push(['end',    params.end]);
  if (!rows.length) return '';

  const lines = rows.map(([k, v]) =>
    `<div style="display:flex;justify-content:space-between;width:100%"><span style="color:rgba(26,15,8,0.55)">${k}</span><span style="color:#1a0f08">${v}</span></div>`
  ).join('');

  return `<div style="display:flex;flex-direction:column;gap:4px;padding-top:6px;border-top:1px solid rgba(26,15,8,0.15);font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:0.08em">${lines}</div>`;
}

export function deriveFromTimeline(timeline, recipeId) {
  const entry = timeline.find(t => t.recipeId === recipeId);
  if (!entry) return {};
  const stagger = entry.primitives.find(p => p.stagger)?.stagger;
  return { stagger };
}
