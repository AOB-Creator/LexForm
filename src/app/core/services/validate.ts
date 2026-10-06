import { DictKey } from '../i18n/dictionary';

const digits = (v: string) => v.replace(/[\s-]/g, '');

/** Light format checks for common Uzbek identifiers, chosen by field key. Returns a warning key or null. */
export function fieldWarning(key: string, value: string, companyAccount: boolean): DictKey | null {
  const v = value.trim();
  if (!v) return null;
  const k = key.toLowerCase();
  if (k === 'stir' || k.endsWith('_stir')) return /^\d{9}$/.test(digits(v)) ? null : 'val.stir';
  if (k === 'pinfl' || k.endsWith('_pinfl')) return /^\d{14}$/.test(digits(v)) ? null : 'val.pinfl';
  if (k === 'mfo' || k.endsWith('_mfo')) return /^\d{5}$/.test(digits(v)) ? null : 'val.mfo';
  if (k === 'phone' || k.endsWith('_phone')) {
    const d = v.replace(/\D/g, '');
    return d.length === 9 || (d.length === 12 && d.startsWith('998')) ? null : 'val.phone';
  }
  if (k.endsWith('_pass')) return /^[A-ZА-Я]{2}\s?\d{7}/i.test(v) ? null : 'val.pass';
  if (companyAccount && k.endsWith('_acc')) return /^\d{20}$/.test(digits(v)) ? null : 'val.acc';
  return null;
}
