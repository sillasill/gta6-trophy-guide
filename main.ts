// Leonida Trophy Guide — the program that hands the guide in.
//
// This repository is a static offline web app (app/) plus its screenshots.
// The program copies both into the output directory the grader provides
// and writes /output/dossier.json with the vendored make.fun library, so
// the judge can read the guide's screenshots and its source outline.
// vendor/makefun-frontend.ts is the kit's copy and must stay unchanged:
// the scorer rebuilds the dossier with its own copy and compares bytes.
//
// Node 22, standard library only. Outside the grader, MAKEFUN_OUTPUT_DIR
// stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(source, target) {
  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyTree(join(repoRoot, 'app'), join(outputDir, 'app'));
copyTree(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'));

// The scorer's caps, from the kit's reference/gate.json: at most 4
// screenshots, each at most 256 KiB; app/ at most 993 files and
// directories and 48 MiB; the dossier text at most 160 KiB.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log(`Leonida Trophy Guide handed in: ${outputDir}`);
