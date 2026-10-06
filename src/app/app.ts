import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TPipe } from './core/i18n/i18n.service';
import { PaletteState } from './core/services/palette.service';
import { Prefs } from './core/services/prefs.service';
import { Header } from './layout/header';
import { Palette } from './layout/palette';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Palette, TPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header />
    <main><router-outlet /></main>
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
    .dev { color: inherit; text-decoration: none; white-space: nowrap; }
    .dev b { color: var(--primary); }
    .dev:hover b { text-decoration: underline; }
  `,
})
export class App {
  // instantiate prefs early so theme applies before first paint of routes
  private readonly prefs = inject(Prefs);
  protected readonly palette = inject(PaletteState);

  @HostListener('window:keydown', ['$event'])
  protected onKey(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.palette.open.update(o => !o);
    }
  }
}
