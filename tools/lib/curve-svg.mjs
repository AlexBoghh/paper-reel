import { evalEase } from './easings.mjs';

const SAMPLE_POINTS = [0, 14, 28, 42, 57, 71, 85, 100];

/**
 * Render an easing curve as inline SVG. The `height` defaults to 32 to match
 * the curve-strip template's bottom-row dimensions (top 16 reserved for the
 * recipe label). Pass an explicit height to override (e.g. tests using 24).
 */
export function generateCurveSVG({ ease, width, height = 32 }) {
  const path = buildPath(ease, width, height);
  const ticks = SAMPLE_POINTS.map(pct => {
    const x = (pct / 100) * width;
    return `<line data-tick="${pct}" x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#f97316" stroke-width="1" stroke-opacity="0.4"/>`;
  }).join('');
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${ticks}<path d="${path}" stroke="#f97316" stroke-width="1.5" fill="none"/></svg>`;
}

/**
 * Render a "you are here" overlay for a curve strip — a thin vertical orange
 * line at `markerPct` (0–100) of the strip's width. Returns absolute-positioned
 * HTML that goes inside the curve-strip's bottom row alongside the SVG.
 *
 * Returns empty string when markerPct is null/undefined so the placeholder
 * collapses cleanly in the template.
 */
export function generatePositionMarker({ markerPct, width, height = 32 }) {
  if (markerPct == null || Number.isNaN(markerPct)) return '';
  const x = Math.max(0, Math.min(100, markerPct)) / 100 * width;
  return `<div style="position:absolute;left:${x.toFixed(1)}px;top:0;width:2px;height:${height}px;background:#f97316;box-shadow:0 0 6px rgba(249,115,22,0.65);" data-marker="${markerPct}"></div>`;
}

function buildPath(ease, w, h) {
  // Special-case linear so the test gets the simple 'M 0 h L w 0' form
  if (ease === 'none') return `M 0 ${h} L ${w} 0`;
  const steps = 60;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const v = evalEase(ease, t);
    const x = t * w;
    const y = (1 - v) * h;
    d += (i === 0 ? 'M ' : ' L ') + x.toFixed(2) + ' ' + y.toFixed(2);
  }
  return d;
}
