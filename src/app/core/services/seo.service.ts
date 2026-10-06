import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export const SITE = 'https://lexform.uz';
export const SITE_NAME = 'LexForm';
const OG_IMAGE = `${SITE}/og.png`;

export interface SeoData {
  title: string;
  description: string;
  /** path starting with "/" */
  path: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  jsonLd?: object[];
}

/** Per-page title, description, canonical, robots, Open Graph / Twitter tags and JSON-LD. */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  update(d: SeoData): void {
    const url = SITE + (d.path === '/' ? '/' : d.path.replace(/\/$/, ''));
    const desc = d.description.length > 300 ? d.description.slice(0, 297).trimEnd() + '…' : d.description;
    this.title.setTitle(d.title);
    const tags: [string, string, string][] = [
      ['name', 'description', desc],
      ['name', 'robots', d.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'],
      ['property', 'og:type', d.type ?? 'website'],
      ['property', 'og:site_name', SITE_NAME],
      ['property', 'og:title', d.title],
      ['property', 'og:description', desc],
      ['property', 'og:url', url],
      ['property', 'og:image', OG_IMAGE],
      ['property', 'og:image:width', '1200'],
      ['property', 'og:image:height', '630'],
      ['property', 'og:image:alt', 'LexForm — yuridik hujjatlar namunalari'],
      ['property', 'og:locale', 'uz_UZ'],
      ['property', 'og:locale:alternate', 'ru_RU'],
      ['name', 'twitter:card', 'summary_large_image'],
      ['name', 'twitter:title', d.title],
      ['name', 'twitter:description', desc],
      ['name', 'twitter:image', OG_IMAGE],
    ];
    for (const [attr, key, content] of tags) this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);

    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);

    this.doc.head.querySelectorAll('script[data-seo]').forEach(s => s.remove());
    for (const obj of d.jsonLd ?? []) {
      const s = this.doc.createElement('script');
      s.setAttribute('type', 'application/ld+json');
      s.setAttribute('data-seo', '');
      // "<" is escaped so user-independent text can never close the script tag
      s.textContent = JSON.stringify({ '@context': 'https://schema.org', ...obj }).replace(/</g, '\\u003c');
      this.doc.head.appendChild(s);
    }
  }
}

export const crumbs = (items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + path })),
});
