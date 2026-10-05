import { esc } from '../core/doc/format';
import { CategoryId, FieldDef, RowColumn, Tr } from '../core/doc/types';

export const tr = (uz: string, ru: string, en: string): Tr => ({ uz, ru, en });

export interface Category { id: CategoryId; title: Tr; desc: Tr; subs: { id: string; title: Tr }[] }

/** Catalogue structure (modelled on the sections of the Ministry of Justice yurxizmat.uz portal). */
export const CATEGORIES: Category[] = [
  { id: 'contracts', title: tr('Shartnomalar', 'Договоры', 'Contracts'), desc: tr('Xizmat, oldi-sotdi, ijara, avtotransport', 'Услуги, купля-продажа, аренда, автотранспорт', 'Services, sale, lease, vehicles'), subs: [
    { id: 'legal', title: tr('Yuridik shaxslar oʻrtasida', 'Между юрлицами', 'Between companies') },
    { id: 'realty', title: tr('Koʻchmas mulk', 'Недвижимость', 'Real estate') },
    { id: 'vehicle', title: tr('Avtotransport', 'Автотранспорт', 'Vehicles') },
    { id: 'individuals', title: tr('Jismoniy shaxslar bilan', 'С физлицами', 'With individuals') },
    { id: 'annex', title: tr('Dalolatnoma va kelishuvlar', 'Акты и соглашения', 'Acts & annexes') },
  ] },
  { id: 'applications', title: tr('Arizalar', 'Заявления', 'Applications'), desc: tr('Davlat organlari va tashkilotlarga murojaatlar', 'Обращения в госорганы и организации', 'Requests to authorities and organisations'), subs: [
    { id: 'legal', title: tr('Yuridik shaxslar', 'Юридические лица', 'Companies') },
    { id: 'individuals', title: tr('Jismoniy shaxslar', 'Физические лица', 'Individuals') },
    { id: 'children', title: tr('Bolalar boʻyicha', 'По детям', 'Children') },
  ] },
  { id: 'hr', title: tr('Shaxsiy tarkib', 'Кадровые документы', 'Personnel'), desc: tr('Xodim arizalari, buyruqlar, mehnat shartnomasi', 'Заявления работников, приказы, трудовой договор', 'Staff requests, orders, employment contract'), subs: [
    { id: 'applications', title: tr('Arizalar', 'Заявления', 'Requests') },
    { id: 'orders', title: tr('Buyruqlar', 'Приказы', 'Orders') },
    { id: 'contracts', title: tr('Mehnat shartnomalari', 'Трудовые договоры', 'Employment contracts') },
    { id: 'references', title: tr('Maʼlumotnomalar', 'Справки', 'References') },
    { id: 'notices', title: tr('Bildirishnomalar', 'Уведомления', 'Notices & memos') },
    { id: 'internal', title: tr('Ichki hujjatlar', 'Внутренние документы', 'Internal documents') },
  ] },
  { id: 'notarial', title: tr('Notarial hujjatlar', 'Нотариальные документы', 'Notarial'), desc: tr('Vasiyatnoma, ishonchnoma, hadya, meros', 'Завещание, доверенность, дарение, наследство', 'Wills, powers of attorney, gifts, inheritance'), subs: [
    { id: 'applications', title: tr('Arizalar', 'Заявления', 'Applications') },
    { id: 'wills', title: tr('Vasiyatnomalar', 'Завещания', 'Wills') },
    { id: 'poa', title: tr('Ishonchnomalar', 'Доверенности', 'Powers of attorney') },
    { id: 'contracts', title: tr('Shartnomalar', 'Договоры', 'Contracts') },
  ] },
  { id: 'court', title: tr('Sudga oid hujjatlar', 'Судебные документы', 'Court'), desc: tr('Daʼvo arizalari, sud buyrugʻi, shikoyatlar', 'Иски, судебный приказ, жалобы', 'Claims, court orders, appeals'), subs: [
    { id: 'claims', title: tr('Daʼvo arizalar', 'Исковые заявления', 'Statements of claim') },
    { id: 'applications', title: tr('Arizalar', 'Заявления', 'Applications') },
    { id: 'responses', title: tr('Eʼtirozlar va iltimosnomalar', 'Возражения и ходатайства', 'Objections & motions') },
    { id: 'appeals', title: tr('Apellyatsiya va kassatsiya', 'Апелляция и кассация', 'Appeals & cassation') },
  ] },
  { id: 'corporate', title: tr('Korporativ hujjatlar', 'Корпоративные документы', 'Corporate'), desc: tr('MChJ qarorlari, talabnomalar, ishonchnomalar', 'Решения ООО, претензии, доверенности', 'LLC decisions, claim letters, powers of attorney'), subs: [
    { id: 'decisions', title: tr('Qarorlar va bayonnomalar', 'Решения и протоколы', 'Decisions & minutes') },
    { id: 'claims', title: tr('Talabnomalar', 'Претензии', 'Claim letters') },
    { id: 'charters', title: tr('Ustavlar', 'Уставы', 'Charters') },
    { id: 'letters', title: tr('Maʼlumotnoma va xatlar', 'Справки и письма', 'References & letters') },
    { id: 'poa', title: tr('Ishonchnomalar', 'Доверенности', 'Powers of attorney') },
  ] },
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
  plaintiff: tr('Daʼvogar', 'Истец', 'Claimant'),
  defendant: tr('Javobgar', 'Ответчик', 'Defendant'),
  court: tr('Sud', 'Суд', 'Court'),
  claim: tr('Talab mazmuni', 'Суть требования', 'Claim'),
  children: tr('Bolalar', 'Дети', 'Children'),
  marriage: tr('Nikoh', 'Брак', 'Marriage'),
  debt: tr('Qarz', 'Долг', 'Debt'),
  applicant: tr('Ariza beruvchi', 'Заявитель', 'Applicant'),
  addressee: tr('Kimga', 'Адресат', 'Addressee'),
  request: tr('Murojaat mazmuni', 'Содержание обращения', 'Request'),
  testator: tr('Vasiyat qiluvchi', 'Завещатель', 'Testator'),
  heirs: tr('Merosxoʻrlar', 'Наследники', 'Heirs'),
  deceased: tr('Meros qoldiruvchi', 'Наследодатель', 'Deceased'),
  vehicle: tr('Avtotransport vositasi', 'Транспортное средство', 'Vehicle'),
  donor: tr('Hadya qiluvchi', 'Даритель', 'Donor'),
  donee: tr('Hadya oluvchi', 'Одаряемый', 'Donee'),
  gift: tr('Hadya predmeti', 'Предмет дарения', 'Gift'),
  child: tr('Bola', 'Ребёнок', 'Child'),
  parent: tr('Ota-ona', 'Родитель', 'Parent'),
  leave: tr('Taʼtil', 'Отпуск', 'Leave'),
  case: tr('Ish va qaror', 'Дело и решение', 'Case and decision'),
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

export const personCell = (c: import('../core/doc/engine').Ctx, pfx: string, role: string) =>
  `<b>«${role}»</b><br>${c.x(pfx, 20)}<br>Паспорт: ${c.x(pfx + '_pass', 18)}<br>Манзил: ${c.x(pfx + '_addr', 22)}<br>ЖШШИР: ${c.x(pfx + '_pinfl', 14)}<br>Ҳисоб/карта: ${c.x(pfx + '_acc', 18)}<br><br>____________ ${c.x(pfx, 14)}`;

export const personFields = (pfx: string, g: string, ex: { fio: string; pass: string; addr: string }): FieldDef[] => [
  { k: pfx, g, l: L.fio, ex: ex.fio },
  { k: pfx + '_pass', g, l: tr('Pasport (seriya, raqam, kim bergan, sana)', 'Паспорт (серия, номер, кем и когда выдан)', 'Passport (series, number, issuer, date)'), ex: ex.pass },
  { k: pfx + '_addr', g, l: L.addr, ex: ex.addr },
  { k: pfx + '_pinfl', g, l: tr('JShShIR', 'ПИНФЛ', 'Personal ID (PINFL)'), half: true },
  { k: pfx + '_acc', g, l: tr('Hisob yoki karta raqami', 'Счёт или номер карты', 'Account or card number'), half: true },
];

/** Right-hand addressee block of an application: «…га / …дан». */
export const addressee = (...lines: string[]) => `<div class="to">${lines.filter(Boolean).map(l => `<p>${l}</p>`).join('')}</div>`;

/** Date on the left, signature and name on the right. */
export const signLine = (c: import('../core/doc/engine').Ctx, dateKey: string, fioKey: string) =>
  `<table class="sig"><tr><td>${c.date(dateKey)}</td><td class="r">____________ ${c.x(fioKey, 18)}</td></tr></table>`;

/** Numbered list of attachments; extra lines from a textarea are appended. */
export const attachments = (c: import('../core/doc/engine').Ctx, fixed: string[], extraKey?: string) => {
  const extra = extraKey ? c.raw(extraKey).split('\n').map(s => s.trim()).filter(Boolean).map(s => c.span(esc(s))) : [];
  const all = [...fixed, ...extra];
  return all.length ? `<p><b>Илова:</b></p><ol>${all.map(i => `<li>${i}</li>`).join('')}</ol>` : '';
};

export const vehicleFields = (g: string): FieldDef[] => [
  { k: 'v_model', g, l: tr('Rusumi va modeli', 'Марка и модель', 'Make and model'), ex: 'Chevrolet Cobalt', half: true },
  { k: 'v_year', g, l: tr('Ishlab chiqarilgan yili', 'Год выпуска', 'Year of manufacture'), ex: '2021', half: true },
  { k: 'v_color', g, l: tr('Rangi', 'Цвет', 'Colour'), ex: 'оқ', half: true },
  { k: 'v_plate', g, l: tr('Davlat raqam belgisi', 'Госномер', 'Licence plate'), ex: '01 A 123 BC', half: true },
  { k: 'v_vin', g, l: tr('Kuzov (VIN) raqami', 'Номер кузова (VIN)', 'Body (VIN) number'), ex: 'XWBJA69V0MA000000', half: true },
  { k: 'v_engine', g, l: tr('Dvigatel raqami', 'Номер двигателя', 'Engine number'), ex: 'B15D2 000000', half: true },
  { k: 'v_doc', g, l: tr('Qayd etish guvohnomasi (seriya, raqam, sana)', 'Техпаспорт (серия, номер, дата)', 'Registration certificate (series, No., date)'), ex: 'AAF 0123456, 15.03.2021' },
];
export const vehicleText = (c: import('../core/doc/engine').Ctx) =>
  `${c.x('v_model', 14)} русумли, ${c.x('v_year', 4)} йилда ишлаб чиқарилган, ${c.x('v_color', 6)} рангли, давлат рақам белгиси ${c.x('v_plate', 10)}, кузов (VIN) рақами ${c.x('v_vin', 14)}, двигатель рақами ${c.x('v_engine', 10)} бўлган автотранспорт воситаси (қайд этиш гувоҳномаси: ${c.x('v_doc', 16)})`;

export const ITEM_COLS: RowColumn[] = [
  { k: 'name', l: tr('Nomi', 'Наименование', 'Name') },
  { k: 'unit', l: tr('Oʻlchov birligi', 'Ед. изм.', 'Unit') },
  { k: 'qty', l: tr('Miqdori', 'Количество', 'Quantity'), num: true },
  { k: 'price', l: tr('Narxi', 'Цена', 'Price'), num: true },
];

export const STD_LIABILITY =
  '«Хўжалик юритувчи субъектлар фаолиятининг шартномавий-ҳуқуқий базаси тўғрисида»ги Қонун';
