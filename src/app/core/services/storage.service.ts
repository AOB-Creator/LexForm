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

  remove(key: string): void {
    try { globalThis.localStorage?.removeItem(this.prefix + key); } catch { /* storage unavailable */ }
  }
}
