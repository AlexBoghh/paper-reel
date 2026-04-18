// tools/load-prior-motion-plan.mjs
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function loadMostRecentPlan(dir) {
  if (!existsSync(dir)) return null;
  const candidates = readdirSync(dir)
    .filter(f => f.endsWith('.motion-plan.json'))
    .map(f => ({ f, mtime: statSync(join(dir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  if (!candidates.length) return null;
  return JSON.parse(readFileSync(join(dir, candidates[0].f), 'utf8'));
}
