import { DocTemplate, FieldDef, Values } from '../core/doc/types';
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

export const TEMPLATES: DocTemplate[] = [...CONTRACTS, ...MORE_CONTRACTS, ...APPLICATIONS, ...HR_REQUESTS, ...HR, ...MORE_HR, ...NOTARIAL, ...MORE_NOTARIAL, ...COURT, ...MORE_COURT, ...CORPORATE, ...MORE_CORPORATE, ...ACTS];

export function findTemplate(id: string): DocTemplate | undefined {
  return TEMPLATES.find(t => t.id === id);
}

export function exampleValues(t: DocTemplate): Values {
  const v: Values = {};
  t.fields.forEach((f: FieldDef) => {
    v[f.k] = Array.isArray(f.ex) ? f.ex.map(r => ({ ...r })) : (f.ex ?? (f.t === 'select' && f.opts ? f.opts[0] : ''));
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
