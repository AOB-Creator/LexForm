import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocTemplate, Values } from '../../core/doc/types';
import { DictKey } from '../../core/i18n/dictionary';
import { I18n, TPipe, TrPipe } from '../../core/i18n/i18n.service';
import { Drafts } from '../../core/services/drafts.service';
import { Library } from '../../core/services/library.service';
import { Profile, Profiles } from '../../core/services/profiles.service';
import { Icon } from '../../layout/icon';
import { completion, findTemplate } from '../../templates';
import { CATEGORIES } from '../../templates/shared';

/** Keep only string values and tables of string cells from an untrusted backup. */
function cleanValues(v: unknown): Values | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const out: Values = {};
  for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
    if (typeof x === 'string') out[k] = x;
    else if (Array.isArray(x)) {
      out[k] = x.filter(r => r && typeof r === 'object' && !Array.isArray(r)).map(r => {
        const row: Record<string, string> = {};
        for (const [ck, cv] of Object.entries(r as Record<string, unknown>)) if (typeof cv === 'string') row[ck] = cv;
        return row;
      });
    }
  }
  return out;
}

interface Backup { app: 'lexform'; v: 1; exported: string; drafts: Record<string, { values: Values; updated: number }>; profiles: Profile[]; favs: string[]; }

@Component({
  selector: 'app-my',
  imports: [RouterLink, TPipe, TrPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './my.html',
  styleUrl: './my.scss',
})
export class My {
  private readonly i18n = inject(I18n);
  private readonly drafts = inject(Drafts);
  private readonly library = inject(Library);
  protected readonly profiles = inject(Profiles);
  protected readonly toast = signal<DictKey | ''>('');

  protected readonly items = computed(() => {
    this.drafts.version();
    return this.drafts.list()
      .map(d => ({ ...d, t: findTemplate(d.id) }))
      .filter((d): d is { id: string; updated: number; t: DocTemplate } => !!d.t)
      .map(d => ({ ...d, pct: Math.round(completion(d.t, this.drafts.load(d.id) ?? {}) * 100) }));
  });

  protected cat(t: DocTemplate) {
    const c = CATEGORIES.find(x => x.id === t.cat)!;
    return { cat: c.title, sub: c.subs.find(s => s.id === t.sub)!.title };
  }

  protected when(ts: number): string {
    if (!ts) return '—';
    const d = new Date(ts), z = (n: number) => String(n).padStart(2, '0');
    return `${z(d.getDate())}.${z(d.getMonth() + 1)}.${d.getFullYear()} ${z(d.getHours())}:${z(d.getMinutes())}`;
  }

  protected summary(p: Profile): string {
    return p.kind === 'company'
      ? [p.data['_stir'] && `STIR ${p.data['_stir']}`, p.data['_rep'], p.data['_addr']].filter(Boolean).join(' · ')
      : [p.data['_pass'], p.data['_addr']].filter(Boolean).join(' · ');
  }

  protected removeDraft(id: string): void {
    if (confirm(this.i18n.t('my.confirm'))) this.drafts.remove(id);
  }
  protected removeProfile(id: string): void {
    if (confirm(this.i18n.t('my.confirm'))) this.profiles.remove(id);
  }

  protected exportAll(): void {
    const data: Backup = { app: 'lexform', v: 1, exported: new Date().toISOString(), drafts: {}, profiles: this.profiles.all(), favs: this.library.favs() };
    for (const d of this.drafts.list()) {
      const values = this.drafts.load(d.id);
      if (values) data.drafts[d.id] = { values, updated: d.updated };
    }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `lexform-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  protected async importFile(ev: Event): Promise<void> {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text()) as Partial<Backup>;
      if (data.app !== 'lexform' || typeof data.drafts !== 'object' || !data.drafts) throw new Error('bad');
      for (const [id, d] of Object.entries(data.drafts)) {
        const values = findTemplate(id) && d ? cleanValues(d.values) : null;
        if (values) this.drafts.put(id, values, Number(d.updated) || Date.now());
      }
      for (const p of Array.isArray(data.profiles) ? data.profiles : []) {
        if ((p.kind === 'company' || p.kind === 'person') && typeof p.label === 'string' && p.data && typeof p.data === 'object') {
          const clean: Record<string, string> = {};
          for (const [k, v] of Object.entries(p.data)) if (typeof v === 'string') clean[k] = v;
          this.profiles.save(p.kind, p.label, clean);
        }
      }
      if (Array.isArray(data.favs)) this.library.favs.update(f => [...new Set([...f, ...data.favs!.filter(id => typeof id === 'string' && findTemplate(id))])]);
      this.flash('my.imported');
    } catch {
      this.flash('my.badFile');
    }
  }

  private flash(k: DictKey): void {
    this.toast.set(k);
    setTimeout(() => this.toast.set(''), 2600);
  }
}
