// Runs after `ng build`: writes sitemap.xml and a static 404.html from the prerendered pages.
import { copyFileSync, existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://lexform.uz';
const OUT = 'dist/lexform-app/browser';
const SKIP = new Set(['my', '404']);

function pages(dir, rel = '') {
  const out = [];
  if (existsSync(join(dir, 'index.html'))) out.push(rel);
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory() && !SKIP.has(rel ? `${rel}/${name}` : name)) out.push(...pages(p, rel ? `${rel}/${name}` : name));
  }
  return out;
}

const today = new Date().toISOString().slice(0, 10);
const priority = p => (p === '' ? '1.0' : p.startsWith('c/') ? '0.9' : '0.8');
const urls = pages(OUT).sort((a, b) => priority(b) - priority(a) || a.localeCompare(b));
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(p => `  <url><loc>${SITE}/${p}</loc><lastmod>${today}</lastmod><changefreq>${p === '' ? 'weekly' : 'monthly'}</changefreq><priority>${priority(p)}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(OUT, 'sitemap.xml'), xml);

if (existsSync(join(OUT, '404/index.html'))) copyFileSync(join(OUT, '404/index.html'), join(OUT, '404.html'));
console.log(`postbuild: sitemap.xml with ${urls.length} URLs, 404.html ${existsSync(join(OUT, '404.html')) ? 'written' : 'missing'}`);
