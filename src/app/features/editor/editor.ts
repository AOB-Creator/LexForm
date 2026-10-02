import { ChangeDetectionStrategy, Component, computed, effect, ElementRef, inject, input, signal, untracked, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { renderTemplate } from '../../core/doc/engine';
import { esc, fmtMoney, moneyWords, parseNum } from '../../core/doc/format';
import { cyrToLat } from '../../core/doc/translit';
import { DocTemplate, FieldDef, RowValue, Values } from '../../core/doc/types';
import { DictKey } from '../../core/i18n/dictionary';
import { I18n, TPipe, TrPipe } from '../../core/i18n/i18n.service';
import { Drafts } from '../../core/services/drafts.service';
import { Prefs } from '../../core/services/prefs.service';
import { Icon } from '../../layout/icon';
import { completion, emptyValues, exampleValues, findTemplate } from '../../templates';
import { CATEGORIES, GROUPS } from '../../templates/shared';

interface Group { key: string; fields: (FieldDef | [FieldDef, FieldDef])[]; }

const WORD_CSS = `body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.4}
h2,h3{text-align:center;font-size:12pt}h2{text-transform:uppercase}p,li{text-align:justify}
.c{text-align:center}.r{text-align:right}.sp{text-align:center;font-weight:bold;letter-spacing:3pt}
table.t{border-collapse:collapse;width:100%}table.t td,table.t th{border:1px solid #000;padding:3pt 5pt;font-size:11pt}
td.n{text-align:right}table.info{width:100%}table.info td{width:50%;vertical-align:top}.photo{float:right;width:3cm;height:4cm;border:1px dashed #999;text-align:center;font-size:9pt}.fio{text-align:center;font-weight:bold}table.sig{width:100%}table.sig td{width:50%;vertical-align:top}`;

@Component({
  selector: 'app-editor',
  imports: [RouterLink, NgTemplateOutlet, TPipe, TrPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editor.html',
  styleUrl: './editor.scss',
})
export class Editor {
  /** route param :id */
  readonly id = input.required<string>();

  private readonly drafts = inject(Drafts);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly title = inject(Title);
  protected readonly i18n = inject(I18n);
  protected readonly prefs = inject(Prefs);
  protected readonly groupsLabel = GROUPS;

  private readonly sheet = viewChild<ElementRef<HTMLElement>>('sheet');

  protected readonly tpl = computed<DocTemplate | undefined>(() => findTemplate(this.id()));
  protected readonly values = signal<Values>({});
  protected readonly note = signal<DictKey>('ed.saved');
  protected readonly toast = signal('');
  protected readonly tab = signal<'form' | 'doc'>('form');

  protected readonly category = computed(() => CATEGORIES.find(c => c.id === this.tpl()?.cat));

  protected readonly groups = computed<Group[]>(() => {
    const t = this.tpl();
    if (!t) return [];
    const out: Group[] = [];
    for (const f of t.fields) {
      let g = out.find(x => x.key === f.g);
      if (!g) out.push((g = { key: f.g, fields: [] }));
      const last = g.fields[g.fields.length - 1];
      if (f.half && last && !Array.isArray(last) && last.half) {
        g.fields[g.fields.length - 1] = [last, f];
      } else {
        g.fields.push(f);
      }
    }
    return out;
  });

  protected readonly html = computed(() => {
    const t = this.tpl();
    return t ? this.sanitizer.bypassSecurityTrustHtml(renderTemplate(t, this.values(), this.prefs.script())) : '';
  });

  protected readonly progress = computed(() => {
    const t = this.tpl();
    return t ? Math.round(completion(t, this.values()) * 100) : 0;
  });

  constructor() {
    // load draft or example when the template changes
    effect(() => {
      const t = this.tpl();
      if (!t) return;
      untracked(() => {
        const saved = this.drafts.load(t.id);
        this.values.set(saved ?? exampleValues(t));
        this.note.set(saved ? 'ed.saved' : 'ed.exampleNote');
      });
    });
    // autosave
    effect(() => {
      const t = this.tpl();
      const v = this.values();
      if (t && Object.keys(v).length) this.drafts.save(t.id, v);
    });
    effect(() => {
      const t = this.tpl();
      this.title.setTitle(t ? `${this.i18n.tr(t.title)} · LexForm` : 'LexForm');
    });
  }

  protected isPair(x: FieldDef | [FieldDef, FieldDef]): x is [FieldDef, FieldDef] { return Array.isArray(x); }

  protected str(k: string): string {
    const v = this.values()[k];
    return typeof v === 'string' ? v : '';
  }
  protected rows(k: string): RowValue[] {
    const v = this.values()[k];
    return Array.isArray(v) ? v : [];
  }

  protected set(k: string, v: string): void {
    this.values.update(cur => ({ ...cur, [k]: v }));
    this.note.set('ed.saved');
  }
  protected setCell(k: string, i: number, col: string, v: string): void {
    this.values.update(cur => {
      const rows = (Array.isArray(cur[k]) ? cur[k] as RowValue[] : []).map(r => ({ ...r }));
      rows[i] = { ...rows[i], [col]: v };
      return { ...cur, [k]: rows };
    });
    this.note.set('ed.saved');
  }
  protected addRow(f: FieldDef): void {
    const blank = Object.fromEntries((f.cols ?? []).map(c => [c.k, '']));
    this.values.update(cur => ({ ...cur, [f.k]: [...this.rows(f.k), blank] }));
  }
  protected removeRow(k: string, i: number): void {
    this.values.update(cur => ({ ...cur, [k]: this.rows(k).filter((_, j) => j !== i) }));
  }

  /** Display a select option (stored in Cyrillic) in the chosen script. */
  protected opt(o: string): string { return this.prefs.script() === 'lat' ? cyrToLat(o) : o; }

  protected moneyHint(k: string): string {
    const n = parseNum(this.str(k));
    if (!isFinite(n)) return '';
    const w = moneyWords(n);
    return `${fmtMoney(n)} — ${this.prefs.script() === 'lat' ? cyrToLat(w) : w}`;
  }
  protected rowsTotal(f: FieldDef): string {
    if (!f.cols?.some(c => c.k === 'qty') || !f.cols.some(c => c.k === 'price')) return '';
    const sum = this.rows(f.k).reduce((s, r) => {
      const q = parseNum(r['qty']), p = parseNum(r['price']);
      return isFinite(q) && isFinite(p) ? s + q * p : s;
    }, 0);
    return sum ? fmtMoney(sum) : '';
  }

  protected fillExample(): void {
    const t = this.tpl();
    if (!t) return;
    this.values.set(exampleValues(t));
    this.note.set('ed.exampleNote');
  }
  protected clear(): void {
    const t = this.tpl();
    if (!t) return;
    this.values.set(emptyValues(t));
    this.note.set('ed.cleared');
  }

  private flash(key: DictKey): void {
    this.toast.set(this.i18n.t(key));
    setTimeout(() => this.toast.set(''), 2600);
  }

  private cleanHtml(): string {
    const el = this.sheet()?.nativeElement;
    if (!el) return '';
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.pb').forEach(p => (p.outerHTML = '<br style="page-break-before:always">'));
    clone.querySelectorAll('.blank').forEach(b => b.removeAttribute('class'));
    return clone.innerHTML;
  }

  protected async copy(): Promise<void> {
    const el = this.sheet()?.nativeElement;
    if (!el) return;
    const html = `<div style="font-family:'Times New Roman',serif;font-size:12pt">${this.cleanHtml()}</div>`;
    const text = el.innerText;
    try {
      if ('ClipboardItem' in window && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' }),
        })]);
        this.flash('ed.copied');
      } else {
        await navigator.clipboard.writeText(text);
        this.flash('ed.copiedText');
      }
    } catch {
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      this.flash('ed.selected');
    }
  }

  protected downloadDoc(): void {
    const t = this.tpl();
    if (!t) return;
    const title = this.prefs.script() === 'lat' ? cyrToLat(t.docTitle) : t.docTitle;
    const doc = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">`
      + `<head><meta charset="utf-8"><title>${esc(title)}</title><style>@page{size:A4;margin:2cm 1.5cm 2cm 2.5cm}${WORD_CSS}${t.wordCss ?? ''}</style></head>`
      + `<body>${this.cleanHtml()}</body></html>`;
    const url = URL.createObjectURL(new Blob(['﻿', doc], { type: 'application/msword' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${t.fileName?.(this.values()) || `${t.id}-${this.prefs.script()}`}.doc`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    this.flash('ed.downloaded');
  }

  protected print(): void { window.print(); }
}
