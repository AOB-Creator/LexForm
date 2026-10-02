import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TPipe } from './core/i18n/i18n.service';
import { Prefs } from './core/services/prefs.service';
import { Header } from './layout/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, TPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header />
    <main><router-outlet /></main>
    <footer class="foot no-print">
      <span><b>LexForm</b> · {{ 'app.tagline' | t }}</span>
      <span>{{ 'foot.note' | t }}</span>
    </footer>
  `,
  styles: `
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    main { flex: 1; }
    .foot {
      display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px;
      padding: 22px var(--gutter); border-top: 1px solid var(--line);
      color: var(--muted); font-size: 13px;
    }
  `,
})
export class App {
  // instantiate prefs early so theme applies before first paint of routes
  private readonly prefs = inject(Prefs);
}
