// tools/validate-export.mjs
import { loadRecipe } from './lib/recipe-loader.mjs';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export async function validateExport(jsContent, plan, { recipeRoot }) {
  const errs = [];
  for (const c of plan.citations) {
    const r = await loadRecipe(c.recipeId, recipeRoot);
    for (const sig of r.signatures) {
      if (!jsContent.includes(sig)) {
        errs.push(`recipe ${c.recipeId} (role ${c.role}): missing signature "${sig}"`);
      }
    }
  }
  return errs;
}

export async function validateMotionPlanCompleteness(plan, { recipeRoot }) {
  const errs = [];
  for (const c of plan.citations) {
    const r = await loadRecipe(c.recipeId, recipeRoot);
    const params = plan.params?.[c.recipeId] || {};
    for (const key of r.meaningfulParams || []) {
      if (params[key] === undefined) {
        errs.push(`recipe ${c.recipeId}: motion-plan.params.${c.recipeId} missing meaningful key "${key}"`);
      }
    }
  }
  return errs;
}

export async function validateMotionPlanContent(plan, { recipeRoot }) {
  const errs = [];
  const content = plan.content || {};
  for (const c of plan.citations) {
    const r = await loadRecipe(c.recipeId, recipeRoot);
    const entry = content[c.recipeId];
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      errs.push(`recipe ${c.recipeId} (role ${c.role}): missing content entry in motion-plan.content`);
      continue;
    }
    for (const key of Object.keys(r.contentShape || {})) {
      const v = entry[key];
      if (v === undefined || v === null) {
        errs.push(`recipe ${c.recipeId}: content.${c.recipeId}.${key} is required (contentShape defines it)`);
        continue;
      }
      if (typeof v === 'string' && !v.trim()) {
        errs.push(`recipe ${c.recipeId}: content.${c.recipeId}.${key} cannot be empty`);
      }
      if (Array.isArray(v) && v.length === 0) {
        errs.push(`recipe ${c.recipeId}: content.${c.recipeId}.${key} cannot be an empty array`);
      }
    }
  }
  return errs;
}

// CLI entry
// Plan spec: `import.meta.url === \`file://${process.argv[1].replace(/\\/g, '/')}\``
// That literal form fails on Windows because Node's import.meta.url uses `file:///C:/...`
// (triple slash + URL-encoded spaces), while the replaced argv[1] produces `file://C:/... ...`.
// Mirror the compose-export.mjs precedent: use pathToFileURL for a correct, cross-platform
// comparison, OR-ed with the plan's verbatim backslash-swap form.
if (import.meta.url === pathToFileURL(process.argv[1]).href
    || import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const [jsPath, planPath] = process.argv.slice(2);
  const js = readFileSync(jsPath, 'utf8');
  const plan = JSON.parse(readFileSync(planPath, 'utf8'));
  const sigErrs = await validateExport(js, plan, { recipeRoot: 'GSAP Animations' });
  const compErrs = await validateMotionPlanCompleteness(plan, { recipeRoot: 'GSAP Animations' });
  const contentErrs = await validateMotionPlanContent(plan, { recipeRoot: 'GSAP Animations' });
  const all = [...sigErrs, ...compErrs, ...contentErrs];
  if (all.length) {
    console.error('[validate] FAIL:');
    for (const e of all) console.error('  - ' + e);
    process.exit(1);
  }
  console.log('[validate] OK');
}
