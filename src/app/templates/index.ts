import { DocTemplate, FieldDef, Values } from '../core/doc/types';
import { RU } from './ru';
import { ruExample } from './ru/examples';
import { ACTS } from './acts';
import { APPLICATIONS } from './applications';
import { CONTRACTS } from './contracts';
import { CORPORATE } from './corporate';
import { COURT } from './court';
import { HR } from './hr';
import { HR_REQUESTS } from './hr-requests';
import { NOTARIAL } from './notarial';
import { MORE_CONTRACTS } from './more-contracts';
import { MORE_HR } from './more-hr';
import { MORE_CORPORATE, MORE_COURT, MORE_NOTARIAL } from './more-legal';
import { BATCH3_CONTRACTS } from './batch3-contracts';
import { BATCH3_CORPORATE, BATCH3_COURT, BATCH3_NOTARIAL } from './batch3-legal';
import { BATCH3_APPLICATIONS, BATCH3_HR } from './batch3-people';
import { BATCH4_CONTRACTS } from './batch4-contracts';
import { BATCH4_CORPORATE, BATCH4_COURT, BATCH4_NOTARIAL } from './batch4-legal';
import { BATCH4_APPLICATIONS, BATCH4_HR } from './batch4-people';

export const TEMPLATES: DocTemplate[] = [...CONTRACTS, ...MORE_CONTRACTS, ...BATCH3_CONTRACTS, ...BATCH4_CONTRACTS, ...APPLICATIONS, ...BATCH3_APPLICATIONS, ...BATCH4_APPLICATIONS, ...HR_REQUESTS, ...HR, ...MORE_HR, ...BATCH3_HR, ...BATCH4_HR, ...NOTARIAL, ...MORE_NOTARIAL, ...BATCH3_NOTARIAL, ...BATCH4_NOTARIAL, ...COURT, ...MORE_COURT, ...BATCH3_COURT, ...BATCH4_COURT, ...CORPORATE, ...MORE_CORPORATE, ...BATCH3_CORPORATE, ...BATCH4_CORPORATE, ...ACTS];

// attach Russian versions where available
for (const t of TEMPLATES) if (RU[t.id]) t.ru = RU[t.id];

export function findTemplate(id: string): DocTemplate | undefined {
  return TEMPLATES.find(t => t.id === id);
}

export function exampleValues(t: DocTemplate, lang: 'uz' | 'ru' = 'uz'): Values {
  const v: Values = {};
  // Russian examples only make sense for templates with a Russian version; select values stay Uzbek (they are mapped at render time)
  const conv = lang === 'ru' && t.ru ? ruExample : (s: string) => s;
  t.fields.forEach((f: FieldDef) => {
    const own = lang === 'ru' ? t.ru?.ex?.[f.k] : undefined;
    if (own !== undefined) v[f.k] = Array.isArray(own) ? own.map(r => ({ ...r })) : own;
    else if (Array.isArray(f.ex)) v[f.k] = f.ex.map(r => Object.fromEntries(Object.entries(r).map(([k, x]) => [k, conv(x)])));
    else if (f.t === 'select') v[f.k] = f.ex ?? (f.opts ? f.opts[0] : '');
    else v[f.k] = f.ex === undefined ? '' : conv(f.ex);
  });
  return v;
}

export function emptyValues(t: DocTemplate): Values {
  const v: Values = {};
  t.fields.forEach(f => { v[f.k] = f.t === 'rows' ? [] : f.t === 'select' && f.opts ? f.opts[0] : ''; });
  return v;
}

/** Share of filled scalar fields + non-empty tables (0–1). */
export function completion(t: DocTemplate, v: Values): number {
  let n = 0, filled = 0;
  for (const f of t.fields) {
    n++;
    const x = v[f.k];
    if (Array.isArray(x) ? x.length > 0 : typeof x === 'string' && x.trim() !== '') filled++;
  }
  return n ? filled / n : 0;
}
