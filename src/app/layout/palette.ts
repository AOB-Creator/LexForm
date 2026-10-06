import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostListener, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { cyrToLat } from '../core/doc/translit';
import { DocTemplate } from '../core/doc/types';
import { TPipe, TrPipe } from '../core/i18n/i18n.service';
import { PaletteState } from '../core/services/palette.service';
import { TEMPLATES } from '../templates';
import { CATEGORIES } from '../templates/shared';
import { Icon } from './icon';

const norm = (s: string) => cyrToLat(s).toLowerCase().replace(/[ʻʼ'`‘’]/g, '');
const INDEX = TEMPLATES.map(t => ({ t, hay: norm([t.title.uz, t.title.ru, t.title.en, t.docTitle, t.desc.uz].join(' ')), title: norm(t.title.uz) }));

/** Ctrl+K quick switcher over all templates. */
@Component({
  selector: 'app-palette',
  imports: [TPipe, TrPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (state.open()) {
      <div class="backdrop no-print" (click)="close()"></div>
      <div class="pal no-print" role="dialog" aria-modal="true" [attr.aria-label]="'nav.search' | t">
        <label class="q">
          <app-icon name="search" />
          <input #q type="search" [value]="query()" (input)="query.set($any($event.target).value); active.set(0)" [placeholder]="'pal.placeholder' | t" autocomplete="off">
          <kbd>Esc</kbd>
        </label>
        <ul role="listbox">
          @for (t of results(); track t.id; let i = $index) {
            <li role="option" [attr.aria-selected]="i === active()" [class.on]="i === active()" (mouseenter)="active.set(i)" (click)="go(t)">
              <span class="ttl">{{ t.title | tr }}</span>
              <span class="sub">{{ cat(t) | tr }} · {{ t.docTitle }}</span>
            </li>
          } @empty {
            <li class="none">{{ 'list.empty' | t }}</li>
          }
        </ul>
        <p class="hint">{{ 'pal.hint' | t }}</p>
      </div>
    }
  `,
  styles: `
    .backdrop { position: fixed; inset: 0; background: rgba(10, 14, 30, .45); z-index: 60; backdrop-filter: blur(2px); }
    .pal {
      position: fixed; z-index: 61; left: 50%; top: 12vh; transform: translateX(-50%);
      width: min(640px, calc(100vw - 32px)); max-height: 72vh; display: flex; flex-direction: column;
      background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--shadow-lg); overflow: hidden;
    }
    .q { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--line); color: var(--muted); }
    .q input { flex: 1; border: 0; outline: none; background: none; font-size: 16px; color: var(--ink); min-width: 0; }
    kbd { font: 500 11px var(--f-mono); border: 1px solid var(--line-2); border-radius: 6px; padding: 2px 6px; color: var(--muted); }
    ul { list-style: none; margin: 0; padding: 6px; overflow: auto; }
    li { display: grid; gap: 2px; padding: 9px 12px; border-radius: 10px; cursor: pointer; }
    li.on { background: var(--primary-soft); }
    .ttl { font-weight: 700; color: var(--ink); }
    .sub { font-size: 12.5px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .none { color: var(--muted); cursor: default; }
    .hint { margin: 0; padding: 8px 16px; border-top: 1px solid var(--line); font: 500 11.5px var(--f-mono); color: var(--muted); }
  `,
})
export class Palette {
  protected readonly state = inject(PaletteState);
  private readonly router = inject(Router);
  private readonly input = viewChild<ElementRef<HTMLInputElement>>('q');
  protected readonly query = signal('');
  protected readonly active = signal(0);

  protected readonly results = computed<DocTemplate[]>(() => {
    const words = norm(this.query().trim()).split(/\s+/).filter(Boolean);
    if (!words.length) return TEMPLATES.slice(0, 10);
    return INDEX
      .filter(x => words.every(w => x.hay.includes(w)))
      .sort((a, b) => Number(b.title.startsWith(words[0])) - Number(a.title.startsWith(words[0])))
      .slice(0, 12)
      .map(x => x.t);
  });

  constructor() {
    effect(() => { if (this.state.open()) setTimeout(() => this.input()?.nativeElement.focus()); });
  }

  protected cat(t: DocTemplate) { return CATEGORIES.find(c => c.id === t.cat)!.title; }

  protected close(): void { this.state.open.set(false); this.query.set(''); this.active.set(0); }

  protected go(t: DocTemplate): void {
    this.close();
    this.router.navigate(['/t', t.id]);
  }

  @HostListener('window:keydown', ['$event'])
  protected onKey(e: KeyboardEvent): void {
    if (!this.state.open()) return;
    const n = this.results().length;
    if (e.key === 'Escape') { e.preventDefault(); this.close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); this.active.update(i => (n ? (i + 1) % n : 0)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.active.update(i => (n ? (i - 1 + n) % n : 0)); }
    else if (e.key === 'Enter') { const t = this.results()[this.active()]; if (t) { e.preventDefault(); this.go(t); } }
  }
}
