import { esc, fmtDate, fmtDateShort, fmtMoney, moneyWords, parseNum } from './format';
import { cyrToLatHtml } from './translit';
import { DocTemplate, RowValue, Script, Values } from './types';

/** Render context: reads values and turns them into document HTML (Uzbek Cyrillic). Empty values become underlines. */
export class Ctx {
  constructor(private readonly values: Values) {}

  raw(k: string): string {
    const v = this.values[k];
    return typeof v === 'string' ? v.trim() : '';
  }
  has(k: string): boolean { return this.raw(k) !== ''; }
  num(k: string): number { return parseNum(this.raw(k)); }
  rows(k: string): RowValue[] {
    const v = this.values[k];
    return Array.isArray(v) ? v : [];
  }

  span(html: string): string { return `<span class="v">${html}</span>`; }
  blank(w = 14): string { return `<span class="blank">${'_'.repeat(w)}</span>`; }

  /** text value or blank line */
  x(k: string, w = 14): string {
    const r = this.raw(k);
    return r ? this.span(esc(r).replace(/\n/g, '<br>')) : this.blank(w);
  }
  /** "1 000 000 (Бир миллион сўм)" */
  money(k: string): string { return this.moneyN(this.num(k)); }
  moneyN(n: number): string {
    if (!isFinite(n) || n === 0) return `${this.blank(10)} (${this.blank(30)})`;
    return `${this.span(fmtMoney(n))} (${this.span(moneyWords(n))})`;
  }
  sum(k: string): string { const n = this.num(k); return isFinite(n) ? this.span(fmtMoney(n)) : this.blank(10); }
  date(k: string): string {
    return this.has(k) ? this.span(fmtDate(this.raw(k))) : `«${this.blank(3)}» ${this.blank(10)} 20${this.blank(3)} йил`;
  }
  dshort(k: string): string { return this.has(k) ? this.span(fmtDateShort(this.raw(k))) : this.blank(10); }
}

export function renderTemplate(t: DocTemplate, values: Values, script: Script): string {
  const html = t.render(new Ctx(values));
  return script === 'lat' ? cyrToLatHtml(html) : html;
}

/* ---------------- building blocks shared by templates ---------------- */

export const meta = (left: string, right: string) => `<div class="meta"><span>${left}</span><span>${right}</span></div>`;
export const sigTable = (left: string, right: string) => `<table class="sig"><tr><td>${left}</td><td>${right}</td></tr></table>`;
export const h = (title: string) => `<h3>${title}</h3>`;
export const p = (text: string) => `<p>${text}</p>`;
export const ol = (items: string[], start = 1) => `<ol${start > 1 ? ` start="${start}"` : ''}>${items.map(i => `<li>${i}</li>`).join('')}</ol>`;

/** «Name» номидан Устав асосида иш юритувчи директор F.I.O. (кейинги ўринларда «Role» деб юритилади) */
export function partyIntro(c: Ctx, pfx: string, role: string): string {
  return `${c.x(pfx + '_name', 20)} номидан ${c.x(pfx + '_basis', 8)} асосида иш юритувчи ${c.x(pfx + '_pos', 8)} ${c.x(pfx + '_rep', 22)} (кейинги ўринларда «${role}» деб юритилади)`;
}

/** Requisites + signature cell of a legal entity. */
export function reqCell(c: Ctx, pfx: string, role: string): string {
  return `<b>«${role}»</b><br>${c.x(pfx + '_name', 20)}<br>
    Манзил: ${c.x(pfx + '_addr', 24)}<br>
    СТИР: ${c.x(pfx + '_stir', 12)}<br>
    Ҳ/р: ${c.x(pfx + '_acc', 22)}<br>
    Банк: ${c.x(pfx + '_bank', 20)}<br>
    МФО: ${c.x(pfx + '_mfo', 6)} &nbsp; Тел.: ${c.x(pfx + '_phone', 12)}<br><br>
    ${c.x(pfx + '_pos', 8)} ____________ ${c.x(pfx + '_rep', 16)}<br>М.Ў.`;
}

/** Items table (name / unit / qty / price → sum) with total. */
export function itemsTable(c: Ctx, key: string): { html: string; total: number } {
  const rows = c.rows(key);
  let total = 0;
  let body = '';
  rows.forEach((r, i) => {
    const q = parseNum(r['qty']), pr = parseNum(r['price']);
    const s = isFinite(q) && isFinite(pr) ? q * pr : NaN;
    if (isFinite(s)) total += s;
    body += `<tr><td class="n">${i + 1}</td><td>${r['name'] ? c.span(esc(r['name'])) : c.blank(12)}</td><td>${esc(r['unit'] ?? '')}</td>`
      + `<td class="n">${isFinite(q) ? fmtMoney(q) : ''}</td><td class="n">${isFinite(pr) ? fmtMoney(pr) : ''}</td><td class="n">${isFinite(s) ? fmtMoney(s) : ''}</td></tr>`;
  });
  if (!rows.length) body = `<tr><td class="n">1</td><td>${c.blank(12)}</td><td></td><td></td><td></td><td></td></tr>`;
  body += `<tr><td></td><td colspan="4"><b>Жами</b></td><td class="n"><b>${total ? fmtMoney(total) : ''}</b></td></tr>`;
  const head = ['№', 'Номи', 'Ўлчов бирлиги', 'Миқдори', 'Нархи', 'Суммаси'].map(x => `<th>${x}</th>`).join('');
  return { html: `<table class="t"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`, total };
}
