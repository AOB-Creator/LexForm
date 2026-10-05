import { Tr } from '../doc/types';

const t = (uz: string, ru: string, en: string): Tr => ({ uz, ru, en });

/** Interface strings. Documents themselves are always Uzbek (Cyrillic or Latin). */
export const DICT = {
  'app.tagline': t('Oʻzbekiston uchun yuridik hujjatlar', 'Юридические документы для Узбекистана', 'Legal documents for Uzbekistan'),
  'nav.templates': t('Shablonlar', 'Шаблоны', 'Templates'),
  'nav.how': t('Qanday ishlaydi', 'Как это работает', 'How it works'),
  'theme.toggle': t('Mavzuni almashtirish', 'Сменить тему', 'Toggle theme'),
  'lang.label': t('Interfeys tili', 'Язык интерфейса', 'Interface language'),

  'hero.kicker': t('Qarorlar · buyruqlar · shartnomalar', 'Решения · приказы · договоры', 'Decisions · orders · contracts'),
  'hero.title': t('Yuridik hujjatni forma orqali tayyorlang', 'Готовьте юридический документ через форму', 'Draft legal documents by filling a form'),
  'hero.lead': t(
    'Maydonlarni toʻldiring — hujjat A4 varaqda darhol shakllanadi. Summalar soʻz bilan yoziladi, sanalar rasmiy uslubda, yozuvni kirill va lotin oʻrtasida bir tugma bilan almashtirasiz.',
    'Заполните поля — документ сразу собирается на листе A4. Суммы прописью, даты в официальном стиле, кириллица и латиница переключаются одной кнопкой.',
    'Fill in the fields and the document assembles on an A4 sheet as you type. Amounts are written in words, dates in official style, and one switch toggles Cyrillic and Latin script.'),
  'hero.cta': t('Shablon tanlash', 'Выбрать шаблон', 'Choose a template'),
  'hero.try': t('MChJ tashkil etishdan boshlash', 'Начать с создания ООО', 'Start with forming an LLC'),
  'stat.templates': t('shablon', 'шаблонов', 'templates'),
  'stat.scripts': t('yozuv: kirill va lotin', 'письменности: кириллица и латиница', 'scripts: Cyrillic and Latin'),
  'stat.ui': t('interfeys tili', 'языка интерфейса', 'interface languages'),
  'hero.sheet': t('Jonli koʻrinish', 'Живой предпросмотр', 'Live preview'),

  'list.title': t('Hujjat shablonlari', 'Шаблоны документов', 'Document templates'),
  'list.search': t('Shablon qidirish…', 'Поиск шаблона…', 'Search templates…'),
  'list.all': t('Barchasi', 'Все', 'All'),
  'list.empty': t('Hech narsa topilmadi. Boshqa soʻz bilan qidirib koʻring.', 'Ничего не найдено. Попробуйте другое слово.', 'Nothing found. Try a different word.'),
  'list.minutes': t('daq.', 'мин', 'min'),
  'list.fields': t('maydon', 'полей', 'fields'),
  'list.open': t('Ochish', 'Открыть', 'Open'),
  'list.draft': t('Qoralama bor', 'Есть черновик', 'Draft saved'),

  'how.title': t('Qanday ishlaydi', 'Как это работает', 'How it works'),
  'how.1.t': t('Shablonni tanlang', 'Выберите шаблон', 'Pick a template'),
  'how.1.d': t('Shartnoma, ariza, daʼvo, vasiyatnoma yoki buyruq — 6 boʻlimdagi tayyor hujjatlar.', 'Договор, заявление, иск, завещание или приказ — готовые документы в 6 разделах.', 'Contract, application, claim, will or order — ready documents in 6 sections.'),
  'how.2.t': t('Formani toʻldiring', 'Заполните форму', 'Fill in the form'),
  'how.2.d': t('Jadval, foiz va jami summalar avtomatik hisoblanadi; boʻsh maydon chiziq boʻlib qoladi.', 'Таблицы, проценты и итоги считаются сами; пустое поле остаётся линией.', 'Tables, percentages and totals are calculated; empty fields stay as lines.'),
  'how.3.t': t('Yuklab oling', 'Скачайте', 'Download'),
  'how.3.d': t('Word (.doc) fayl, chop etish yoki PDF — kirill yoki lotin yozuvida.', 'Файл Word (.doc), печать или PDF — кириллицей или латиницей.', 'Word (.doc), print or PDF — in Cyrillic or Latin script.'),

  'foot.dev': t('Ishlab chiquvchi:', 'Разработано', 'Developed by'),
  'foot.note': t(
    'Shablonlar namunaviy. Muhim hujjatlarni imzolashdan oldin yurist bilan tekshiring.',
    'Шаблоны типовые. Перед подписанием важных документов проконсультируйтесь с юристом.',
    'Templates are model forms. Have important documents checked by a lawyer before signing.'),

  'ed.back': t('Barcha shablonlar', 'Все шаблоны', 'All templates'),
  'ed.script': t('Hujjat yozuvi', 'Письменность документа', 'Document script'),
  'ed.cyr': t('Кирилл', 'Кирилл', 'Кирилл'),
  'ed.lat': t('Lotin', 'Lotin', 'Lotin'),
  'ed.example': t('Namuna bilan toʻldirish', 'Заполнить примером', 'Fill with example'),
  'ed.clear': t('Tozalash', 'Очистить', 'Clear'),
  'ed.copy': t('Nusxalash', 'Копировать', 'Copy'),
  'ed.doc': t('Word (.doc)', 'Word (.doc)', 'Word (.doc)'),
  'ed.print': t('Chop etish / PDF', 'Печать / PDF', 'Print / PDF'),
  'ed.marks': t('Kiritilgan qiymatlarni belgilash', 'Подсвечивать введённые значения', 'Highlight entered values'),
  'ed.progress': t('toʻldirildi', 'заполнено', 'filled'),
  'ed.saved': t('Qoralama shu brauzerda saqlanadi', 'Черновик сохраняется в этом браузере', 'Draft is saved in this browser'),
  'ed.exampleNote': t('Forma toʻqima namunaviy maʼlumotlar bilan toʻldirilgan — oʻzingiznikiga almashtiring.', 'Форма заполнена вымышленными примерами — замените своими данными.', 'The form holds fictional example data — replace it with yours.'),
  'ed.cleared': t('Forma tozalandi. Boʻsh joylar hujjatda chiziq boʻlib chiqadi.', 'Форма очищена. Пустые места в документе остаются линиями.', 'Form cleared. Empty places print as lines.'),
  'ed.tabForm': t('Forma', 'Форма', 'Form'),
  'ed.tabDoc': t('Hujjat', 'Документ', 'Document'),
  'ed.addRow': t('Qator qoʻshish', 'Добавить строку', 'Add row'),
  'ed.upload': t('Rasm yuklash', 'Загрузить фото', 'Upload photo'),
  'ed.replace': t('Almashtirish', 'Заменить', 'Replace'),
  'ed.uploadHint': t('JPG yoki PNG, 3×4 nisbatda avtomatik kesiladi', 'JPG или PNG, автоматически обрезается до 3×4', 'JPG or PNG, auto-cropped to 3×4'),
  'ed.uploadError': t('Rasmni oʻqib boʻlmadi', 'Не удалось прочитать изображение', 'Could not read the image'),
  'ed.removeRow': t('Oʻchirish', 'Удалить', 'Remove'),
  'ed.copied': t('Nusxalandi — Word yoki Google Docs’ga qoʻying', 'Скопировано — вставьте в Word или Google Docs', 'Copied — paste into Word or Google Docs'),
  'ed.copiedText': t('Matn nusxalandi', 'Текст скопирован', 'Text copied'),
  'ed.selected': t('Hujjat belgilandi — Ctrl+C bosing', 'Документ выделен — нажмите Ctrl+C', 'Document selected — press Ctrl+C'),
  'ed.downloaded': t('Fayl yuklab olindi', 'Файл скачан', 'File downloaded'),
  'ed.docLang': t('Hujjat oʻzbek tilida tuziladi', 'Документ составляется на узбекском языке', 'The document is drafted in Uzbek'),
  'ed.latinNote': t('Lotin yozuvida kirillcha kiritilgan qiymatlar ham avtomatik oʻgiriladi.', 'В латинице введённые кириллицей значения тоже транслитерируются.', 'In Latin mode, values typed in Cyrillic are transliterated too.'),
  'ed.notFound': t('Bunday shablon topilmadi.', 'Такой шаблон не найден.', 'Template not found.'),
  'ed.rows': t('qator', 'строк', 'rows'),
  'ed.sum': t('Jami', 'Итого', 'Total'),
} satisfies Record<string, Tr>;

export type DictKey = keyof typeof DICT;
