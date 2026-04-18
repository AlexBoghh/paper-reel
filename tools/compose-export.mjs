// tools/compose-export.mjs
import { loadRecipe } from './lib/recipe-loader.mjs';
import { validateMotionPlan } from './lib/motion-plan-schema.mjs';
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const BOOTSTRAP_HEAD = `
gsap.registerPlugin(ScrollTrigger);
window.addEventListener('DOMContentLoaded', () => {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
`;

const BOOTSTRAP_TAIL = `
  requestAnimationFrame(() => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 100);
});
window.addEventListener('load', () => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });

function wrapLettersInSpan(element) {
  const text = element.textContent;
  element.innerHTML = text.split('')
    .map(c => c === ' ' ? '<span>&nbsp;</span>' : '<span class="letter">' + c + '</span>').join(' ');
}

function wrapWordsInSpan(element) {
  const text = element.textContent;
  element.innerHTML = text
    .split(' ')
    .map(word => '<span class="word">' + word + '</span>')
    .join(' ');
}
`;

export async function compose(plan, { recipeRoot }) {
  const errs = validateMotionPlan(plan);
  if (errs.length) throw new Error('Invalid motion plan: ' + errs.join('; '));

  const recipes = await Promise.all(
    plan.citations.map(c => loadRecipe(c.recipeId, recipeRoot))
  );

  const content = plan.content || {};
  const jsBlocks = plan.citations.map((c, i) => recipes[i].generate(c.opts));
  const markupBlocks = plan.citations.map((c, i) =>
    recipes[i].generateMarkup(c.opts, content[c.recipeId] || {}));
  const cssBlocks = plan.citations.map((c, i) => recipes[i].generateCSS(c.opts));

  const js = [BOOTSTRAP_HEAD, ...jsBlocks, BOOTSTRAP_TAIL].join('\n');
  const html = renderHostHTML(plan, markupBlocks, cssBlocks, js);

  return { html, js };
}

function renderHostHTML(plan, markupBlocks, cssBlocks, js) {
  const recipeCSS = cssBlocks
    .map((css, i) => `/* ${plan.citations[i].recipeId} */\n${css}`)
    .join('\n\n');
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${plan.timestamp}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#f1ebdc;color:#14120f;font-family:'Inter',sans-serif}

${recipeCSS}
</style>
</head><body>
${markupBlocks.join('\n')}
<script src="https://unpkg.com/lenis@1.1.20/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script>${js}</script>
</body></html>`;
}

// CLI entry
// Plan spec: `import.meta.url === \`file://${process.argv[1].replace(/\\/g, '/')}\``
// That literal form fails on Windows because Node's import.meta.url uses `file:///C:/...%20...`
// (triple slash + URL-encoded spaces), while the replaced argv[1] produces `file://C:/... ...`.
// Use pathToFileURL for a correct, cross-platform comparison that handles both.
if (import.meta.url === pathToFileURL(process.argv[1]).href
    || import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const [planPath, htmlOut, jsOut] = process.argv.slice(2);
  const plan = JSON.parse(await import('node:fs').then(m => m.readFileSync(planPath, 'utf8')));
  const { html, js } = await compose(plan, { recipeRoot: 'GSAP Animations' });
  writeFileSync(htmlOut, html);
  writeFileSync(jsOut, js);
  console.log(`[compose] wrote ${htmlOut} + ${jsOut}`);
}
