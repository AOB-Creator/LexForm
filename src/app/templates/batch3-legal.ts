import { esc, fmtMoney, parseNum } from '../core/doc/format';
import { Ctx, meta, ol, p, sigTable } from '../core/doc/engine';
import { DocTemplate, FieldDef } from '../core/doc/types';
import { addressee, attachments, EX_A, L, partyFields, personCell, personFields, signLine, tr } from './shared';

const who = (c: Ctx, k: string) => `${c.x(k, 22)} (паспорт: ${c.x(k + '_pass', 18)}, яшаш манзили: ${c.x(k + '_addr', 24)})`;
const notaryBox = `<div class="pb"></div><p class="c"><b>Нотариал тасдиқлаш учун жой</b></p><p class="c"><i>(нотариус тўлдиради)</i></p>`;
const cityDate: FieldDef[] = [
  { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент шаҳри', half: true },
  { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
];
const H = { fio: 'Каримов Фаррух Олимович', pass: 'AB 5566778, Мирзо Улуғбек тумани ИИБ, 20.01.2018', addr: 'Тошкент ш., Мирзо Улуғбек тумани, Буюк Ипак йўли кўчаси, 45-уй, 7-хонадон' };
const W = { fio: 'Каримова Нигора Ботировна', pass: 'AA 2233445, Юнусобод тумани ИИБ, 14.07.2019', addr: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадон' };
const noAcc = (fs: FieldDef[]) => fs.filter(f => !f.k.endsWith('_acc'));
const COURT = 'Фуқаролик ишлари бўйича Юнусобод туманлараро суди';
const sum = (c: Ctx, k: string, col: string) => c.rows(k).reduce((s, r) => { const n = parseNum(r[col] ?? ''); return isFinite(n) ? s + n : s; }, 0);

export const BATCH3_NOTARIAL: DocTemplate[] = [
  {
    id: 'marriage-contract', cat: 'notarial', sub: 'contracts', minutes: 8,
    docTitle: 'Никоҳ шартномаси',
    title: tr('Nikoh shartnomasi', 'Брачный договор', 'Prenuptial / marriage contract'),
    desc: tr('Er-xotinning mulkiy huquq va majburiyatlari: mulk rejimi, alohida mulk roʻyxati, nikoh bekor boʻlganda. Notarial tasdiqlanadi.', 'Имущественные права супругов: режим, раздельное имущество, при расторжении. Нотариально.', 'Spouses’ property regime, separate property, terms on divorce. Notarised.'),
    fields: [
      ...cityDate,
      ...noAcc(personFields('h', 'party1', H)),
      ...noAcc(personFields('wf', 'party2', W)),
      { k: 'when', g: 'marriage', l: tr('Nikoh', 'Брак', 'Marriage'), t: 'select', opts: ['никоҳ давлат рўйхатидан ўтказилгунга қадар', 'никоҳ даврида'], ex: 'никоҳ даврида', half: true },
      { k: 'reg', g: 'marriage', l: tr('Nikoh qayd etilgan (boʻlsa)', 'Брак зарегистрирован (если)', 'Marriage registered (if)'), ex: '20.06.2014, Юнусобод тумани ФҲДЁ бўлими', half: true },
      { k: 'regime', g: 'property', l: tr('Mulk rejimi', 'Режим имущества', 'Property regime'), t: 'select', opts: ['алоҳида мулк режими', 'улушли мулк режими', 'аралаш режим (айрим мол-мулк алоҳида)'], ex: 'аралаш режим (айрим мол-мулк алоҳида)' },
      { k: 'own', g: 'property', l: tr('Alohida mulk deb belgilanadigan mol-mulk', 'Раздельное имущество', 'Separate property'), t: 'rows',
        cols: [{ k: 'what', l: tr('Mol-mulk', 'Имущество', 'Item') }, { k: 'whose', l: tr('Kimning mulki', 'Чьё', 'Owner') }],
        ex: [{ what: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадон', whose: 'хотинининг' }, { what: '«Намуна Савдо» МЧЖ устав капиталидаги 60% улуш', whose: 'эрининг' }] },
      { k: 'divorce', g: 'property', l: tr('Nikoh bekor boʻlganda', 'При расторжении брака', 'On divorce'), t: 'textarea', ex: 'Никоҳ давомида биргаликда орттирилган бошқа мол-мулк тенг улушларда тақсимланади.' },
    ],
    render: c => {
      const own = c.rows('own').filter(r => (r['what'] ?? '').trim());
      return `
      <h2>Никоҳ шартномаси</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Биз, ${who(c, 'h')}, ва ${who(c, 'wf')}, ${c.x('when', 16)}${c.has('reg') ? ' (никоҳ ' + c.x('reg') + 'да қайд этилган)' : ''}, Ўзбекистон Республикаси Оила кодексига мувофиқ ушбу никоҳ шартномасини туздик:`)}
      ${ol([
        `Эр-хотиннинг мол-мулкига нисбатан ${c.x('regime', 18)} белгиланади.`,
        own.length ? `Қуйидаги мол-мулк тарафлардан бирининг алоҳида мулки ҳисобланади ва тақсимланмайди: ${own.map(r => `${c.span(esc(r['what']))} — ${c.span(esc(r['whose'] ?? ''))} алоҳида мулки`).join('; ')}.` : 'Алоҳида мулк белгиланмаган.',
        'Ҳар бир тараф ўзининг алоҳида мулкига мустақил равишда эгалик қилади, ундан фойдаланади ва уни тасарруф этади.',
        `Никоҳ бекор қилинган тақдирда: ${c.x('divorce', 30)}`,
        'Шартнома вояга етмаган болаларнинг ҳуқуқларини чекламайди ва тарафлардан бирини жуда ноқулай аҳволга солиб қўядиган шартларни назарда тутмайди.',
        'Шартнома тарафларнинг келишуви билан ўзгартирилиши ёки бекор қилиниши мумкин. Шартнома нотариал тасдиқланган кундан (никоҳдан олдин тузилганда — никоҳ қайд этилган кундан) кучга киради.',
        'Шартнома уч нусхада тузилди: биттаси нотариал идорада сақланади, қолганлари тарафларга берилади.',
      ])}
      ${sigTable(`<b>Эр</b><br><br>____________ ${c.x('h', 18)}`, `<b>Хотин</b><br><br>____________ ${c.x('wf', 18)}`)}
      ${notaryBox}`;
    },
  },
  {
    id: 'alimony-agreement', cat: 'notarial', sub: 'contracts', minutes: 5,
    docTitle: 'Алимент тўлаш тўғрисида келишув',
    title: tr('Aliment toʻlash toʻgʻrisida kelishuv', 'Соглашение об уплате алиментов', 'Child-support agreement'),
    desc: tr('Ota-onaning sudsiz kelishuvi: oylik summa yoki ulush, toʻlov usuli, indeksatsiya. Notarial tasdiqlanadi.', 'Соглашение родителей без суда: сумма или доля, способ, индексация. Нотариально.', 'Out-of-court agreement between parents: amount or share, method, indexation. Notarised.'),
    fields: [
      ...cityDate,
      ...noAcc(personFields('pay', 'party1', H)),
      ...personFields('rec', 'party2', W),
      { k: 'kids', g: 'children', l: tr('Bolalar', 'Дети', 'Children'), t: 'rows', cols: [{ k: 'fio', l: L.fio }, { k: 'born', l: tr('Tugʻilgan sanasi', 'Дата рождения', 'Date of birth') }],
        ex: [{ fio: 'Каримов Жавоҳир Фаррухович', born: '12.03.2016' }, { fio: 'Каримова Мадина Фарруховна', born: '05.09.2019' }] },
      { k: 'amount', g: 'payment', l: tr('Oylik summa', 'Сумма в месяц', 'Monthly amount'), t: 'money', ex: '3000000', half: true },
      { k: 'day', g: 'payment', l: tr('Toʻlov kuni', 'День оплаты', 'Pay day'), t: 'number', ex: '10', half: true },
      { k: 'how', g: 'payment', l: tr('Toʻlov usuli', 'Способ', 'Method'), t: 'select', opts: ['олувчининг банк картасига ўтказиш', 'олувчининг банк ҳисоб рақамига ўтказиш', 'нақд пулда тилхат асосида'], ex: 'олувчининг банк картасига ўтказиш' },
    ],
    render: c => {
      const kids = c.rows('kids').filter(r => (r['fio'] ?? '').trim());
      const list = kids.length ? kids.map(r => `${c.span(esc(r['fio']))} (${c.span(esc(r['born'] ?? ''))} йилда туғилган)`).join(', ') : c.blank(30);
      return `
      <h2>Алимент тўлаш тўғрисида келишув</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Биз, ${who(c, 'pay')} (кейинги ўринларда «Тўловчи»), ва ${who(c, 'rec')} (кейинги ўринларда «Олувчи»), Ўзбекистон Республикаси Оила кодексига мувофиқ вояга етмаган фарзандларимиз ${list}нинг таъминоти учун ушбу келишувни туздик:`)}
      ${ol([
        `Тўловчи болалар таъминоти учун ҳар ойда ${c.money('amount')} миқдорида алимент тўлайди.`,
        `Алимент ҳар ойнинг ${c.x('day', 2)}-санасигача ${c.x('how', 24)} йўли билан тўланади.`,
        'Алимент миқдори энг кам иш ҳақи миқдори ўзгарганда унга мутаносиб равишда индексация қилинади.',
        'Алимент болалар вояга етгунга қадар тўланади. Тўлов кечиктирилганда Тўловчи қонунчиликда белгиланган жавобгарликни олади.',
        'Нотариал тасдиқланган ушбу келишув ижро ҳужжати кучига эга.',
        'Келишув тарафларнинг ўзаро розилиги билан ўзгартирилиши ёки бекор қилиниши мумкин. Келишув уч нусхада тузилди.',
      ])}
      ${sigTable(`<b>Тўловчи</b><br><br>____________ ${c.x('pay', 18)}`, `<b>Олувчи</b><br>Карта/ҳисоб: ${c.x('rec_acc', 16)}<br><br>____________ ${c.x('rec', 18)}`)}
      ${notaryBox}`;
    },
  },
  {
    id: 'realty-poa', cat: 'notarial', sub: 'poa', minutes: 5,
    docTitle: 'Кўчмас мулкни сотиш учун ишончнома',
    title: tr('Koʻchmas mulkni sotish uchun ishonchnoma', 'Доверенность на продажу недвижимости', 'Power of attorney to sell real estate'),
    desc: tr('Vakilga uy-joyni sotish, shartnoma imzolash, pulni olish va roʻyxatdan oʻtkazish vakolati.', 'Полномочия продать жильё, подписать договор, получить деньги, зарегистрировать.', 'Power to sell a home, sign, receive payment and register the transfer.'),
    fields: [
      ...cityDate,
      ...noAcc(personFields('pr', 'principal', W)),
      ...noAcc(personFields('ag', 'agent', { fio: 'Каримов Олим Баҳодирович', pass: 'AC 9988776, Яшнобод тумани ИИБ, 03.03.2016', addr: 'Тошкент ш., Яшнобод тумани, Тузель кўчаси, 6-уй' })),
      { k: 'obj', g: 'object', l: tr('Koʻchmas mulk', 'Недвижимость', 'Property'), t: 'textarea', ex: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадондаги икки хонали квартира (кадастр рақами 10:05:01:02:03:0045)' },
      { k: 'min', g: 'object', l: tr('Eng kam narx (ixtiyoriy)', 'Минимальная цена (опц.)', 'Minimum price (optional)'), t: 'money', half: true },
      { k: 'until', g: 'powers', l: tr('Amal qilish muddati', 'Срок действия', 'Valid until'), t: 'date', ex: '2027-04-05', half: true },
    ],
    render: c => `
      <h2>Ишончнома</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Мен, ${who(c, 'pr')}, ушбу ишончнома билан ${who(c, 'ag')}га менга мулк ҳуқуқи асосида тегишли бўлган ${c.x('obj', 30)}ни ${c.has('min') ? c.money('min') + 'дан кам бўлмаган нархда, ' : ''}ўз хоҳишига кўра сотишни ишониб топшираман.`)}
      ${p('Шу мақсадда ишончли вакилга қуйидаги ҳуқуқлар берилади: кадастр, нотариал ва бошқа идораларда менинг номимдан вакиллик қилиш; зарур маълумотномалар ва ҳужжатларни олиш; олди-сотди шартномаси ва топшириш-қабул қилиш далолатномасини имзолаш; сотилган мулк учун пул маблағларини олиш; мулк ҳуқуқининг ўтишини давлат рўйхатидан ўтказиш; ушбу топшириқ билан боғлиқ бошқа ҳаракатларни амалга ошириш.')}
      ${p(`Ишончнома ${c.date('until')}гача амал қилади ва ваколатларни бошқа шахсга ишониш ҳуқуқисиз берилди. Фуқаролик кодексининг ишончномага оид нормалари менга тушунтирилди.`)}
      ${sigTable('Ишонч билдирувчи', `____________ ${c.x('pr', 18)}`)}
      ${notaryBox}`,
  },
  {
    id: 'spouse-consent', cat: 'notarial', sub: 'applications', minutes: 3,
    docTitle: 'Эр (хотин)нинг розилиги',
    title: tr('Er (xotin)ning bitimga roziligi', 'Согласие супруга на сделку', 'Spouse’s consent to a transaction'),
    desc: tr('Umumiy mulkni sotish, garovga qoʻyish yoki hadya qilishga turmush oʻrtogʻining notarial roziligi.', 'Нотариальное согласие супруга на продажу, залог или дарение общего имущества.', 'Notarised consent of a spouse to sell, pledge or gift joint property.'),
    fields: [
      ...cityDate,
      ...noAcc(personFields('sp', 'party1', H)),
      { k: 'other', g: 'party2', l: tr('Turmush oʻrtogʻi F.I.Sh.', 'Ф.И.О. супруга', 'Spouse full name'), ex: W.fio },
      { k: 'act', g: 'object', l: tr('Bitim', 'Сделка', 'Transaction'), t: 'select', opts: ['сотишга', 'гаровга қўйишга', 'ҳадя қилишга', 'ижарага беришга'], ex: 'сотишга', half: true },
      { k: 'price', g: 'object', l: tr('Narx (ixtiyoriy)', 'Цена (опц.)', 'Price (optional)'), t: 'money', half: true },
      { k: 'obj', g: 'object', l: tr('Mol-mulk', 'Имущество', 'Property'), t: 'textarea', ex: 'никоҳ давомида биргаликда орттирилган, Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадондаги икки хонали квартира' },
    ],
    render: c => `
      <h2>Розилик</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Мен, ${who(c, 'sp')}, турмуш ўртоғим ${c.x('other', 22)}га ${c.x('obj', 30)}ни ${c.has('price') ? c.money('price') + ' нархда ва ' : ''}ўз хоҳишига кўра шартлар асосида ${c.x('act', 10)} розилик бераман.`)}
      ${p('Ушбу розиликнинг мазмуни ва ҳуқуқий оқибатлари, шу жумладан Оила кодексининг эр-хотиннинг умумий мол-мулкини тасарруф этишга оид нормалари менга нотариус томонидан тушунтирилди.')}
      ${sigTable('Розилик берувчи', `____________ ${c.x('sp', 18)}`)}
      ${notaryBox}`,
  },
];

const parties = (pl: { fio: string; addr: string }, df: { fio: string; addr: string }): FieldDef[] => [
  { k: 'court', g: 'court', l: tr('Sud nomi', 'Наименование суда', 'Court'), ex: COURT },
  { k: 'pl', g: 'plaintiff', l: L.fio, ex: pl.fio },
  { k: 'pl_addr', g: 'plaintiff', l: L.addr, ex: pl.addr },
  { k: 'pl_phone', g: 'plaintiff', l: L.phone, ex: '+998 90 111-22-33', half: true },
  { k: 'df', g: 'defendant', l: tr('F.I.Sh. / nomi', 'Ф.И.О. / наименование', 'Name'), ex: df.fio },
  { k: 'df_addr', g: 'defendant', l: L.addr, ex: df.addr },
];
const courtHead = (c: Ctx, a = 'Даъвогар', b = 'Жавобгар') => addressee(`<b>${c.x('court', 26)}га</b>`, `<b>${a}:</b> ${c.x('pl', 22)}`, `Манзил: ${c.x('pl_addr', 24)}`, c.has('pl_phone') ? `Тел.: ${c.x('pl_phone')}` : '', `<b>${b}:</b> ${c.x('df', 22)}`, `Манзил: ${c.x('df_addr', 24)}`);
const att: FieldDef = { k: 'att', g: 'claim', l: tr('Qoʻshimcha ilovalar (har biri yangi qatordan)', 'Доп. приложения (каждое с новой строки)', 'Extra attachments (one per line)'), t: 'textarea' };
const date: FieldDef = { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' };
const caseNo: FieldDef[] = [
  { k: 'case', g: 'case', l: tr('Ish raqami', 'Номер дела', 'Case No.'), ex: '2-1234/2026', half: true },
  { k: 'judge', g: 'case', l: tr('Sudya', 'Судья', 'Judge'), ex: 'Б.Б. Бахтиёров', half: true },
];

export const BATCH3_COURT: DocTemplate[] = [
  {
    id: 'court-damages', cat: 'court', sub: 'claims', minutes: 6,
    docTitle: 'Зарарни қоплаш тўғрисида даъво аризаси',
    title: tr('Zararni qoplash toʻgʻrisida daʼvo', 'Иск о возмещении ущерба', 'Claim for damages'),
    desc: tr('Mol-mulkka yetkazilgan zarar (suv bosish, YTH va boshq.): zarar tarkibi jadvali, jami avtomatik.', 'Ущерб имуществу (залив, ДТП и др.): состав ущерба, итог считается.', 'Property damage (flooding, accident, etc.): itemised damage, total computed.'),
    fields: [
      ...parties(W, { fio: 'Сафаров Илҳом Баҳодирович', addr: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 38-хонадон' }),
      { k: 'when', g: 'claim', l: tr('Hodisa sanasi', 'Дата происшествия', 'Date of incident'), t: 'date', ex: '2026-08-21', half: true },
      { k: 'what', g: 'claim', l: tr('Hodisa', 'Происшествие', 'Incident'), t: 'textarea', ex: 'Жавобгарнинг юқори қаватдаги хонадонида сув қувури ёрилиши натижасида менинг хонадонимни сув босди. Бу ҳолат уй-жой мулкдорлари ширкати томонидан тузилган далолатнома билан тасдиқланган.' },
      { k: 'items', g: 'property', l: tr('Zarar tarkibi', 'Состав ущерба', 'Damage items'), t: 'rows',
        cols: [{ k: 'name', l: tr('Nima', 'Что', 'Item') }, { k: 'sum', l: tr('Summa', 'Сумма', 'Amount'), num: true }],
        ex: [{ name: 'Шифт ва деворларни таъмирлаш', sum: '12500000' }, { name: 'Ламинат пол қопламасини алмаштириш', sum: '8400000' }, { name: 'Баҳолаш хизмати', sum: '1500000' }] },
      att, date,
    ],
    render: c => {
      const total = sum(c, 'items', 'sum');
      const rows = c.rows('items').filter(r => (r['name'] ?? '').trim());
      return `
      ${courtHead(c)}
      <h2>Даъво аризаси</h2>
      <p class="c"><i>етказилган зарарни қоплаш тўғрисида</i></p>
      ${p(`${c.date('when')}да қуйидаги ҳодиса юз берди: ${c.x('what', 40)}`)}
      ${p('Натижада менга қуйидаги зарар етказилди:')}
      <table class="t"><tr><th>№</th><th>Зарар</th><th>Сумма</th></tr>${rows.map((r, i) => `<tr><td class="n">${i + 1}</td><td>${c.span(esc(r['name']))}</td><td class="n">${fmtMoney(parseNum(r['sum'] ?? '') || 0)}</td></tr>`).join('')}<tr><td></td><td><b>Жами</b></td><td class="n"><b>${fmtMoney(total)}</b></td></tr></table>
      ${p('Ўзбекистон Республикаси Фуқаролик кодексига мувофиқ, фуқаронинг мол-мулкига етказилган зарар уни етказган шахс томонидан тўлиқ ҳажмда қопланиши лозим. Зарарни ихтиёрий қоплаш тўғрисидаги талабим бажарилмади.')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`Жавобгар ${c.x('df', 18)}дан менинг фойдамга ${c.moneyN(total)} миқдоридаги зарар ундирилсин.`, 'Жавобгардан суд харажатлари ундирилсин.'])}
      ${attachments(c, ['Ҳодиса тўғрисидаги далолатнома нусхаси.', 'Зарарни баҳолаш ҳисоботи.', 'Мол-мулкка эгаликни тасдиқловчи ҳужжат нусхаси.', 'Давлат божи тўланганлиги тўғрисидаги ҳужжат.', 'Даъво аризасининг жавобгар учун нусхаси.'], 'att')}
      ${signLine(c, 'date', 'pl')}`;
    },
  },
  {
    id: 'court-consumer', cat: 'court', sub: 'claims', minutes: 5,
    docTitle: 'Истеъмолчининг ҳуқуқларини ҳимоя қилиш тўғрисида даъво аризаси',
    title: tr('Isteʼmolchi huquqlarini himoya qilish daʼvosi', 'Иск о защите прав потребителя', 'Consumer protection claim'),
    desc: tr('Sotuvchidan sifatsiz tovar puli, neustoyka va maʼnaviy zararni undirish.', 'Взыскание с продавца стоимости товара, неустойки и морального вреда.', 'Recover the price, penalty and non-pecuniary damage from a seller.'),
    fields: [
      ...parties(W, { fio: '«Техно Намуна» МЧЖ', addr: 'Тошкент ш., Юнусобод тумани, Амир Темур кўчаси, 107-уй' }),
      { k: 'item', g: 'claim', l: tr('Tovar', 'Товар', 'Product'), ex: 'Samsung русумли кир ювиш машинаси', half: true },
      { k: 'bought', g: 'claim', l: tr('Xarid sanasi', 'Дата покупки', 'Purchase date'), t: 'date', ex: '2026-09-12', half: true },
      { k: 'price', g: 'claim', l: tr('Narxi', 'Цена', 'Price'), t: 'money', ex: '5400000', half: true },
      { k: 'claimDate', g: 'claim', l: tr('Talabnoma berilgan sana', 'Дата претензии', 'Claim letter date'), t: 'date', ex: '2026-09-20', half: true },
      { k: 'pen', g: 'claim', l: tr('Neustoyka', 'Неустойка', 'Penalty'), t: 'money', ex: '540000', half: true },
      { k: 'moral', g: 'claim', l: tr('Maʼnaviy zarar', 'Моральный вред', 'Non-pecuniary damage'), t: 'money', ex: '1000000', half: true },
      { k: 'what', g: 'claim', l: tr('Kamchilik va holatlar', 'Недостаток и обстоятельства', 'Defect and facts'), t: 'textarea', ex: 'Товар сиқиш режимида ўзидан ўзи ўчиб қолади. Сотувчига берилган талабнома жавобсиз қолди.' },
      att, date,
    ],
    render: c => {
      const total = [c.num('price'), c.num('pen'), c.num('moral')].reduce((s, n) => s + (isFinite(n) ? n : 0), 0);
      return `
      ${courtHead(c)}
      <h2>Даъво аризаси</h2>
      <p class="c"><i>истеъмолчининг ҳуқуқларини ҳимоя қилиш тўғрисида</i></p>
      ${p(`${c.date('bought')}да жавобгардан ${c.x('item', 20)}ни ${c.money('price')}га сотиб олдим. ${c.x('what', 30)}`)}
      ${p(`${c.date('claimDate')}да жавобгарга тўланган пулни қайтариш ҳақида талабнома бердим, бироқ талабим қонунда белгиланган муддатда қондирилмади.`)}
      ${p('«Истеъмолчиларнинг ҳуқуқларини ҳимоя қилиш тўғрисида»ги Ўзбекистон Республикаси Қонунига мувофиқ, сифатсиз товар сотилганда истеъмолчи тўланган пулни қайтаришни, талаб бажарилмаган муддат учун неустойкани ва маънавий зарарни қоплашни талаб қилишга ҳақли.')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`Жавобгардан менинг фойдамга товар учун тўланган ${c.money('price')} ундирилсин.`, `Талабни қондириш муддати бузилгани учун ${c.money('pen')} неустойка ундирилсин.`, `${c.money('moral')} маънавий зарар ундирилсин. Жами: ${c.moneyN(total)}.`])}
      ${attachments(c, ['Касса чеки ва кафолат талони нусхалари.', 'Талабнома нусхаси ва юборилганлигини тасдиқловчи ҳужжат.', 'Даъво аризасининг жавобгар учун нусхаси.'], 'att')}
      ${signLine(c, 'date', 'pl')}`;
    },
  },
  {
    id: 'court-motion', cat: 'court', sub: 'responses', minutes: 2,
    docTitle: 'Илтимоснома',
    title: tr('Iltimosnoma (ish koʻrishni qoldirish va boshq.)', 'Ходатайство (об отложении и др.)', 'Motion (adjournment, etc.)'),
    desc: tr('Sudga iltimosnoma: ishni keyinga qoldirish, dalil talab qilish, ekspertiza tayinlash va boshq.', 'Ходатайство в суд: отложение, истребование доказательств, экспертиза и др.', 'Motion to the court: adjournment, evidence request, expert examination, etc.'),
    fields: [
      { k: 'court', g: 'court', l: tr('Sud nomi', 'Наименование суда', 'Court'), ex: COURT },
      ...caseNo,
      { k: 'pl', g: 'applicant', l: L.fio, ex: W.fio },
      { k: 'role', g: 'applicant', l: tr('Ishdagi maqomi', 'Статус в деле', 'Role'), t: 'select', opts: ['даъвогар', 'жавобгар', 'учинчи шахс', 'вакил'], ex: 'жавобгар', half: true },
      { k: 'pl_phone', g: 'applicant', l: L.phone, ex: '+998 90 111-22-33', half: true },
      { k: 'hearing', g: 'case', l: tr('Sud majlisi sanasi', 'Дата заседания', 'Hearing date'), t: 'date', ex: '2026-10-14', half: true },
      { k: 'kind', g: 'claim', l: tr('Iltimos', 'Ходатайство', 'Motion'), t: 'select', opts: ['суд мажлисини бошқа кунга қолдириш', 'қўшимча далилларни ишга қўшиш', 'суд экспертизасини тайинлаш', 'гувоҳни чақириш'], ex: 'суд мажлисини бошқа кунга қолдириш' },
      { k: 'why', g: 'claim', l: tr('Asos', 'Основание', 'Grounds'), t: 'textarea', ex: 'Суд мажлиси белгиланган кунда стационар даволанишда бўламан. Тасдиқловчи тиббий маълумотнома илова қилинади.' },
      date,
    ],
    render: c => `
      ${addressee(`<b>${c.x('court', 26)}га</b>`, `Судья ${c.x('judge', 14)}га`, `Иш № ${c.x('case', 10)} бўйича ${c.x('role', 8)}`, `${c.x('pl', 22)}дан`, c.has('pl_phone') ? `Тел.: ${c.x('pl_phone')}` : '')}
      <h2>Илтимоснома</h2>
      ${p(`Судингиз иш юритувида ${c.x('case', 10)}-сонли иш мавжуд, суд мажлиси ${c.date('hearing')}га белгиланган.`)}
      ${p(c.x('why', 40))}
      ${p('Ўзбекистон Республикаси Фуқаролик процессуал кодексига мувофиқ ишда иштирок этувчи шахслар илтимосномалар билан мурожаат қилиш ҳуқуқига эга. Юқоридагиларга асосан,')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`${c.x('kind', 24)}.`])}
      ${signLine(c, 'date', 'pl')}`,
  },
  {
    id: 'court-objection', cat: 'court', sub: 'responses', minutes: 5,
    docTitle: 'Даъво аризасига эътироз',
    title: tr('Daʼvo arizasiga eʼtiroz (izoh)', 'Возражение на исковое заявление', 'Statement of defence'),
    desc: tr('Javobgarning daʼvoga yozma eʼtirozi: daʼvo mazmuni, eʼtiroz asoslari, soʻrov.', 'Письменное возражение ответчика: суть иска, доводы, просьба.', 'Defendant’s written defence: claim summary, arguments, relief.'),
    fields: [
      { k: 'court', g: 'court', l: tr('Sud nomi', 'Наименование суда', 'Court'), ex: COURT },
      ...caseNo,
      { k: 'pl', g: 'defendant', l: tr('Javobgar F.I.Sh.', 'Ф.И.О. ответчика', 'Defendant'), ex: 'Алиев Тимур Рустамович' },
      { k: 'pl_addr', g: 'defendant', l: L.addr, ex: 'Тошкент ш., Чилонзор тумани, 5-мавзе, 3-уй, 7-хонадон' },
      { k: 'df', g: 'plaintiff', l: tr('Daʼvogar F.I.Sh.', 'Ф.И.О. истца', 'Claimant'), ex: 'Юсупов Шерзод Анварович' },
      { k: 'gist', g: 'claim', l: tr('Daʼvo talabi', 'Требование истца', 'What is claimed'), ex: '30 000 000 сўм қарзни ундириш' },
      { k: 'args', g: 'claim', l: tr('Eʼtiroz asoslari', 'Доводы', 'Arguments'), t: 'textarea', ex: 'Қарзнинг 25 000 000 сўми 2026 йил апрель–июнь ойларида банк картаси орқали қайтарилган, бу банк кўчирмаси билан тасдиқланади. Даъвогар ушбу тўловларни ҳисобга олмаган.' },
      { k: 'ask', g: 'claim', l: tr('Soʻrov', 'Просьба', 'Relief'), t: 'select', opts: ['даъвони қаноатлантиришни рад этиш', 'даъвони қисман қаноатлантириш'], ex: 'даъвони қисман қаноатлантириш' },
      att, date,
    ],
    render: c => `
      ${addressee(`<b>${c.x('court', 26)}га</b>`, `Иш № ${c.x('case', 10)}`, `<b>Жавобгар:</b> ${c.x('pl', 22)}`, `Манзил: ${c.x('pl_addr', 24)}`, `<b>Даъвогар:</b> ${c.x('df', 22)}`)}
      <h2>Даъво аризасига эътироз</h2>
      ${p(`Даъвогар ${c.x('df', 20)} мендан ${c.x('gist', 24)} тўғрисида даъво аризаси билан судга мурожаат қилган. Даъво талаблари билан қуйидаги асосларга кўра келишмайман:`)}
      ${p(c.x('args', 40))}
      ${p('Ўзбекистон Республикаси Фуқаролик процессуал кодексига мувофиқ, ҳар бир тараф ўз талаб ва эътирозларига асос қилиб келтирган ҳолатларни исботлаши лозим. Юқоридагиларга асосан,')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`${c.x('ask', 20)}.`])}
      ${attachments(c, ['Эътирозни асословчи ҳужжатлар нусхалари.', 'Эътирознинг даъвогар учун нусхаси.'], 'att')}
      ${signLine(c, 'date', 'pl')}`,
  },
];

export const BATCH3_CORPORATE: DocTemplate[] = [
  {
    id: 'llc-charter', cat: 'corporate', sub: 'charters', minutes: 10,
    docTitle: 'Масъулияти чекланган жамият устави',
    title: tr('MChJ ustavi (qisqa)', 'Устав ООО (краткий)', 'LLC charter (short)'),
    desc: tr('MChJ ustavining asosiy boʻlimlari: nom, faoliyat, ustav fondi va ulushlar (summa avtomatik), boshqaruv, chiqish, tugatish.', 'Основные разделы устава ООО: название, деятельность, уставный фонд и доли (суммы считаются), управление, выход, ликвидация.', 'Core LLC charter sections: name, business, capital and shares (amounts computed), management, exit, liquidation.'),
    fields: [
      { k: 'name', g: 'company', l: L.company, ex: 'Намуна Савдо' },
      { k: 'addr', g: 'company', l: tr('Pochta manzili', 'Почтовый адрес', 'Address'), ex: 'Тошкент ш., Юнусобод тумани, Амир Темур кўчаси, 1-уй' },
      { k: 'acts', g: 'company', l: tr('Asosiy faoliyat turlari', 'Основные виды деятельности', 'Main activities'), t: 'textarea', ex: 'озиқ-овқат маҳсулотлари улгуржи ва чакана савдоси; омбор хизматлари; юк ташиш' },
      { k: 'cap', g: 'company', l: tr('Ustav fondi', 'Уставный фонд', 'Charter capital'), t: 'money', ex: '50000000' },
      { k: 'parts', g: 'participants', l: tr('Ishtirokchilar', 'Участники', 'Participants'), t: 'rows', cols: [{ k: 'name', l: L.fio }, { k: 'share', l: tr('Ulush, %', 'Доля, %', 'Share, %'), num: true }],
        ex: [{ name: 'Каримов Алишер Баҳромович', share: '60' }, { name: 'Раҳимова Дилноза Шавкатовна', share: '40' }] },
      { k: 'term', g: 'company', l: tr('Direktor vakolat muddati', 'Срок полномочий директора', 'Director’s term'), ex: 'беш йил', half: true },
      { k: 'date', g: 'doc', l: tr('Tasdiqlangan sana', 'Дата утверждения', 'Approved on'), t: 'date', ex: '2026-10-05', half: true },
    ],
    render: c => {
      const cap = c.num('cap');
      const parts = c.rows('parts').filter(r => (r['name'] ?? '').trim());
      const body = parts.map((r, i) => { const s = parseNum(r['share'] ?? ''); const a = isFinite(cap) && isFinite(s) ? cap * s / 100 : NaN; return `<tr><td class="n">${i + 1}</td><td>${c.span(esc(r['name']))}</td><td class="n">${isFinite(s) ? s : ''}</td><td class="n">${isFinite(a) ? fmtMoney(a) : ''}</td></tr>`; }).join('');
      return `
      <p class="r">Иштирокчиларнинг ${c.date('date')}даги<br>умумий йиғилиши қарори билан<br>ТАСДИҚЛАНГАН</p>
      <h2>«${c.x('name')}» масъулияти чекланган жамиятининг устави</h2>
      <h3>1. Умумий қоидалар</h3>
      ${p(`1.1. «${c.x('name')}» масъулияти чекланган жамияти (кейинги ўринларда «Жамият») «Масъулияти чекланган ҳамда қўшимча масъулиятли жамиятлар тўғрисида»ги Ўзбекистон Республикаси Қонуни ва бошқа қонун ҳужжатларига мувофиқ фаолият кўрсатади.`)}
      ${p(`1.2. Жамиятнинг фирма номи: тўлиқ — «${c.x('name')}» масъулияти чекланган жамияти, қисқартирилган — «${c.x('name')}» МЧЖ. Почта манзили: ${c.x('addr', 26)}.`)}
      ${p('1.3. Жамият юридик шахс ҳисобланади, мустақил балансга, банк ҳисоб рақамларига, ўз номи ёзилган муҳрга эга. Жамият ўз мажбуриятлари бўйича ўзига тегишли барча мол-мулк билан жавоб беради. Иштирокчилар жамият мажбуриятлари бўйича жавобгар бўлмайди ва ўз ҳиссалари қиймати доирасида зарарлар таваккалчилигини кўтаради.')}
      <h3>2. Фаолият мақсади ва турлари</h3>
      ${p(`2.1. Жамиятнинг мақсади фойда олишдан иборат. Асосий фаолият турлари: ${c.x('acts', 30)}. Лицензия талаб қилинадиган фаолият лицензия олингандан кейин амалга оширилади.`)}
      <h3>3. Устав фонди ва улушлар</h3>
      ${p(`3.1. Жамиятнинг устав фонди ${c.money('cap')}ни ташкил этади ва иштирокчилар ўртасида қуйидагича тақсимланади:`)}
      <table class="t"><tr><th>№</th><th>Иштирокчи</th><th>Улуш, %</th><th>Ҳисса, сўм</th></tr>${body || `<tr><td class="n">1</td><td>${c.blank(20)}</td><td></td><td></td></tr>`}</table>
      ${p('3.2. Иштирокчи ўз улушини бошқа иштирокчиларга ёки учинчи шахсларга қонунчиликда ва ушбу уставда белгиланган тартибда бегоналаштиришга ҳақли. Иштирокчилар учинчи шахсга сотиладиган улушни сотиб олишда имтиёзли ҳуқуққа эга.')}
      <h3>4. Жамиятни бошқариш</h3>
      ${p('4.1. Жамиятнинг олий бошқарув органи иштирокчиларнинг умумий йиғилиши ҳисобланади. Навбатдаги умумий йиғилиш йилига камида бир марта ўтказилади.')}
      ${p('4.2. Устав ва устав фондини ўзгартириш, ижроия органини сайлаш, йиллик ҳисоботни тасдиқлаш, фойдани тақсимлаш, қайта ташкил этиш ва тугатиш масалалари умумий йиғилишнинг мутлақ ваколатига киради.')}
      ${p(`4.3. Жамиятнинг жорий фаолиятига раҳбарликни умумий йиғилиш томонидан ${c.x('term', 8)} муддатга сайланадиган директор амалга оширади. Директор ишончномасиз жамият номидан иш кўради.`)}
      <h3>5. Фойдани тақсимлаш</h3>
      ${p('5.1. Жамиятнинг соф фойдаси умумий йиғилиш қарорига кўра иштирокчилар ўртасида уларнинг улушларига мутаносиб равишда тақсимланиши ёки жамиятни ривожлантиришга йўналтирилиши мумкин.')}
      <h3>6. Иштирокчининг чиқиши</h3>
      ${p('6.1. Иштирокчи бошқа иштирокчиларнинг розилигидан қатъи назар исталган вақтда жамиятдан чиқишга ҳақли. Бунда унга улушининг ҳақиқий қиймати қонунчиликда белгиланган муддатда тўланади.')}
      <h3>7. Қайта ташкил этиш ва тугатиш</h3>
      ${p('7.1. Жамият умумий йиғилиш қарорига ёки суд қарорига кўра қонунчиликда белгиланган тартибда қайта ташкил этилиши ёки тугатилиши мумкин.')}
      <h3>Иштирокчиларнинг имзолари</h3>
      ${ol(parts.length ? parts.map(r => `${c.span(esc(r['name']))} ____________`) : [c.blank(30)])}`;
    },
  },
  {
    id: 'guarantee-letter', cat: 'corporate', sub: 'letters', minutes: 3,
    docTitle: 'Кафолат хати',
    title: tr('Kafolat xati', 'Гарантийное письмо', 'Letter of guarantee'),
    desc: tr('Toʻlov, ishni bajarish yoki ishga qabul qilishni kafolatlovchi rasmiy xat.', 'Официальное письмо, гарантирующее оплату, выполнение работ или трудоустройство.', 'Official letter guaranteeing payment, performance or employment.'),
    fields: [
      ...partyFields('co', 'company', EX_A).filter(f => ['co_name', 'co_stir', 'co_addr', 'co_acc', 'co_bank', 'co_mfo', 'co_phone', 'co_rep'].includes(f.k)),
      { k: 'out', g: 'doc', l: tr('Chiquvchi raqam', 'Исходящий №', 'Reference No.'), ex: '61/26', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
      { k: 'to', g: 'addressee', l: tr('Kimga', 'Кому', 'To'), ex: '«Мисол Хизмат» МЧЖ директори Д.Ш. Раҳимовага' },
      { k: 'what', g: 'request', l: tr('Nimani kafolatlaydi', 'Что гарантируется', 'Guarantee'), t: 'textarea', ex: '04.05.2026 йилдаги 45-сон шартнома бўйича етказиб берилган товарлар учун 20 500 000 (йигирма миллион беш юз минг) сўм миқдоридаги қарзни' },
      { k: 'until', g: 'request', l: tr('Muddat', 'Срок', 'Deadline'), t: 'date', ex: '2026-10-31' },
    ],
    render: c => `
      <p class="c"><b>${c.x('co_name', 22)}</b><br>СТИР ${c.x('co_stir', 9)} · ${c.x('co_addr', 24)} · тел. ${c.x('co_phone', 12)}</p>
      <p>${c.dshort('date')} № ${c.x('out', 6)}</p>
      ${addressee(c.x('to', 26))}
      <h2>Кафолат хати</h2>
      ${p(`${c.x('co_name', 18)} ушбу хат орқали ${c.x('what', 40)} ${c.date('until')}гача тўлашни (бажаришни) кафолатлайди.`)}
      ${p(`Тўлов қуйидаги ҳисоб рақамидан амалга оширилади: ${c.x('co_acc', 16)}, ${c.x('co_bank', 16)}, МФО ${c.x('co_mfo', 5)}.`)}
      <table class="sig"><tr><td>Директор</td><td class="r">____________ ${c.x('co_rep', 16)}<br>М.Ў.</td></tr></table>`,
  },
  {
    id: 'requisites-letter', cat: 'corporate', sub: 'letters', minutes: 2,
    docTitle: 'Корхона реквизитлари',
    title: tr('Korxona rekvizitlari (kartochka)', 'Карточка реквизитов предприятия', 'Company details card'),
    desc: tr('Hamkorlarga yuboriladigan rekvizitlar varaqasi: nom, STIR, manzil, bank, rahbar.', 'Карточка реквизитов для контрагентов: название, ИНН, адрес, банк, руководитель.', 'Company details card for partners: name, TIN, address, bank, head.'),
    fields: [
      ...partyFields('co', 'company', EX_A),
      { k: 'oked', g: 'company', l: tr('IFUT (OKED)', 'ОКЭД', 'Activity code (OKED)'), ex: '46390', half: true },
      { k: 'vat', g: 'company', l: tr('QQS toʻlovchi kodi', 'Рег. код плательщика НДС', 'VAT payer code'), ex: '326010012345', half: true },
      { k: 'mail', g: 'company', l: tr('Elektron pochta', 'Эл. почта', 'Email'), ex: 'info@namuna-savdo.uz' },
    ],
    render: c => `
      <h2>«${c.x('co_name', 18)}» реквизитлари</h2>
      <table class="t">
        ${[['Тўлиқ номи', c.x('co_name', 22)], ['СТИР', c.x('co_stir', 9)], ['ИФУТ', c.x('oked', 6)], ['ҚҚС тўловчи коди', c.x('vat', 12)], ['Юридик манзил', c.x('co_addr', 26)], ['Ҳисоб рақами', c.x('co_acc', 20)], ['Банк', c.x('co_bank', 22)], ['МФО', c.x('co_mfo', 5)], ['Раҳбар', `${c.x('co_pos', 8)} ${c.x('co_rep', 20)}`], ['Ваколат асоси', c.x('co_basis', 10)], ['Телефон', c.x('co_phone', 14)], ['Эл. почта', c.x('mail', 18)]].map(([a, b]) => `<tr><td><b>${a}</b></td><td>${b}</td></tr>`).join('')}
      </table>`,
  },
  {
    id: 'major-deal', cat: 'corporate', sub: 'decisions', minutes: 4,
    docTitle: 'Йирик битимни тасдиқлаш тўғрисида қарор',
    title: tr('Yirik bitimni tasdiqlash qarori', 'Решение об одобрении крупной сделки', 'Approval of a major transaction'),
    desc: tr('Ishtirokchilar yigʻilishining yirik bitim (kredit, garov, mulk sotish)ni tasdiqlash qarori.', 'Решение собрания об одобрении крупной сделки (кредит, залог, продажа).', 'Participants’ approval of a major transaction (loan, pledge, sale).'),
    fields: [
      { k: 'company', g: 'meeting', l: L.company, ex: 'Намуна Савдо' },
      { k: 'no', g: 'meeting', l: L.number, ex: '4', half: true },
      { k: 'date', g: 'meeting', l: L.date, t: 'date', ex: '2026-10-05', half: true },
      { k: 'city', g: 'meeting', l: L.city, ex: 'Тошкент шаҳри' },
      { k: 'parts', g: 'participants', l: tr('Ishtirokchilar', 'Участники', 'Participants'), t: 'rows', cols: [{ k: 'name', l: L.fio }, { k: 'share', l: tr('Ulush, %', 'Доля, %', 'Share, %'), num: true }],
        ex: [{ name: 'Каримов Алишер Баҳромович', share: '60' }, { name: 'Раҳимова Дилноза Шавкатовна', share: '40' }] },
      { k: 'kind', g: 'decision', l: tr('Bitim turi', 'Вид сделки', 'Transaction'), t: 'select', opts: ['кредит олиш', 'мол-мулкни гаровга қўйиш', 'кўчмас мулкни сотиш', 'кўчмас мулк сотиб олиш'], ex: 'кредит олиш', half: true },
      { k: 'amount', g: 'decision', l: tr('Bitim summasi', 'Сумма сделки', 'Amount'), t: 'money', ex: '500000000', half: true },
      { k: 'cp', g: 'decision', l: tr('Kontragent', 'Контрагент', 'Counterparty'), ex: '«Намуна банк» АТБ' },
      { k: 'terms', g: 'decision', l: tr('Asosiy shartlar', 'Основные условия', 'Key terms'), t: 'textarea', ex: '36 ой муддатга, йиллик 22 фоиз, таъминот сифатида жамият балансидаги омбор биноси гаровга қўйилади' },
      { k: 'dir', g: 'decision', l: tr('Vakolatli shaxs (direktor)', 'Уполномоченное лицо', 'Authorised person'), ex: 'Каримов Алишер Баҳромович' },
    ],
    render: c => {
      const parts = c.rows('parts').filter(r => (r['name'] ?? '').trim());
      return `
      <p class="c">«${c.x('company')}» масъулияти чекланган жамияти</p>
      <h2>Иштирокчилар умумий йиғилишининг баённомаси № ${c.x('no', 3)}</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p('Йиғилишда иштирок этдилар:')}
      ${ol(parts.length ? parts.map(r => `${c.span(esc(r['name']))} — ${c.span(esc(r['share'] ?? ''))}%`) : [c.blank(30)])}
      ${p('Кворум мавжуд. Кун тартиби: йирик битимни тасдиқлаш.')}
      <h3>Қарор қилинди:</h3>
      ${ol([
        `Жамият томонидан ${c.x('cp', 18)} билан ${c.money('amount')} миқдорида ${c.x('kind', 14)} тўғрисидаги битим қуйидаги шартларда тасдиқлансин: ${c.x('terms', 30)}.`,
        `Жамият директори ${c.x('dir', 18)}га битим бўйича шартнома ва у билан боғлиқ барча ҳужжатларни имзолаш ваколати берилсин.`,
      ])}
      ${p('Овоз бериш натижалари: «ёқлаб» — 100%, «қарши» — йўқ, «бетараф» — йўқ.')}
      ${ol(parts.length ? parts.map(r => `${c.span(esc(r['name']))} ____________`) : [c.blank(30)])}`;
    },
  },
  {
    id: 'share-sale', cat: 'corporate', sub: 'decisions', minutes: 6,
    docTitle: 'Устав фондидаги улушни олди-сотди шартномаси',
    title: tr('Ulushni oldi-sotdi shartnomasi', 'Договор купли-продажи доли', 'Share purchase agreement'),
    desc: tr('MChJ ustav fondidagi ulushni sotish: ulush %, nominal va sotuv narxi, imtiyozli huquq.', 'Продажа доли в уставном фонде ООО: доля, номинал, цена, преимущественное право.', 'Sale of an LLC share: percentage, nominal value, price, pre-emption right.'),
    fields: [
      { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент шаҳри', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
      ...noAcc(personFields('sl', 'seller', { fio: 'Раҳимова Дилноза Шавкатовна', pass: 'AA 1112223, Чилонзор тумани ИИБ, 05.05.2017', addr: 'Тошкент ш., Чилонзор тумани, Бунёдкор шоҳ кўчаси, 10-уй, 5-хонадон' })),
      ...personFields('by', 'buyer', { fio: 'Алиев Тимур Рустамович', pass: 'AB 1234567, Чилонзор тумани ИИБ, 12.08.2018', addr: 'Тошкент ш., Чилонзор тумани, 5-мавзе, 3-уй, 7-хонадон' }),
      { k: 'company', g: 'company', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
      { k: 'stir', g: 'company', l: tr('STIR', 'ИНН', 'TIN'), ex: '301234567', half: true },
      { k: 'share', g: 'company', l: tr('Sotiladigan ulush, %', 'Продаваемая доля, %', 'Share sold, %'), t: 'number', ex: '40', half: true },
      { k: 'nominal', g: 'company', l: tr('Nominal qiymati', 'Номинальная стоимость', 'Nominal value'), t: 'money', ex: '20000000', half: true },
      { k: 'price', g: 'payment', l: tr('Sotuv narxi', 'Цена продажи', 'Price'), t: 'money', ex: '150000000', half: true },
      { k: 'pre', g: 'payment', l: tr('Imtiyozli huquq', 'Преимущественное право', 'Pre-emption'), t: 'select', opts: ['бошқа иштирокчилар улушни сотиб олишдан ёзма равишда воз кечган', 'харидор жамиятнинг иштирокчиси ҳисобланади'], ex: 'бошқа иштирокчилар улушни сотиб олишдан ёзма равишда воз кечган' },
    ],
    render: c => `
      <h2>Устав фондидаги улушни олди-сотди шартномаси</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Биз, ${who(c, 'sl')} (кейинги ўринларда «Сотувчи»), ва ${who(c, 'by')} (кейинги ўринларда «Харидор»), ушбу шартномани қуйидагилар ҳақида туздик:`)}
      ${ol([
        `Сотувчи ${c.x('company', 18)} (СТИР ${c.x('stir', 9)}) устав фондидаги ўзига тегишли ${c.x('share', 3)}% улушни (номинал қиймати ${c.money('nominal')}) Харидорга сотади, Харидор эса уни қабул қилади ва ҳақини тўлайди.`,
        `Улушнинг сотиш нархи ${c.money('price')}. Ҳисоб-китоб шартнома имзолангандан кейин 5 банк куни ичида Сотувчининг ҳисоб рақамига ўтказиш йўли билан амалга оширилади.`,
        `Сотувчи улуш тўлиқ тўланганлиги, гаровга қўйилмаганлиги, низоли эмаслиги ва учинчи шахсларнинг ҳуқуқлари билан юкланмаганлигини кафолатлайди. Шунингдек, ${c.x('pre', 24)}.`,
        'Улушга бўлган ҳуқуқ ва иштирокчининг барча ҳуқуқ ва мажбуриятлари Харидорга жамиятнинг таъсис ҳужжатларига киритилган ўзгартиришлар давлат рўйхатидан ўтказилган пайтдан бошлаб ўтади.',
        'Шартнома «Масъулияти чекланган ҳамда қўшимча масъулиятли жамиятлар тўғрисида»ги Қонунга мувофиқ тузилди ва қонунчиликда белгиланган тартибда расмийлаштирилади. Шартнома уч нусхада тузилди.',
      ])}
      ${sigTable(`<b>Сотувчи</b><br>${c.x('sl', 18)}<br><br>____________`, personCell(c, 'by', 'Харидор'))}`,
  },
];

