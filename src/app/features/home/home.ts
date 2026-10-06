import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { renderTemplate } from '../../core/doc/engine';
import { CategoryId } from '../../core/doc/types';
import { I18n, TPipe, TrPipe } from '../../core/i18n/i18n.service';
import { Drafts } from '../../core/services/drafts.service';
import { Library } from '../../core/services/library.service';
import { Seo, SITE } from '../../core/services/seo.service';
import { DICT, DictKey } from '../../core/i18n/dictionary';
import { Prefs } from '../../core/services/prefs.service';
import { Icon } from '../../layout/icon';
import { exampleValues, findTemplate, TEMPLATES } from '../../templates';
import { CATEGORIES } from '../../templates/shared';

const CAT_ICON: Record<CategoryId, string> = { contracts: 'handshake', applications: 'pen', hr: 'users', notarial: 'stamp', court: 'scale', corporate: 'building' };

@Component({
  selector: 'app-home',
  imports: [RouterLink, TPipe, TrPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly i18n = inject(I18n);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly drafts = inject(Drafts);
  protected readonly prefs = inject(Prefs);
  protected readonly library = inject(Library);

  /** ?q= from the URL (WebSite SearchAction target) */
  readonly q = input<string>();
  protected readonly faq = [1, 2, 3, 4, 5].map(n => ({ q: `faq.${n}.q` as DictKey, a: `faq.${n}.a` as DictKey }));
  protected readonly categories = CATEGORIES;
  protected readonly catIcon = CAT_ICON;
  protected readonly total = TEMPLATES.length;
  protected readonly query = signal('');
  protected readonly cat = signal<CategoryId | 'all' | 'fav'>('all');
  protected readonly sub = signal<string>('all');
  protected readonly subs = computed(() => CATEGORIES.find(c => c.id === this.cat())?.subs ?? []);

  protected readonly list = computed(() => {
    const q = this.query().trim().toLowerCase();
    const c = this.cat();
    const s = this.sub();
    this.i18n.lang();
    const favs = this.library.favs();
    return TEMPLATES.filter(t => (c === 'all' || t.cat === c || (c === 'fav' && favs.includes(t.id))) && (s === 'all' || t.sub === s) && (!q ||
      [t.title.uz, t.title.ru, t.title.en, t.desc.uz, t.desc.ru, t.desc.en, t.docTitle].join(' ').toLowerCase().includes(q)));
  });

  protected readonly countByCat = computed(() => {
    const m: Record<string, number> = {};
    TEMPLATES.forEach(t => {
      m[t.cat] = (m[t.cat] ?? 0) + 1;
      m[t.cat + '/' + t.sub] = (m[t.cat + '/' + t.sub] ?? 0) + 1;
    });
    return m;
  });

  protected readonly recentList = computed(() => this.library.recent().map(id => findTemplate(id)).filter((t): t is NonNullable<typeof t> => !!t).slice(0, 6));

  protected toggleFav(e: Event, id: string): void {
    e.preventDefault();
    e.stopPropagation();
    this.library.toggleFav(id);
  }

  protected pickCat(c: CategoryId | 'all' | 'fav'): void {
    this.cat.set(c);
    this.sub.set('all');
  }

  /** Live sample shown in the hero: the real LLC-formation template with example data. */
  protected readonly sample = computed(() => {
    const t = findTemplate('llc-founding')!;
    const html = renderTemplate(t, exampleValues(t), this.prefs.script()).split('<div class="pb"></div>')[0];
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  constructor() {
    effect(() => {
      const q = this.q();
      if (q) untracked(() => { this.query.set(q); this.cat.set('all'); });
    });
    inject(Seo).update({
      title: 'LexForm — yuridik hujjatlar namunalari: shartnoma, ariza, daʼvo, buyruq',
      description: `${TEMPLATES.length} ta bepul yuridik hujjat namunasi: shartnomalar, arizalar, daʼvo arizalari, buyruqlar, vasiyatnoma va ishonchnomalar. Forma orqali toʻldiring, oʻzbek tilida (kirill yoki lotin) Word va PDF yuklab oling. Образцы договоров и заявлений на узбекском языке.`,
      path: '/',
      jsonLd: [
        { '@type': 'WebSite', name: 'LexForm', url: SITE + '/', inLanguage: ['uz', 'ru', 'en'],
          potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: SITE + '/?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } },
        { '@type': 'Organization', name: 'LexForm', url: SITE + '/', logo: SITE + '/icon-512.png',
          parentOrganization: { '@type': 'Organization', name: 'TrustCode', url: 'https://trustcode.uz' } },
        { '@type': 'WebApplication', name: 'LexForm', url: SITE + '/', applicationCategory: 'BusinessApplication', operatingSystem: 'Any', inLanguage: 'uz',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'UZS' }, creator: { '@type': 'Organization', name: 'TrustCode', url: 'https://trustcode.uz' } },
        { '@type': 'FAQPage', mainEntity: this.faq.map(f => ({ '@type': 'Question', name: DICT[f.q].uz, acceptedAnswer: { '@type': 'Answer', text: DICT[f.a].uz } })) },
      ],
    });
  }

  protected hasDraft(id: string): boolean { return this.drafts.has(id); }
  protected catTitle(id: CategoryId) { return CATEGORIES.find(c => c.id === id)!.title; }
  protected subTitle(id: CategoryId, sub: string) { return CATEGORIES.find(c => c.id === id)!.subs.find(s => s.id === sub)!.title; }
}
