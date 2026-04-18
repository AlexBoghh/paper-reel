import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const REQUIRED_EXPORTS = [
  'id', 'name', 'category', 'signatures', 'requiredOpts',
  'defaultOpts', 'meaningfulParams', 'contentShape',
  'generate', 'generateMarkup', 'generateCSS', 'defaultPrimitives'
];

export async function loadRecipe(id, searchRoot) {
  const path = findRecipe(id, searchRoot);
  if (!path) throw new Error(`Recipe ${id} not found under ${searchRoot}`);
  const code = readFileSync(path, 'utf8');
  const url = 'data:text/javascript;base64,' + Buffer.from(code).toString('base64');
  const mod = await import(url);
  for (const ex of REQUIRED_EXPORTS) {
    if (!(ex in mod)) throw new Error(`Recipe ${id} missing export: ${ex}`);
  }
  return mod;
}

function findRecipe(id, root) {
  if (!existsSync(root)) return null;
  for (const entry of readdirSync(root)) {
    const p = join(root, entry);
    if (!statSync(p).isDirectory()) continue;
    const direct = join(p, 'recipe.mjs');
    if (entry === id && existsSync(direct)) return direct;
    const nested = findRecipe(id, p);
    if (nested) return nested;
  }
  return null;
}
