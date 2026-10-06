import { esc } from '../core/doc/format';
import { Ctx, meta, ol, p, sigTable } from '../core/doc/engine';
import { DocTemplate, FieldDef } from '../core/doc/types';
import { addressee, attachments, EX_A, L, partyFields, personFields, signLine, tr, vehicleFields, vehicleText } from './shared';

const who = (c: Ctx, k: string) => `${c.x(k, 22)} (паспорт: ${c.x(k + '_pass', 18)}, яшаш манзили: ${c.x(k + '_addr', 24)})`;
const notaryBox = `<div class="pb"></div><p class="c"><b>Нотариал тасдиқлаш учун жой</b></p><p class="c"><i>(нотариус тўлдиради)</i></p>`;
const cityDate: FieldDef[] = [
  { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент шаҳри', half: true },
  { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-06', half: true },
];
const noAcc = (fs: FieldDef[]) => fs.filter(f => !f.k.endsWith('_acc'));
const OLD = { fio: 'Раҳимов Аҳмад Каримович', pass: 'AB 7654321, Ургут тумани ИИБ, 02.05.2016', addr: 'Самарқанд вилояти, Ургут тумани, Боғишамол кўчаси, 8-уй' };
const SON = { fio: 'Раҳимов Жасур Аҳмадович', pass: 'AD 1122334, Юнусобод тумани ИИБ, 01.03.2020', addr: 'Тошкент шаҳри, Юнусобод тумани, Боғишамол кўчаси, 10-уй, 15-хонадон' };
const W = { fio: 'Каримова Нигора Ботировна', addr: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадон' };
const H = { fio: 'Каримов Фаррух Олимович', addr: 'Тошкент ш., Мирзо Улуғбек тумани, Буюк Ипак йўли кўчаси, 45-уй, 7-хонадон' };
const COURT = 'Фуқаролик ишлари бўйича Юнусобод туманлараро суди';

export const BATCH4_NOTARIAL: DocTemplate[] = [
  {
    id: 'pension-poa', cat: 'notarial', sub: 'poa', minutes: 3,
    docTitle: 'Пенсия олиш учун ишончнома',
    title: tr('Pensiya olish uchun ishonchnoma', 'Доверенность на получение пенсии', 'Power of attorney to collect a pension'),
    desc: tr('Pensioner nomidan pensiya va nafaqalarni olish, maʼlumotnomalar olish vakolati.', 'Получение пенсии и пособий, справок от имени пенсионера.', 'Collect pension, benefits and certificates on the pensioner’s behalf.'),
    fields: [
      ...cityDate,
      ...noAcc(personFields('pr', 'principal', OLD)),
      ...noAcc(personFields('ag', 'agent', SON)),
      { k: 'org', g: 'powers', l: tr('Pensiya toʻlovchi organ / bank', 'Орган / банк, выплачивающий пенсию', 'Paying office / bank'), ex: 'Ургут тумани бюджетдан ташқари пенсия жамғармаси бўлими ва «Намуна банк» АТБ' },
      { k: 'until', g: 'powers', l: tr('Amal qilish muddati', 'Срок действия', 'Valid until'), t: 'date', ex: '2027-10-06', half: true },
    ],
    render: c => `
      <h2>Ишончнома</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Мен, ${who(c, 'pr')}, ушбу ишончнома билан ${who(c, 'ag')}га ${c.x('org', 26)}да менга тегишли пенсия, нафақа ва бошқа ижтимоий тўловларни олиш, шу мақсадда аризалар бериш, маълумотномалар олиш ва зарур ҳужжатларга имзо қўйиш ҳуқуқини бераман.`)}
      ${p(`Ишончнома ${c.date('until')}гача ваколатларни бошқа шахсга ишониш ҳуқуқисиз берилди. Ишончномани бекор қилиш оқибатлари менга тушунтирилди.`)}
      ${sigTable('Ишонч билдирувчи', `____________ ${c.x('pr', 18)}`)}
      ${notaryBox}`,
  },
  {
    id: 'bank-poa', cat: 'notarial', sub: 'poa', minutes: 3,
    docTitle: 'Банк ҳисоб рақамини бошқариш учун ишончнома',
    title: tr('Bank hisobini boshqarish ishonchnomasi', 'Доверенность на распоряжение счётом', 'Bank account power of attorney'),
    desc: tr('Bankdagi hisob va omonatlardan pul olish, oʻtkazish, karta va koʻchirmalar olish vakolati.', 'Снятие и перевод средств, получение карт и выписок.', 'Withdraw and transfer funds, collect cards and statements.'),
    fields: [
      ...cityDate,
      ...noAcc(personFields('pr', 'principal', OLD)),
      ...noAcc(personFields('ag', 'agent', SON)),
      { k: 'bank', g: 'powers', l: tr('Bank', 'Банк', 'Bank'), ex: '«Намуна банк» АТБ Ургут филиали' },
      { k: 'acc', g: 'powers', l: tr('Hisob raqami', 'Номер счёта', 'Account No.'), ex: '2020 6000 1234 5678 9012' },
      { k: 'limit', g: 'powers', l: tr('Vakolat', 'Объём полномочий', 'Scope'), t: 'select', opts: ['ҳисобдаги барча маблағларни тасарруф этиш', 'фақат ҳисоб кўчирмалари ва маълумотномалар олиш'], ex: 'ҳисобдаги барча маблағларни тасарруф этиш', half: true },
      { k: 'until', g: 'powers', l: tr('Amal qilish muddati', 'Срок действия', 'Valid until'), t: 'date', ex: '2027-10-06', half: true },
    ],
    render: c => `
      <h2>Ишончнома</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Мен, ${who(c, 'pr')}, ушбу ишончнома билан ${who(c, 'ag')}га ${c.x('bank', 22)}даги ${c.x('acc', 20)} рақамли ҳисоб бўйича ${c.x('limit', 24)} ҳуқуқини бераман.`)}
      ${c.raw('limit').startsWith('ҳисобдаги') ? p('Шу жумладан: нақд пул олиш, ҳисобга пул қўйиш, бошқа ҳисобларга ўтказиш, омонатларни очиш ва ёпиш, банк картасини олиш, ҳисоб кўчирмалари ва маълумотномалар олиш, банк ҳужжатларига имзо қўйиш.') : ''}
      ${p(`Ишончнома ${c.date('until')}гача ваколатларни бошқа шахсга ишониш ҳуқуқисиз берилди.`)}
      ${sigTable('Ишонч билдирувчи', `____________ ${c.x('pr', 18)}`)}
      ${notaryBox}`,
  },
  {
    id: 'will-revocation', cat: 'notarial', sub: 'wills', minutes: 2,
    docTitle: 'Васиятномани бекор қилиш тўғрисида ариза',
    title: tr('Vasiyatnomani bekor qilish arizasi', 'Заявление об отмене завещания', 'Revocation of a will'),
    desc: tr('Ilgari tuzilgan vasiyatnomani toʻliq bekor qilish: sana, notarius, reyestr raqami.', 'Полная отмена ранее составленного завещания: дата, нотариус, реестровый номер.', 'Revoke a previous will: date, notary, register number.'),
    fields: [
      { k: 'notary', g: 'addressee', l: tr('Notarial idora', 'Нотариальная контора', 'Notary office'), ex: 'Ургут тумани давлат нотариал идораси' },
      ...noAcc(personFields('ts', 'testator', OLD)),
      { k: 'wdate', g: 'heirs', l: tr('Vasiyatnoma sanasi', 'Дата завещания', 'Date of will'), t: 'date', ex: '2024-04-11', half: true },
      { k: 'reg', g: 'heirs', l: tr('Reyestr raqami', 'Реестровый №', 'Register No.'), ex: '2-1457', half: true },
      { k: 'wnotary', g: 'heirs', l: tr('Tasdiqlagan notarius', 'Удостоверивший нотариус', 'Certifying notary'), ex: 'Ургут тумани давлат нотариал идораси нотариуси' },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-06' },
    ],
    render: c => `
      ${addressee(`<b>${c.x('notary', 24)}га</b>`, `${c.x('ts', 22)}дан`, `Паспорт: ${c.x('ts_pass', 18)}`, `Манзил: ${c.x('ts_addr', 24)}`)}
      <h2>Ариза</h2>
      <p class="c"><i>васиятномани бекор қилиш тўғрисида</i></p>
      ${p(`${c.date('wdate')}да ${c.x('wnotary', 22)} томонидан тасдиқланган ва реестрда ${c.x('reg', 6)}-рақам билан қайд этилган васиятномамни тўлиқ бекор қиламан.`)}
      ${p('Ушбу аризанинг ҳуқуқий оқибатлари менга нотариус томонидан тушунтирилди.')}
      ${signLine(c, 'date', 'ts')}
      ${notaryBox}`,
  },
];

const att: FieldDef = { k: 'att', g: 'claim', l: tr('Qoʻshimcha ilovalar (har biri yangi qatordan)', 'Доп. приложения (каждое с новой строки)', 'Extra attachments (one per line)'), t: 'textarea' };
const date: FieldDef = { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-06' };
const parties = (pl: { fio: string; addr: string }, df: { fio: string; addr: string }, dfL = L.fio): FieldDef[] => [
  { k: 'court', g: 'court', l: tr('Sud nomi', 'Наименование суда', 'Court'), ex: COURT },
  { k: 'pl', g: 'plaintiff', l: L.fio, ex: pl.fio },
  { k: 'pl_addr', g: 'plaintiff', l: L.addr, ex: pl.addr },
  { k: 'pl_phone', g: 'plaintiff', l: L.phone, ex: '+998 90 111-22-33', half: true },
  { k: 'df', g: 'defendant', l: dfL, ex: df.fio },
  { k: 'df_addr', g: 'defendant', l: L.addr, ex: df.addr },
];
const head = (c: Ctx, a = 'Даъвогар', b = 'Жавобгар') => addressee(`<b>${c.x('court', 26)}га</b>`, `<b>${a}:</b> ${c.x('pl', 22)}`, `Манзил: ${c.x('pl_addr', 24)}`, c.has('pl_phone') ? `Тел.: ${c.x('pl_phone')}` : '', `<b>${b}:</b> ${c.x('df', 22)}`, `Манзил: ${c.x('df_addr', 24)}`);

export const BATCH4_COURT: DocTemplate[] = [
  {
    id: 'court-reinstatement', cat: 'court', sub: 'claims', minutes: 6,
    docTitle: 'Ишга тиклаш тўғрисида даъво аризаси',
    title: tr('Ishga tiklash toʻgʻrisida daʼvo', 'Иск о восстановлении на работе', 'Claim for reinstatement'),
    desc: tr('Gʻayriqonuniy boʻshatilgan xodim: ishga tiklash, majburiy progul haqi, maʼnaviy zarar.', 'Незаконно уволенный: восстановление, оплата вынужденного прогула, моральный вред.', 'Unlawfully dismissed employee: reinstatement, back pay, non-pecuniary damage.'),
    fields: [
      ...parties({ fio: 'Алиев Тимур Рустамович', addr: 'Тошкент ш., Чилонзор тумани, 5-мавзе, 3-уй, 7-хонадон' }, { fio: '«Мисол Хизмат» МЧЖ', addr: 'Тошкент ш., Чилонзор тумани, Бунёдкор шоҳ кўчаси, 10-уй' }, tr('Ish beruvchi', 'Работодатель', 'Employer')),
      { k: 'pos', g: 'claim', l: L.position, ex: 'омборчи', half: true },
      { k: 'order', g: 'claim', l: tr('Boʻshatish buyrugʻi', 'Приказ об увольнении', 'Dismissal order'), ex: '15.09.2026 йилдаги 31-К-сон', half: true },
      { k: 'ground', g: 'claim', l: tr('Koʻrsatilgan asos', 'Указанное основание', 'Stated ground'), ex: 'меҳнат вазифаларини мунтазам бузганлик' },
      { k: 'why', g: 'claim', l: tr('Nima uchun gʻayriqonuniy', 'Почему незаконно', 'Why unlawful'), t: 'textarea', ex: 'Менга нисбатан илгари интизомий жазо қўлланмаган, тушунтириш хати талаб қилинмаган, касаба уюшмаси қўмитаси билан келишилмаган. Буйруқ нусхаси менга фақат 20.09.2026 йилда берилган.' },
      { k: 'back', g: 'claim', l: tr('Majburiy progul uchun haq', 'Оплата вынужденного прогула', 'Back pay'), t: 'money', ex: '4500000', half: true },
      { k: 'moral', g: 'claim', l: tr('Maʼnaviy zarar', 'Моральный вред', 'Non-pecuniary damage'), t: 'money', ex: '3000000', half: true },
      att, date,
    ],
    render: c => `
      ${head(c)}
      <h2>Даъво аризаси</h2>
      <p class="c"><i>ишга тиклаш тўғрисида</i></p>
      ${p(`Мен жавобгарда ${c.x('pos', 12)} лавозимида ишлаганман. ${c.x('order', 16)} буйруқ билан «${c.x('ground', 22)}» асосида ишдан бўшатилдим.`)}
      ${p(`Ишдан бўшатиш қонунга хилоф деб ҳисоблайман: ${c.x('why', 40)}`)}
      ${p('Ўзбекистон Республикаси Меҳнат кодексига мувофиқ, меҳнат шартномаси қонунга хилоф равишда бекор қилинган ходим аввалги ишига тикланиши, унга мажбурий прогул вақти учун ўртача иш ҳақи тўланиши ва маънавий зарар қопланиши лозим.')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`${c.x('order', 16)} буйруқ қонунга хилоф деб топилиб, бекор қилинсин ва мен аввалги ${c.x('pos', 12)} лавозимимга тиклансин.`, `Жавобгардан менинг фойдамга мажбурий прогул вақти учун ${c.money('back')} (суд қарори чиққан кунгача қайта ҳисобланган ҳолда) ундирилсин.`, `${c.money('moral')} маънавий зарар ундирилсин.`])}
      ${attachments(c, ['Ишдан бўшатиш тўғрисидаги буйруқ нусхаси.', 'Меҳнат шартномаси нусхаси.', 'Ўртача иш ҳақи тўғрисидаги маълумотнома.', 'Даъво аризасининг жавобгар учун нусхаси.'], 'att')}
      ${signLine(c, 'date', 'pl')}`,
  },
  {
    id: 'court-child-residence', cat: 'court', sub: 'claims', minutes: 6,
    docTitle: 'Боланинг яшаш жойини белгилаш тўғрисида даъво аризаси',
    title: tr('Bolaning yashash joyini belgilash daʼvosi', 'Иск об определении места жительства ребёнка', 'Claim to determine a child’s residence'),
    desc: tr('Ajrashgan ota-ona: bola kim bilan yashashi, sharoitlar, boshqa ota-ona bilan uchrashuv tartibi.', 'Разведённые родители: с кем живёт ребёнок, условия, порядок общения.', 'Separated parents: who the child lives with, conditions, contact schedule.'),
    fields: [
      ...parties(W, H),
      { k: 'kids', g: 'children', l: tr('Bolalar', 'Дети', 'Children'), t: 'rows', cols: [{ k: 'fio', l: L.fio }, { k: 'born', l: tr('Tugʻilgan sanasi', 'Дата рождения', 'Date of birth') }],
        ex: [{ fio: 'Каримова Мадина Фарруховна', born: '05.09.2019' }] },
      { k: 'cond', g: 'claim', l: tr('Sharoitlar', 'Условия', 'Conditions'), t: 'textarea', ex: 'Мен доимий иш жойига ва уч хонали квартирага эгаман. Бола туғилганидан бери мен билан яшайди, яшаш жойи яқинидаги мактабгача таълим ташкилотига қатнайди.' },
      { k: 'visits', g: 'claim', l: tr('Uchrashuv tartibi (taklif)', 'Порядок общения (предложение)', 'Contact schedule (proposal)'), ex: 'ҳар ҳафтанинг шанба куни соат 10:00 дан 18:00 гача' },
      att, date,
    ],
    render: c => {
      const kids = c.rows('kids').filter(r => (r['fio'] ?? '').trim());
      const list = kids.length ? kids.map(r => `${c.span(esc(r['fio']))} (${c.span(esc(r['born'] ?? ''))} йилда туғилган)`).join(', ') : c.blank(30);
      return `
      ${head(c)}
      <h2>Даъво аризаси</h2>
      <p class="c"><i>боланинг яшаш жойини белгилаш тўғрисида</i></p>
      ${p(`Жавобгар билан никоҳдан фарзандимиз бор: ${list}. Ҳозирда биз алоҳида яшаймиз ва боланинг яшаш жойи бўйича келишувга эриша олмадик.`)}
      ${p(c.x('cond', 40))}
      ${p('Ўзбекистон Республикаси Оила кодексига кўра, ота-она алоҳида яшаганда вояга етмаган боланинг яшаш жойи ота-онанинг келишуви билан, келишув бўлмаганда эса боланинг манфаатларини ҳисобга олган ҳолда суд томонидан белгиланади.')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`Вояга етмаган ${list}нинг яшаш жойи онаси (отаси) — даъвогар ${c.x('pl', 18)} билан белгилансин.`, `Жавобгарнинг бола билан учрашиш тартиби қуйидагича белгилансин: ${c.x('visits', 24)}.`])}
      ${attachments(c, ['Боланинг туғилганлик тўғрисидаги гувоҳномаси нусхаси.', 'Даъвогарнинг иш жойи ва уй-жой шароити тўғрисидаги ҳужжатлар.', 'Даъво аризасининг жавобгар учун нусхаси.'], 'att')}
      ${signLine(c, 'date', 'pl')}`;
    },
  },
  {
    id: 'court-alimony-change', cat: 'court', sub: 'claims', minutes: 5,
    docTitle: 'Алимент миқдорини ўзгартириш тўғрисида даъво аризаси',
    title: tr('Aliment miqdorini oʻzgartirish daʼvosi', 'Иск об изменении размера алиментов', 'Claim to change child support'),
    desc: tr('Oilaviy yoki moddiy ahvol oʻzgargani sababli aliment miqdorini kamaytirish yoki oshirish.', 'Уменьшение или увеличение алиментов в связи с изменением положения.', 'Reduce or increase support due to changed circumstances.'),
    fields: [
      ...parties(H, W),
      { k: 'dec', g: 'case', l: tr('Avvalgi qaror', 'Прежнее решение', 'Previous decision'), ex: 'Юнусобод туманлараро судининг 10.03.2025 йилдаги ҳал қилув қарори' },
      { k: 'now', g: 'case', l: tr('Hozirgi miqdor', 'Текущий размер', 'Current amount'), ex: 'даромаднинг учдан бир қисми', half: true },
      { k: 'dir', g: 'claim', l: tr('Talab', 'Требование', 'Request'), t: 'select', opts: ['камайтириш', 'ошириш'], ex: 'камайтириш', half: true },
      { k: 'new', g: 'claim', l: tr('Soʻralayotgan miqdor', 'Запрашиваемый размер', 'Requested amount'), ex: 'ҳар ойда 2 000 000 сўм қатъий пул суммаси' },
      { k: 'why', g: 'claim', l: tr('Sabab', 'Причина', 'Grounds'), t: 'textarea', ex: 'Янги оила қурдим ва қарамоғимда яна бир вояга етмаган фарзанд бор. Бундан ташқари, соғлиғим ёмонлашгани сабабли даромадим камайган, бу тиббий маълумотнома билан тасдиқланади.' },
      att, date,
    ],
    render: c => `
      ${head(c)}
      <h2>Даъво аризаси</h2>
      <p class="c"><i>алимент миқдорини ўзгартириш тўғрисида</i></p>
      ${p(`${c.x('dec', 26)} билан мендан болалар таъминоти учун ${c.x('now', 18)} миқдорида алимент ундирилган.`)}
      ${p(`Ушбу қарор қабул қилингандан кейин тарафлардан бирининг моддий ва оилавий аҳволи ўзгарди: ${c.x('why', 40)}`)}
      ${p('Ўзбекистон Республикаси Оила кодексига мувофиқ, тарафлардан бирининг моддий ёки оилавий аҳволи ўзгарганда суд манфаатдор тарафнинг талабига кўра алимент миқдорини ўзгартиришга ҳақли.')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`Алимент миқдори ${c.x('dir', 8)} ва ${c.x('new', 24)} этиб белгилансин.`])}
      ${attachments(c, ['Аввалги суд қарори нусхаси.', 'Даромад ва оилавий аҳволни тасдиқловчи ҳужжатлар.', 'Даъво аризасининг жавобгар учун нусхаси.'], 'att')}
      ${signLine(c, 'date', 'pl')}`,
  },
  {
    id: 'court-writ-request', cat: 'court', sub: 'applications', minutes: 2,
    docTitle: 'Ижро варақасини бериш тўғрисида ариза',
    title: tr('Ijro varaqasini berish arizasi', 'Заявление о выдаче исполнительного листа', 'Request for a writ of execution'),
    desc: tr('Qonuniy kuchga kirgan qaror boʻyicha ijro varaqasini berish va MIBga yuborish.', 'Выдача исполнительного листа по вступившему в силу решению и направление в БПИ.', 'Issue a writ on a final judgment and send it to the enforcement bureau.'),
    fields: [
      { k: 'court', g: 'court', l: tr('Sud nomi', 'Наименование суда', 'Court'), ex: COURT },
      { k: 'pl', g: 'applicant', l: tr('Undiruvchi F.I.Sh.', 'Ф.И.О. взыскателя', 'Creditor'), ex: 'Юсупов Шерзод Анварович' },
      { k: 'pl_addr', g: 'applicant', l: L.addr, ex: 'Тошкент ш., Миробод тумани, Нукус кўчаси, 20-уй, 21-хонадон' },
      { k: 'case', g: 'case', l: tr('Ish raqami', 'Номер дела', 'Case No.'), ex: '2-1234/2026', half: true },
      { k: 'dec', g: 'case', l: tr('Qaror sanasi', 'Дата решения', 'Decision date'), t: 'date', ex: '2026-08-12', half: true },
      { k: 'df', g: 'case', l: tr('Qarzdor', 'Должник', 'Debtor'), ex: 'Алиев Тимур Рустамович' },
      { k: 'send', g: 'case', l: tr('Yuborish', 'Направить', 'Send'), t: 'select', opts: ['ижро варақасини Мажбурий ижро бюросига юборишингизни', 'ижро варақасини менга беришингизни'], ex: 'ижро варақасини Мажбурий ижро бюросига юборишингизни' },
      date,
    ],
    render: c => `
      ${addressee(`<b>${c.x('court', 26)}га</b>`, `${c.x('pl', 22)}дан`, `Манзил: ${c.x('pl_addr', 24)}`)}
      <h2>Ариза</h2>
      ${p(`Судингизнинг ${c.date('dec')}даги ${c.x('case', 10)}-сонли иш бўйича ҳал қилув қарори билан ${c.x('df', 20)}дан менинг фойдамга пул маблағи ундирилган. Ҳал қилув қарори қонуний кучга кирган, бироқ қарздор уни ихтиёрий ижро этмаяпти.`)}
      ${p(`Шу боис ${c.x('send', 24)} сўрайман.`)}
      ${signLine(c, 'date', 'pl')}`,
  },
  {
    id: 'court-security', cat: 'court', sub: 'applications', minutes: 3,
    docTitle: 'Даъвони таъминлаш чораларини кўриш тўғрисида ариза',
    title: tr('Daʼvoni taʼminlash arizasi', 'Заявление об обеспечении иска', 'Application to secure a claim'),
    desc: tr('Javobgarning mol-mulki yoki hisobiga xatlov qoʻyish, bitimlarni taqiqlash va boshq.', 'Арест имущества или счёта ответчика, запрет сделок и др.', 'Freeze the defendant’s property or account, prohibit transactions, etc.'),
    fields: [
      { k: 'court', g: 'court', l: tr('Sud nomi', 'Наименование суда', 'Court'), ex: COURT },
      { k: 'pl', g: 'plaintiff', l: L.fio, ex: 'Юсупов Шерзод Анварович' },
      { k: 'pl_addr', g: 'plaintiff', l: L.addr, ex: 'Тошкент ш., Миробод тумани, Нукус кўчаси, 20-уй, 21-хонадон' },
      { k: 'df', g: 'defendant', l: L.fio, ex: 'Алиев Тимур Рустамович' },
      { k: 'case', g: 'case', l: tr('Ish (boʻlsa)', 'Дело (если есть)', 'Case (if any)'), ex: 'қарзни ундириш тўғрисидаги даъво' },
      { k: 'measure', g: 'claim', l: tr('Chora', 'Мера', 'Measure'), t: 'select', opts: ['жавобгарга тегишли мол-мулкни хатлаш', 'жавобгарнинг банк ҳисобварақларидаги маблағларни хатлаш', 'жавобгарга муайян ҳаракатларни амалга оширишни тақиқлаш'], ex: 'жавобгарга тегишли мол-мулкни хатлаш' },
      { k: 'what', g: 'claim', l: tr('Qaysi mol-mulk', 'Какое имущество', 'Which property'), ex: 'Chevrolet Malibu автомобили, давлат рақам белгиси 01 B 456 CD', half: true },
      { k: 'sum', g: 'claim', l: tr('Daʼvo summasi', 'Сумма иска', 'Claim amount'), t: 'money', ex: '30000000', half: true },
      { k: 'why', g: 'claim', l: tr('Nega zarur', 'Почему необходимо', 'Why necessary'), t: 'textarea', ex: 'Жавобгар автомобилни сотиш учун эълон берган. Мол-мулк бегоналаштирилса, суд қарорини ижро этиш имконсиз бўлиб қолиши мумкин.' },
      date,
    ],
    render: c => `
      ${addressee(`<b>${c.x('court', 26)}га</b>`, `<b>Даъвогар:</b> ${c.x('pl', 22)}`, `Манзил: ${c.x('pl_addr', 24)}`, `<b>Жавобгар:</b> ${c.x('df', 22)}`)}
      <h2>Ариза</h2>
      <p class="c"><i>даъвони таъминлаш чораларини кўриш тўғрисида</i></p>
      ${p(`Судингиз иш юритувида (иш юритувига қабул қилинаётган) ${c.x('case', 20)} бўйича ${c.money('sum')} миқдоридаги талаб мавжуд.`)}
      ${p(c.x('why', 40))}
      ${p('Ўзбекистон Республикаси Фуқаролик процессуал кодексига мувофиқ, агар таъминлаш чоралари кўрилмаса суд ҳужжатининг ижросини қийинлаштириши ёки имконсиз қилиши мумкин бўлса, суд даъвони таъминлаш чораларини кўради.')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`Даъвони таъминлаш чораси сифатида ${c.x('measure', 24)}${c.has('what') ? ` (${c.x('what')})` : ''} даъво суммаси доирасида қўллансин.`])}
      ${signLine(c, 'date', 'pl')}`,
  },
];

const meeting: FieldDef[] = [
  { k: 'company', g: 'meeting', l: L.company, ex: 'Намуна Савдо' },
  { k: 'no', g: 'meeting', l: L.number, ex: '5', half: true },
  { k: 'date', g: 'meeting', l: L.date, t: 'date', ex: '2026-10-06', half: true },
  { k: 'city', g: 'meeting', l: L.city, ex: 'Тошкент шаҳри' },
  { k: 'parts', g: 'participants', l: tr('Ishtirokchilar', 'Участники', 'Participants'), t: 'rows', cols: [{ k: 'name', l: L.fio }, { k: 'share', l: tr('Ulush, %', 'Доля, %', 'Share, %'), num: true }],
    ex: [{ name: 'Каримов Алишер Баҳромович', share: '60' }, { name: 'Раҳимова Дилноза Шавкатовна', share: '40' }] },
];
const minutes = (c: Ctx, agenda: string, decisions: string[]) => {
  const parts = c.rows('parts').filter(r => (r['name'] ?? '').trim());
  return `
    <p class="c">«${c.x('company')}» масъулияти чекланган жамияти</p>
    <h2>Иштирокчилар умумий йиғилишининг баённомаси № ${c.x('no', 3)}</h2>
    ${meta(c.x('city', 14), c.date('date'))}
    ${p('Йиғилишда иштирок этдилар:')}
    ${ol(parts.length ? parts.map(r => `${c.span(esc(r['name']))} — ${c.span(esc(r['share'] ?? ''))}%`) : [c.blank(30)])}
    ${p(`Кворум мавжуд. Кун тартиби: ${agenda}.`)}
    <h3>Қарор қилинди:</h3>
    ${ol(decisions)}
    ${p('Овоз бериш натижалари: «ёқлаб» — 100%, «қарши» — йўқ, «бетараф» — йўқ.')}
    ${ol(parts.length ? parts.map(r => `${c.span(esc(r['name']))} ____________`) : [c.blank(30)])}`;
};
const poaHead = (c: Ctx) => `
  <p class="c"><b>${c.x('co_name', 22)}</b><br>СТИР ${c.x('co_stir', 9)} · ${c.x('co_addr', 24)}</p>
  <h2>Ишончнома № ${c.x('no', 4)}</h2>
  ${meta(c.x('city', 14), c.date('date'))}`;
const poaCo = (): FieldDef[] => [
  ...partyFields('co', 'principal', EX_A).filter(f => ['co_name', 'co_stir', 'co_addr', 'co_acc', 'co_bank', 'co_mfo', 'co_rep', 'co_pos'].includes(f.k)),
  { k: 'no', g: 'doc', l: L.number, ex: '84', half: true },
  { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-06', half: true },
  { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент шаҳри' },
  { k: 'ag', g: 'agent', l: L.fio, ex: 'Тошпўлатов Бекзод Анварович' },
  { k: 'ag_pos', g: 'agent', l: L.position, ex: 'омборчи', half: true },
  { k: 'ag_pass', g: 'agent', l: tr('Pasport', 'Паспорт', 'Passport'), ex: 'AB 3456789, Сергели тумани ИИБ, 10.10.2019', half: true },
];
const poaSign = (c: Ctx) => `${p(`Ишончли вакилнинг имзоси ____________ тасдиқлайман.`)}${sigTable(c.x('co_pos', 10), `____________ ${c.x('co_rep', 16)}<br>М.Ў.`)}`;

export const BATCH4_CORPORATE: DocTemplate[] = [
  {
    id: 'branch-decision', cat: 'corporate', sub: 'decisions', minutes: 4,
    docTitle: 'Филиал очиш тўғрисида қарор',
    title: tr('Filial ochish qarori', 'Решение об открытии филиала', 'Decision to open a branch'),
    desc: tr('Filial yoki vakolatxona ochish: nomi, manzili, faoliyati, rahbari, nizomni tasdiqlash.', 'Открытие филиала: название, адрес, деятельность, руководитель, положение.', 'Open a branch: name, address, business, head, approve regulations.'),
    fields: [
      ...meeting,
      { k: 'bname', g: 'decision', l: tr('Filial nomi', 'Название филиала', 'Branch name'), ex: '«Намуна Савдо» МЧЖ Самарқанд филиали' },
      { k: 'baddr', g: 'decision', l: tr('Filial manzili', 'Адрес филиала', 'Branch address'), ex: 'Самарқанд ш., Регистон кўчаси, 25-уй' },
      { k: 'bact', g: 'decision', l: tr('Filial faoliyati', 'Деятельность филиала', 'Branch business'), ex: 'улгуржи савдо ва омбор хизматлари' },
      { k: 'bhead', g: 'decision', l: tr('Filial rahbari', 'Руководитель филиала', 'Branch head'), ex: 'Нормуродов Санжар Ботирович' },
    ],
    render: c => minutes(c, 'филиал очиш', [
      `${c.x('baddr', 24)} манзилида ${c.x('bname', 22)} очилсин. Филиал ${c.x('bact', 20)} фаолиятини амалга оширади.`,
      `Филиал тўғрисидаги низом тасдиқлансин. Филиал раҳбари этиб ${c.x('bhead', 20)} тайинлансин ва унга ишончнома берилсин.`,
      'Жамият директорига филиални қонунчиликда белгиланган тартибда ҳисобга қўйиш (рўйхатдан ўтказиш) ва бошқа зарур ҳаракатларни амалга ошириш юклатилсин.',
    ]),
  },
  {
    id: 'liquidation-decision', cat: 'corporate', sub: 'decisions', minutes: 4,
    docTitle: 'Жамиятни ихтиёрий тугатиш тўғрисида қарор',
    title: tr('Jamiyatni tugatish qarori', 'Решение о ликвидации общества', 'Voluntary liquidation decision'),
    desc: tr('MChJni ixtiyoriy tugatish: tugatuvchi (komissiya), kreditorlarni xabardor qilish, balanslar.', 'Добровольная ликвидация ООО: ликвидатор, уведомление кредиторов, балансы.', 'Voluntary liquidation: liquidator, notifying creditors, balance sheets.'),
    fields: [
      ...meeting,
      { k: 'why', g: 'decision', l: tr('Sabab', 'Причина', 'Reason'), ex: 'иштирокчиларнинг қарорига кўра фаолиятни давом эттириш мақсадга мувофиқ эмаслиги' },
      { k: 'liq', g: 'decision', l: tr('Tugatuvchi', 'Ликвидатор', 'Liquidator'), ex: 'Каримов Алишер Баҳромович' },
    ],
    render: c => minutes(c, 'жамиятни ихтиёрий тугатиш', [
      `«${c.x('company')}» МЧЖ ${c.x('why', 24)} сабабли ихтиёрий равишда тугатилсин.`,
      `Тугатувчи этиб ${c.x('liq', 20)} тайинлансин. Шу пайтдан бошлаб жамият ишларини бошқариш ваколатлари тугатувчига ўтади.`,
      'Тугатувчига: рўйхатдан ўтказувчи органни ва солиқ органини тугатиш ҳақида қонунда белгиланган муддатда хабардор қилиш; маълум кредиторларни ёзма хабардор қилиш ва тугатиш ҳақида эълон бериш; дебиторлик қарзларини ундириш; оралиқ ва якуний тугатиш балансларини тузиб, умумий йиғилишга тасдиқлаш учун тақдим этиш юклатилсин.',
      'Кредиторлар билан ҳисоб-китоблардан кейин қолган мол-мулк иштирокчилар ўртасида уларнинг улушларига мутаносиб тақсимлансин.',
    ]),
  },
  {
    id: 'details-change-letter', cat: 'corporate', sub: 'letters', minutes: 2,
    docTitle: 'Реквизитлар ўзгаргани тўғрисида хабарнома',
    title: tr('Rekvizitlar oʻzgargani haqida xat', 'Письмо об изменении реквизитов', 'Notice of changed company details'),
    desc: tr('Hamkorlarga: yangi bank hisob, manzil yoki nom; qaysi sanadan amal qilishi.', 'Контрагентам: новый счёт, адрес или название; дата действия.', 'To partners: new bank account, address or name; effective date.'),
    fields: [
      ...partyFields('co', 'company', EX_A).filter(f => ['co_name', 'co_stir', 'co_rep', 'co_phone'].includes(f.k)),
      { k: 'out', g: 'doc', l: tr('Chiquvchi raqam', 'Исходящий №', 'Reference No.'), ex: '70/26', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-06', half: true },
      { k: 'to', g: 'addressee', l: tr('Kimga', 'Кому', 'To'), ex: 'Ҳурматли ҳамкорлар' },
      { k: 'from', g: 'changes', l: tr('Qaysi sanadan', 'С какой даты', 'Effective from'), t: 'date', ex: '2026-10-15' },
      { k: 'rows', g: 'changes', l: tr('Oʻzgarishlar', 'Изменения', 'Changes'), t: 'rows',
        cols: [{ k: 'what', l: tr('Rekvizit', 'Реквизит', 'Detail') }, { k: 'old', l: tr('Eski', 'Старое', 'Old') }, { k: 'new', l: tr('Yangi', 'Новое', 'New') }],
        ex: [{ what: 'Ҳисоб рақами', old: '2020 8000 1001 2345 6001', new: '2020 8000 7007 1234 0001' }, { what: 'Банк, МФО', old: '«Намуна банк» АТБ, 00014', new: '«Бошқа Намуна банк» АТБ, 00444' }] },
    ],
    render: c => {
      const rows = c.rows('rows').filter(r => (r['what'] ?? '').trim());
      return `
      <p class="c"><b>${c.x('co_name', 22)}</b> · СТИР ${c.x('co_stir', 9)} · тел. ${c.x('co_phone', 12)}</p>
      <p>${c.dshort('date')} № ${c.x('out', 6)}</p>
      ${addressee(c.x('to', 20))}
      <h2>Хабарнома</h2>
      ${p(`${c.x('co_name', 18)} ${c.date('from')}дан бошлаб қуйидаги реквизитлари ўзгаришини маълум қилади:`)}
      <table class="t"><tr><th>Реквизит</th><th>Эски</th><th>Янги</th></tr>${rows.map(r => `<tr><td>${c.span(esc(r['what']))}</td><td>${c.span(esc(r['old'] ?? ''))}</td><td><b>${c.span(esc(r['new'] ?? ''))}</b></td></tr>`).join('') || `<tr><td>${c.blank(10)}</td><td></td><td></td></tr>`}</table>
      ${p('Кўрсатилган санадан бошлаб тўловларни ва ҳужжатларни янги реквизитлар бўйича расмийлаштиришингизни сўраймиз. Шартномаларга қўшимча келишув талаб этилса, тайёрлаб беришга тайёрмиз.')}
      <table class="sig"><tr><td>Директор</td><td class="r">____________ ${c.x('co_rep', 16)}<br>М.Ў.</td></tr></table>`;
    },
  },
  {
    id: 'goods-poa', cat: 'corporate', sub: 'poa', minutes: 3,
    docTitle: 'Товар-моддий бойликларни олиш учун ишончнома',
    title: tr('Tovar olish uchun ishonchnoma', 'Доверенность на получение ТМЦ', 'Power of attorney to collect goods'),
    desc: tr('Xodimga yetkazib beruvchidan tovar-moddiy boyliklarni olish vakolati: roʻyxat, hujjat, muddat.', 'Получение ТМЦ у поставщика: перечень, документ, срок.', 'Employee may collect goods from a supplier: list, document, validity.'),
    fields: [
      ...poaCo(),
      { k: 'from', g: 'powers', l: tr('Kimdan olinadi', 'У кого получить', 'Supplier'), ex: '«Мисол Хизмат» МЧЖ' },
      { k: 'doc', g: 'powers', l: tr('Hujjat asosida', 'По документу', 'Document'), ex: '06.10.2026 йилдаги 128-сон ҳисобварақ-фактура' },
      { k: 'until', g: 'powers', l: tr('Amal qilish muddati', 'Действительна до', 'Valid until'), t: 'date', ex: '2026-10-16', half: true },
      { k: 'items', g: 'items', l: tr('Olinadigan qiymatliklar', 'ТМЦ к получению', 'Items'), t: 'rows', cols: [{ k: 'name', l: tr('Nomi', 'Наименование', 'Name') }, { k: 'unit', l: tr('Oʻlchov', 'Ед.', 'Unit') }, { k: 'qty', l: tr('Miqdori (soʻz bilan)', 'Количество (прописью)', 'Quantity (in words)') }],
        ex: [{ name: 'Шакар (50 кг қопда)', unit: 'қоп', qty: 'қирқ' }, { name: 'Ўсимлик ёғи, 5 л', unit: 'дона', qty: 'юз' }] },
    ],
    render: c => {
      const rows = c.rows('items').filter(r => (r['name'] ?? '').trim());
      return `${poaHead(c)}
      ${p(`Ушбу ишончнома ${c.x('ag_pos', 10)} ${c.x('ag', 22)}га (паспорт: ${c.x('ag_pass', 18)}) ${c.x('from', 18)}дан ${c.x('doc', 22)} асосида қуйидаги товар-моддий бойликларни олиш учун берилди:`)}
      <table class="t"><tr><th>№</th><th>Номи</th><th>Ўлчов бирлиги</th><th>Миқдори (сўз билан)</th></tr>${rows.map((r, i) => `<tr><td class="n">${i + 1}</td><td>${c.span(esc(r['name']))}</td><td>${c.span(esc(r['unit'] ?? ''))}</td><td>${c.span(esc(r['qty'] ?? ''))}</td></tr>`).join('') || `<tr><td class="n">1</td><td>${c.blank(14)}</td><td></td><td></td></tr>`}</table>
      ${p(`Ишончнома ${c.date('until')}гача амал қилади.`)}
      ${poaSign(c)}`;
    },
  },
  {
    id: 'company-vehicle-poa', cat: 'corporate', sub: 'poa', minutes: 3,
    docTitle: 'Хизмат автомобилини бошқариш учун ишончнома',
    title: tr('Xizmat avtomobilini boshqarish ishonchnomasi', 'Доверенность на служебный автомобиль', 'Company car power of attorney'),
    desc: tr('Tashkilot nomidan xodimga xizmat avtomobilini boshqarish va undan foydalanish vakolati.', 'Право работника управлять служебным автомобилем.', 'Authorises an employee to drive and use a company vehicle.'),
    fields: [
      ...poaCo(),
      { k: 'lic', g: 'agent', l: tr('Haydovchilik guvohnomasi', 'Водительское удостоверение', 'Driving licence'), ex: 'AF 7654321' },
      ...vehicleFields('vehicle'),
      { k: 'until', g: 'powers', l: tr('Amal qilish muddati', 'Действительна до', 'Valid until'), t: 'date', ex: '2027-10-06', half: true },
    ],
    render: c => `${poaHead(c)}
      ${p(`${c.x('co_name', 18)} ушбу ишончнома билан ${c.x('ag_pos', 10)} ${c.x('ag', 22)}га (паспорт: ${c.x('ag_pass', 18)}, ҳайдовчилик гувоҳномаси ${c.x('lic', 10)}) жамият балансидаги ${vehicleText(c)}ни бошқариш ва ундан хизмат мақсадларида фойдаланиш, йўл ҳаракати хавфсизлиги органлари ва техник хизмат кўрсатиш шохобчаларида жамият номидан вакиллик қилиш ҳуқуқини беради.`)}
      ${p(`Ишончнома ${c.date('until')}гача ваколатларни бошқа шахсга ишониш ҳуқуқисиз берилди. Автомобилни бегоналаштириш ва гаровга қўйиш ҳуқуқи берилмайди.`)}
      ${poaSign(c)}`,
  },
];
