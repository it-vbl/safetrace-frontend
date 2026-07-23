#!/usr/bin/env node
/**
 * Crawls every page route under src/app with plain HTTP requests against a
 * running Next.js server and reports pages that fail to compile/render
 * (missing modules, thrown errors, non-2xx responses, etc).
 *
 * This exists because `next build` performs static analysis on every route
 * (and will already fail loudly on missing imports), but this project's
 * `next lint` config does not verify import resolution, and neither catches
 * errors that only happen at render time. Hitting every route on the running
 * dev/prod server is a cheap extra smoke test after a big cleanup.
 *
 * Usage:
 *   npm run dev                     # in one terminal
 *   node scripts/check-pages.mjs    # in another terminal
 *
 * Options (env vars):
 *   BASE_URL   Base URL of the running app (default: http://localhost:3000)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.join(__dirname, '..', 'src', 'app');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Placeholder values used to fill in dynamic route segments like [id].
const DYNAMIC_SEGMENT_VALUE = '1';

const PAGE_FILE_NAMES = new Set(['page.jsx', 'page.tsx', 'page.js', 'page.ts']);

function findRoutes(dir, segments = []) {
  const routes = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  if (entries.some((e) => e.isFile() && PAGE_FILE_NAMES.has(e.name))) {
    const urlPath =
      '/' +
      segments
        .map((seg) => (seg.match(/^\[(\.\.\.)?(.+)\]$/) ? DYNAMIC_SEGMENT_VALUE : seg))
        .join('/');
    routes.push(urlPath.replace(/\/+/g, '/'));
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'api') continue;
    // Route groups like (group) don't affect the URL, but still recurse into them.
    const isGroup = entry.name.startsWith('(') && entry.name.endsWith(')');
    routes.push(...findRoutes(path.join(dir, entry.name), isGroup ? segments : [...segments, entry.name]));
  }

  return routes;
}

const ERROR_MARKERS = [
  'Unhandled Runtime Error',
  'Server Error',
  'Application error',
  'Module not found',
  "Cannot find module",
  'is not defined',
  'nextjs__container_errors',
];

// Fake session cookies so pages don't just render the client-side redirect
// to /login (see ClientLayout.jsx auth guard). "roles": [1] = ADMIN, which
// passes most permission checks in libs/permissions.js.
const COOKIE_HEADER = [
  'token=fake-token-for-smoke-test',
  'refreshToken=fake-refresh-token',
  'fullName=QA%20Bot',
  'userId=1',
  'username=qa-bot',
  'email=qa-bot%40example.com',
  `roles=${encodeURIComponent(JSON.stringify([1]))}`,
].join('; ');

async function checkRoute(route) {
  let response;
  let bodyText = '';
  let fetchError = null;

  try {
    response = await fetch(`${BASE_URL}${route}`, {
      headers: {
        Cookie: COOKIE_HEADER,
        'User-Agent': 'check-pages-script',
      },
      redirect: 'manual',
    });
    bodyText = await response.text();
  } catch (err) {
    fetchError = err.message;
  }

  const httpStatus = response ? response.status : null;
  const overlayHit = ERROR_MARKERS.find((marker) => bodyText.includes(marker));
  const isRedirect = httpStatus !== null && httpStatus >= 300 && httpStatus < 400;
  const redirectLocation = isRedirect ? response.headers.get('location') : null;

  const failed = Boolean(fetchError) || (httpStatus !== null && httpStatus >= 400) || Boolean(overlayHit);

  return {
    route,
    ok: !failed,
    httpStatus,
    fetchError,
    overlayHit,
    redirectLocation,
    excerpt: overlayHit ? extractExcerpt(bodyText, overlayHit) : null,
  };
}

function extractExcerpt(text, marker) {
  const idx = text.indexOf(marker);
  const plain = text.slice(Math.max(0, idx - 40), idx + 200).replace(/\s+/g, ' ');
  return plain.trim();
}

async function main() {
  const routes = findRoutes(APP_DIR).sort();
  console.log(`Discovered ${routes.length} route(s) under src/app.`);
  console.log(`Base URL: ${BASE_URL}\n`);

  const results = [];
  for (const route of routes) {
    process.stdout.write(`Checking ${route} ... `);
    const result = await checkRoute(route);
    results.push(result);
    console.log(result.ok ? `OK (${result.httpStatus})` : 'FAILED');
  }

  const failures = results.filter((r) => !r.ok);

  console.log('\n' + '='.repeat(70));
  console.log(`Summary: ${results.length - failures.length}/${results.length} pages OK`);
  console.log('='.repeat(70));

  if (failures.length) {
    for (const f of failures) {
      console.log(`\n\u2717 ${f.route}`);
      if (f.fetchError) console.log(`  Fetch error: ${f.fetchError}`);
      if (f.httpStatus !== null && f.httpStatus >= 400) console.log(`  HTTP status: ${f.httpStatus}`);
      if (f.overlayHit) {
        console.log(`  Error marker found: "${f.overlayHit}"`);
        console.log(`  Context: ...${f.excerpt}...`);
      }
    }
    process.exitCode = 1;
  } else {
    console.log('\nAll pages responded without server-side errors.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
