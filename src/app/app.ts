import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TPipe, TrPipe } from './core/i18n/i18n.service';
import { CATEGORY_LINKS } from './layout/category-links';
import { PaletteState } from './core/services/palette.service';
import { Prefs } from './core/services/prefs.service';
import { Header } from './layout/header';
import { Palette } from './layout/palette';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Header, Palette, TPipe, TrPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header />
    <main><router-outlet /></main>
    <nav class="sections no-print" [attr.aria-label]="'foot.sections' | t">
      <b>{{ 'foot.sections' | t }}:</b>
      @for (c of categories; track c.id) { <a [routerLink]="['/c', c.id]">{{ c.title | tr }}</a> }
      <a routerLink="/my">{{ 'nav.my' | t }}</a>
    </nav>
    <footer class="foot no-print">
      <span><b>LexForm</b> · {{ 'app.tagline' | t }}</span>
      <span>{{ 'foot.note' | t }}</span>
      <a class="dev" href="https://trustcode.uz" target="_blank" rel="noopener">{{ 'foot.dev' | t }} <b>TrustCode</b></a>
    </footer>
    @defer (when palette.open()) { <app-palette /> }
  `,
  styles: `
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    main { flex: 1; }
    .foot {
      display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px;
      padding: 22px var(--gutter); border-top: 1px solid var(--line);
      color: var(--muted); font-size: 13px;
    }
    .sections { display: flex; flex-wrap: wrap; gap: 6px 18px; padding: 18px var(--gutter); border-top: 1px solid var(--line); font-size: 13.5px; color: var(--muted); }
    .sections a { color: var(--ink-2); text-decoration: none; font-weight: 600; }
    .sections a:hover { color: var(--primary); }
    .dev { color: inherit; text-decoration: none; white-space: nowrap; }
    .dev b { color: var(--primary); }
    .dev:hover b { text-decoration: underline; }
  `,
})
export class App {
  // instantiate prefs early so theme applies before first paint of routes
  private readonly prefs = inject(Prefs);
  protected readonly palette = inject(PaletteState);
  protected readonly categories = CATEGORY_LINKS;

  @HostListener('window:keydown', ['$event'])
  protected onKey(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.palette.open.update(o => !o);
    }
  }
}
