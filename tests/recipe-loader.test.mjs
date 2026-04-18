import { test, expect, beforeEach, afterEach } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadRecipe } from '../tools/lib/recipe-loader.mjs';

const root = join(tmpdir(), 'reel-recipes-test');

beforeEach(() => {
  rmSync(root, { recursive: true, force: true });
  mkdirSync(root, { recursive: true });
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

test('loads recipe by id from a search root', async () => {
  const dir = join(root, 'Test Animations', 'mwg_999');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'recipe.mjs'), `
    export const id = 'mwg_999';
    export const name = 'Test';
    export const category = 'TEST';
    export const signatures = ['gsap.to'];
    export const requiredOpts = {};
    export const defaultOpts = {};
    export const meaningfulParams = [];
    export const contentShape = {};
    export function generate() { return 'gsap.to(...)'; }
    export function generateMarkup() { return '<div></div>'; }
    export function generateCSS() { return '.test { color: #f97316; }'; }
    export function defaultPrimitives() { return []; }
  `);
  const r = await loadRecipe('mwg_999', root);
  expect(r.id).toBe('mwg_999');
  expect(r.signatures).toEqual(['gsap.to']);
  expect(r.generate()).toBe('gsap.to(...)');
});

test('throws on unknown recipe id', async () => {
  await expect(loadRecipe('mwg_zzz', root)).rejects.toThrow(/not found/);
});

test('throws when recipe is missing a required export', async () => {
  const dir = join(root, 'Test Animations', 'mwg_888');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'recipe.mjs'), `
    export const id = 'mwg_888';
    export const name = 'Incomplete';
    export const category = 'TEST';
    // missing signatures, requiredOpts, defaultOpts, meaningfulParams, generate, generateMarkup, defaultPrimitives
  `);
  await expect(loadRecipe('mwg_888', root)).rejects.toThrow(/missing export/);
});
