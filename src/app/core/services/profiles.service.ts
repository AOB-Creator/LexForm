import { effect, inject, Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

export type ProfileKind = 'company' | 'person';
export interface Profile { id: string; kind: ProfileKind; label: string; data: Record<string, string>; updated: number; }

/** Field-key suffixes that make up a party block (see partyFields / personFields). */
export const PROFILE_SUFFIXES: Record<ProfileKind, string[]> = {
  company: ['_name', '_pos', '_rep', '_basis', '_stir', '_addr', '_acc', '_mfo', '_bank', '_phone'],
  person: ['', '_pass', '_addr', '_pinfl', '_acc', '_phone'],
};

/** Saved company details and people, reusable across documents. */
@Injectable({ providedIn: 'root' })
export class Profiles {
  private readonly store = inject(StorageService);
  readonly all = signal<Profile[]>(this.store.get<Profile[]>('profiles') ?? []);

  constructor() {
    effect(() => this.store.set('profiles', this.all()));
  }

  of(kind: ProfileKind): Profile[] { return this.all().filter(p => p.kind === kind); }

  /** Save (or update a profile with the same label and kind). */
  save(kind: ProfileKind, label: string, data: Record<string, string>): void {
    const clean = label.trim();
    if (!clean) return;
    this.all.update(list => {
      const i = list.findIndex(p => p.kind === kind && p.label === clean);
      const item: Profile = { id: i >= 0 ? list[i].id : Math.random().toString(36).slice(2, 10), kind, label: clean, data, updated: Date.now() };
      return i >= 0 ? list.map((p, j) => (j === i ? item : p)) : [item, ...list];
    });
  }

  remove(id: string): void { this.all.update(list => list.filter(p => p.id !== id)); }
}
