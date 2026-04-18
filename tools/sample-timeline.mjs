// tools/sample-timeline.mjs
import { evalEase } from './lib/easings.mjs';
import { validateMotionPlan } from './lib/motion-plan-schema.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const SAMPLE_POINTS = [0, 14, 28, 42, 57, 71, 85, 100];

export function sampleTimeline(plan) {
  const errs = validateMotionPlan(plan);
  if (errs.length) throw new Error('Invalid plan: ' + errs.join('; '));

  const elements = {};

  for (const entry of plan.timeline) {
    const [s, e] = entry.scrollRange;
    for (const prim of entry.primitives) {
      const count = prim.stagger ? prim.stagger.count : 1;
      for (let i = 0; i < count; i++) {
        const key = count > 1 ? `${prim.selector}[${i}]` : prim.selector;
        if (!elements[key]) elements[key] = [];
        for (const pct of SAMPLE_POINTS) {
          if (pct < s || pct > e) continue;
          const localStart = prim.stagger
            ? s + i * prim.stagger.amount * (e - s)
            : s;
          const localEnd = prim.stagger
            ? Math.min(e, localStart + (e - s) * (1 - prim.stagger.amount * (count - 1)))
            : e;
          if (pct < localStart) {
            mergeSample(elements[key], pct, prim.kind, prim.from);
            continue;
          }
          if (pct > localEnd) {
            mergeSample(elements[key], pct, prim.kind, prim.to);
            continue;
          }
          const t = (pct - localStart) / (localEnd - localStart);
          const eased = evalEase(prim.ease, t);
          const v = prim.from + (prim.to - prim.from) * eased;
          mergeSample(elements[key], pct, prim.kind, v);
        }
      }
    }
  }

  return { samplePoints: SAMPLE_POINTS, elements };
}

function mergeSample(arr, pct, kind, v) {
  const existing = arr.find(s => s.scrollPct === pct);
  if (existing) existing[kind] = v;
  else arr.push({ scrollPct: pct, [kind]: v });
}

// CLI entry — Windows-safe self-detection mirroring tools/compose-export.mjs.
if (import.meta.url === pathToFileURL(process.argv[1]).href
    || import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const [planPath, framesOut] = process.argv.slice(2);
  const plan = JSON.parse(readFileSync(planPath, 'utf8'));
  const frames = sampleTimeline(plan);
  const out = framesOut
    || (planPath.endsWith('.motion-plan.json')
        ? planPath.replace(/\.motion-plan\.json$/, '.frames.json')
        : `previews/${Date.now()}.frames.json`);
  writeFileSync(out, JSON.stringify(frames, null, 2));
  console.log(`[sample] wrote ${out}`);
}
