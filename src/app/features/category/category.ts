import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryId } from '../../core/doc/types';
import { TPipe, TrPipe } from '../../core/i18n/i18n.service';
import { crumbs, Seo, SITE } from '../../core/services/seo.service';
import { TEMPLATES } from '../../templates';
import { CATEGORIES } from '../../templates/shared';

const SEO_TITLE: Record<CategoryId, string> = {
  contracts: 'Shartnomalar namunalari — oldi-sotdi, ijara, xizmat, pudrat, qarz | LexForm',
  applications: 'Ariza namunalari — davlat organlari, bank, maktab va bogʻchaga | LexForm',
  hr: 'Kadrlar hujjatlari namunalari — buyruqlar, mehnat shartnomasi, arizalar | LexForm',
  notarial: 'Notarial hujjatlar namunalari — vasiyatnoma, ishonchnoma, meros | LexForm',
  court: 'Sudga oid hujjatlar namunalari — daʼvo arizalari, shikoyatlar | LexForm',
  corporate: 'MChJ korporativ hujjatlari namunalari — qaror, ustav, bayonnoma | LexForm',
};

@Component({
  selector: 'app-category',
  imports: [RouterLink, TPipe, TrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cat(); as c) {
      <section class="wrap">
        <nav class="crumbs" aria-label="breadcrumb">
          <a routerLink="/">{{ 'cat.home' | t }}</a> <span>›</span> <span>{{ c.title | tr }}</span>
        </nav>
        <h1>{{ c.title | tr }}</h1>
        <p class="lead">{{ c.intro! | tr }}</p>
        <p class="count">{{ list().length }} {{ 'cat.count' | t }}</p>
        @for (s of c.subs; track s.id) {
          <h2 [id]="s.id">{{ s.title | tr }}</h2>
          <ul class="grid">
            @for (t of bySub(s.id); track t.id) {
              <li>
                <a [routerLink]="['/t', t.id]">
                  <span class="ttl">{{ t.title | tr }}</span>
                  <span class="doc">{{ t.docTitle }}</span>
                  <span class="desc">{{ t.desc | tr }}</span>
                </a>
              </li>
            }
          </ul>
        }
        <h2>{{ 'cat.other' | t }}</h2>
        <div class="others">
          @for (o of others(); track o.id) { <a class="chip" [routerLink]="['/c', o.id]">{{ o.title | tr }}</a> }
        </div>
      </section>
    }
  `,
  styles: `
    :host { display: block; }
    .wrap { max-width: 1100px; margin: 0 auto; padding: clamp(24px, 4vw, 48px) var(--gutter) 72px; }
    .crumbs { font-size: 13px; color: var(--muted); display: flex; gap: 6px; flex-wrap: wrap; }
    .crumbs a { color: var(--muted); } .crumbs a:hover { color: var(--primary); }
    h1 { font: 600 clamp(26px, 3.6vw, 40px)/1.15 var(--f-display); letter-spacing: -.01em; margin: 12px 0 12px; }
    .lead { color: var(--ink-2); max-width: 80ch; margin: 0 0 8px; font-size: 16px; }
    .count { font: 500 12.5px var(--f-mono); color: var(--muted); margin: 0 0 8px; }
    h2 { font: 700 13px/1 var(--f-ui); text-transform: uppercase; letter-spacing: .12em; color: var(--primary); margin: 32px 0 12px; }
    .grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px; }
    .grid a { display: grid; gap: 4px; height: 100%; padding: 14px 16px; border-radius: var(--r); background: var(--surface); border: 1px solid var(--line); color: var(--ink); text-decoration: none; transition: border-color .15s, box-shadow .15s; }
    .grid a:hover { border-color: var(--primary); box-shadow: var(--shadow); }
    .ttl { font-weight: 700; }
    .doc { font: italic 13.5px var(--f-doc); color: var(--muted); }
    .desc { font-size: 13.5px; color: var(--ink-2); }
    .others { display: flex; flex-wrap: wrap; gap: 8px; }
    .others a { text-decoration: none; }
  `,
})
export class Category {
  readonly id = input.required<string>();
  private readonly seo = inject(Seo);
  protected readonly cat = computed(() => CATEGORIES.find(c => c.id === this.id()));
  protected readonly list = computed(() => TEMPLATES.filter(t => t.cat === this.id()));
  protected readonly others = computed(() => CATEGORIES.filter(c => c.id !== this.id()));
  protected bySub(sub: string) { return this.list().filter(t => t.sub === sub); }

  constructor() {
    effect(() => {
      const c = this.cat();
      if (!c) { this.seo.update({ title: 'Sahifa topilmadi | LexForm', description: '', path: '/404', noindex: true }); return; }
      const path = `/c/${c.id}`;
      this.seo.update({
        title: SEO_TITLE[c.id],
        description: `${c.intro!.uz} ${c.intro!.ru}`,
        path,
        jsonLd: [
          crumbs([['Bosh sahifa', '/'], [c.title.uz, path]]),
          {
            '@type': 'CollectionPage', name: c.title.uz, url: SITE + path, inLanguage: 'uz',
            mainEntity: { '@type': 'ItemList', itemListElement: this.list().map((t, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/t/${t.id}`, name: t.title.uz })) },
          },
        ],
      });
    });
  }
}
