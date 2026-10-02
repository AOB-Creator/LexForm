import { itemsTable, meta, p, sigTable } from '../core/doc/engine';
import { DocTemplate } from '../core/doc/types';
import { ITEM_COLS, L, tr } from './shared';

export const ACTS: DocTemplate[] = [
  {
    id: 'completion-act', cat: 'acts', minutes: 3,
    docTitle: 'Бажарилган ишлар (кўрсатилган хизматлар) далолатномаси',
    title: tr('Bajarilgan ishlar dalolatnomasi', 'Акт выполненных работ', 'Act of completed works'),
    desc: tr('Shartnoma boʻyicha ish va xizmatlar roʻyxati, jami summa soʻz bilan, eʼtirozsiz qabul.', 'Перечень работ и услуг по договору, итог прописью, приёмка без претензий.', 'Works and services under a contract, total in words, accepted without claims.'),
    fields: [
      { k: 'no', g: 'act', l: L.number, ex: '14', half: true },
      { k: 'date', g: 'act', l: L.date, t: 'date', ex: '2026-10-31', half: true },
      { k: 'city', g: 'act', l: L.city, ex: 'Тошкент шаҳри' },
      { k: 'c_no', g: 'contract', l: tr('Shartnoma raqami', 'Номер договора', 'Contract No.'), ex: '27', half: true },
      { k: 'c_date', g: 'contract', l: tr('Shartnoma sanasi', 'Дата договора', 'Contract date'), t: 'date', ex: '2026-10-01', half: true },
      { k: 'ex_name', g: 'executor', l: tr('Ijrochi', 'Исполнитель', 'Contractor'), ex: '«Мисол Хизмат» МЧЖ', half: true },
      { k: 'ex_rep', g: 'executor', l: tr('Ijrochi vakili', 'Представитель исполнителя', 'Contractor’s signatory'), ex: 'директор Раҳимова Д.Ш.', half: true },
      { k: 'cu_name', g: 'customer', l: tr('Buyurtmachi', 'Заказчик', 'Customer'), ex: '«Намуна Савдо» МЧЖ', half: true },
      { k: 'cu_rep', g: 'customer', l: tr('Buyurtmachi vakili', 'Представитель заказчика', 'Customer’s signatory'), ex: 'директор Каримов А.Б.', half: true },
      { k: 'items', g: 'items', l: tr('Ishlar va xizmatlar', 'Работы и услуги', 'Works and services'), t: 'rows', cols: ITEM_COLS,
        ex: [{ name: 'Бухгалтерия ҳисобини юритиш (октябрь)', unit: 'ой', qty: '1', price: '4000000' }, { name: 'Солиқ ҳисоботларини тайёрлаш', unit: 'чорак', qty: '1', price: '2500000' }] },
      { k: 'vat', g: 'items', l: tr('QQS', 'НДС', 'VAT'), t: 'select', opts: ['ҚҚСсиз', 'ҚҚС билан'], ex: 'ҚҚСсиз' },
    ],
    render: c => {
      const t = itemsTable(c, 'items');
      return `
      <h2>Далолатнома № ${c.x('no', 3)}</h2>
      <p class="c">бажарилган ишлар (кўрсатилган хизматлар) тўғрисида<br>${c.dshort('c_date')} йилдаги ${c.x('c_no', 3)}-сон шартномага</p>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Биз, қуйида имзо қўювчилар, Ижрочи ${c.x('ex_name', 18)} номидан ${c.x('ex_rep', 18)} ва Буюртмачи ${c.x('cu_name', 18)} номидан ${c.x('cu_rep', 18)} шартнома бўйича қуйидаги ишлар бажарилганлиги (хизматлар кўрсатилганлиги) ҳақида мазкур далолатномани туздик:`)}
      ${t.html}
      ${p(`Жами: ${c.moneyN(t.total)}, ${c.x('vat', 6)}.`)}
      ${p('Ишлар (хизматлар) тўлиқ ҳажмда, белгиланган муддатда ва лозим сифатда бажарилди. Буюртмачининг эътирози йўқ.')}
      ${sigTable(`Топширди:<br>Ижрочи<br><br>____________ ${c.x('ex_rep', 14)}<br>М.Ў.`, `Қабул қилди:<br>Буюртмачи<br><br>____________ ${c.x('cu_rep', 14)}<br>М.Ў.`)}`;
    },
  },
  {
    id: 'power-of-attorney', cat: 'acts', minutes: 3,
    docTitle: 'Ишончнома',
    title: tr('Ishonchnoma', 'Доверенность', 'Power of attorney'),
    desc: tr('Tashkilot nomidan vakilga vakolat berish: hujjatlarni rasmiylashtirish, imzolash, qabul qilish.', 'Полномочия представителю от имени организации: оформление, подписание, получение документов.', 'Authorising a representative to act for the company: filing, signing, receiving documents.'),
    fields: [
      { k: 'no', g: 'doc', l: L.number, ex: '08', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-01', half: true },
      { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент шаҳри', half: true },
      { k: 'until', g: 'doc', l: tr('Amal qilish muddati (gacha)', 'Действует до', 'Valid until'), t: 'date', ex: '2026-12-31', half: true },
      { k: 'org', g: 'principal', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
      { k: 'org_stir', g: 'principal', l: tr('STIR', 'ИНН', 'TIN'), ex: '301234567', half: true },
      { k: 'head', g: 'principal', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Director'), ex: 'Каримов Алишер Баҳромович', half: true },
      { k: 'org_addr', g: 'principal', l: tr('Yuridik manzil', 'Юридический адрес', 'Registered address'), ex: 'Тошкент ш., Юнусобод тумани, Амир Темур кўчаси, 1-уй' },
      { k: 'ag', g: 'agent', l: L.fio, ex: 'Алиев Тимур Рустамович' },
      { k: 'ag_pos', g: 'agent', l: L.position, ex: 'юрист', half: true },
      { k: 'ag_pass', g: 'agent', l: L.passport, ex: 'AB 1234567', half: true },
      { k: 'ag_pass_by', g: 'agent', l: tr('Kim bergan, sana', 'Кем и когда выдан', 'Issued by, date'), ex: 'Чилонзор тумани ИИБ, 12.08.2018' },
      { k: 'where', g: 'powers', l: tr('Qaysi organlarda', 'В каких органах', 'Before which bodies'), t: 'textarea', ex: 'давлат солиқ хизмати органлари, Давлат хизматлари марказлари, банклар ва бошқа ташкилотлар' },
      { k: 'what', g: 'powers', l: tr('Vakolatlar', 'Полномочия', 'Powers'), t: 'textarea', ex: 'жамият номидан ариза ва ҳужжатларни тақдим этиш, уларга имзо қўйиш, ҳужжатлар ва маълумотномаларни олиш' },
      { k: 'subst', g: 'powers', l: tr('Boshqa shaxsga topshirish', 'Передоверие', 'Delegation'), t: 'select', opts: ['ҳуқуқисиз', 'ҳуқуқи билан'], ex: 'ҳуқуқисиз' },
    ],
    render: c => `
      <h2>Ишончнома № ${c.x('no', 3)}</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`${c.x('org', 20)} (СТИР ${c.x('org_stir', 10)}, манзил: ${c.x('org_addr', 24)}) номидан Устав асосида иш юритувчи директор ${c.x('head', 22)} ушбу ишончнома билан жамият ${c.x('ag_pos', 10)}и ${c.x('ag', 22)}га (паспорт ${c.x('ag_pass', 10)}, ${c.x('ag_pass_by', 18)} томонидан берилган) ${c.x('where', 26)}да қуйидаги ҳаракатларни амалга оширишга ваколат беради:`)}
      ${p(c.x('what', 40) + '.')}
      ${p(`Ишончнома ${c.date('until')}гача, бошқа шахсга ишониб топшириш ${c.x('subst', 10)} берилди.`)}
      ${p(`Вакилнинг имзоси ____________ ${c.x('ag', 16)} тасдиқлайман.`)}
      ${sigTable('Директор', `____________ ${c.x('head', 16)}<br>М.Ў.`)}`,
  },
];
