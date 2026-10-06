import { effect, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

/** Favourite and recently opened templates. */
@Injectable({ providedIn: 'root' })
export class Library {
  private readonly store = inject(StorageService);
  readonly favs = signal<string[]>(this.store.get<string[]>('favs') ?? []);
  readonly recent = signal<string[]>(this.store.get<string[]>('recent') ?? []);

  constructor() {
    effect(() => this.store.set('favs', this.favs()));
    effect(() => this.store.set('recent', this.recent()));
  }

  isFav(id: string): boolean { return this.favs().includes(id); }
  toggleFav(id: string): void {
    this.favs.update(f => (f.includes(id) ? f.filter(x => x !== id) : [id, ...f]));
  }
  touch(id: string): void {
    this.recent.update(r => [id, ...r.filter(x => x !== id)].slice(0, 8));
  }
}
