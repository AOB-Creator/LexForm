import { describe, expect, it } from 'vitest';
import { emptyValues, exampleValues, TEMPLATES } from '../../templates';
import { CATEGORIES, GROUPS } from '../../templates/shared';
import { ruExample } from '../../templates/ru/examples';
import { Ctx, renderTemplate } from './engine';
import { fmtDate, fmtDateRu, fmtMoney, moneyWords, moneyWordsRu, numWordsRu } from './format';
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

describe('templates escape user input', () => {
  const evil = '<img src=x onerror=alert(1)>';
  for (const t of TEMPLATES) {
    it(`${t.id} never emits raw HTML from field values`, () => {
      const v = exampleValues(t);
      for (const f of t.fields) {
        if (f.t === 'image' || f.t === 'select' || f.t === 'date' || f.t === 'money' || f.t === 'number') continue;
        if (f.t === 'rows') v[f.k] = [Object.fromEntries((f.cols ?? []).map(col => [col.k, col.num ? '1' : evil]))];
        else v[f.k] = evil;
      }
      for (const s of ['cyr', 'lat', 'ru'] as const) {
        const html = renderTemplate(t, v, s);
        expect(html, `${t.id}/${s}`).not.toContain('<img src=x');
      }
    });
  }
});

describe('Russian output', () => {
  it('writes money in Russian words with correct forms', () => {
    expect(numWordsRu(1)).toBe('один');
    expect(numWordsRu(21000)).toBe('двадцать одна тысяча');
    expect(numWordsRu(2000000)).toBe('два миллиона');
    expect(numWordsRu(5014)).toBe('пять тысяч четырнадцать');
    expect(numWordsRu(1464000)).toBe('один миллион четыреста шестьдесят четыре тысячи');
    expect(moneyWordsRu(20500000)).toBe('Двадцать миллионов пятьсот тысяч сум');
    expect(moneyWordsRu(12.5)).toBe('Двенадцать сум пятьдесят тийин');
    expect(fmtDateRu('2026-10-06')).toBe('«06» октября 2026 г.');
  });

  const ruTemplates = TEMPLATES.filter(t => t.ru);
  it('has a first batch of Russian versions', () => expect(ruTemplates.length).toBeGreaterThanOrEqual(25));

  for (const t of ruTemplates) {
    it(`${t.id}: Russian option lists match the Uzbek ones`, () => {
      for (const [k, list] of Object.entries(t.ru!.opts ?? {})) {
        const f = t.fields.find(x => x.k === k);
        expect(f?.opts, `${t.id}.${k}`).toBeTruthy();
        expect(list.length, `${t.id}.${k}`).toBe(f!.opts!.length);
      }
    });
    it(`${t.id}: Russian text renders cleanly and contains no Uzbek-only letters`, () => {
      for (const v of [exampleValues(t), emptyValues(t)]) {
        const html = renderTemplate(t, v, 'ru');
        expect(html).not.toMatch(/undefined|NaN|\[object/);
      }
      // with empty values every word on the page comes from the template itself
      const empty = renderTemplate(t, emptyValues(t), 'ru').replace(/<[^>]+>/g, ' ');
      expect(empty, t.id).not.toMatch(/[ўқғҳЎҚҒҲ]/);
    });
    it(`${t.id}: select values are translated`, () => {
      const v = exampleValues(t);
      const html = renderTemplate(t, v, 'ru');
      for (const [k, list] of Object.entries(t.ru!.opts ?? {})) {
        const f = t.fields.find(x => x.k === k)!;
        const i = f.opts!.indexOf(String(v[k]));
        if (i >= 0 && html.includes(String(v[k])) && !list[i].includes(String(v[k]))) throw new Error(`${t.id}.${k} left untranslated`);
      }
    });
  }

  it('Russian example values carry no Uzbek-only letters', () => {
    for (const t of ruTemplates) {
      const v = exampleValues(t, 'ru');
      for (const f of t.fields) {
        if (f.t === 'select' || f.t === 'image') continue;
        expect(JSON.stringify(v[f.k]), `${t.id}.${f.k}`).not.toMatch(/[ўқғҳЎҚҒҲ]/);
      }
      expect(renderTemplate(t, v, 'ru'), t.id).not.toMatch(/[ўқғҳЎҚҒҲ]/);
    }
  });

  it('converts common example values', () => {
    expect(ruExample('«Намуна Савдо» МЧЖ')).toBe('ООО «Намуна Савдо»');
    expect(ruExample('Тошкент ш., Юнусобод тумани, Амир Темур кўчаси, 1-уй')).toBe('г. Ташкент, Юнусабадский район, ул. Амир Темур, д. 1');
    expect(ruExample('Чилонзор тумани ИИБ, 12.08.2018')).toBe('ОВД Чиланзарского района, 12.08.2018');
    expect(ruExample('Каримов Алишер Баҳромович')).toBe('Каримов Алишер Бахромович');
    expect(ruExample('«Намуна банк» АТБ Юнусобод филиали')).toBe('Юнусабадский филиал АКБ «Намуна банк»');
  });

  it('falls back to Uzbek Cyrillic when no Russian version exists', () => {
    const t = TEMPLATES.find(x => !x.ru)!;
    expect(renderTemplate(t, exampleValues(t), 'ru')).toBe(renderTemplate(t, exampleValues(t), 'cyr'));
  });
});
