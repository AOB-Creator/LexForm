import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaletteState {
  readonly open = signal(false);
}
