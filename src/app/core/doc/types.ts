export type UiLang = 'uz' | 'ru' | 'en';
export type Script = 'cyr' | 'lat';

/** A UI string in the three interface languages. */
export interface Tr { uz: string; ru: string; en: string; }

export type FieldType = 'text' | 'textarea' | 'date' | 'money' | 'number' | 'select' | 'rows' | 'image';

export interface RowColumn { k: string; l: Tr; num?: boolean; }

export interface FieldDef {
  k: string;
  l: Tr;
  t?: FieldType;
  /** group key — see GROUPS in templates/shared.ts */
  g: string;
  /** example value (fictional); arrays for `rows` */
  ex?: string | Record<string, string>[];
  /** select options — document values in Uzbek Cyrillic */
  opts?: string[];
  cols?: RowColumn[];
  half?: boolean;
  hint?: Tr;
}

export type RowValue = Record<string, string>;
export type Values = Record<string, string | RowValue[]>;

export type CategoryId = 'corporate' | 'hr' | 'contracts' | 'acts';

export interface DocTemplate {
  id: string;
  cat: CategoryId;
  title: Tr;
  desc: Tr;
  /** document title as printed (Uzbek Cyrillic) */
  docTitle: string;
  minutes: number;
  fields: FieldDef[];
  render: (c: import('./engine').Ctx) => string;
  /** Word export: file name without extension (default: `${id}-${script}`) */
  fileName?: (v: Values) => string;
  /** Word export: @page margins and base font override */
  wordCss?: string;
}
