import { esc, fmtMoney, parseNum } from '../core/doc/format';
import { Ctx, meta, ol, p, sigTable } from '../core/doc/engine';
import { DocTemplate, FieldDef } from '../core/doc/types';
import { addressee, attachments, L, signLine, tr } from './shared';

const AP = { fio: 'Каримова Нигора Ботировна', addr: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадон', phone: '+998 90 111-22-33' };
const apFields = (): FieldDef[] => [
  { k: 'ap', g: 'applicant', l: L.fio, ex: AP.fio },
  { k: 'ap_addr', g: 'applicant', l: L.addr, ex: AP.addr },
  { k: 'ap_phone', g: 'applicant', l: L.phone, ex: AP.phone, half: true },
];
const date: FieldDef = { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' };
const attF: FieldDef = { k: 'att', g: 'request', l: tr('Ilovalar (har biri yangi qatordan)', 'Приложения (каждое с новой строки)', 'Attachments (one per line)'), t: 'textarea' };
const from = (c: Ctx) => [`${c.x('ap', 22)}дан`, `Манзил: ${c.x('ap_addr', 24)}`, c.has('ap_phone') ? `Тел.: ${c.x('ap_phone')}` : ''];

const orderHead: FieldDef[] = [
  { k: 'company', g: 'doc', l: L.company, ex: 'Намуна Савдо' },
  { k: 'no', g: 'doc', l: L.number, ex: '25-К', half: true },
  { k: 'odate', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
  { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент ш.' },
];
const sign: FieldDef = { k: 'head', g: 'sign', l: L.head, ex: 'Каримов А.Б.' };
const order = (c: Ctx, subject: string, items: string[], ack = '') => `
  <p class="c">«${c.x('company')}» масъулияти чекланган жамияти</p>
  <h2>Буйруқ № ${c.x('no', 4)}</h2>
  ${meta(c.date('odate'), c.x('city', 12))}
  <p class="c"><i>${subject}</i></p>
  <p class="sp">БУЮРАМАН:</p>
  ${ol(items)}
  ${sigTable('Директор', `____________ ${c.x('head', 16)}`)}
  ${ack}`;
const worker: FieldDef[] = [
  { k: 'w', g: 'employee', l: L.fio, ex: 'Алиев Тимур Рустамович' },
  { k: 'pos', g: 'employee', l: L.position, ex: 'савдо менежери', half: true },
  { k: 'dept', g: 'employee', l: tr('Boʻlim', 'Отдел', 'Department'), ex: 'савдо бўлими', half: true },
];

export const BATCH3_APPLICATIONS: DocTemplate[] = [
  {
    id: 'consumer-complaint', cat: 'applications', sub: 'individuals', minutes: 3,
    docTitle: 'Истеъмолчининг талабномаси',
    title: tr('Isteʼmolchi talabnomasi (tovarni qaytarish)', 'Претензия потребителя (возврат товара)', 'Consumer claim (return of goods)'),
    desc: tr('Sotuvchiga: sifatsiz tovarni almashtirish, pulni qaytarish yoki tuzatish talabi.', 'Продавцу: замена, возврат денег или ремонт некачественного товара.', 'To a seller: replacement, refund or repair of a faulty product.'),
    fields: [
      { k: 'org', g: 'addressee', l: tr('Sotuvchi', 'Продавец', 'Seller'), ex: '«Техно Намуна» МЧЖ дўкони' },
      { k: 'org_addr', g: 'addressee', l: L.addr, ex: 'Тошкент ш., Юнусобод тумани, Амир Темур кўчаси, 107-уй' },
      ...apFields(),
      { k: 'item', g: 'request', l: tr('Tovar', 'Товар', 'Product'), ex: 'Samsung русумли кир ювиш машинаси' },
      { k: 'bought', g: 'request', l: tr('Xarid sanasi', 'Дата покупки', 'Purchase date'), t: 'date', ex: '2026-09-12', half: true },
      { k: 'price', g: 'request', l: tr('Narxi', 'Цена', 'Price'), t: 'money', ex: '5400000', half: true },
      { k: 'defect', g: 'request', l: tr('Kamchilik', 'Недостаток', 'Defect'), t: 'textarea', ex: 'Сиқиш режимида кучли шовқин чиқаради ва иш жараёнида ўзидан ўзи ўчиб қолади.' },
      { k: 'want', g: 'request', l: tr('Talab', 'Требование', 'Demand'), t: 'select', opts: ['тўланган пулни қайтариш', 'товарни худди шундай соз товарга алмаштириш', 'камчиликни бепул бартараф этиш', 'нархни мутаносиб равишда камайтириш'], ex: 'тўланган пулни қайтариш' },
      attF, date,
    ],
    render: c => `
      ${addressee(`<b>${c.x('org', 22)}га</b>`, `Манзил: ${c.x('org_addr', 22)}`, ...from(c))}
      <h2>Талабнома</h2>
      ${p(`${c.date('bought')}да дўконингиздан ${c.x('item', 22)}ни ${c.money('price')}га сотиб олдим. Харид касса чеки билан тасдиқланади.`)}
      ${p(`Фойдаланиш жараёнида товарда қуйидаги камчилик аниқланди: ${c.x('defect', 30)}`)}
      ${p('«Истеъмолчиларнинг ҳуқуқларини ҳимоя қилиш тўғрисида»ги Ўзбекистон Республикаси Қонунига мувофиқ, сифатсиз товар сотилган истеъмолчи ўз хоҳишига кўра товарни алмаштиришни, нархни камайтиришни, камчиликни бепул бартараф этишни ёки тўланган пулни қайтаришни талаб қилишга ҳақли.')}
      ${p(`Шу боис ${c.x('want', 24)}ни талаб қиламан. Талаб қонунда белгиланган муддатда қондирилмаса, судга мурожаат қилишга ва етказилган зарар ҳамда маънавий зарарни ундиришга мажбур бўламан.`)}
      ${attachments(c, ['Касса чеки нусхаси.', 'Кафолат талони нусхаси.'], 'att')}
      ${signLine(c, 'date', 'ap')}`,
  },
  {
    id: 'loan-deferral', cat: 'applications', sub: 'individuals', minutes: 3,
    docTitle: 'Кредит тўловини кечиктириш тўғрисида ариза',
    title: tr('Kredit toʻlovini kechiktirish arizasi', 'Заявление об отсрочке платежа по кредиту', 'Loan payment deferral request'),
    desc: tr('Bankka: vaqtinchalik qiyinchilik sababli kredit toʻlovini kechiktirish yoki jadvalni oʻzgartirish.', 'В банк: отсрочка платежа или изменение графика из-за временных трудностей.', 'To a bank: defer payments or reschedule due to temporary hardship.'),
    fields: [
      { k: 'org', g: 'addressee', l: tr('Bank (filial)', 'Банк (филиал)', 'Bank (branch)'), ex: '«Намуна банк» АТБ Юнусобод филиали' },
      ...apFields(),
      { k: 'contract', g: 'request', l: tr('Kredit shartnomasi', 'Кредитный договор', 'Loan agreement'), ex: '15.02.2025 йилдаги КД-0451-сон', half: true },
      { k: 'left', g: 'request', l: tr('Qoldiq qarz', 'Остаток долга', 'Outstanding'), t: 'money', ex: '42000000', half: true },
      { k: 'why', g: 'request', l: tr('Sabab', 'Причина', 'Reason'), t: 'textarea', ex: 'Иш жойимдаги штатлар қисқартирилиши натижасида 2026 йил 1 сентябрдан бошлаб даромадим вақтинча камайди. Янги иш жойига ўтиш жараёндаман.' },
      { k: 'ask', g: 'request', l: tr('Soʻrov', 'Просьба', 'Request'), t: 'select', opts: ['асосий қарз тўловини уч ойга кечиктириш', 'кредит муддатини узайтириб, ойлик тўловни камайтириш', 'фоиз тўловларини вақтинча камайтириш'], ex: 'асосий қарз тўловини уч ойга кечиктириш' },
      attF, date,
    ],
    render: c => `
      ${addressee(`<b>${c.x('org', 24)} бошқарувчисига</b>`, ...from(c))}
      <h2>Ариза</h2>
      ${p(`Мен ${c.x('contract', 18)} кредит шартномаси бўйича қарз олувчиман. Ҳозирги кунда қолдиқ қарз ${c.money('left')}ни ташкил этади.`)}
      ${p(c.x('why', 40))}
      ${p(`Юқоридагиларни инобатга олиб, ${c.x('ask', 24)} имконини беришингизни сўрайман. Мажбуриятларимни тўлиқ бажаришни кафолатлайман.`)}
      ${attachments(c, [], 'att')}
      ${signLine(c, 'date', 'ap')}`,
  },
  {
    id: 'tax-refund', cat: 'applications', sub: 'legal', minutes: 3,
    docTitle: 'Ортиқча тўланган солиқни қайтариш тўғрисида ариза',
    title: tr('Ortiqcha toʻlangan soliqni qaytarish arizasi', 'Заявление о возврате переплаты налога', 'Tax overpayment refund request'),
    desc: tr('Soliq organiga: ortiqcha toʻlangan summani qaytarish yoki boshqa soliqqa hisoblash.', 'В налоговую: возврат переплаты или зачёт в счёт другого налога.', 'To the tax office: refund an overpayment or offset it against another tax.'),
    fields: [
      { k: 'org', g: 'addressee', l: tr('Soliq organi', 'Налоговый орган', 'Tax office'), ex: 'Юнусобод тумани давлат солиқ инспекцияси' },
      { k: 'co', g: 'applicant', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
      { k: 'co_stir', g: 'applicant', l: tr('STIR', 'ИНН', 'TIN'), ex: '301234567', half: true },
      { k: 'co_acc', g: 'applicant', l: tr('Hisob raqami, bank, MFO', 'Счёт, банк, МФО', 'Account, bank, MFO'), ex: '2020 8000 1001 2345 6001, «Намуна банк» АТБ, МФО 00014' },
      { k: 'tax', g: 'request', l: tr('Soliq turi', 'Вид налога', 'Tax'), ex: 'фойда солиғи', half: true },
      { k: 'sum', g: 'request', l: tr('Ortiqcha summa', 'Сумма переплаты', 'Overpayment'), t: 'money', ex: '7350000', half: true },
      { k: 'how', g: 'request', l: tr('Soʻrov', 'Просьба', 'Request'), t: 'select', opts: ['жамиятнинг ҳисоб рақамига қайтариш', 'келгуси тўловлар ҳисобига ўтказиш', 'бошқа солиқ бўйича қарздорлик ҳисобига ўтказиш'], ex: 'жамиятнинг ҳисоб рақамига қайтариш' },
      { k: 'why', g: 'request', l: tr('Ortiqcha toʻlov sababi', 'Причина переплаты', 'Cause'), t: 'textarea', ex: '2026 йил III чорак учун аниқлаштирилган ҳисобот топширилгандан кейин солиқ суммаси камайди.' },
      { k: 'dir', g: 'sign', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Director'), ex: 'А.Б. Каримов', half: true },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05', half: true },
    ],
    render: c => `
      ${addressee(`<b>${c.x('org', 24)}га</b>`, `${c.x('co', 20)}дан (СТИР ${c.x('co_stir', 9)})`)}
      <h2>Ариза</h2>
      <p class="c"><i>ортиқча тўланган солиқ суммасини қайтариш тўғрисида</i></p>
      ${p(`${c.x('co', 18)}нинг ${c.x('tax', 12)} бўйича шахсий ҳисоб варақасида ${c.money('sum')} миқдорида ортиқча тўланган сумма мавжуд. ${c.x('why', 30)}`)}
      ${p(`Ўзбекистон Республикаси Солиқ кодексига мувофиқ, ушбу суммани ${c.x('how', 24)}ни сўраймиз.`)}
      ${p(`Банк реквизитлари: ${c.x('co_acc', 30)}.`)}
      <table class="sig"><tr><td>${c.date('date')}</td><td class="r">Директор ____________ ${c.x('dir', 14)}</td></tr></table>`,
  },
  {
    id: 'school-transfer', cat: 'applications', sub: 'children', minutes: 2,
    docTitle: 'Ўқувчини бошқа мактабга ўтказиш тўғрисида ариза',
    title: tr('Oʻquvchini boshqa maktabga oʻtkazish arizasi', 'Заявление о переводе ученика', 'Pupil transfer application'),
    desc: tr('Ota-onaning maktab direktoriga arizasi: bolani boshqa maktabga oʻtkazish va hujjatlarni berish.', 'Заявление родителя: перевод ребёнка в другую школу и выдача документов.', 'Parent’s request to transfer a child and release school records.'),
    fields: [
      { k: 'school', g: 'addressee', l: tr('Hozirgi maktab', 'Текущая школа', 'Current school'), ex: 'Юнусобод туманидаги 45-сон умумтаълим мактаби' },
      { k: 'dir', g: 'addressee', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Head teacher'), ex: 'М.М. Мирзаева' },
      ...apFields(),
      { k: 'ch', g: 'child', l: L.fio, ex: 'Каримов Жавоҳир Фаррухович' },
      { k: 'grade', g: 'child', l: tr('Sinf', 'Класс', 'Grade'), ex: '4-«Б»', half: true },
      { k: 'to', g: 'child', l: tr('Yangi maktab', 'Новая школа', 'New school'), ex: 'Мирзо Улуғбек туманидаги 110-сон мактаб', half: true },
      { k: 'why', g: 'child', l: tr('Sabab', 'Причина', 'Reason'), ex: 'яшаш жойимиз ўзгаргани' },
      date,
    ],
    render: c => `
      ${addressee(`<b>${c.x('school', 24)} директори</b>`, `${c.x('dir', 16)}га`, ...from(c))}
      <h2>Ариза</h2>
      ${p(`${c.x('why', 16)} сабабли фарзандим, ${c.x('grade', 4)} синф ўқувчиси ${c.x('ch', 22)}ни ${c.x('to', 22)}га ўтказиш учун мактабдан чиқаришингизни ва шахсий йиғмажилди ҳамда ўзлаштириш тўғрисидаги маълумотларни беришингизни сўрайман.`)}
      ${signLine(c, 'date', 'ap')}`,
  },
];

export const BATCH3_HR: DocTemplate[] = [
  {
    id: 'transfer-order', cat: 'hr', sub: 'orders', minutes: 3,
    docTitle: 'Бошқа ишга ўтказиш тўғрисида буйруқ',
    title: tr('Boshqa ishga oʻtkazish buyrugʻi', 'Приказ о переводе на другую работу', 'Transfer order'),
    desc: tr('Xodimni boshqa lavozim yoki boʻlimga doimiy/vaqtincha oʻtkazish: yangi maosh, sana.', 'Перевод на другую должность или отдел: постоянно/временно, оклад, дата.', 'Permanent or temporary transfer to another post: salary, date.'),
    fields: [
      ...orderHead, ...worker,
      { k: 'npos', g: 'terms', l: tr('Yangi lavozim', 'Новая должность', 'New position'), ex: 'савдо бўлими бошлиғи', half: true },
      { k: 'ndept', g: 'terms', l: tr('Yangi boʻlim', 'Новый отдел', 'New department'), ex: 'савдо бўлими', half: true },
      { k: 'kind', g: 'terms', l: tr('Oʻtkazish turi', 'Вид перевода', 'Type'), t: 'select', opts: ['доимий', 'вақтинча'], ex: 'доимий', half: true },
      { k: 'from', g: 'terms', l: tr('Sanadan', 'С даты', 'From'), t: 'date', ex: '2026-10-15', half: true },
      { k: 'salary', g: 'terms', l: tr('Yangi oylik maosh', 'Новый оклад', 'New salary'), t: 'money', ex: '8500000' },
      sign,
    ],
    render: c => order(c, 'Бошқа ишга ўтказиш тўғрисида', [
      `${c.x('dept', 12)} ${c.x('pos', 14)} ${c.x('w', 20)} ${c.date('from')}дан бошлаб ${c.x('ndept', 12)} ${c.x('npos', 16)} лавозимига ${c.x('kind', 6)} ўтказилсин.`,
      `Ходимга ${c.money('salary')} миқдорида лавозим маоши белгилансин.`,
      'Меҳнат шартномасига тегишли ўзгартиришлар қўшимча келишув билан расмийлаштирилсин.',
      `Асос: ${c.x('w', 16)}нинг аризаси (розилиги), меҳнат шартномасига қўшимча келишув.`,
    ], `<p>Буйруқ билан танишдим ва розиман: ____________ ${c.x('w', 16)}</p>`),
  },
  {
    id: 'bonus-order', cat: 'hr', sub: 'orders', minutes: 4,
    docTitle: 'Ходимларни мукофотлаш тўғрисида буйруқ',
    title: tr('Mukofotlash buyrugʻi', 'Приказ о премировании', 'Bonus order'),
    desc: tr('Xodimlarga bir martalik mukofot: roʻyxat va summalar, jami avtomatik.', 'Разовая премия работникам: список и суммы, итог считается.', 'One-off bonuses: list and amounts, total computed.'),
    fields: [
      ...orderHead,
      { k: 'reason', g: 'terms', l: tr('Asos / sabab', 'Основание / повод', 'Reason'), ex: '2026 йил III чорак режасини ортиғи билан бажарганлиги учун' },
      { k: 'list', g: 'employee', l: tr('Xodimlar', 'Работники', 'Employees'), t: 'rows',
        cols: [{ k: 'fio', l: L.fio }, { k: 'pos', l: L.position }, { k: 'sum', l: tr('Summa', 'Сумма', 'Amount'), num: true }],
        ex: [{ fio: 'Алиев Тимур Рустамович', pos: 'савдо менежери', sum: '2000000' }, { fio: 'Сафарова Малика Илҳомовна', pos: 'савдо менежери', sum: '2000000' }, { fio: 'Тошпўлатов Бекзод Анварович', pos: 'омборчи', sum: '1000000' }] },
      sign,
    ],
    render: c => {
      let total = 0;
      const rows = c.rows('list').filter(r => (r['fio'] ?? '').trim());
      const body = rows.map((r, i) => { const n = parseNum(r['sum'] ?? ''); if (isFinite(n)) total += n; return `<tr><td class="n">${i + 1}</td><td>${c.span(esc(r['fio']))}</td><td>${c.span(esc(r['pos'] ?? ''))}</td><td class="n">${isFinite(n) ? fmtMoney(n) : ''}</td></tr>`; }).join('');
      return order(c, 'Ходимларни мукофотлаш тўғрисида', [
        `${c.x('reason', 30)} қуйидаги ходимлар мукофотлансин:<table class="t"><tr><th>№</th><th>Ф.И.Ш.</th><th>Лавозими</th><th>Сумма</th></tr>${body}<tr><td></td><td colspan="2"><b>Жами</b></td><td class="n"><b>${fmtMoney(total)}</b></td></tr></table>`,
        `Бухгалтерияга жами ${c.moneyN(total)} миқдоридаги мукофотни навбатдаги иш ҳақи билан бирга ҳисоблаб тўлаш топширилсин.`,
        'Мукофот жамиятнинг меҳнатга ҳақ тўлаш фонди ҳисобидан тўлансин.',
      ]);
    },
  },
  {
    id: 'material-liability', cat: 'hr', sub: 'contracts', minutes: 4,
    docTitle: 'Тўлиқ индивидуал моддий жавобгарлик тўғрисида шартнома',
    title: tr('Toʻliq moddiy javobgarlik shartnomasi', 'Договор о полной материальной ответственности', 'Full liability agreement'),
    desc: tr('Qimmatliklarga xizmat koʻrsatuvchi xodim bilan (kassir, omborchi): majburiyatlar va javobgarlik.', 'С работником, обслуживающим ценности (кассир, кладовщик): обязанности и ответственность.', 'With staff handling valuables (cashier, storekeeper): duties and liability.'),
    fields: [
      { k: 'company', g: 'employer', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
      { k: 'head', g: 'employer', l: L.head, ex: 'Каримов Алишер Баҳромович' },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
      { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент ш.', half: true },
      { k: 'w', g: 'employee', l: L.fio, ex: 'Тошпўлатов Бекзод Анварович' },
      { k: 'pos', g: 'employee', l: L.position, ex: 'омборчи', half: true },
      { k: 'what', g: 'employee', l: tr('Qimmatliklar', 'Ценности', 'Valuables'), ex: 'омбордаги товар-моддий бойликлар', half: true },
    ],
    render: c => `
      <h2>Тўлиқ индивидуал моддий жавобгарлик тўғрисида шартнома</h2>
      ${meta(c.x('city', 12), c.date('date'))}
      ${p(`${c.x('company', 18)} (кейинги ўринларда «Иш берувчи») номидан раҳбар ${c.x('head', 20)} ва ${c.x('pos', 12)} ${c.x('w', 20)} (кейинги ўринларда «Ходим») Ўзбекистон Республикаси Меҳнат кодексига мувофиқ ушбу шартномани туздилар:`)}
      ${ol([
        `Ходим ўзига ишониб топширилган ${c.x('what', 20)}нинг бутлиги учун тўлиқ индивидуал моддий жавобгар бўлади.`,
        'Ходим мажбур: ишониб топширилган бойликларни асраш ва зарар етказилишининг олдини олиш чораларини кўриш; бойликлар ҳисобини белгиланган тартибда юритиш ва ҳисоботлар тақдим этиш; бойликлар бутлигига хавф туғдирувчи ҳолатлар ҳақида раҳбариятни дарҳол хабардор қилиш; инвентаризацияда иштирок этиш.',
        'Иш берувчи мажбур: бойликларни сақлаш учун зарур шароитларни яратиш; Ходимни моддий жавобгарликка оид қонунчилик ва ички ҳужжатлар билан таништириш; инвентаризацияни белгиланган муддатларда ўтказиш.',
        'Ходимнинг айби билан етказилган зарар қонунчиликда белгиланган тартибда қопланади. Зарар Ходимнинг айбисиз юзага келганлиги исботланса, Ходим жавобгарликдан озод қилинади.',
        'Шартнома Ходим ишониб топширилган бойликлар билан ишлаган бутун давр мобайнида амал қилади ва икки нусхада тузилди.',
      ])}
      ${sigTable(`<b>Иш берувчи</b><br>${c.x('company', 16)}<br><br>____________ ${c.x('head', 16)}<br>М.Ў.`, `<b>Ходим</b><br>${c.x('pos', 12)}<br><br>____________ ${c.x('w', 16)}`)}`,
  },
  {
    id: 'job-description', cat: 'hr', sub: 'internal', minutes: 6,
    docTitle: 'Лавозим йўриқномаси',
    title: tr('Lavozim yoʻriqnomasi', 'Должностная инструкция', 'Job description'),
    desc: tr('Lavozim uchun umumiy qoidalar, malaka talablari, vazifalar, huquqlar va javobgarlik.', 'Общие положения, требования, обязанности, права и ответственность.', 'General provisions, requirements, duties, rights and liability for a post.'),
    fields: [
      { k: 'company', g: 'employer', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
      { k: 'head', g: 'employer', l: L.head, ex: 'Каримов А.Б.', half: true },
      { k: 'date', g: 'doc', l: tr('Tasdiqlangan sana', 'Дата утверждения', 'Approved on'), t: 'date', ex: '2026-10-05', half: true },
      { k: 'pos', g: 'terms', l: L.position, ex: 'савдо менежери', half: true },
      { k: 'dept', g: 'terms', l: tr('Boʻlim', 'Отдел', 'Department'), ex: 'савдо бўлими', half: true },
      { k: 'boss', g: 'terms', l: tr('Kimga boʻysunadi', 'Подчиняется', 'Reports to'), ex: 'савдо бўлими бошлиғига' },
      { k: 'req', g: 'terms', l: tr('Malaka talablari', 'Требования', 'Requirements'), t: 'textarea', ex: 'олий (иқтисодий ёки техник) маълумот, савдо соҳасида камида 1 йил иш тажрибаси, компьютер ва 1С дастурида ишлаш кўникмаси' },
      { k: 'duties', g: 'terms', l: tr('Vazifalar (har biri yangi qatordan)', 'Обязанности (каждая с новой строки)', 'Duties (one per line)'), t: 'textarea', ex: 'мижозлар базасини юритиш ва кенгайтириш\nтижорат таклифлари тайёрлаш ва шартномалар тузишда иштирок этиш\nбуюртмаларни қабул қилиш ва бажарилишини назорат қилиш\nдебиторлик қарзларини ундиришда иштирок этиш\nойлик савдо ҳисоботини тайёрлаш' },
    ],
    render: c => {
      const duties = c.raw('duties').split('\n').map(s => s.trim()).filter(Boolean).map(s => c.span(esc(s)));
      return `
      <p class="r">«ТАСДИҚЛАЙМАН»<br>${c.x('company', 16)} раҳбари<br>____________ ${c.x('head', 12)}<br>${c.date('date')}</p>
      <h2>${c.x('pos', 14)}нинг лавозим йўриқномаси</h2>
      <h3>1. Умумий қоидалар</h3>
      ${p(`1.1. ${c.x('pos', 14)} ${c.x('dept', 12)} ходими ҳисобланади ва бевосита ${c.x('boss', 16)} бўйсунади.`)}
      ${p('1.2. Ходим раҳбарнинг буйруғи билан лавозимга тайинланади ва лавозимдан озод қилинади.')}
      ${p(`1.3. Малака талаблари: ${c.x('req', 30)}.`)}
      ${p('1.4. Ходим ўз фаолиятида Ўзбекистон Республикаси қонунчилиги, жамият устави, ички меҳнат тартиби қоидалари ва ушбу йўриқномага амал қилади.')}
      <h3>2. Вазифалари</h3>
      ${ol(duties.length ? duties : [c.blank(40)])}
      <h3>3. Ҳуқуқлари</h3>
      ${ol(['Ўз вазифаларини бажариш учун зарур маълумот ва ҳужжатларни олиш.', 'Иш фаолиятини такомиллаштириш бўйича таклифлар киритиш.', 'Меҳнат шароитларини яхшилашни талаб қилиш.', 'Малакасини ошириш.'])}
      <h3>4. Жавобгарлиги</h3>
      ${p('Ходим ўз вазифаларини бажармаганлик ёки лозим даражада бажармаганлик, етказилган моддий зарар ва ички тартиб қоидаларини бузганлик учун қонунчиликда белгиланган тартибда жавобгар бўлади.')}
      <p>Йўриқнома билан танишдим, бир нусхасини олдим: ____________ «___» __________ 20__ й.</p>`;
    },
  },
  {
    id: 'memo', cat: 'hr', sub: 'notices', minutes: 2,
    docTitle: 'Билдирги',
    title: tr('Bildirgi (xizmat xati)', 'Служебная записка', 'Internal memo'),
    desc: tr('Boʻlim boshligʻi yoki xodimning rahbarga ichki yozma bildirgisi: mavzu va taklif.', 'Внутренняя записка руководителю: тема и предложение.', 'Internal memo to management: subject and proposal.'),
    fields: [
      { k: 'to', g: 'addressee', l: tr('Kimga', 'Кому', 'To'), ex: '«Намуна Савдо» МЧЖ директори А.Б. Каримовга' },
      { k: 'from', g: 'applicant', l: tr('Kimdan', 'От кого', 'From'), ex: 'савдо бўлими бошлиғи Б.Б. Бобоевдан' },
      { k: 'subject', g: 'request', l: tr('Mavzu', 'Тема', 'Subject'), ex: 'бўлимга қўшимча штат бирлиги ажратиш тўғрисида' },
      { k: 'text', g: 'request', l: tr('Matn', 'Текст', 'Text'), t: 'textarea', ex: 'Сўнгги икки чоракда буюртмалар ҳажми 40 фоизга ошди. Ҳозирги ходимлар сони билан буюртмаларни ўз вақтида бажариш қийинлашмоқда.' },
      { k: 'ask', g: 'request', l: tr('Taklif', 'Предложение', 'Proposal'), t: 'textarea', ex: 'Савдо бўлимига 1 нафар савдо менежери штат бирлигини қўшишни сўрайман.' },
      { k: 'fio', g: 'sign', l: tr('Imzolovchi', 'Подписант', 'Signed by'), ex: 'Б.Б. Бобоев', half: true },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05', half: true },
    ],
    render: c => `
      ${addressee(c.x('to', 24), c.x('from', 24))}
      <h2>Билдирги</h2>
      <p class="c"><i>${c.x('subject', 30)}</i></p>
      ${p(c.x('text', 40))}
      ${p(c.x('ask', 40))}
      ${signLine(c, 'date', 'fio')}`,
  },
  {
    id: 'reduction-notice', cat: 'hr', sub: 'notices', minutes: 3,
    docTitle: 'Штатлар қисқариши муносабати билан меҳнат шартномасини бекор қилиш ҳақида огоҳлантириш',
    title: tr('Shtat qisqarishi haqida ogohlantirish', 'Уведомление о сокращении штата', 'Redundancy notice'),
    desc: tr('Xodimni shtat qisqarishi tufayli shartnoma bekor qilinishi haqida oldindan yozma ogohlantirish.', 'Письменное предупреждение работника о расторжении договора по сокращению.', 'Advance written notice of termination due to redundancy.'),
    fields: [
      { k: 'company', g: 'employer', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
      { k: 'head', g: 'employer', l: L.head, ex: 'Каримов А.Б.' },
      { k: 'no', g: 'doc', l: L.number, ex: '7', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
      ...worker,
      { k: 'order', g: 'terms', l: tr('Qisqartirish buyrugʻi', 'Приказ о сокращении', 'Redundancy order'), ex: '01.10.2026 йилдаги 24-К-сон буйруқ' },
      { k: 'notice', g: 'terms', l: tr('Ogohlantirish muddati', 'Срок предупреждения', 'Notice period'), ex: 'икки ой', half: true, hint: tr('Amaldagi Mehnat kodeksi boʻyicha tekshiring.', 'Проверьте по действующему Трудовому кодексу.', 'Check against the current Labour Code.') },
      { k: 'end', g: 'terms', l: tr('Bekor qilinish sanasi', 'Дата расторжения', 'Termination date'), t: 'date', ex: '2026-12-07', half: true },
      { k: 'offer', g: 'terms', l: tr('Taklif qilinadigan boʻsh lavozim (boʻlsa)', 'Предлагаемая вакансия (если есть)', 'Vacancy offered (if any)'), ex: 'омборчи (савдо бўлими)' },
    ],
    render: c => `
      <p class="c"><b>${c.x('company', 22)}</b></p>
      <p>${c.dshort('date')} № ${c.x('no', 4)}</p>
      ${addressee(`${c.x('dept', 12)} ${c.x('pos', 14)}`, `${c.x('w', 22)}га`)}
      <h2>Огоҳлантириш</h2>
      ${p(`${c.x('order', 20)}га асосан жамиятда штатлар қисқартирилиши муносабати билан сиз эгаллаб турган ${c.x('pos', 14)} лавозими штат жадвалидан чиқарилади.`)}
      ${p(`Ўзбекистон Республикаси Меҳнат кодексига мувофиқ, сиз билан тузилган меҳнат шартномаси ${c.x('notice', 8)}дан кейин — ${c.date('end')}да бекор қилиниши ҳақида огоҳлантирамиз.`)}
      ${c.has('offer') ? p(`Сизга жамиятдаги бўш ${c.x('offer', 18)} лавозимига ўтказишни таклиф қиламиз. Розилигингиз ҳақида ёзма маълум қилишингизни сўраймиз.`) : p('Ҳозирда жамиятда малакангизга мос бўш лавозим мавжуд эмас.')}
      ${p('Меҳнат шартномаси бекор қилинганда сизга қонунчиликда назарда тутилган ишдан бўшатиш нафақаси ва бошқа тўловлар тўланади.')}
      ${sigTable('Директор', `____________ ${c.x('head', 16)}`)}
      <p>Огоҳлантиришни олдим: ____________ ${c.x('w', 16)} &nbsp; «___» __________ 20__ й.</p>`,
  },
];
