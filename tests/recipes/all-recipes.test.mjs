import { test, expect } from 'vitest';
import { loadRecipe } from '../../tools/lib/recipe-loader.mjs';

const RECIPE_IDS = [
  'mwg_001', 'mwg_003', 'mwg_007', 'mwg_023', 'mwg_042', 'mwg_045',
  'mwg_004', 'mwg_005', 'mwg_006', 'mwg_009', 'mwg_010', 'mwg_011'
];

const ROOT = 'GSAP Animations';

for (const id of RECIPE_IDS) {
  test(`${id} loads with all required exports`, async () => {
    const r = await loadRecipe(id, ROOT);
    expect(r.id).toBe(id);
    expect(typeof r.name).toBe('string');
    expect(['CARD SCROLL', 'TEXT']).toContain(r.category);
    expect(Array.isArray(r.signatures)).toBe(true);
    expect(r.signatures.length).toBeGreaterThanOrEqual(3);
    expect(Array.isArray(r.meaningfulParams)).toBe(true);
    expect(typeof r.generate).toBe('function');
    expect(typeof r.generateMarkup).toBe('function');
    expect(typeof r.generateCSS).toBe('function');
    expect(typeof r.defaultPrimitives).toBe('function');
    expect(r.contentShape, `${id}: contentShape must be a plain object`).toBeTypeOf('object');
    expect(r.contentShape).not.toBeNull();
    expect(Array.isArray(r.contentShape)).toBe(false);
  });

  test(`${id} generate() output contains every signature`, async () => {
    const r = await loadRecipe(id, ROOT);
    const opts = { ...r.defaultOpts, ...stubRequired(r.requiredOpts) };
    const code = r.generate(opts);
    for (const sig of r.signatures) {
      expect(code, `recipe ${id} missing signature "${sig}"`).toContain(sig);
    }
  });

  test(`${id} generateCSS() returns a non-empty string`, async () => {
    const r = await loadRecipe(id, ROOT);
    const opts = { ...r.defaultOpts, ...stubRequired(r.requiredOpts) };
    const css = r.generateCSS(opts);
    expect(typeof css).toBe('string');
    expect(css.length).toBeGreaterThan(0);
  });

  test(`${id} generateMarkup() accepts optional content and falls back gracefully`, async () => {
    const r = await loadRecipe(id, ROOT);
    const opts = { ...r.defaultOpts, ...stubRequired(r.requiredOpts) };
    const noContent = r.generateMarkup(opts);
    const withEmpty = r.generateMarkup(opts, {});
    expect(typeof noContent).toBe('string');
    expect(noContent.length).toBeGreaterThan(0);
    expect(withEmpty).toBe(noContent); // empty content must match the no-arg default
  });
}

function stubRequired(spec) {
  const out = {};
  for (const key of Object.keys(spec || {})) {
    out[key] = key.toLowerCase().includes('selector') ? `.${key}` : 1;
  }
  return out;
}
