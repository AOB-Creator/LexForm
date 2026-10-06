import { inject, Injectable, signal } from '@angular/core';
import { Values } from '../doc/types';
import { StorageService } from './storage.service';

export interface DraftInfo { id: string; updated: number; }

@Injectable({ providedIn: 'root' })
export class Drafts {
  private readonly store = inject(StorageService);
  /** bumps whenever drafts change so lists can recompute */
  readonly version = signal(0);

  load(id: string): Values | null { return this.store.get<Values>('draft:' + id); }
  has(id: string): boolean { return this.load(id) !== null; }

  save(id: string, v: Values): void {
    const prev = this.load(id);
    if (prev && JSON.stringify(prev) === JSON.stringify(v)) return;
    this.store.set('draft:' + id, v);
    this.store.set('draftmeta:' + id, { updated: Date.now() });
    this.version.update(n => n + 1);
  }

  updated(id: string): number { return this.store.get<{ updated: number }>('draftmeta:' + id)?.updated ?? 0; }

  /** Restore a draft from a backup, keeping its original edit time. */
  put(id: string, v: Values, updated: number): void {
    this.store.set('draft:' + id, v);
    this.store.set('draftmeta:' + id, { updated });
    this.version.update(n => n + 1);
  }

  remove(id: string): void {
    this.store.remove('draft:' + id);
    this.store.remove('draftmeta:' + id);
    this.version.update(n => n + 1);
  }

  list(): DraftInfo[] {
    return this.store.keys('draft:')
      .map(k => k.slice('draft:'.length))
      .map(id => ({ id, updated: this.updated(id) }))
      .sort((a, b) => b.updated - a.updated);
  }
}
