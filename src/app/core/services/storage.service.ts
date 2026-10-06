import { Injectable } from '@angular/core';

/** localStorage with graceful failure (private mode, blocked storage). */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly prefix = 'lexform:';

  get<T>(key: string): T | null {
    try {
      const raw = globalThis.localStorage?.getItem(this.prefix + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  set(key: string, value: unknown): void {
    try { globalThis.localStorage?.setItem(this.prefix + key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  }

  /** Keys (without the app prefix) that start with the given prefix. */
  keys(prefix = ''): string[] {
    try {
      const ls = globalThis.localStorage;
      if (!ls) return [];
      const out: string[] = [];
      for (let i = 0; i < ls.length; i++) {
        const k = ls.key(i);
        if (k?.startsWith(this.prefix + prefix)) out.push(k.slice(this.prefix.length));
      }
      return out;
    } catch {
      return [];
    }
  }

  remove(key: string): void {
    try { globalThis.localStorage?.removeItem(this.prefix + key); } catch { /* storage unavailable */ }
  }
}
