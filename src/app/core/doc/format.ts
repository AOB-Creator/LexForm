/** Number, money and date formatting for Uzbek documents. Output is Uzbek Cyrillic; Latin is produced by transliteration. */

export function parseNum(s: unknown): number {
  if (s === null || s === undefined) return NaN;
  const t = String(s).replace(/\s+/g, '').replace(',', '.');
  return t === '' ? NaN : Number(t);
}

/** 1234567.5 → "1 234 567,50" */
export function fmtMoney(n: number): string {
  if (!isFinite(n)) return '';
  const neg = n < 0;
  const [i, d] = Math.abs(n).toFixed(2).split('.');
  return (neg ? '−' : '') + i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (d === '00' ? '' : ',' + d);
}

const ONES = ['', 'бир', 'икки', 'уч', 'тўрт', 'беш', 'олти', 'етти', 'саккиз', 'тўққиз'];
const TENS = ['', 'ўн', 'йигирма', 'ўттиз', 'қирқ', 'эллик', 'олтмиш', 'етмиш', 'саксон', 'тўқсон'];
const SCALES = ['', 'минг', 'миллион', 'миллиард', 'триллион'];

function triad(n: number): string {
  const h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, o = n % 10;
  const w: string[] = [];
  if (h) w.push(ONES[h], 'юз');
  if (t) w.push(TENS[t]);
  if (o) w.push(ONES[o]);
  return w.join(' ');
}

/** Integer in Uzbek words: 1464000 → "бир миллион тўрт юз олтмиш тўрт минг" */
export function numWords(n: number): string {
  n = Math.floor(Math.abs(n));
  if (n === 0) return 'нол';
  const parts: string[] = [];
  let i = 0;
  while (n > 0) {
    const tr = n % 1000;
    if (tr) parts.unshift(triad(tr) + (SCALES[i] ? ' ' + SCALES[i] : ''));
    n = Math.floor(n / 1000);
    i++;
  }
  return parts.join(' ');
}

/** Money in words, capitalised: "Эллик миллион сўм", with тийин when present. */
export function moneyWords(n: number): string {
  if (!isFinite(n)) return '';
  const whole = Math.floor(Math.abs(n));
  const tiyin = Math.round((Math.abs(n) - whole) * 100);
  let s = numWords(whole) + ' сўм';
  if (tiyin) s += ' ' + numWords(tiyin) + ' тийин';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

export function parseDate(s: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
}

/** "2026-10-01" → «01» октябрь 2026 йил */
export function fmtDate(s: string): string {
  const p = parseDate(s);
  return p ? `«${String(p.d).padStart(2, '0')}» ${MONTHS[p.m - 1]} ${p.y} йил` : '';
}

/** "2026-10-01" → 01.10.2026 */
export function fmtDateShort(s: string): string {
  const p = parseDate(s);
  return p ? `${String(p.d).padStart(2, '0')}.${String(p.m).padStart(2, '0')}.${p.y}` : '';
}

export function esc(s: unknown): string {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/* ---------------- Russian ---------------- */

const RU_ONES_M = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const RU_ONES_F = ['', 'одна', 'две', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const RU_TEENS = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
const RU_TENS = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
const RU_HUNDREDS = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
/** [one, few, many] and grammatical gender of each scale */
const RU_SCALES: [string[], boolean][] = [
  [['', '', ''], false],
  [['тысяча', 'тысячи', 'тысяч'], true],
  [['миллион', 'миллиона', 'миллионов'], false],
  [['миллиард', 'миллиарда', 'миллиардов'], false],
  [['триллион', 'триллиона', 'триллионов'], false],
];

/** Russian plural form index for a count: 0 = один, 1 = два–четыре, 2 = пять+ */
export function ruPlural(n: number): 0 | 1 | 2 {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return 2;
  if (b === 1) return 0;
  if (b >= 2 && b <= 4) return 1;
  return 2;
}

function ruTriad(n: number, fem: boolean): string {
  const h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, o = n % 10;
  const w: string[] = [];
  if (h) w.push(RU_HUNDREDS[h]);
  if (t === 1) w.push(RU_TEENS[o]);
  else {
    if (t) w.push(RU_TENS[t]);
    if (o) w.push((fem ? RU_ONES_F : RU_ONES_M)[o]);
  }
  return w.join(' ');
}

/** Integer in Russian words: 1464000 → "один миллион четыреста шестьдесят четыре тысячи" */
export function numWordsRu(n: number): string {
  n = Math.floor(Math.abs(n));
  if (n === 0) return 'ноль';
  const parts: string[] = [];
  let i = 0;
  while (n > 0) {
    const tr = n % 1000;
    if (tr) {
      const [forms, fem] = RU_SCALES[i];
      parts.unshift(ruTriad(tr, fem) + (i ? ' ' + forms[ruPlural(tr)] : ''));
    }
    n = Math.floor(n / 1000);
    i++;
  }
  return parts.join(' ');
}

/** Money in Russian words, capitalised: "Пятьдесят миллионов сум", with тийин when present. */
export function moneyWordsRu(n: number): string {
  if (!isFinite(n)) return '';
  const whole = Math.floor(Math.abs(n));
  const tiyin = Math.round((Math.abs(n) - whole) * 100);
  let s = numWordsRu(whole) + ' сум';
  if (tiyin) s += ' ' + numWordsRu(tiyin) + ' тийин';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const MONTHS_RU = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

/** "2026-10-01" → «01» октября 2026 г. */
export function fmtDateRu(s: string): string {
  const p = parseDate(s);
  return p ? `«${String(p.d).padStart(2, '0')}» ${MONTHS_RU[p.m - 1]} ${p.y} г.` : '';
}
