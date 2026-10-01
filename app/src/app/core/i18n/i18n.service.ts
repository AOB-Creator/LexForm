import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, Pipe, PipeTransform, signal } from '@angular/core';
import { Tr, UiLang } from '../doc/types';
import { DICT, DictKey } from './dictionary';
import { StorageService } from '../services/storage.service';

export const UI_LANGS: { id: UiLang; short: string; name: string }[] = [
  { id: 'uz', short: 'UZ', name: 'Oʻzbekcha' },
  { id: 'ru', short: 'RU', name: 'Русский' },
  { id: 'en', short: 'EN', name: 'English' },
];

@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly store = inject(StorageService);
  private readonly doc = inject(DOCUMENT);
  readonly lang = signal<UiLang>(this.initial());

  constructor() {
    effect(() => {
      const l = this.lang();
      this.store.set('ui-lang', l);
      this.doc.documentElement.lang = l === 'uz' ? 'uz-Latn' : l;
    });
  }

  private initial(): UiLang {
    const saved = this.store.get<UiLang>('ui-lang');
    if (saved && ['uz', 'ru', 'en'].includes(saved)) return saved;
    const nav = (globalThis.navigator?.language || 'uz').slice(0, 2);
    return nav === 'ru' ? 'ru' : 'uz';
  }

  t(key: DictKey): string { return DICT[key][this.lang()]; }
  tr(v: Tr): string { return v[this.lang()]; }
}

/** `{{ 'key' | t }}` — impure so it follows language switches. */
@Pipe({ name: 't', pure: false })
export class TPipe implements PipeTransform {
  private readonly i18n = inject(I18n);
  transform(key: DictKey): string { return this.i18n.t(key); }
}

/** `{{ someTr | tr }}` for objects with uz/ru/en. */
@Pipe({ name: 'tr', pure: false })
export class TrPipe implements PipeTransform {
  private readonly i18n = inject(I18n);
  transform(v: Tr | undefined): string { return v ? this.i18n.tr(v) : ''; }
}
