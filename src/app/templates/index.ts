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
import { BATCH3_CONTRACTS } from './batch3-contracts';
import { BATCH3_CORPORATE, BATCH3_COURT, BATCH3_NOTARIAL } from './batch3-legal';
import { BATCH3_APPLICATIONS, BATCH3_HR } from './batch3-people';
import { BATCH4_CONTRACTS } from './batch4-contracts';
import { BATCH4_CORPORATE, BATCH4_COURT, BATCH4_NOTARIAL } from './batch4-legal';
import { BATCH4_APPLICATIONS, BATCH4_HR } from './batch4-people';

export const TEMPLATES: DocTemplate[] = [...CONTRACTS, ...MORE_CONTRACTS, ...BATCH3_CONTRACTS, ...BATCH4_CONTRACTS, ...APPLICATIONS, ...BATCH3_APPLICATIONS, ...BATCH4_APPLICATIONS, ...HR_REQUESTS, ...HR, ...MORE_HR, ...BATCH3_HR, ...BATCH4_HR, ...NOTARIAL, ...MORE_NOTARIAL, ...BATCH3_NOTARIAL, ...BATCH4_NOTARIAL, ...COURT, ...MORE_COURT, ...BATCH3_COURT, ...BATCH4_COURT, ...CORPORATE, ...MORE_CORPORATE, ...BATCH3_CORPORATE, ...BATCH4_CORPORATE, ...ACTS];

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
