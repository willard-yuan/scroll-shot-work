// scripts/indexnow.mjs
// ---------------------------------------------------------------------------
// IndexNow push hook for Cloudflare Pages.
//
// Wired into the build via package.json:
//   "build": "astro build && node scripts/indexnow.mjs"
//
// After `astro build` produces dist/, this script reads dist/sitemap.xml and
// notifies the IndexNow API of every <loc> URL. One submission fans out to all
// participating engines (Bing, Yandex, Naver, Seznam, Yep) — Google is NOT
// covered (use Google Search Console separately).
//
// GATING (so local builds never ping the live API):
//   - Runs only when CF_PAGES === 'true' (Cloudflare Pages build env) OR
//     INDEXNOW_ENABLED === 'true'.
//   - Otherwise it prints a skip message and exits 0.
//
// ENV OVERRIDES:
//   INDEXNOW_KEY         key (default: hardcoded below; must match the
//                        public/<KEY>.txt verification file)
//   SITEMAP_PATH         sitemap to read (default: dist/sitemap.xml)
//   INDEXNOW_HOST        host (default: derived from first <loc>)
//   INDEXNOW_ENDPOINT    default https://api.indexnow.org/indexnow
//   INDEXNOW_BATCH       urls per POST batch (default 1000, max 10000)
//   INDEXNOW_DRY_RUN     'true' => print only, no network call
//
// NOTE: submitting the full sitemap on every deploy is the standard static-site
// pattern. If you later want changed-only pings, diff against a cached sitemap
// hash and submit only the delta URLs.
// ---------------------------------------------------------------------------

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const KEY = process.env.INDEXNOW_KEY || '1082534a2316484b9bd49f0722976d5a';
const SITEMAP_PATH = process.env.SITEMAP_PATH || resolve(ROOT, 'dist', 'sitemap.xml');
const ENDPOINT = process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow';
const BATCH = Number(process.env.INDEXNOW_BATCH || 1000);
const DRY_RUN = process.env.INDEXNOW_DRY_RUN === 'true';
const HOST_OVERRIDE = process.env.INDEXNOW_HOST || '';

const log = (...a) => console.log('[indexnow]', ...a);

async function main() {
	const onCF = process.env.CF_PAGES === 'true';
	const enabled = process.env.INDEXNOW_ENABLED === 'true';
	if (!onCF && !enabled) {
		log('Skipping (not on Cloudflare Pages and INDEXNOW_ENABLED not set).');
		return;
	}

	if (!existsSync(SITEMAP_PATH)) {
		log(`Sitemap not found at ${SITEMAP_PATH}; skip.`);
		return;
	}

	const xml = readFileSync(SITEMAP_PATH, 'utf8');
	const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
		.map((m) => m[1].trim())
		.filter(Boolean);
	if (!urls.length) {
		log('No <loc> URLs found in sitemap; skip.');
		return;
	}

	const host = HOST_OVERRIDE || (() => {
		try {
			return new URL(urls[0]).host;
		} catch {
			return '';
		}
	})();
	if (!host) {
		log('Could not determine host; set INDEXNOW_HOST. skip.');
		return;
	}

	const keyLocation = `https://${host}/${KEY}.txt`;
	log(`host=${host} urls=${urls.length} endpoint=${ENDPOINT} dryRun=${DRY_RUN}`);

	const batches = [];
	for (let i = 0; i < urls.length; i += BATCH) {
		batches.push(urls.slice(i, i + BATCH));
	}

	for (let b = 0; b < batches.length; b++) {
		const urlList = batches[b];
		const payload = JSON.stringify({ host, key: KEY, keyLocation, urlList });

		if (DRY_RUN) {
			log(`[dry-run] batch ${b + 1}/${batches.length}: would POST ${urlList.length} urls (first: ${urlList[0]})`);
			continue;
		}

		try {
			const res = await fetch(ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: payload,
			});
			const body = await res.text().catch(() => '');
			if (res.ok) {
				log(`batch ${b + 1}/${batches.length}: OK (${res.status}) submitted ${urlList.length} urls`);
			} else if (res.status === 400) {
				// Common on the very first deploy: the public/<KEY>.txt file is
				// not live yet when this runs during build. Benign — later
				// deploys succeed once the key file is reachable.
				log(`batch ${b + 1}/${batches.length}: HTTP 400 (key validation; if first deploy, retry next build) ${body.slice(0, 160)}`);
			} else {
				log(`batch ${b + 1}/${batches.length}: HTTP ${res.status} ${body.slice(0, 160)}`);
			}
		} catch (e) {
			log(`batch ${b + 1}/${batches.length}: fetch error ${e.message}`);
		}
	}

	log('Done.');
}

main().catch((e) => {
	console.error('[indexnow] FATAL', e);
	process.exit(1);
});
