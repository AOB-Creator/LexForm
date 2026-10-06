import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18n, TPipe, UI_LANGS } from '../core/i18n/i18n.service';
import { PaletteState } from '../core/services/palette.service';
import { Prefs } from '../core/services/prefs.service';
import { Icon } from './icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, TPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bar no-print">
      <a class="logo" routerLink="/" aria-label="LexForm">
        <span class="mark" aria-hidden="true">
          <svg viewBox="0 0 32 32"><path d="M9 5h10l5 5v17H9z" /><path class="fold" d="M19 5v5h5" /><circle cx="21" cy="22" r="4" /></svg>
        </span>
        <span class="word">Lex<b>Form</b></span>
      </a>
      <nav class="links">
        <a routerLink="/" fragment="templates">{{ 'nav.templates' | t }}</a>
        <a routerLink="/my" routerLinkActive="act">{{ 'nav.my' | t }}</a>
        <a routerLink="/" fragment="how">{{ 'nav.how' | t }}</a>
      </nav>
      <div class="tools">
        <button class="search-btn" type="button" (click)="palette.open.set(true)" [attr.aria-label]="'nav.search' | t">
          <app-icon name="search" /><span class="lbl">{{ 'nav.search' | t }}</span><kbd>Ctrl K</kbd>
        </button>
        <a class="btn icon ghost my" routerLink="/my" [attr.aria-label]="'nav.my' | t" [attr.title]="'nav.my' | t"><app-icon name="folder" /></a>
        <div class="seg" role="group" [attr.aria-label]="'lang.label' | t">
          @for (l of langs; track l.id) {
            <button type="button" [attr.aria-pressed]="i18n.lang() === l.id" [attr.title]="l.name" (click)="i18n.lang.set(l.id)">{{ l.short }}</button>
          }
        </div>
        <button class="btn icon ghost" type="button" (click)="prefs.toggleTheme()" [attr.aria-label]="'theme.toggle' | t" [attr.title]="'theme.toggle' | t">
          <app-icon [name]="prefs.theme() === 'dark' ? 'sun' : 'moon'" />
        </button>
      </div>
    </header>
  `,
  styles: `
    .bar {
      position: sticky; top: env(safe-area-inset-top, 0px); z-index: 20;
      display: flex; align-items: center; gap: 24px;
      padding: 12px var(--gutter);
      background: color-mix(in srgb, var(--bg) 82%, transparent);
      backdrop-filter: saturate(1.4) blur(14px);
      border-bottom: 1px solid var(--line);
    }
    .logo { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: var(--ink); }
    .mark { width: 34px; height: 34px; border-radius: 10px; background: var(--primary); display: grid; place-items: center; }
    .mark svg { width: 24px; height: 24px; fill: #fff; stroke: none; }
    .mark .fold { fill: #c9d0f5; }
    .mark circle { fill: none; stroke: #5fe0d4; stroke-width: 2; }
    .word { font: 600 19px/1 var(--f-display); letter-spacing: -.01em; }
    .word b { color: var(--primary); font-weight: 600; }
    .links { display: flex; gap: 20px; margin-right: auto; }
    .links a { color: var(--muted); text-decoration: none; font-weight: 600; font-size: 14px; }
    .links a:hover { color: var(--ink); }
    .tools { display: flex; align-items: center; gap: 8px; }
    .links a.act { color: var(--primary); }
    .search-btn {
      display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
      padding: 7px 10px; border-radius: 999px; border: 1px solid var(--line-2); background: var(--surface); color: var(--muted); font-size: 13px;
    }
    .search-btn:hover { border-color: var(--primary); color: var(--ink); }
    .search-btn kbd { font: 500 10.5px var(--f-mono); border: 1px solid var(--line-2); border-radius: 5px; padding: 1px 5px; }
    .my { display: none; }
    @media (max-width: 900px) { .search-btn .lbl, .search-btn kbd { display: none; } }
    @media (max-width: 640px) { .links { display: none; } .tools { margin-left: auto; } .bar { gap: 12px; } .my { display: inline-flex; } }
    @media (max-width: 480px) { .word { display: none; } .tools { gap: 4px; } .seg button { padding-inline: 8px; } .search-btn { padding: 7px 9px; } }
  `,
})
export class Header {
  protected readonly i18n = inject(I18n);
  protected readonly prefs = inject(Prefs);
  protected readonly palette = inject(PaletteState);
  protected readonly langs = UI_LANGS;
}
