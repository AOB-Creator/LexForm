import { describe, expect, it } from 'vitest';
import { emptyValues, exampleValues, TEMPLATES } from '../../templates';
import { CATEGORIES, GROUPS } from '../../templates/shared';
import { Ctx, renderTemplate } from './engine';
import { fmtDate, fmtMoney, moneyWords } from './format';
import { cyrToLat, cyrToLatHtml } from './translit';

describe('money words (Uzbek Cyrillic)', () => {
  it.each([
    [0, 'Нол сўм'],
    [100, 'Бир юз сўм'],
    [21000, 'Йигирма бир минг сўм'],
    [50000000, 'Эллик миллион сўм'],
    [1464000000, 'Бир миллиард тўрт юз олтмиш тўрт миллион сўм'],
    [5735775.93, 'Беш миллион етти юз ўттиз беш минг етти юз етмиш беш сўм тўқсон уч тийин'],
  ])('%d', (n, words) => expect(moneyWords(n)).toBe(words));

  it('formats digits with spaces', () => expect(fmtMoney(1234567.5)).toBe('1 234 567,50'));
  it('formats official dates', () => expect(fmtDate('2026-10-01')).toBe('«01» октябрь 2026 йил'));
});

describe('Cyrillic → Latin', () => {
  it.each([
    ['Эллик миллион сўм', 'Ellik million soʻm'],
    ['ҚАРОР ҚИЛАМАН', 'QAROR QILAMAN'],
    ['Шартнома', 'Shartnoma'],
    ['ШАРТНОМА', 'SHARTNOMA'],
    ['МЧЖ', 'MChJ'],
    ['Ёзув столи', 'Yozuv stoli'],
    ['ер, Енгиш, бериш', 'yer, Yengish, berish'],
    ['маъсулият', 'maʼsuliyat'],
    ['ғазначилик, ҳисоб, тўққиз', 'gʻaznachilik, hisob, toʻqqiz'],
    ['октябрь, сентябрь', 'oktyabr, sentyabr'],
    ['концерн, акция', 'konsern, aksiya'],
    ['AA 1234567 Тошкент', 'AA 1234567 Toshkent'],
  ])('%s', (cyr, lat) => expect(cyrToLat(cyr)).toBe(lat));

  it('keeps HTML tags untouched', () =>
    expect(cyrToLatHtml('<p class="c">Буйруқ <b>№ 1</b></p>')).toBe('<p class="c">Buyruq <b>№ 1</b></p>'));
});

describe('templates', () => {
  it('have unique ids', () => expect(new Set(TEMPLATES.map(t => t.id)).size).toBe(TEMPLATES.length));

  for (const t of TEMPLATES) {
    describe(t.id, () => {
      it('labels exist in all three UI languages', () => {
        for (const f of t.fields) expect(f.l.uz && f.l.ru && f.l.en, f.k).toBeTruthy();
        expect(t.title.uz && t.title.ru && t.title.en).toBeTruthy();
      });
      for (const script of ['cyr', 'lat'] as const) {
        it(`renders example and empty data (${script})`, () => {
          for (const v of [exampleValues(t), emptyValues(t)]) {
            const html = renderTemplate(t, v, script);
            expect(html).not.toMatch(/undefined|NaN|\[object/);
            if (script === 'lat') expect(html.replace(/<[^>]+>/g, '')).not.toMatch(/[а-яёўқғҳА-ЯЁЎҚҒҲ]/);
          }
        });
      }
    });
  }
});

describe('Ctx.img', () => {
  const png = 'data:image/png;base64,iVBORw0KGgo=';
  it('renders an uploaded image', () => {
    expect(new Ctx({ p: png }).img('p', 'X')).toBe(`<img src="${png}" alt="">`);
  });
  it('falls back to the placeholder for empty or unsafe values', () => {
    expect(new Ctx({}).img('p', 'X')).toBe('X');
    expect(new Ctx({ p: 'javascript:alert(1)' }).img('p', 'X')).toBe('X');
    expect(new Ctx({ p: 'data:image/png;base64,abc" onerror="x' }).img('p', 'X')).toBe('X');
  });
});

describe('catalogue structure', () => {
  it('every template sits in an existing category and subcategory', () => {
    for (const t of TEMPLATES) {
      const cat = CATEGORIES.find(c => c.id === t.cat);
      expect(cat, t.id).toBeTruthy();
      expect(cat!.subs.some(s => s.id === t.sub), `${t.id} → ${t.cat}/${t.sub}`).toBe(true);
    }
  });
  it('every subcategory has at least one template', () => {
    for (const c of CATEGORIES) for (const s of c.subs) {
      expect(TEMPLATES.some(t => t.cat === c.id && t.sub === s.id), `${c.id}/${s.id}`).toBe(true);
    }
  });
  it('every form group has a label', () => {
    for (const t of TEMPLATES) for (const f of t.fields) expect(GROUPS[f.g], `${t.id}.${f.k} → ${f.g}`).toBeTruthy();
  });
  it('field keys are unique within a template', () => {
    for (const t of TEMPLATES) expect(new Set(t.fields.map(f => f.k)).size, t.id).toBe(t.fields.length);
  });
});
