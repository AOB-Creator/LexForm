/**
 * Uzbek Cyrillic → Uzbek Latin transliteration (official alphabet, 1995, with ʻ U+02BB and ʼ U+02BC).
 *
 * Rules that depend on position:
 *  - е → "ye" at the start of a word or after a vowel / ъ / ь, otherwise "e"
 *  - ц → "ts" after a vowel, otherwise "s"
 *  - multi-letter results keep title case ("Ш" + lowercase → "Sh") or full upper case inside all-caps words ("ШАРТНОМА" → "SHARTNOMA")
 *  - the abbreviation МЧЖ is written MChJ by convention
 */

const MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ц: 's', ж: 'j', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'x', ч: 'ch', ш: 'sh', щ: 'sh',
  ъ: 'ʼ', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya', ў: 'oʻ', қ: 'q', ғ: 'gʻ', ҳ: 'h',
};
const VOWELS = new Set('аеёиоуэюяўАЕЁИОУЭЮЯЎ');
const CYR = /[а-яёўқғҳА-ЯЁЎҚҒҲ]/;

function isUpper(ch: string): boolean {
  return ch !== ch.toLowerCase() && ch === ch.toUpperCase();
}

function translitWord(word: string): string {
  if (word === 'МЧЖ') return 'MChJ';
  const letters = [...word];
  const allCaps = letters.filter(c => CYR.test(c)).length > 1 && letters.every(c => !CYR.test(c) || isUpper(c));
  let out = '';
  for (let i = 0; i < letters.length; i++) {
    const ch = letters[i];
    const lower = ch.toLowerCase();
    if (!(lower in MAP)) { out += ch; continue; }
    const prev = i > 0 ? letters[i - 1] : '';
    let lat: string;
    if (lower === 'е') {
      lat = !prev || !CYR.test(prev) || VOWELS.has(prev) || prev.toLowerCase() === 'ъ' || prev.toLowerCase() === 'ь' ? 'ye' : 'e';
    } else if (lower === 'ц') {
      lat = prev && VOWELS.has(prev) ? 'ts' : 's';
    } else {
      lat = MAP[lower];
    }
    if (isUpper(ch) && lat) {
      lat = allCaps ? lat.toUpperCase() : lat.charAt(0).toUpperCase() + lat.slice(1);
    }
    out += lat;
  }
  return out;
}

/** Transliterate plain text. */
export function cyrToLat(text: string): string {
  return text.replace(/[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳ]+/g, w => (CYR.test(w) ? translitWord(w) : w));
}

/** Transliterate only the text nodes of an HTML string (tags and attributes stay untouched). */
export function cyrToLatHtml(html: string): string {
  return html.replace(/(^|>)([^<]+)/g, (_m, gt: string, text: string) => gt + cyrToLat(text));
}
