import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TPipe } from '../../core/i18n/i18n.service';
import { PaletteState } from '../../core/services/palette.service';
import { Seo } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, TPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="nf">
      <p class="code">404</p>
      <h1>{{ 'nf.title' | t }}</h1>
      <p>{{ 'nf.text' | t }}</p>
      <div class="act">
        <a class="btn primary" routerLink="/">{{ 'cat.home' | t }}</a>
        <button class="btn" type="button" (click)="palette.open.set(true)">{{ 'nav.search' | t }} · Ctrl K</button>
      </div>
    </section>
  `,
  styles: `
    .nf { max-width: 640px; margin: 0 auto; padding: 96px var(--gutter); text-align: center; display: grid; gap: 12px; justify-items: center; }
    .code { font: 700 72px/1 var(--f-display); color: var(--primary); margin: 0; }
    h1 { font: 600 28px var(--f-display); margin: 0; }
    p { color: var(--ink-2); margin: 0; }
    .act { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 8px; }
  `,
})
export class NotFound {
  protected readonly palette = inject(PaletteState);
  constructor() {
    inject(Seo).update({ title: 'Sahifa topilmadi — 404 | LexForm', description: 'Bunday sahifa mavjud emas.', path: '/404', noindex: true });
  }
}
