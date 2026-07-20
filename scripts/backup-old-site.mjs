import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const origin = 'https://wigexporter.com';
const outputRoot = path.resolve(
  process.argv[2] || '../backups/hostinger-pre-migration-2026-07-20',
);
const queue = [
  `${origin}/`,
  `${origin}/wp-sitemap.xml`,
  `${origin}/post-sitemap.xml`,
  `${origin}/page-sitemap.xml`,
  `${origin}/product-sitemap.xml`,
  `${origin}/category-sitemap.xml`,
  `${origin}/wp-json/`,
  `${origin}/wp-json/wp/v2/pages?per_page=100`,
  `${origin}/wp-json/wp/v2/posts?per_page=100`,
  `${origin}/wp-json/wp/v2/product?per_page=100`,
];
const queued = new Set(queue);
const completed = [];
const failures = [];

function localPath(url, contentType) {
  const parsed = new URL(url);
  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  if (!path.extname(pathname)) {
    pathname += contentType.includes('text/html') ? '/index.html' : '.json';
  }
  if (parsed.search) {
    const suffix = Buffer.from(parsed.search).toString('hex').slice(0, 32);
    const extension = path.extname(pathname);
    pathname = `${pathname.slice(0, -extension.length)}-${suffix}${extension}`;
  }
  return path.join(outputRoot, pathname.replace(/^\/+/, ''));
}

function addUrl(value, base) {
  try {
    const next = new URL(value, base);
    next.hash = '';
    if (next.origin !== origin) return;
    if (!['http:', 'https:'].includes(next.protocol)) return;
    if (queued.has(next.href)) return;
    queued.add(next.href);
    queue.push(next.href);
  } catch {
    // Ignore malformed URLs found in legacy markup.
  }
}

function discover(text, url, contentType) {
  if (contentType.includes('xml')) {
    for (const match of text.matchAll(/<loc>([^<]+)<\/loc>/gi)) addUrl(match[1], url);
  }
  if (contentType.includes('html') || contentType.includes('xml')) {
    for (const match of text.matchAll(
      /(?:href|src|srcset|content)=["']([^"'<>]+)["']/gi,
    )) {
      for (const candidate of match[1].split(',').map((part) => part.trim().split(/\s+/)[0])) {
        addUrl(candidate, url);
      }
    }
  }
  if (contentType.includes('css')) {
    for (const match of text.matchAll(/url\((?:"|')?([^"')]+)(?:"|')?\)/gi)) {
      addUrl(match[1], url);
    }
  }
}

await mkdir(outputRoot, { recursive: true });

async function archiveUrl(url) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': 'WigExporter migration backup/1.0' },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const body = Buffer.from(await response.arrayBuffer());
    const destination = localPath(url, contentType);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, body);
    completed.push({ url, destination: path.relative(outputRoot, destination), bytes: body.length });
    if (
      contentType.includes('text/') ||
      contentType.includes('json') ||
      contentType.includes('xml') ||
      contentType.includes('javascript')
    ) {
      discover(body.toString('utf8'), url, contentType);
    }
  } catch (error) {
    failures.push({ url, error: error.message });
  }
}

let cursor = 0;
while (cursor < queue.length && cursor < 2500) {
  const batch = queue.slice(cursor, Math.min(cursor + 8, 2500));
  cursor += batch.length;
  await Promise.all(batch.map((url) => archiveUrl(url)));
}

const manifest = {
  createdAt: new Date().toISOString(),
  origin,
  completedCount: completed.length,
  failureCount: failures.length,
  completed,
  failures,
};
await writeFile(
  path.join(outputRoot, 'backup-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(
  JSON.stringify(
    {
      outputRoot,
      completedCount: completed.length,
      failureCount: failures.length,
      totalBytes: completed.reduce((sum, item) => sum + item.bytes, 0),
    },
    null,
    2,
  ),
);
