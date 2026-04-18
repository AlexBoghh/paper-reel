import { test, expect, beforeEach, afterEach } from 'vitest';
import { renderTemplate } from '../tools/lib/template-loader.mjs';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = join(tmpdir(), 'reel-tmpl-test');

beforeEach(() => {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

test('substitutes single placeholder', () => {
  writeFileSync(join(dir, 'a.html'), '<div>{TITLE}</div>');
  expect(renderTemplate(join(dir, 'a.html'), { TITLE: 'X' })).toBe('<div>X</div>');
});

test('substitutes repeated placeholder', () => {
  writeFileSync(join(dir, 'b.html'), '<div style="width:{W}px;height:{W}px"></div>');
  expect(renderTemplate(join(dir, 'b.html'), { W: 48 })).toBe('<div style="width:48px;height:48px"></div>');
});

test('throws on unfilled placeholder', () => {
  writeFileSync(join(dir, 'c.html'), '<div>{NEVER}</div>');
  expect(() => renderTemplate(join(dir, 'c.html'), {})).toThrow(/unfilled.*NEVER/);
});
