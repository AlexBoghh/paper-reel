/**
 * Capture screenshots or an animated GIF of a scroll-driven GSAP HTML preview
 * using Browserbase (cloud Chromium) over CDP. Uploads results to Cloudinary.
 *
 * Two modes:
 *
 *   GIF (default — drop-in replacement for previews/capture_gif.py):
 *     node tools/capture_via_browserbase.mjs <path-to-html>
 *   → encodes 90-frame scroll GIF, uploads, prints CLOUDINARY_URL=...
 *
 *   Snapshot (storyboard-frame rendering — used by Stage 9 phase A):
 *     node tools/capture_via_browserbase.mjs <path-to-html> --snapshots=0,14,28,42,57,71,85,100
 *   → captures one PNG per listed scroll %, uploads each, prints
 *     CLOUDINARY_SNAPSHOTS={"0":"https://…","14":"https://…",…}
 *
 * Required env (loaded from .env):
 *   BROWSERBASE_API_KEY      from https://www.browserbase.com/settings
 *   BROWSERBASE_PROJECT_ID   same page
 *   CLOUDINARY_URL           OR the trio CLOUDINARY_{CLOUD_NAME,API_KEY,API_SECRET}
 *
 * System deps: ffmpeg on PATH for GIF mode only. Snapshot mode has no system deps.
 */

import 'dotenv/config';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, statSync } from 'node:fs';
import { resolve, dirname, basename, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import Browserbase from '@browserbasehq/sdk';
import { chromium } from 'playwright-core';
import { v2 as cloudinary } from 'cloudinary';

// ── CLI ──────────────────────────────────────────────────────────────────────
export function parseSnapshotPercents(argv) {
  const flag = argv.find(a => a.startsWith('--snapshots='))
    ?? (argv.includes('--snapshots') ? `--snapshots=${argv[argv.indexOf('--snapshots') + 1] ?? ''}` : null);
  if (!flag) return null;
  const pcts = flag.split('=')[1].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !Number.isNaN(n));
  return pcts.length > 0 ? pcts : null;
}

const argv = process.argv.slice(2);
const htmlArg = argv.find(a => !a.startsWith('-'));
const snapshotPcts = parseSnapshotPercents(argv);
const SNAPSHOT_MODE = Array.isArray(snapshotPcts) && snapshotPcts.length > 0;

// Skip CLI/main entirely when imported (e.g. by tests via `import { … } from`).
const isMain = (() => {
  try {
    const argvUrl = new URL(`file://${process.argv[1].replace(/\\/g, '/')}`);
    return import.meta.url === argvUrl.href;
  } catch { return false; }
})();

const VIEWPORT     = { width: 1440, height: 900 };
const SCALE        = 720;
const FPS          = 10;
const DURATION_S   = 9;
const COLORS       = 128;
const TOTAL_FRAMES = FPS * DURATION_S;

// ── env validation ──────────────────────────────────────────────────────────
function readEnv() {
  const apiKey    = process.env.BROWSERBASE_API_KEY?.trim();
  const projectId = process.env.BROWSERBASE_PROJECT_ID?.trim();
  if (!apiKey || !projectId) {
    console.error('[browserbase] ERROR: BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID required.');
    console.error('[browserbase] Get both from https://www.browserbase.com/settings → Project → API Keys');
    process.exit(1);
  }
  return { apiKey, projectId };
}

function configureCloudinary() {
  const url = process.env.CLOUDINARY_URL?.trim();
  if (url) {
    const m = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
    if (!m) {
      console.error('[cloudinary] ERROR: malformed CLOUDINARY_URL');
      process.exit(1);
    }
    cloudinary.config({ api_key: m[1], api_secret: m[2], cloud_name: m[3], secure: true });
    return;
  }
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key    = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (cloud_name && api_key && api_secret) {
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
    return;
  }
  console.error('[cloudinary] ERROR: no credentials. Set CLOUDINARY_URL or the cloud_name/api_key/api_secret trio.');
  process.exit(1);
}

