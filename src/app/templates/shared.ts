import { CategoryId, FieldDef, RowColumn, Tr } from '../core/doc/types';

export const tr = (uz: string, ru: string, en: string): Tr => ({ uz, ru, en });

export const CATEGORIES: { id: CategoryId; title: Tr; desc: Tr }[] = [
  { id: 'corporate', title: tr('Korporativ', 'Корпоративные', 'Corporate'), desc: tr('MChJ tashkil etish, qarorlar, bayonlar', 'Создание ООО, решения, протоколы', 'Company formation, decisions, minutes') },
  { id: 'hr', title: tr('Kadrlar', 'Кадры', 'HR'), desc: tr('Mehnat shartnomasi va buyruqlar', 'Трудовой договор и приказы', 'Employment contract and orders') },
  { id: 'contracts', title: tr('Shartnomalar', 'Договоры', 'Contracts'), desc: tr('Xizmat, oldi-sotdi, ijara, qarz', 'Услуги, купля-продажа, аренда, заём', 'Services, sale, lease, loans') },
  { id: 'acts', title: tr('Dalolatnoma va ishonchnomalar', 'Акты и доверенности', 'Acts & powers of attorney'), desc: tr('Bajarilgan ishlar, topshirish, ishonchnoma', 'Выполненные работы, передача, доверенность', 'Completed works, handover, power of attorney') },
];

/** Form section headings. */
export const GROUPS: Record<string, Tr> = {
  doc: tr('Hujjat', 'Документ', 'Document'),
  company: tr('Jamiyat', 'Общество', 'Company'),
  founder: tr('Taʼsischi', 'Учредитель', 'Founder'),
  director: tr('Direktor', 'Директор', 'Director'),
  meeting: tr('Yigʻilish', 'Собрание', 'Meeting'),
  decision: tr('Qaror', 'Решение', 'Decision'),
  address: tr('Manzil', 'Адрес', 'Address'),
  property: tr('Mulk roʻyxati', 'Перечень имущества', 'Property list'),
  result: tr('Moliyaviy natija', 'Финансовый результат', 'Financial result'),
  participants: tr('Ishtirokchilar', 'Участники', 'Participants'),
  employer: tr('Ish beruvchi', 'Работодатель', 'Employer'),
  employee: tr('Xodim', 'Работник', 'Employee'),
  terms: tr('Shartlar', 'Условия', 'Terms'),
  staffing: tr('Shtat jadvali', 'Штатное расписание', 'Staffing table'),
  customer: tr('Buyurtmachi', 'Заказчик', 'Customer'),
  executor: tr('Ijrochi', 'Исполнитель', 'Contractor'),
  seller: tr('Sotuvchi', 'Продавец', 'Seller'),
  buyer: tr('Xaridor', 'Покупатель', 'Buyer'),
  lessor: tr('Ijaraga beruvchi', 'Арендодатель', 'Lessor'),
  lessee: tr('Ijarachi', 'Арендатор', 'Lessee'),
  object: tr('Ijara obyekti', 'Объект аренды', 'Leased premises'),
  lender: tr('Qarz beruvchi', 'Займодавец', 'Lender'),
  borrower: tr('Qarz oluvchi', 'Заёмщик', 'Borrower'),
  items: tr('Tovar va xizmatlar', 'Товары и услуги', 'Goods & services'),
  payment: tr('Toʻlov va muddatlar', 'Оплата и сроки', 'Payment & deadlines'),
  contract: tr('Asosiy shartnoma', 'Основной договор', 'Main contract'),
  changes: tr('Oʻzgarishlar', 'Изменения', 'Changes'),
  party1: tr('1-tomon', 'Сторона 1', 'Party 1'),
  party2: tr('2-tomon', 'Сторона 2', 'Party 2'),
  principal: tr('Ishonch bildiruvchi', 'Доверитель', 'Principal'),
  agent: tr('Vakil', 'Представитель', 'Representative'),
  powers: tr('Vakolatlar', 'Полномочия', 'Powers'),
  sign: tr('Imzo', 'Подпись', 'Signature'),
  act: tr('Dalolatnoma', 'Акт', 'Act'),
  person: tr('Shaxsiy maʼlumotlar', 'Личные данные', 'Personal details'),
  education: tr('Maʼlumoti va unvonlar', 'Образование и звания', 'Education & titles'),
  career: tr('Mehnat faoliyati', 'Трудовая деятельность', 'Work history'),
  relatives: tr('Yaqin qarindoshlar', 'Близкие родственники', 'Close relatives'),
};

