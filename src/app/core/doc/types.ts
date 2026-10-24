export type UiLang = 'uz' | 'ru' | 'en';
/** Document output: Uzbek Cyrillic, Uzbek Latin, or Russian (for templates that have a Russian version). */
export type Script = 'cyr' | 'lat' | 'ru';
export type DocLang = 'uz' | 'ru';

/** A UI string in the three interface languages. */
export interface Tr { uz: string; ru: string; en: string; }

export type FieldType = 'text' | 'textarea' | 'date' | 'money' | 'number' | 'select' | 'rows' | 'image';

export interface RowColumn { k: string; l: Tr; num?: boolean; /** multi-line, full row width */ area?: boolean; }

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

export type CategoryId = 'contracts' | 'applications' | 'hr' | 'notarial' | 'court' | 'corporate';

export interface DocTemplate {
  id: string;
  cat: CategoryId;
  /** subcategory id — see CATEGORIES[].subs in templates/shared.ts */
  sub: string;
  title: Tr;
  desc: Tr;
  /** document title as printed (Uzbek Cyrillic) */
  docTitle: string;
  minutes: number;
  fields: FieldDef[];
  render: (c: import('./engine').Ctx) => string;
  /** Russian version of the document (optional; templates without it fall back to Uzbek Cyrillic). */
  ru?: RuVersion;
  /** Word export: file name without extension (default: `${id}-${script}`) */
  fileName?: (v: Values) => string;
  /** Word export: @page margins and base font override */
  wordCss?: string;
}

export interface RuVersion {
  docTitle: string;
  render: (c: import('./engine').Ctx) => string;
  /** Russian example values that replace the automatically converted ones */
  ex?: Values;
  /** Russian wording for select options, index-aligned with FieldDef.opts */
  opts?: Record<string, string[]>;
}
