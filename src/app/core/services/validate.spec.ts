import { describe, expect, it } from 'vitest';
import { fieldWarning } from './validate';

describe('fieldWarning', () => {
  it('accepts valid identifiers', () => {
    expect(fieldWarning('a_stir', '301 234 567', false)).toBeNull();
    expect(fieldWarning('w_pinfl', '31234567890123', false)).toBeNull();
    expect(fieldWarning('s_mfo', '00014', false)).toBeNull();
    expect(fieldWarning('pl_phone', '+998 90 111-22-33', false)).toBeNull();
    expect(fieldWarning('pl_phone', '90 111 22 33', false)).toBeNull();
    expect(fieldWarning('ln_pass', 'AC 7654321, Миробод тумани ИИБ', false)).toBeNull();
    expect(fieldWarning('a_acc', '2020 8000 1001 2345 6001', true)).toBeNull();
  });
  it('flags malformed identifiers', () => {
    expect(fieldWarning('a_stir', '30123456', false)).toBe('val.stir');
    expect(fieldWarning('w_pinfl', '123', false)).toBe('val.pinfl');
    expect(fieldWarning('s_mfo', '014', false)).toBe('val.mfo');
    expect(fieldWarning('pl_phone', '12345', false)).toBe('val.phone');
    expect(fieldWarning('ln_pass', '7654321', false)).toBe('val.pass');
    expect(fieldWarning('a_acc', '2020 8000', true)).toBe('val.acc');
  });
  it('ignores empty values, card numbers and unrelated fields', () => {
    expect(fieldWarning('a_stir', '', false)).toBeNull();
    expect(fieldWarning('ln_acc', '8600 1234 5678 9012', false)).toBeNull();
    expect(fieldWarning('city', 'Тошкент', false)).toBeNull();
  });
});
