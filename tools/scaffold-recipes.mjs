import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'GSAP Animations';

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      if (/^mwg_\d+$/.test(entry)) emit(p, entry);
      else walk(p);
    }
  }
}

function emit(folder, id) {
  const recipePath = join(folder, 'recipe.mjs');
  if (existsSync(recipePath)) {
    console.log(`[skip] ${id}: recipe.mjs exists`);
    return;
  }
  const scriptPath = join(folder, 'assets', 'script.js');
  if (!existsSync(scriptPath)) {
    console.log(`[skip] ${id}: no assets/script.js`);
    return;
  }
  const script = readFileSync(scriptPath, 'utf8');
  const category = folder.includes('Card') ? 'CARD SCROLL' : 'TEXT';
  const tpl = `// AUTO-SCAFFOLDED — refine per §2.0 of the plan: pick signatures, requiredOpts, defaultOpts, meaningfulParams; template selectors; expose magic numbers.
export const id = '${id}';
export const name = 'TODO — set display name';
export const category = '${category}';
export const signatures = [
  // TODO: pick 3-5 short substrings per §2.0 row
];
export const requiredOpts = {
  // TODO: per §2.0 row
};
export const defaultOpts = {
  // TODO: per §2.0 row
};
export const meaningfulParams = [
  // TODO: per §2.0 row
];
export function generate(opts) {
  return ${JSON.stringify(script)};
}
export function generateMarkup(opts) {
  return '<!-- TODO: HTML markup contract -->';
}
export function defaultPrimitives(opts) {
  return [];
}
`;
  writeFileSync(recipePath, tpl);
  console.log(`[wrote] ${recipePath}`);
}

walk(ROOT);