// ── main ────────────────────────────────────────────────────────────────────
async function main(HTML_FILE) {
  const FRAMES_DIR = join(dirname(HTML_FILE), 'frames_tmp_bb');
  const GIF_PATH   = HTML_FILE.replace(/\.html$/i, '.gif');
  const t0 = Date.now();

  if (existsSync(FRAMES_DIR)) rmSync(FRAMES_DIR, { recursive: true, force: true });
  mkdirSync(FRAMES_DIR, { recursive: true });

  const rawHtml = readFileSync(HTML_FILE, 'utf8');
  const lenisStub = 'window.Lenis=class{constructor(){}on(){return this}off(){return this}destroy(){}scrollTo(){}raf(){}};';
  const html = rawHtml.replace(
    /<script[^>]*src=["']https:\/\/unpkg\.com\/lenis@[^"']+["'][^>]*><\/script>/i,
    `<script>${lenisStub}</script>`
  );

  const { apiKey, projectId } = readEnv();
  const bb = new Browserbase({ apiKey });
  console.log('[browserbase] creating session ...');
  const session = await bb.sessions.create({
    projectId,
    browserSettings: { viewport: VIEWPORT },
  });
  console.log(`[browserbase] session ${session.id}  (replay: https://browserbase.com/sessions/${session.id})`);

  let browser;
  try {
    browser = await chromium.connectOverCDP(session.connectUrl);
    const ctx  = browser.contexts()[0];
    const page = ctx.pages()[0] ?? await ctx.newPage();

    console.log(`[capture] loading HTML inline (${html.length} chars)`);
    await page.setContent(html, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(2500);

    const info = await page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      viewportH:    window.innerHeight,
    }));
    const maxScroll = Math.max(info.scrollHeight - info.viewportH, 0);
    console.log(`[capture] scrollHeight=${info.scrollHeight}  maxScroll=${maxScroll}`);

    if (SNAPSHOT_MODE) {
      await runSnapshotMode(page, maxScroll, t0, HTML_FILE, FRAMES_DIR);
    } else {
      await runGifMode(page, maxScroll, t0, HTML_FILE, FRAMES_DIR, GIF_PATH);
    }
  } finally {
    if (browser) await browser.close();
  }
}

// ── snapshot mode ───────────────────────────────────────────────────────────
async function runSnapshotMode(page, maxScroll, t0, HTML_FILE, FRAMES_DIR) {
  configureCloudinary();
  const stem = basename(HTML_FILE).replace(/\.html$/i, '');
  const urls = {};

  for (const pct of snapshotPcts) {
    const y = Math.floor((pct / 100) * maxScroll);

    await page.evaluate((scrollY) => {
      window.scrollTo({ top: scrollY, behavior: 'instant' });
      if (window.ScrollTrigger) window.ScrollTrigger.update();
    }, y);

    // Longer settle than GIF mode — single shot per scroll point, GSAP's scrub
    // needs a tick to catch up from a programmatic jump.
    await page.waitForTimeout(300);

    const buf = await page.screenshot({
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
      type: 'png',
    });
    const pngName = `snapshot_${String(pct).padStart(3, '0')}.png`;
    const pngPath = join(FRAMES_DIR, pngName);
    writeFileSync(pngPath, buf);

    const publicId = `motion-design-paper/storyboard-${stem}-${String(pct).padStart(3, '0')}`;
    console.log(`[snapshot] ${String(pct).padStart(3)}%  scroll_y=${y}  uploading ${publicId} ...`);

    const result = await cloudinary.uploader.upload(pngPath, {
      public_id:     publicId,
      resource_type: 'image',
      tags:          ['motion-design-paper', 'storyboard-snapshot', 'browserbase'],
      overwrite:     true,
    });
    urls[pct] = result.secure_url;
  }

  const tDone = Date.now();
  console.log(`CLOUDINARY_SNAPSHOTS=${JSON.stringify(urls)}`);
  console.log(`[done]  ${snapshotPcts.length} snapshots in ${((tDone - t0) / 1000).toFixed(1)}s`);
}

