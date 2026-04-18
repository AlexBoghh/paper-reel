// tools/lib/diff-plan.mjs
const SAMPLE_POINTS = [0, 14, 28, 42, 57, 71, 85, 100];
const EPS = 0.5;

/**
 * Compare v1 vs v2 sampler output. Returns:
 *   - changedFrames: sorted list of scroll %s where at least one primitive
 *     property differs by more than EPS
 *   - kindsByFrame:  map { pct → sorted[] of primitive `kind`s that differ
 *     at that scroll %, e.g. "translateX" }
 *   - summary:       { total, changed, unchanged } counts
 *
 * `kindsByFrame` is the input to the diff-rail's bottom annotation row —
 * it lets the agent render a short label ("TRANSLATE-X") per changed column
 * instead of just "something moved."
 */
export function diffPlans(framesV1, framesV2) {
  const changed = new Set();
  const kindsByFrame = {};
  const allKeys = new Set([
    ...Object.keys(framesV1.elements),
    ...Object.keys(framesV2.elements)
  ]);

  for (const key of allKeys) {
    const a = framesV1.elements[key] || [];
    const b = framesV2.elements[key] || [];
    for (const pct of SAMPLE_POINTS) {
      const sa = a.find(s => s.scrollPct === pct) || {};
      const sb = b.find(s => s.scrollPct === pct) || {};
      const props = new Set(
        [...Object.keys(sa), ...Object.keys(sb)].filter(k => k !== 'scrollPct')
      );
      for (const p of props) {
        if (Math.abs((sa[p] ?? 0) - (sb[p] ?? 0)) > EPS) {
          changed.add(pct);
          if (!kindsByFrame[pct]) kindsByFrame[pct] = new Set();
          kindsByFrame[pct].add(p);
        }
      }
    }
  }

  const sortedKinds = {};
  for (const pct of Object.keys(kindsByFrame)) {
    sortedKinds[pct] = [...kindsByFrame[pct]].sort();
  }

  const changedFrames = [...changed].sort((a, b) => a - b);
  return {
    changedFrames,
    kindsByFrame: sortedKinds,
    summary: {
      total: SAMPLE_POINTS.length,
      changed: changedFrames.length,
      unchanged: SAMPLE_POINTS.length - changedFrames.length
    }
  };
}
