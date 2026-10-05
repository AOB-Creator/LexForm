import { esc, fmtMoney, parseNum } from '../core/doc/format';
import { Ctx, meta, ol, p, sigTable } from '../core/doc/engine';
import { DocTemplate, FieldDef } from '../core/doc/types';
import { addressee, attachments, L, personCell, personFields, signLine, tr } from './shared';

const passLabel = tr('Pasport (seriya, raqam, kim bergan, sana)', 'Паспорт (серия, номер, кем и когда выдан)', 'Passport (series, number, issuer, date)');
const who = (c: Ctx, k: string) => `${c.x(k, 22)} (паспорт: ${c.x(k + '_pass', 18)}, яшаш манзили: ${c.x(k + '_addr', 24)})`;
const notaryBox = `<div class="pb"></div><p class="c"><b>Нотариал тасдиқлаш учун жой</b></p><p class="c"><i>(нотариус тўлдиради)</i></p>`;
const cityDate: FieldDef[] = [
  { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент шаҳри', half: true },
  { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
];
const P1 = { fio: 'Каримова Нигора Ботировна', pass: 'AA 2233445, Юнусобод тумани ИИБ, 14.07.2019', addr: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадон' };
const P2 = { fio: 'Каримов Фаррух Олимович', pass: 'AB 5566778, Мирзо Улуғбек тумани ИИБ, 20.01.2018', addr: 'Тошкент ш., Мирзо Улуғбек тумани, Буюк Ипак йўли кўчаси, 45-уй, 7-хонадон' };
const COURT = 'Фуқаролик ишлари бўйича Юнусобод туманлараро суди';
const att: FieldDef = { k: 'att', g: 'claim', l: tr('Qoʻshimcha ilovalar (har biri yangi qatordan)', 'Доп. приложения (каждое с новой строки)', 'Extra attachments (one per line)'), t: 'textarea' };
const parties = (pl: { fio: string; addr: string }, df: { fio: string; addr: string }, dfLabel = L.fio): FieldDef[] => [
  { k: 'court', g: 'court', l: tr('Sud nomi', 'Наименование суда', 'Court'), ex: COURT },
  { k: 'pl', g: 'plaintiff', l: L.fio, ex: pl.fio },
  { k: 'pl_addr', g: 'plaintiff', l: tr('Yashash manzili', 'Адрес проживания', 'Residential address'), ex: pl.addr },
  { k: 'pl_phone', g: 'plaintiff', l: L.phone, ex: '+998 90 111-22-33', half: true },
  { k: 'df', g: 'defendant', l: dfLabel, ex: df.fio },
  { k: 'df_addr', g: 'defendant', l: L.addr, ex: df.addr },
];
const head = (c: Ctx, a = 'Даъвогар', b = 'Жавобгар') => addressee(
  `<b>${c.x('court', 26)}га</b>`, `<b>${a}:</b> ${c.x('pl', 22)}`, `Манзил: ${c.x('pl_addr', 26)}`, c.has('pl_phone') ? `Тел.: ${c.x('pl_phone')}` : '',
  `<b>${b}:</b> ${c.x('df', 22)}`, `Манзил: ${c.x('df_addr', 26)}`);

export const MORE_NOTARIAL: DocTemplate[] = [
  {
    id: 'travel-consent', cat: 'notarial', sub: 'applications', minutes: 4,
    docTitle: 'Вояга етмаган боланинг хорижга чиқишига розилик',
    title: tr('Bolaning chet elga chiqishiga rozilik', 'Согласие на выезд ребёнка за границу', 'Consent for a child to travel abroad'),
    desc: tr('Ota yoki onaning roziligi: bola, kim bilan, qaysi davlat(lar), muddat. Notarial tasdiqlanadi.', 'Согласие родителя: ребёнок, с кем, страны, срок. Удостоверяется нотариусом.', 'Parent’s consent: child, accompanying person, countries, period. Notarised.'),
    fields: [
      ...cityDate,
      ...personFields('pr', 'parent', P2).filter(f => !f.k.endsWith('_acc')),
      { k: 'ch', g: 'child', l: L.fio, ex: 'Каримова Мадина Фарруховна' },
      { k: 'ch_born', g: 'child', l: L.birth, t: 'date', ex: '2019-09-05', half: true },
      { k: 'ch_doc', g: 'child', l: tr('Guvohnoma / pasport', 'Свидетельство / паспорт', 'Certificate / passport'), ex: 'I-ТН 0654321', half: true },
      { k: 'with', g: 'agent', l: tr('Kim bilan', 'С кем', 'Accompanied by'), ex: 'онаси Каримова Нигора Ботировна (паспорт AA 2233445)' },
      { k: 'where', g: 'agent', l: tr('Davlat(lar)', 'Страна(ы)', 'Country(ies)'), ex: 'Туркия Республикаси', half: true },
      { k: 'until', g: 'agent', l: tr('Muddat (gacha)', 'Срок (до)', 'Until'), t: 'date', ex: '2027-10-05', half: true },
      { k: 'goal', g: 'agent', l: tr('Maqsad', 'Цель', 'Purpose'), ex: 'дам олиш' },
    ],
    render: c => `
      <h2>Розилик</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Мен, ${who(c, 'pr')}, вояга етмаган фарзандим ${c.x('ch', 22)}нинг (${c.dshort('ch_born')} йилда туғилган, ҳужжат: ${c.x('ch_doc', 12)}) ${c.x('with', 24)} билан бирга ${c.x('goal', 10)} мақсадида ${c.x('where', 14)}га ${c.date('until')}гача бўлган даврда вақтинча чиқишига ва Ўзбекистон Республикасига қайтиб келишига розилик бераман.`)}
      ${p('Шу муносабат билан фарзандимнинг хорижга чиқиши учун зарур ҳужжатларни расмийлаштириш, чегарадан ўтказиш ва унинг манфаатларини ҳимоя қилиш бўйича ҳаракатларни амалга оширишга розилик бераман.')}
      ${p('Ушбу розиликнинг мазмуни ва ҳуқуқий оқибатлари менга нотариус томонидан тушунтирилди.')}
      ${sigTable('Розилик берувчи', `____________ ${c.x('pr', 18)}`)}
      ${notaryBox}`,
  },
  {
    id: 'general-poa', cat: 'notarial', sub: 'poa', minutes: 4,
    docTitle: 'Ишончнома',
    title: tr('Umumiy ishonchnoma (jismoniy shaxs)', 'Генеральная доверенность (физлицо)', 'General power of attorney (individual)'),
    desc: tr('Davlat organlari, banklar va tashkilotlarda vakillik qilish uchun keng vakolatli ishonchnoma.', 'Доверенность на представительство в госорганах, банках, организациях.', 'Broad power to represent the principal before authorities, banks and organisations.'),
    fields: [
      ...cityDate,
      ...personFields('pr', 'principal', P1).filter(f => !f.k.endsWith('_acc')),
      ...personFields('ag', 'agent', { fio: 'Каримов Олим Баҳодирович', pass: 'AC 9988776, Яшнобод тумани ИИБ, 03.03.2016', addr: 'Тошкент ш., Яшнобод тумани, Тузель кўчаси, 6-уй' }).filter(f => !f.k.endsWith('_acc')),
      { k: 'powers', g: 'powers', l: tr('Vakolatlar (har biri yangi qatordan)', 'Полномочия (каждое с новой строки)', 'Powers (one per line)'), t: 'textarea', ex: 'давлат органлари, нотариал идоралар ва бошқа ташкилотларда менинг номимдан вакиллик қилиш\nбанклардаги ҳисоб рақамларимдан пул маблағларини олиш ва ўтказиш\nаризалар, маълумотномалар ва бошқа ҳужжатларни олиш ва топшириш\nкоммунал хизматлар бўйича шартномалар тузиш ва тўловларни амалга ошириш' },
      { k: 'until', g: 'powers', l: tr('Amal qilish muddati (gacha)', 'Срок действия (до)', 'Valid until'), t: 'date', ex: '2027-10-05', half: true },
      { k: 'deleg', g: 'powers', l: tr('Boshqaga ishonish', 'Передоверие', 'Delegation'), t: 'select', opts: ['ваколатларни бошқа шахсга ишониш ҳуқуқисиз', 'ваколатларни бошқа шахсга ишониш ҳуқуқи билан'], ex: 'ваколатларни бошқа шахсга ишониш ҳуқуқисиз', half: true },
    ],
    render: c => {
      const powers = c.raw('powers').split('\n').map(s => s.trim()).filter(Boolean).map(s => c.span(esc(s)));
      return `
      <h2>Ишончнома</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Мен, ${who(c, 'pr')}, ушбу ишончнома билан ${who(c, 'ag')}га қуйидаги ҳаракатларни менинг номимдан амалга оширишни ишониб топшираман:`)}
      ${ol(powers.length ? powers : [c.blank(40)])}
      ${p('Шу мақсадда ишончли вакилга аризалар бериш, ҳужжатларни имзолаш, тўловларни амалга ошириш ва ушбу ишончнома билан боғлиқ бошқа барча ҳаракатларни бажариш ҳуқуқи берилади.')}
      ${p(`Ишончнома ${c.date('until')}гача амал қилади ва ${c.x('deleg', 20)} берилди. Ишончномани бекор қилиш оқибатлари менга тушунтирилди.`)}
      ${sigTable('Ишонч билдирувчи', `____________ ${c.x('pr', 18)}`)}
      ${notaryBox}`;
    },
  },
  {
    id: 'inheritance-refusal', cat: 'notarial', sub: 'applications', minutes: 3,
    docTitle: 'Меросдан воз кечиш тўғрисида ариза',
    title: tr('Merosdan voz kechish arizasi', 'Заявление об отказе от наследства', 'Renunciation of inheritance'),
    desc: tr('Notariusga ariza: boshqa merosxoʻr foydasiga yoki koʻrsatmasdan merosdan voz kechish.', 'Заявление нотариусу: отказ в пользу другого наследника или без указания.', 'To a notary: renouncing in favour of another heir or unconditionally.'),
    fields: [
      { k: 'notary', g: 'addressee', l: tr('Notarial idora / notarius', 'Нотариальная контора / нотариус', 'Notary office'), ex: 'Ургут тумани давлат нотариал идораси' },
      ...personFields('ap', 'applicant', { fio: 'Раҳимова Нодира Аҳмадовна', pass: 'AE 3344556, Ургут тумани ИИБ, 11.11.2021', addr: 'Самарқанд вилояти, Ургут тумани, Мустақиллик кўчаси, 15-уй' }).filter(f => !f.k.endsWith('_acc')),
      { k: 'kin', g: 'applicant', l: tr('Meros qoldiruvchiga kimligi', 'Кем приходится наследодателю', 'Relation to the deceased'), ex: 'қизи', half: true },
      { k: 'dc', g: 'deceased', l: L.fio, ex: 'Раҳимов Аҳмад Каримович' },
      { k: 'dc_died', g: 'deceased', l: tr('Vafot etgan sana', 'Дата смерти', 'Date of death'), t: 'date', ex: '2026-05-14', half: true },
      { k: 'how', g: 'heirs', l: tr('Voz kechish', 'Отказ', 'Renunciation'), t: 'select', opts: ['бошқа меросхўр фойдасига', 'ҳеч кимнинг фойдасига кўрсатмасдан'], ex: 'бошқа меросхўр фойдасига', half: true },
      { k: 'for', g: 'heirs', l: tr('Kimning foydasiga', 'В чью пользу', 'In favour of'), ex: 'акам Раҳимов Жасур Аҳмадович' },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${addressee(`<b>${c.x('notary', 26)}га</b>`, `${c.x('ap', 22)}дан`, `Паспорт: ${c.x('ap_pass', 18)}`, `Манзил: ${c.x('ap_addr', 24)}`)}
      <h2>Ариза</h2>
      <p class="c"><i>меросдан воз кечиш тўғрисида</i></p>
      ${p(`${c.date('dc_died')}да вафот этган ${c.x('dc', 22)}нинг ${c.x('kin', 8)} сифатида унинг вафотидан сўнг очилган меросдан ${c.raw('how').startsWith('бошқа') ? `${c.x('for', 22)} фойдасига` : 'ҳеч кимнинг фойдасига кўрсатмасдан'} воз кечаман.`)}
      ${p('Меросдан воз кечиш кейинчалик бекор қилиниши ёки қайтариб олиниши мумкин эмаслиги, шунингдек ушбу аризанинг бошқа ҳуқуқий оқибатлари менга нотариус томонидан тушунтирилди.')}
      ${signLine(c, 'date', 'ap')}
      ${notaryBox}`,
  },
  {
    id: 'apartment-sale', cat: 'notarial', sub: 'contracts', minutes: 7,
    docTitle: 'Квартира олди-сотди шартномаси',
    title: tr('Kvartira oldi-sotdi shartnomasi', 'Договор купли-продажи квартиры', 'Apartment sale agreement'),
    desc: tr('Jismoniy shaxslar oʻrtasida kvartira sotish: obyekt, kadastr, narx soʻz bilan, hisob-kitob, topshirish.', 'Продажа квартиры между физлицами: объект, кадастр, цена прописью, расчёт, передача.', 'Flat sale between individuals: property, cadastre, price in words, settlement, handover.'),
    fields: [
      ...cityDate,
      ...personFields('sl', 'seller', { fio: 'Юсупов Шерзод Анварович', pass: 'AC 7654321, Миробод тумани ИИБ, 10.02.2017', addr: 'Тошкент ш., Миробод тумани, Нукус кўчаси, 20-уй, 21-хонадон' }),
      ...personFields('by', 'buyer', P1),
      { k: 'addr', g: 'object', l: tr('Kvartira manzili', 'Адрес квартиры', 'Flat address'), ex: 'Тошкент ш., Миробод тумани, Нукус кўчаси, 20-уй, 21-хонадон' },
      { k: 'rooms', g: 'object', l: tr('Xonalar', 'Комнат', 'Rooms'), t: 'number', ex: '3', half: true },
      { k: 'area', g: 'object', l: tr('Umumiy maydon, m²', 'Общая площадь, м²', 'Total area, m²'), t: 'number', ex: '78', half: true },
      { k: 'cad', g: 'object', l: tr('Kadastr raqami', 'Кадастровый номер', 'Cadastre No.'), ex: '10:07:02:01:04:0123', half: true },
      { k: 'title', g: 'object', l: tr('Mulk huquqi hujjati', 'Документ о праве', 'Title document'), ex: '12.03.2019 йилдаги кадастр кўчирмаси', half: true },
      { k: 'price', g: 'payment', l: tr('Narxi', 'Цена', 'Price'), t: 'money', ex: '950000000' },
      { k: 'pay', g: 'payment', l: tr('Hisob-kitob', 'Расчёт', 'Settlement'), t: 'select', opts: ['шартнома нотариал тасдиқлангунга қадар тўлиқ', 'шартнома нотариал тасдиқлангандан кейин 3 банк куни ичида Сотувчининг ҳисоб рақамига'], ex: 'шартнома нотариал тасдиқлангунга қадар тўлиқ' },
      { k: 'free', g: 'payment', l: tr('Boʻshatish muddati', 'Срок освобождения', 'Vacate by'), t: 'date', ex: '2026-10-20', half: true },
      { k: 'reg', g: 'payment', l: tr('Roʻyxatda turganlar', 'Зарегистрированы', 'Registered residents'), t: 'select', opts: ['квартирада рўйхатда турган шахслар йўқ', 'рўйхатда турган шахслар бўшатиш муддатигача рўйхатдан чиқадилар'], ex: 'квартирада рўйхатда турган шахслар йўқ', half: true },
    ],
    render: c => `
      <h2>Квартира олди-сотди шартномаси</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Биз, ${who(c, 'sl')}, кейинги ўринларда «Сотувчи», ва ${who(c, 'by')}, кейинги ўринларда «Харидор», ушбу шартномани қуйидагилар ҳақида туздик:`)}
      ${ol([
        `Сотувчи ${c.x('addr', 26)} манзилида жойлашган, ${c.x('rooms', 2)} хонали, умумий майдони ${c.x('area', 4)} кв.м бўлган квартирани (кадастр рақами ${c.x('cad', 14)}) Харидорнинг мулкига сотади, Харидор эса уни қабул қилиб, ҳақини тўлайди.`,
        `Квартира Сотувчига ${c.x('title', 18)} асосида мулк ҳуқуқи бўйича тегишли.`,
        `Квартиранинг нархи тарафлар келишувига кўра ${c.money('price')}. Ҳисоб-китоб ${c.x('pay', 24)} амалга оширилади.`,
        'Сотувчи шартнома тузилгунга қадар квартира ҳеч кимга сотилмаганлиги, ҳадя қилинмаганлиги, гаровга қўйилмаганлиги, низоли эмаслиги, тақиқ ва ҳибс остида эмаслигини кафолатлайди.',
        `Ушбу шартнома имзоланган кунга ${c.x('reg', 24)}. Сотувчи квартирани ${c.date('free')}гача бўшатиб, топшириш-қабул қилиш далолатномаси асосида Харидорга топширади.`,
        'Харидорнинг квартирага бўлган мулк ҳуқуқи давлат рўйхатидан ўтказилган пайтдан бошлаб вужудга келади. Рўйхатдан ўтказиш харажатлари Харидор зиммасида.',
        'Тарафларга Фуқаролик кодексининг олди-сотди ва кўчмас мулкка оид нормалари нотариус томонидан тушунтирилди.',
        'Шартнома уч нусхада тузилди: биттаси нотариал идорада сақланади, қолганлари тарафларга берилади.',
      ])}
      <h3>Тарафларнинг имзолари</h3>
      ${sigTable(personCell(c, 'sl', 'Сотувчи'), personCell(c, 'by', 'Харидор'))}
      ${notaryBox}`,
  },
];

export const MORE_COURT: DocTemplate[] = [
  {
    id: 'court-property-division', cat: 'court', sub: 'claims', minutes: 7,
    docTitle: 'Эр-хотиннинг умумий мол-мулкини тақсимлаш тўғрисида даъво аризаси',
    title: tr('Er-xotin mol-mulkini taqsimlash daʼvosi', 'Иск о разделе имущества супругов', 'Claim to divide marital property'),
    desc: tr('Nikoh davomida orttirilgan mol-mulk roʻyxati va qiymati, talab qilingan ulush; jami avtomatik.', 'Перечень и стоимость совместно нажитого имущества, требуемая доля; итог считается.', 'List and value of marital property, claimed share; total computed.'),
    fields: [
      ...parties(P1, P2),
      { k: 'since', g: 'marriage', l: tr('Nikoh sanasi', 'Дата брака', 'Date of marriage'), t: 'date', ex: '2014-06-20', half: true },
      { k: 'end', g: 'marriage', l: tr('Nikoh bekor qilingan sana', 'Дата расторжения', 'Divorce date'), t: 'date', ex: '2026-08-15', half: true },
      { k: 'items', g: 'property', l: tr('Mol-mulk', 'Имущество', 'Property'), t: 'rows',
        cols: [{ k: 'name', l: tr('Mol-mulk', 'Имущество', 'Item') }, { k: 'val', l: tr('Qiymati', 'Стоимость', 'Value'), num: true }, { k: 'to', l: tr('Kimga', 'Кому', 'To whom') }],
        ex: [{ name: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадон (2 хонали квартира)', val: '720000000', to: 'даъвогарга' }, { name: 'Chevrolet Cobalt автомобили, 2021 й., 01 A 123 BC', val: '120000000', to: 'жавобгарга' }] },
      { k: 'share', g: 'claim', l: tr('Talab qilinayotgan ulush', 'Требуемая доля', 'Claimed share'), ex: '1/2', half: true },
      { k: 'comp', g: 'claim', l: tr('Kompensatsiya (boʻlsa)', 'Компенсация (если есть)', 'Compensation (if any)'), t: 'money', half: true },
      att,
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => {
      let total = 0;
      const rows = c.rows('items').filter(r => (r['name'] ?? '').trim());
      const body = rows.map((r, i) => { const v = parseNum(r['val'] ?? ''); if (isFinite(v)) total += v; return `<tr><td class="n">${i + 1}</td><td>${c.span(esc(r['name']))}</td><td class="n">${isFinite(v) ? fmtMoney(v) : ''}</td><td>${c.span(esc(r['to'] ?? ''))}</td></tr>`; }).join('');
      return `
      ${head(c)}
      <h2>Даъво аризаси</h2>
      <p class="c"><i>эр-хотиннинг умумий мол-мулкини тақсимлаш тўғрисида</i></p>
      ${p(`Мен жавобгар ${c.x('df', 20)} билан ${c.date('since')}дан ${c.date('end')}гача никоҳда бўлганман. Никоҳ давомида қуйидаги мол-мулк биргаликда орттирилган:`)}
      <table class="t"><tr><th>№</th><th>Мол-мулк</th><th>Қиймати</th><th>Кимга ажратиш сўралади</th></tr>${body || `<tr><td class="n">1</td><td>${c.blank(20)}</td><td></td><td></td></tr>`}<tr><td></td><td><b>Жами</b></td><td class="n"><b>${fmtMoney(total)}</b></td><td></td></tr></table>
      ${p('Ўзбекистон Республикаси Оила кодексига кўра, эр-хотиннинг никоҳ давомида орттирган мол-мулки уларнинг умумий биргаликдаги мулки ҳисобланади ва тақсимлашда, агар улар ўртасидаги шартномада бошқача тартиб назарда тутилмаган бўлса, уларнинг улушлари тенг деб топилади. Мол-мулкни ихтиёрий тақсимлаш бўйича келишувга эришилмади.')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([
        `Эр-хотиннинг умумий мол-мулки тақсимлансин, менга ${c.x('share', 4)} улуш ажратилиб, мол-мулк юқоридаги жадвалга мувофиқ тарафларга берилсин.`,
        ...(c.has('comp') ? [`Улушлар тенглигини таъминлаш учун жавобгардан менинг фойдамга ${c.money('comp')} компенсация ундирилсин.`] : []),
        'Жавобгардан суд харажатлари ундирилсин.',
      ])}
      ${attachments(c, ['Никоҳ ва никоҳни бекор қилиш тўғрисидаги гувоҳномалар нусхалари.', 'Мол-мулкка оид ҳужжатлар ва баҳолаш ҳисоботи нусхалари.', 'Давлат божи тўланганлиги тўғрисидаги ҳужжат.', 'Даъво аризасининг жавобгар учун нусхаси.'], 'att')}
      ${signLine(c, 'date', 'pl')}`;
    },
  },
  {
    id: 'court-wages', cat: 'court', sub: 'claims', minutes: 5,
    docTitle: 'Иш ҳақи бўйича қарзни ундириш тўғрисида даъво аризаси',
    title: tr('Ish haqi qarzini undirish daʼvosi', 'Иск о взыскании задолженности по зарплате', 'Claim for unpaid wages'),
    desc: tr('Xodimning ish beruvchiga daʼvosi: oylar boʻyicha toʻlanmagan ish haqi, jami avtomatik.', 'Иск работника к работодателю: невыплаченная зарплата по месяцам, итог считается.', 'Employee’s claim against an employer: unpaid wages by month, total computed.'),
    fields: [
      ...parties({ fio: 'Алиев Тимур Рустамович', addr: 'Тошкент ш., Чилонзор тумани, 5-мавзе, 3-уй, 7-хонадон' }, { fio: '«Мисол Хизмат» МЧЖ', addr: 'Тошкент ш., Чилонзор тумани, Бунёдкор шоҳ кўчаси, 10-уй' }, tr('Ish beruvchi (tashkilot)', 'Работодатель (организация)', 'Employer (company)')),
      { k: 'pos', g: 'claim', l: L.position, ex: 'омборчи', half: true },
      { k: 'from', g: 'claim', l: tr('Ishlagan davri (dan)', 'Работал с', 'Employed from'), t: 'date', ex: '2024-02-01', half: true },
      { k: 'status', g: 'claim', l: tr('Hozirgi holat', 'Текущий статус', 'Status'), t: 'select', opts: ['ҳозирда ҳам ишлайман', 'меҳнат шартномаси бекор қилинган'], ex: 'меҳнат шартномаси бекор қилинган', half: true },
      { k: 'months', g: 'claim', l: tr('Toʻlanmagan oylar', 'Невыплаченные месяцы', 'Unpaid months'), t: 'rows',
        cols: [{ k: 'm', l: tr('Oy', 'Месяц', 'Month') }, { k: 'sum', l: tr('Summa', 'Сумма', 'Amount'), num: true }],
        ex: [{ m: '2026 йил июнь', sum: '4500000' }, { m: '2026 йил июль', sum: '4500000' }, { m: '2026 йил август', sum: '4500000' }] },
      att,
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => {
      let total = 0;
      const rows = c.rows('months').filter(r => (r['m'] ?? '').trim());
      const list = rows.map(r => { const n = parseNum(r['sum'] ?? ''); if (isFinite(n)) total += n; return `${c.span(esc(r['m']))} — ${isFinite(n) ? c.span(fmtMoney(n)) : c.blank(8)} сўм`; });
      return `
      ${head(c, 'Даъвогар', 'Жавобгар')}
      <h2>Даъво аризаси</h2>
      <p class="c"><i>иш ҳақи бўйича қарзни ундириш тўғрисида</i></p>
      ${p(`Мен ${c.date('from')}дан бошлаб ${c.x('df', 18)}да ${c.x('pos', 12)} лавозимида ишлаганман, ${c.x('status', 16)}.`)}
      ${p('Жавобгар менга қуйидаги ойлар учун ҳисобланган иш ҳақини тўламаган:')}
      ${ol(list.length ? list : [c.blank(30)])}
      ${p(`Жами қарз ${c.moneyN(total)}. Ўзбекистон Республикаси Меҳнат кодексига мувофиқ иш берувчи ходимга иш ҳақини белгиланган муддатларда тўлаши шарт. Қарзни ихтиёрий тўлаш тўғрисидаги мурожаатларим натижасиз қолди.`)}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`Жавобгар ${c.x('df', 18)}дан менинг фойдамга ${c.moneyN(total)} миқдоридаги иш ҳақи бўйича қарз ундирилсин.`, 'Иш ҳақини кечиктириб тўлаганлик учун қонунчиликда назарда тутилган компенсация ундирилсин.'])}
      ${attachments(c, ['Меҳнат шартномаси ва ишга қабул қилиш буйруғи нусхалари.', 'Иш ҳақи ҳисоблангани тўғрисидаги маълумотнома ёки ҳисоб варақаси.', 'Даъво аризасининг жавобгар учун нусхаси.'], 'att')}
      ${signLine(c, 'date', 'pl')}`;
    },
  },
  {
    id: 'court-order-cancel', cat: 'court', sub: 'applications', minutes: 3,
    docTitle: 'Суд буйруғини бекор қилиш тўғрисида ариза',
    title: tr('Sud buyrugʻini bekor qilish arizasi', 'Заявление об отмене судебного приказа', 'Application to cancel a court order'),
    desc: tr('Qarzdorning sud buyrugʻiga eʼtirozi: buyruq raqami, sanasi, eʼtiroz sabablari.', 'Возражение должника против судебного приказа: номер, дата, доводы.', 'Debtor’s objection to a court order: number, date, reasons.'),
    fields: [
      ...parties(P2, P1, tr('Undiruvchi F.I.Sh.', 'Ф.И.О. взыскателя', 'Creditor full name')),
      { k: 'no', g: 'case', l: tr('Sud buyrugʻi raqami', 'Номер приказа', 'Order No.'), ex: '2-СБ-512/2026', half: true },
      { k: 'odate', g: 'case', l: tr('Buyruq sanasi', 'Дата приказа', 'Order date'), t: 'date', ex: '2026-09-20', half: true },
      { k: 'got', g: 'case', l: tr('Buyruq olingan sana', 'Дата получения', 'Received on'), t: 'date', ex: '2026-09-30', half: true },
      { k: 'why', g: 'claim', l: tr('Eʼtiroz sabablari', 'Доводы возражения', 'Reasons'), t: 'textarea', ex: 'Талаб қилинаётган сумма билан келишмайман: қарзнинг бир қисми тўланган, бу банк кўчирмаси билан тасдиқланади. Талаб низоли ҳисобланади.' },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${head(c, 'Қарздор', 'Ундирувчи')}
      <h2>Ариза</h2>
      <p class="c"><i>суд буйруғини бекор қилиш тўғрисида</i></p>
      ${p(`${c.x('court', 20)}нинг ${c.date('odate')}даги ${c.x('no', 10)}-сонли суд буйруғи билан мендан ${c.x('df', 18)} фойдасига пул маблағи ундириш белгиланган. Суд буйруғининг нусхасини ${c.date('got')}да олдим.`)}
      ${p(`Суд буйруғига қарши эътирозимни билдираман. Сабаблари: ${c.x('why', 40)}`)}
      ${p('Ўзбекистон Республикаси Фуқаролик процессуал кодексига мувофиқ, қарздор суд буйруғига қарши қонунда белгиланган муддатда эътироз билдирса, суд буйруғи бекор қилинади.')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`${c.date('odate')}даги ${c.x('no', 10)}-сонли суд буйруғи бекор қилинсин.`])}
      ${signLine(c, 'date', 'pl')}`,
  },
  {
    id: 'court-copy-request', cat: 'court', sub: 'applications', minutes: 2,
    docTitle: 'Суд ҳужжатлари нусхасини бериш тўғрисида ариза',
    title: tr('Sud hujjati nusxasini olish arizasi', 'Заявление о выдаче копии судебного акта', 'Request for a copy of a court document'),
    desc: tr('Hal qiluv qarori, ajrim yoki ijro varaqasi nusxasini berishni soʻrash.', 'Просьба выдать копию решения, определения или исполнительного листа.', 'Request a copy of a judgment, ruling or writ.'),
    fields: [
      { k: 'court', g: 'court', l: tr('Sud nomi', 'Наименование суда', 'Court'), ex: COURT },
      { k: 'pl', g: 'applicant', l: L.fio, ex: P1.fio },
      { k: 'pl_addr', g: 'applicant', l: L.addr, ex: P1.addr },
      { k: 'pl_phone', g: 'applicant', l: L.phone, ex: '+998 90 111-22-33', half: true },
      { k: 'role', g: 'applicant', l: tr('Ishdagi maqomi', 'Статус в деле', 'Role in the case'), t: 'select', opts: ['даъвогар', 'жавобгар', 'учинчи шахс', 'вакил'], ex: 'даъвогар', half: true },
      { k: 'case', g: 'case', l: tr('Ish raqami', 'Номер дела', 'Case No.'), ex: '2-1234/2026', half: true },
      { k: 'dec', g: 'case', l: tr('Hujjat sanasi', 'Дата акта', 'Date of the act'), t: 'date', ex: '2026-09-15', half: true },
      { k: 'what', g: 'case', l: tr('Qaysi hujjat', 'Какой документ', 'Document'), t: 'select', opts: ['ҳал қилув қарори', 'ажрим', 'ижро варақаси', 'суд мажлиси баённомаси'], ex: 'ҳал қилув қарори', half: true },
      { k: 'stamp', g: 'case', l: tr('Kuchga kirganlik belgisi', 'Отметка о вступлении в силу', 'Mark of legal force'), t: 'select', opts: ['қонуний кучга кирганлиги ҳақидаги белги билан', 'белгисиз'], ex: 'қонуний кучга кирганлиги ҳақидаги белги билан', half: true },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${addressee(`<b>${c.x('court', 26)}га</b>`, `${c.x('role', 10)} ${c.x('pl', 22)}дан`, `Манзил: ${c.x('pl_addr', 24)}`, c.has('pl_phone') ? `Тел.: ${c.x('pl_phone')}` : '')}
      <h2>Ариза</h2>
      ${p(`${c.x('case', 10)}-сонли иш бўйича судингиз томонидан ${c.date('dec')}да қабул қилинган ${c.x('what', 14)}нинг нусхасини ${c.x('stamp', 20)} беришингизни сўрайман.`)}
      ${signLine(c, 'date', 'pl')}`,
  },
  {
    id: 'court-cassation', cat: 'court', sub: 'appeals', minutes: 7,
    docTitle: 'Кассация шикояти',
    title: tr('Kassatsiya shikoyati', 'Кассационная жалоба', 'Cassation appeal'),
    desc: tr('Qonuniy kuchga kirgan qaror va apellyatsiya ajrimiga shikoyat: ish maʼlumotlari, asoslar, soʻrov.', 'Жалоба на вступившее в силу решение и апелляционное определение.', 'Appeal against a final judgment and the appellate ruling.'),
    fields: [
      { k: 'court', g: 'court', l: tr('Kassatsiya instansiyasi', 'Кассационная инстанция', 'Cassation court'), ex: 'Ўзбекистон Республикаси Олий судининг фуқаролик ишлари бўйича судлов ҳайъати' },
      { k: 'court1', g: 'court', l: tr('Birinchi instansiya sudi', 'Суд первой инстанции', 'First-instance court'), ex: COURT },
      { k: 'court2', g: 'court', l: tr('Apellyatsiya instansiyasi', 'Апелляционная инстанция', 'Appeal court'), ex: 'Тошкент шаҳар суди фуқаролик ишлари бўйича судлов ҳайъати' },
      { k: 'pl', g: 'plaintiff', l: tr('Shikoyatchi F.I.Sh.', 'Ф.И.О. заявителя', 'Appellant'), ex: P1.fio },
      { k: 'pl_addr', g: 'plaintiff', l: L.addr, ex: P1.addr },
      { k: 'df', g: 'defendant', l: tr('Ikkinchi tomon F.I.Sh.', 'Ф.И.О. другой стороны', 'Other party'), ex: P2.fio },
      { k: 'df_addr', g: 'defendant', l: L.addr, ex: P2.addr },
      { k: 'case', g: 'case', l: tr('Ish raqami', 'Номер дела', 'Case No.'), ex: '2-1234/2026', half: true },
      { k: 'dec', g: 'case', l: tr('Hal qiluv qarori sanasi', 'Дата решения', 'Judgment date'), t: 'date', ex: '2026-06-15', half: true },
      { k: 'app', g: 'case', l: tr('Apellyatsiya ajrimi sanasi', 'Дата апелл. определения', 'Appeal ruling date'), t: 'date', ex: '2026-09-10', half: true },
      { k: 'grounds', g: 'claim', l: tr('Shikoyat asoslari', 'Доводы', 'Grounds'), t: 'textarea', ex: 'Судлар моддий ҳуқуқ нормаларини нотўғри талқин қилган ва процессуал ҳуқуқ нормаларини жиддий бузган: ишда иштирок этувчи шахс суд мажлиси вақти ва жойидан тегишли тарзда хабардор қилинмаган.' },
      { k: 'ask', g: 'claim', l: tr('Soʻrov', 'Просьба', 'Relief'), t: 'select', opts: ['бекор қилиниб, ишда янги қарор қабул қилинсин', 'бекор қилиниб, иш янгидан кўриш учун юборилсин', 'ўзгартирилсин'], ex: 'бекор қилиниб, иш янгидан кўриш учун юборилсин' },
      att,
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${addressee(`<b>${c.x('court', 26)}га</b>`, `<b>Шикоят берувчи:</b> ${c.x('pl', 22)}`, `Манзил: ${c.x('pl_addr', 24)}`, `<b>Иккинчи тараф:</b> ${c.x('df', 22)}`, `Манзил: ${c.x('df_addr', 24)}`)}
      <h2>Кассация шикояти</h2>
      <p class="c"><i>иш № ${c.x('case', 8)}</i></p>
      ${p(`${c.x('court1', 20)}нинг ${c.date('dec')}даги ҳал қилув қарори ва ${c.x('court2', 20)}нинг ${c.date('app')}даги ажрими билан менинг ҳуқуқ ва қонуний манфаатларим бузилган деб ҳисоблайман.`)}
      ${p(`Асослар: ${c.x('grounds', 40)}`)}
      ${p('Юқоридагиларга асосан, Ўзбекистон Республикаси Фуқаролик процессуал кодексининг кассация тартибида иш юритишга оид нормаларига амал қилиб,')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`${c.x('case', 8)}-сонли иш бўйича ${c.date('dec')}даги ҳал қилув қарори ва ${c.date('app')}даги апелляция ажрими ${c.x('ask', 20)}.`])}
      ${attachments(c, ['Ҳал қилув қарори ва апелляция ажрими нусхалари.', 'Давлат божи тўланганлиги тўғрисидаги ҳужжат.', 'Шикоятнинг ишда иштирок этувчи шахслар учун нусхалари.'], 'att')}
      ${signLine(c, 'date', 'pl')}`,
  },
];

export const MORE_CORPORATE: DocTemplate[] = [
  {
    id: 'annual-meeting', cat: 'corporate', sub: 'decisions', minutes: 7,
    docTitle: 'Иштирокчиларнинг навбатдаги (йиллик) умумий йиғилиши баённомаси',
    title: tr('Yillik umumiy yigʻilish bayonnomasi', 'Протокол ежегодного общего собрания', 'Annual general meeting minutes'),
    desc: tr('MChJ ishtirokchilarining yillik yigʻilishi: kvorum avtomatik, hisobot, foyda, direktor hisoboti.', 'Ежегодное собрание участников ООО: кворум автоматически, отчёт, прибыль, отчёт директора.', 'Annual meeting of LLC participants: quorum computed, report, profit, director’s report.'),
    fields: [
      { k: 'company', g: 'meeting', l: L.company, ex: 'Намуна Савдо' },
      { k: 'no', g: 'meeting', l: L.number, ex: '1', half: true },
      { k: 'date', g: 'meeting', l: L.date, t: 'date', ex: '2027-03-25', half: true },
      { k: 'place', g: 'meeting', l: tr('Oʻtkazilgan joy', 'Место проведения', 'Venue'), ex: 'Тошкент ш., Юнусобод тумани, Амир Темур кўчаси, 1-уй' },
      { k: 'chair', g: 'meeting', l: tr('Rais', 'Председатель', 'Chair'), ex: 'Каримов А.Б.', half: true },
      { k: 'secr', g: 'meeting', l: tr('Kotib', 'Секретарь', 'Secretary'), ex: 'Раҳимова Д.Ш.', half: true },
      { k: 'parts', g: 'participants', l: tr('Ishtirokchilar (qatnashganlar)', 'Участники (присутствуют)', 'Participants present'), t: 'rows',
        cols: [{ k: 'name', l: L.fio }, { k: 'share', l: tr('Ulush, %', 'Доля, %', 'Share, %'), num: true }],
        ex: [{ name: 'Каримов Алишер Баҳромович', share: '60' }, { name: 'Раҳимова Дилноза Шавкатовна', share: '40' }] },
      { k: 'year', g: 'result', l: tr('Hisobot yili', 'Отчётный год', 'Reporting year'), ex: '2026', half: true },
      { k: 'profit', g: 'result', l: tr('Yillik sof foyda', 'Чистая прибыль за год', 'Net profit for the year'), t: 'money', ex: '480000000', half: true },
      { k: 'use', g: 'result', l: tr('Foydani ishlatish', 'Использование прибыли', 'Use of profit'), t: 'select', opts: ['жамиятни ривожлантиришга йўналтирилсин', 'дивиденд сифатида иштирокчилар ўртасида улушларига мутаносиб тақсимлансин', 'қисман тақсимланиб, қолган қисми ривожлантиришга йўналтирилсин'], ex: 'жамиятни ривожлантиришга йўналтирилсин' },
      { k: 'dir', g: 'result', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Director'), ex: 'Каримов Алишер Баҳромович' },
    ],
    render: c => {
      const rows = c.rows('parts').filter(r => (r['name'] ?? '').trim());
      const q = rows.reduce((s, r) => { const n = parseNum(r['share'] ?? ''); return isFinite(n) ? s + n : s; }, 0);
      return `
      <p class="c">«${c.x('company')}» масъулияти чекланган жамияти</p>
      <h2>Иштирокчиларнинг навбатдаги (йиллик) умумий йиғилиши баённомаси № ${c.x('no', 3)}</h2>
      ${meta(c.date('date'), c.x('place', 20))}
      ${p('Йиғилишда иштирок этдилар:')}
      ${ol(rows.length ? rows.map(r => `${c.span(esc(r['name']))} — устав капиталидаги улуши ${c.span(esc(r['share'] ?? ''))}%`) : [c.blank(30)])}
      ${p(`Йиғилишда жами ${q ? c.span(String(q)) : c.blank(3)}% овозга эга иштирокчилар қатнашмоқда. ${q > 50 ? 'Кворум мавжуд, йиғилиш ваколатли.' : 'Кворум масаласи текширилсин.'}`)}
      ${p(`Йиғилиш раиси — ${c.x('chair', 14)}, котиби — ${c.x('secr', 14)}.`)}
      <h3>Кун тартиби:</h3>
      ${ol([`Жамиятнинг ${c.x('year', 4)} йилдаги фаолияти ва йиллик молиявий ҳисоботини тасдиқлаш.`, 'Соф фойдани тақсимлаш.', 'Директорнинг ҳисоботини эшитиш.'])}
      <h3>Қарор қилинди:</h3>
      ${ol([
        `Жамиятнинг ${c.x('year', 4)} йилдаги фаолияти ва йиллик молиявий ҳисоботи тасдиқлансин.`,
        `${c.x('year', 4)} йил якунлари бўйича олинган ${c.money('profit')} миқдоридаги соф фойда ${c.x('use', 30)}.`,
        `Директор ${c.x('dir', 18)}нинг ҳисоботи маълумот учун қабул қилинсин, унинг фаолияти қониқарли деб топилсин.`,
      ])}
      ${p('Овоз бериш натижалари: барча масалалар бўйича «ёқлаб» — 100%, «қарши» — йўқ, «бетараф» — йўқ.')}
      ${sigTable('Йиғилиш раиси', `____________ ${c.x('chair', 14)}`)}
      ${sigTable('Йиғилиш котиби', `____________ ${c.x('secr', 14)}`)}`;
    },
  },
  {
    id: 'participant-exit', cat: 'corporate', sub: 'decisions', minutes: 3,
    docTitle: 'Иштирокчининг жамиятдан чиқиши тўғрисида ариза',
    title: tr('Ishtirokchining jamiyatdan chiqish arizasi', 'Заявление участника о выходе из общества', 'Participant’s withdrawal notice'),
    desc: tr('MChJ ishtirokchisining jamiyatdan chiqishi va ulushning haqiqiy qiymatini toʻlashni talab qilishi.', 'Выход участника из ООО и требование выплаты действительной стоимости доли.', 'An LLC participant withdraws and claims the actual value of the share.'),
    fields: [
      { k: 'company', g: 'company', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
      { k: 'dir', g: 'company', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Director'), ex: 'А.Б. Каримов' },
      { k: 'ap', g: 'applicant', l: L.fio, ex: 'Раҳимова Дилноза Шавкатовна' },
      { k: 'ap_pass', g: 'applicant', l: passLabel, ex: 'AA 1112223, Чилонзор тумани ИИБ, 05.05.2017' },
      { k: 'ap_addr', g: 'applicant', l: L.addr, ex: 'Тошкент ш., Чилонзор тумани, Бунёдкор шоҳ кўчаси, 10-уй, 5-хонадон' },
      { k: 'share', g: 'applicant', l: tr('Ulush, %', 'Доля, %', 'Share, %'), t: 'number', ex: '40', half: true },
      { k: 'pay', g: 'applicant', l: tr('Toʻlov shakli', 'Форма выплаты', 'Payment form'), t: 'select', opts: ['пул маблағлари билан', 'шу қийматдаги мол-мулк билан'], ex: 'пул маблағлари билан', half: true },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${addressee(`<b>${c.x('company', 20)} директори</b>`, `${c.x('dir', 14)}га`, `Жамият иштирокчиси ${c.x('ap', 22)}дан`, `Паспорт: ${c.x('ap_pass', 18)}`, `Манзил: ${c.x('ap_addr', 24)}`)}
      <h2>Ариза</h2>
      <p class="c"><i>жамият иштирокчилари таркибидан чиқиш тўғрисида</i></p>
      ${p(`Мен, ${c.x('ap', 22)}, ${c.x('company', 18)} устав капиталидаги ${c.x('share', 3)}% улушнинг эгаси сифатида, «Масъулияти чекланган ҳамда қўшимча масъулиятли жамиятлар тўғрисида»ги Ўзбекистон Республикаси Қонуни ва жамият уставига мувофиқ жамият иштирокчилари таркибидан чиқаётганимни маълум қиламан.`)}
      ${p(`Қонунда белгиланган муддат ва тартибда менга улушимнинг ҳақиқий қийматини ${c.x('pay', 14)} тўлашингизни ва жамиятнинг таъсис ҳужжатларига тегишли ўзгартиришларни киритиб, давлат рўйхатидан ўтказишингизни сўрайман.`)}
      ${signLine(c, 'date', 'ap')}`,
  },
  {
    id: 'claim-reply', cat: 'corporate', sub: 'claims', minutes: 4,
    docTitle: 'Талабномага жавоб',
    title: tr('Talabnomaga javob', 'Ответ на претензию', 'Reply to a claim letter'),
    desc: tr('Kelgan talabnomaga rasmiy javob: toʻliq/qisman tan olish yoki rad etish, asoslar, toʻlov taklifi.', 'Официальный ответ на претензию: признание полностью/частично или отказ, доводы, предложение.', 'Formal reply: full/partial acceptance or rejection, reasons, payment offer.'),
    fields: [
      { k: 'co', g: 'applicant', l: L.company, ex: '«Мисол Хизмат» МЧЖ' },
      { k: 'co_stir', g: 'applicant', l: tr('STIR', 'ИНН', 'TIN'), ex: '302765432', half: true },
      { k: 'out', g: 'doc', l: tr('Chiquvchi raqam', 'Исходящий №', 'Reference No.'), ex: '23/26', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-12' },
      { k: 'org', g: 'addressee', l: tr('Talabnoma yuborgan tashkilot', 'Отправитель претензии', 'Claimant company'), ex: '«Намуна Савдо» МЧЖ' },
      { k: 'head', g: 'addressee', l: tr('Rahbar F.I.Sh.', 'Ф.И.О. руководителя', 'Head'), ex: 'А.Б. Каримов' },
      { k: 'c_no', g: 'contract', l: tr('Talabnoma raqami', 'Номер претензии', 'Claim No.'), ex: '52/26', half: true },
      { k: 'c_date', g: 'contract', l: tr('Talabnoma sanasi', 'Дата претензии', 'Claim date'), t: 'date', ex: '2026-10-05', half: true },
      { k: 'claimed', g: 'contract', l: tr('Talab qilingan summa', 'Заявленная сумма', 'Amount claimed'), t: 'money', ex: '22960000' },
      { k: 'res', g: 'contract', l: tr('Qaror', 'Решение', 'Decision'), t: 'select', opts: ['тўлиқ тан олинади', 'қисман тан олинади', 'рад этилади'], ex: 'қисман тан олинади', half: true },
      { k: 'accepted', g: 'contract', l: tr('Tan olingan summa', 'Признанная сумма', 'Accepted amount'), t: 'money', ex: '20500000', half: true },
      { k: 'why', g: 'contract', l: tr('Asoslar', 'Обоснование', 'Reasons'), t: 'textarea', ex: 'Асосий қарз суммаси тан олинади. Пеня бўйича талаб рад этилади, чунки тўловнинг кечикиши Кредитор томонидан ҳисобварақ-фактуранинг кечиктириб тақдим этилиши билан боғлиқ.' },
      { k: 'when', g: 'contract', l: tr('Toʻlov muddati', 'Срок оплаты', 'Payment date'), t: 'date', ex: '2026-10-31', half: true },
      { k: 'sign_fio', g: 'sign', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Director'), ex: 'Д.Ш. Раҳимова', half: true },
    ],
    render: c => `
      <p class="c"><b>${c.x('co', 22)}</b> · СТИР ${c.x('co_stir', 9)}</p>
      <p>${c.dshort('date')} № ${c.x('out', 6)}</p>
      ${addressee(`<b>${c.x('org', 20)} раҳбари</b>`, `${c.x('head', 14)}га`)}
      <h2>Талабномага жавоб</h2>
      ${p(`Сизнинг ${c.dshort('c_date')} йилдаги ${c.x('c_no', 5)}-сонли талабномангиз (талаб қилинган сумма ${c.money('claimed')}) кўриб чиқилди.`)}
      ${p(`Талабнома ${c.x('res', 12)}.`)}
      ${p(c.x('why', 40))}
      ${c.raw('res') !== 'рад этилади' ? p(`Тан олинган ${c.money('accepted')} миқдоридаги сумма ${c.date('when')}гача ҳисоб рақамингизга ўтказилади.`) : ''}
      <table class="sig"><tr><td>Директор</td><td class="r">____________ ${c.x('sign_fio', 14)}</td></tr></table>`,
  },
];
