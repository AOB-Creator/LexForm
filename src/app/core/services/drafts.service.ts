import { inject, Injectable } from '@angular/core';
import { Values } from '../doc/types';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class Drafts {
  private readonly store = inject(StorageService);
  load(id: string): Values | null { return this.store.get<Values>('draft:' + id); }
  save(id: string, v: Values): void { this.store.set('draft:' + id, v); }
  has(id: string): boolean { return this.load(id) !== null; }
}
