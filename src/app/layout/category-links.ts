import { CategoryId, Tr } from '../core/doc/types';

/** Category names for the site-wide footer (kept tiny so the shell does not pull in all templates). */
export const CATEGORY_LINKS: { id: CategoryId; title: Tr }[] = [
  { id: 'contracts', title: { uz: 'Shartnomalar', ru: 'Договоры', en: 'Contracts' } },
  { id: 'applications', title: { uz: 'Arizalar', ru: 'Заявления', en: 'Applications' } },
  { id: 'hr', title: { uz: 'Shaxsiy tarkib', ru: 'Кадровые документы', en: 'Personnel' } },
  { id: 'notarial', title: { uz: 'Notarial hujjatlar', ru: 'Нотариальные документы', en: 'Notarial' } },
  { id: 'court', title: { uz: 'Sudga oid hujjatlar', ru: 'Судебные документы', en: 'Court' } },
  { id: 'corporate', title: { uz: 'Korporativ hujjatlar', ru: 'Корпоративные документы', en: 'Corporate' } },
];
