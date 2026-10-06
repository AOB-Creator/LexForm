import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';
import { Script } from '../doc/types';
import { StorageService } from './storage.service';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class Prefs {
  private readonly store = inject(StorageService);
  private readonly doc = inject(DOCUMENT);

  readonly script = signal<Script>(this.store.get<Script>('script') ?? 'cyr');
  readonly theme = signal<Theme>(this.store.get<Theme>('theme') ?? this.systemTheme());
  readonly marks = signal<boolean>(this.store.get<boolean>('marks') ?? true);
  /** document preview zoom, % */
  readonly zoom = signal<number>(this.store.get<number>('zoom') ?? 100);

  constructor() {
    effect(() => this.store.set('script', this.script()));
    effect(() => this.store.set('marks', this.marks()));
    effect(() => this.store.set('zoom', this.zoom()));
    effect(() => {
      const th = this.theme();
      this.store.set('theme', th);
      this.doc.documentElement.setAttribute('data-theme', th);
    });
  }

  zoomBy(step: number): void { this.zoom.update(z => Math.min(150, Math.max(70, z + step))); }

  toggleTheme(): void { this.theme.update(t => (t === 'dark' ? 'light' : 'dark')); }

  private systemTheme(): Theme {
    return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
