import AdmZip from 'adm-zip';
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

const SRC = '_skill_extracted/reel';
const OUT = 'reel.skill';
const INSTALL = process.env.REEL_SKILL_INSTALL_DIR ?? join(homedir(), '.claude', 'skills', 'reel');

const args = process.argv.slice(2);
const doInstall = args.includes('--install');

function addDir(zip, dir, prefix) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const zipPath = prefix + '/' + entry;
    if (statSync(p).isDirectory()) addDir(zip, p, zipPath);
    else zip.addFile(zipPath, readFileSync(p));
  }
}

function copyDir(src, dest) {
  if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const entry of readdirSync(src)) {
    const sp = join(src, entry);
    const dp = join(dest, entry);
    if (statSync(sp).isDirectory()) {
      count += copyDir(sp, dp);
    } else {
      writeFileSync(dp, readFileSync(sp));
      count++;
    }
  }
  return count;
}

const zip = new AdmZip();
addDir(zip, SRC, 'reel');
zip.writeZip(OUT);
console.log(`[repack] wrote ${OUT} (${statSync(OUT).size} bytes)`);

if (doInstall) {
  const n = copyDir(SRC, INSTALL);
  console.log(`[install] synced ${n} files to ${INSTALL}`);
  console.log(`[install] new sessions of Claude Code will load the updated skill on /clear`);
}