// ── GIF mode ────────────────────────────────────────────────────────────────
async function runGifMode(page, maxScroll, t0, HTML_FILE, FRAMES_DIR, GIF_PATH) {
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const progress = i / (TOTAL_FRAMES - 1);
    const y = Math.floor(progress * maxScroll);

    await page.evaluate((scrollY) => {
      window.scrollTo({ top: scrollY, behavior: 'instant' });
      if (window.ScrollTrigger) window.ScrollTrigger.update();
    }, y);
    await page.waitForTimeout(40);

    const buf = await page.screenshot({
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
      type: 'png',
    });
    writeFileSync(join(FRAMES_DIR, `frame_${String(i).padStart(4, '0')}.png`), buf);

    if (i % 10 === 0) console.log(`[capture] frame ${i}/${TOTAL_FRAMES}  scroll_y=${y}`);
  }

  const tFrames = Date.now();
  console.log(`[capture] ${TOTAL_FRAMES} frames captured in ${((tFrames - t0) / 1000).toFixed(1)}s`);

  const vf = `fps=${FPS},scale=${SCALE}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=${COLORS}[p];[s1][p]paletteuse`;
  const ffArgs = [
    '-y',
    '-framerate', String(FPS),
    '-i', join(FRAMES_DIR, 'frame_%04d.png'),
    '-vf', vf,
    '-loop', '0',
    GIF_PATH,
  ];
  console.log('[ffmpeg] encoding GIF ...');
  const ff = spawnSync('ffmpeg', ffArgs, { encoding: 'utf8' });
  if (ff.status !== 0) {
    console.error('[ffmpeg STDERR]', (ff.stderr || '').slice(-2000));
    process.exit(1);
  }

  let sizeMB = statSync(GIF_PATH).size / 1_048_576;
  if (sizeMB > 5) {
    console.log(`[size] ${sizeMB.toFixed(2)} MB > 5 MB — re-encoding at ${Math.floor(SCALE / 2)}px wide ...`);
    const ffArgs2 = ffArgs.slice();
    ffArgs2[ffArgs2.indexOf(vf)] = vf.replace(`scale=${SCALE}`, `scale=${Math.floor(SCALE / 2)}`);
    spawnSync('ffmpeg', ffArgs2);
    sizeMB = statSync(GIF_PATH).size / 1_048_576;
  }
  console.log(`[gif]  ${GIF_PATH}  (${sizeMB.toFixed(2)} MB)`);

  configureCloudinary();
  const stem     = basename(HTML_FILE).replace(/\.html$/i, '');
  const publicId = `motion-design-paper/live-preview-${stem}`;

  console.log(`[cloudinary] uploading -> ${publicId} ...`);
  const result = await cloudinary.uploader.upload(GIF_PATH, {
    public_id:     publicId,
    resource_type: 'image',
    tags:          ['motion-design-paper', 'live-preview', 'browserbase'],
    overwrite:     true,
  });

  const tDone = Date.now();
  console.log(`CLOUDINARY_URL=${result.secure_url}`);
  console.log(`[done]  total runtime ${((tDone - t0) / 1000).toFixed(1)}s`);
}

// ── CLI entry (runs after all top-level consts are initialized) ─────────────
if (isMain) {
  if (!htmlArg) {
    console.error('Usage:');
    console.error('  node tools/capture_via_browserbase.mjs <path-to-html>                         # GIF mode');
    console.error('  node tools/capture_via_browserbase.mjs <path-to-html> --snapshots=0,14,…,100  # snapshot mode');
    process.exit(2);
  }
  const HTML_FILE = resolve(htmlArg);
  if (!existsSync(HTML_FILE)) {
    console.error(`[capture] ERROR: HTML file not found: ${HTML_FILE}`);
    process.exit(2);
  }
  main(HTML_FILE).catch((err) => {
    console.error('[capture] FATAL', err?.stack || err);
    process.exit(1);
  });
}