/** Common field labels. */
export const L = {
  number: tr('Raqami', 'Номер', 'Number'),
  date: tr('Sana', 'Дата', 'Date'),
  city: tr('Shahar / tuman', 'Город / район', 'City / district'),
  company: tr('Jamiyat nomi', 'Наименование общества', 'Company name'),
  fio: tr('F.I.Sh.', 'Ф.И.О.', 'Full name'),
  passport: tr('Pasport seriyasi va raqami', 'Серия и номер паспорта', 'Passport series and number'),
  passportBy: tr('Kim tomonidan berilgan', 'Кем выдан', 'Issued by'),
  passportDate: tr('Berilgan sana', 'Дата выдачи', 'Date of issue'),
  birth: tr('Tugʻilgan sana', 'Дата рождения', 'Date of birth'),
  addr: tr('Manzil', 'Адрес', 'Address'),
  phone: tr('Telefon', 'Телефон', 'Phone'),
  head: tr('Rahbar F.I.Sh.', 'Ф.И.О. руководителя', 'Head (full name)'),
  center: tr('Roʻyxatdan oʻtkazuvchi organ', 'Регистрирующий орган', 'Registering authority'),
  amount: tr('Summa (soʻm)', 'Сумма (сум)', 'Amount (UZS)'),
  position: tr('Lavozim', 'Должность', 'Position'),
};

export interface PartyExample { name: string; pos?: string; rep: string; basis?: string; stir: string; addr: string; acc: string; mfo: string; bank: string; phone: string; }

export function partyFields(pfx: string, g: string, ex: PartyExample): FieldDef[] {
  return [
    { k: pfx + '_name', g, l: tr('Tashkilot nomi', 'Наименование организации', 'Organisation name'), ex: ex.name },
    { k: pfx + '_pos', g, l: tr('Vakil lavozimi', 'Должность представителя', 'Signatory position'), ex: ex.pos ?? 'директор', half: true },
    { k: pfx + '_rep', g, l: tr('Vakil F.I.Sh.', 'Ф.И.О. представителя', 'Signatory full name'), ex: ex.rep, half: true },
    { k: pfx + '_basis', g, l: tr('Vakolat asosi', 'Основание полномочий', 'Acting under'), ex: ex.basis ?? 'Устав', half: true, hint: tr('Устав, Низом yoki ishonchnoma', 'Устав, положение или доверенность', 'Charter, regulation or power of attorney') },
    { k: pfx + '_stir', g, l: tr('STIR', 'ИНН', 'TIN'), ex: ex.stir, half: true },
    { k: pfx + '_addr', g, l: tr('Yuridik manzil', 'Юридический адрес', 'Registered address'), ex: ex.addr },
    { k: pfx + '_acc', g, l: tr('Hisob raqami', 'Расчётный счёт', 'Bank account'), ex: ex.acc, half: true },
    { k: pfx + '_mfo', g, l: tr('MFO', 'МФО', 'Bank code (MFO)'), ex: ex.mfo, half: true },
    { k: pfx + '_bank', g, l: tr('Bank', 'Банк', 'Bank'), ex: ex.bank },
    { k: pfx + '_phone', g, l: L.phone, ex: ex.phone, half: true },
  ];
}

// Fictional example parties — never real companies.
export const EX_A: PartyExample = {
  name: '«Намуна Савдо» МЧЖ', rep: 'Каримов Алишер Баҳромович', stir: '301234567',
  addr: 'Тошкент ш., Юнусобод тумани, Амир Темур кўчаси, 1-уй', acc: '2020 8000 1001 2345 6001', mfo: '00014',
  bank: '«Намуна банк» АТБ Юнусобод филиали', phone: '+998 71 200-00-00',
};
export const EX_B: PartyExample = {
  name: '«Мисол Хизмат» МЧЖ', rep: 'Раҳимова Дилноза Шавкатовна', stir: '302765432',
  addr: 'Тошкент ш., Чилонзор тумани, Бунёдкор шоҳ кўчаси, 10-уй', acc: '2020 8000 2002 6789 0001', mfo: '00873',
  bank: '«Мисол банк» АТБ Чилонзор филиали', phone: '+998 71 300-00-00',
};

export const ITEM_COLS: RowColumn[] = [
  { k: 'name', l: tr('Nomi', 'Наименование', 'Name') },
  { k: 'unit', l: tr('Oʻlchov birligi', 'Ед. изм.', 'Unit') },
  { k: 'qty', l: tr('Miqdori', 'Количество', 'Quantity'), num: true },
  { k: 'price', l: tr('Narxi', 'Цена', 'Price'), num: true },
];

export const STD_LIABILITY =
  '«Хўжалик юритувчи субъектлар фаолиятининг шартномавий-ҳуқуқий базаси тўғрисида»ги Қонун';
