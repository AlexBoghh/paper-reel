import { readFileSync } from 'node:fs';

export function renderTemplate(path, vars) {
  let html = readFileSync(path, 'utf8');
  for (const [key, val] of Object.entries(vars)) {
    html = html.replaceAll(`{${key}}`, String(val));
  }
  const leftover = html.match(/\{[A-Z_]+\}/);
  if (leftover) {
    throw new Error(`Template ${path}: unfilled placeholder ${leftover[0]}`);
  }
  return html;
}

export function loadTemplate(path) {
  return readFileSync(path, 'utf8');
}
