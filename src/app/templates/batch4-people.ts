import { esc } from '../core/doc/format';
import { Ctx, meta, ol, p, sigTable } from '../core/doc/engine';
import { DocTemplate, FieldDef } from '../core/doc/types';
import { addressee, attachments, L, signLine, tr } from './shared';

const AP = { fio: 'Каримова Нигора Ботировна', addr: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадон' };
const ap = (): FieldDef[] => [
  { k: 'ap', g: 'applicant', l: L.fio, ex: AP.fio },
  { k: 'ap_addr', g: 'applicant', l: L.addr, ex: AP.addr },
  { k: 'ap_phone', g: 'applicant', l: L.phone, ex: '+998 90 111-22-33', half: true },
];
const from = (c: Ctx) => [`${c.x('ap', 22)}дан`, `Манзил: ${c.x('ap_addr', 24)}`, c.has('ap_phone') ? `Тел.: ${c.x('ap_phone')}` : ''];
const date: FieldDef = { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-06' };
const attF: FieldDef = { k: 'att', g: 'request', l: tr('Ilovalar (har biri yangi qatordan)', 'Приложения (каждое с новой строки)', 'Attachments (one per line)'), t: 'textarea' };

const toDir: FieldDef[] = [
  { k: 'co', g: 'employer', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
  { k: 'dir', g: 'employer', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Director'), ex: 'А.Б. Каримов' },
];
const worker: FieldDef[] = [
  { k: 'w', g: 'employee', l: L.fio, ex: 'Сафарова Малика Илҳомовна' },
  { k: 'pos', g: 'employee', l: L.position, ex: 'бухгалтер', half: true },
  { k: 'dept', g: 'employee', l: tr('Boʻlim', 'Отдел', 'Department'), ex: 'бухгалтерия', half: true },
];
const wHead = (c: Ctx) => addressee(`<b>${c.x('co', 20)} директори</b>`, `${c.x('dir', 14)}га`, `${c.x('dept', 12)} ${c.x('pos', 14)}`, `${c.x('w', 22)}дан`);
const orderHead: FieldDef[] = [
  { k: 'company', g: 'doc', l: L.company, ex: 'Намуна Савдо' },
  { k: 'no', g: 'doc', l: L.number, ex: '27-К', half: true },
  { k: 'odate', g: 'doc', l: L.date, t: 'date', ex: '2026-10-06', half: true },
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
const hrParties: FieldDef[] = [
  { k: 'company', g: 'employer', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
  { k: 'head', g: 'employer', l: L.head, ex: 'Каримов Алишер Баҳромович' },
  { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-06', half: true },
  { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент ш.', half: true },
  { k: 'w', g: 'employee', l: L.fio, ex: 'Алиев Тимур Рустамович' },
  { k: 'pos', g: 'employee', l: L.position, ex: 'савдо менежери', half: true },
  { k: 'contract', g: 'employee', l: tr('Mehnat shartnomasi', 'Трудовой договор', 'Employment contract'), ex: '01.03.2024 йилдаги 12-сон', half: true },
];
const hrSign = (c: Ctx) => sigTable(`<b>Иш берувчи</b><br>${c.x('company', 16)}<br><br>____________ ${c.x('head', 16)}<br>М.Ў.`, `<b>Ходим</b><br>${c.x('pos', 12)}<br><br>____________ ${c.x('w', 16)}`);

export const BATCH4_APPLICATIONS: DocTemplate[] = [
  {
    id: 'mahalla-reference', cat: 'applications', sub: 'individuals', minutes: 2,
    docTitle: 'Маълумотнома бериш тўғрисида ариза',
    title: tr('Mahalladan maʼlumotnoma olish arizasi', 'Заявление в махаллю о справке', 'Request for a mahalla reference'),
    desc: tr('Mahalla fuqarolar yigʻiniga: yashash joyi, oila tarkibi yoki tavsifnoma berishni soʻrash.', 'В сход граждан махалли: справка о месте жительства, составе семьи или характеристика.', 'To the mahalla: certificate of residence, family composition or a character reference.'),
    fields: [
      { k: 'mfy', g: 'addressee', l: tr('MFY nomi', 'Махалля', 'Mahalla'), ex: '«Боғишамол» маҳалла фуқаролар йиғини' },
      { k: 'rais', g: 'addressee', l: tr('Rais F.I.Sh.', 'Ф.И.О. председателя', 'Chair'), ex: 'Р.Р. Раҳимов' },
      ...ap(),
      { k: 'kind', g: 'request', l: tr('Maʼlumotnoma turi', 'Вид справки', 'Type'), t: 'select', opts: ['яшаш жойи тўғрисида', 'оила таркиби тўғрисида', 'тавсифнома'], ex: 'оила таркиби тўғрисида', half: true },
      { k: 'for', g: 'request', l: tr('Qayerga', 'Куда', 'For'), ex: 'банкка тақдим этиш учун', half: true },
      date,
    ],
    render: c => `
      ${addressee(`<b>${c.x('mfy', 22)} раиси</b>`, `${c.x('rais', 14)}га`, ...from(c))}
      <h2>Ариза</h2>
      ${p(`Менга ${c.x('kind', 14)} маълумотнома беришингизни сўрайман. Маълумотнома ${c.x('for', 18)} зарур.`)}
      ${signLine(c, 'date', 'ap')}`,
  },
  {
    id: 'child-absence', cat: 'applications', sub: 'children', minutes: 2,
    docTitle: 'Ўқувчининг дарсга келмаганлиги тўғрисида ариза',
    title: tr('Bolaning darsga kelmagani haqida ariza', 'Заявление о пропуске занятий ребёнком', 'Note on a pupil’s absence'),
    desc: tr('Sinf rahbari yoki direktorga: bola qaysi kunlar va qaysi sabab bilan darsga kelmagani.', 'Классному руководителю или директору: дни и причина отсутствия ребёнка.', 'To the class teacher or head: dates and reason for absence.'),
    fields: [
      { k: 'school', g: 'addressee', l: tr('Maktab', 'Школа', 'School'), ex: 'Юнусобод туманидаги 45-сон умумтаълим мактаби' },
      { k: 'dir', g: 'addressee', l: tr('Kimga', 'Кому', 'To'), ex: 'директори М.М. Мирзаевага' },
      ...ap(),
      { k: 'ch', g: 'child', l: L.fio, ex: 'Каримов Жавоҳир Фаррухович' },
      { k: 'grade', g: 'child', l: tr('Sinf', 'Класс', 'Grade'), ex: '4-«Б»', half: true },
      { k: 'from', g: 'child', l: tr('Sanadan', 'С', 'From'), t: 'date', ex: '2026-10-01', half: true },
      { k: 'to', g: 'child', l: tr('Sanagacha', 'По', 'To'), t: 'date', ex: '2026-10-03', half: true },
      { k: 'why', g: 'child', l: tr('Sabab', 'Причина', 'Reason'), t: 'select', opts: ['бетоблиги', 'оилавий шароит', 'спорт мусобақасида иштирок этгани'], ex: 'бетоблиги', half: true },
      date,
    ],
    render: c => `
      ${addressee(`<b>${c.x('school', 24)}</b>`, c.x('dir', 18), ...from(c))}
      <h2>Ариза</h2>
      ${p(`Фарзандим, ${c.x('grade', 4)} синф ўқувчиси ${c.x('ch', 22)} ${c.date('from')}дан ${c.date('to')}гача ${c.x('why', 12)} сабабли дарсларга келмаганлигини маълум қиламан.`)}
      ${p('Ўтказиб юборилган мавзуларни ўзлаштириши учун зарур чораларни кўришимизни маълум қиламан. Тасдиқловчи ҳужжат (мавжуд бўлса) илова қилинади.')}
      ${signLine(c, 'date', 'ap')}`,
  },
  {
    id: 'card-block', cat: 'applications', sub: 'individuals', minutes: 2,
    docTitle: 'Банк картасини блоклаш ва пулни қайтариш тўғрисида ариза',
    title: tr('Bank kartasini bloklash arizasi', 'Заявление о блокировке карты', 'Card blocking request'),
    desc: tr('Bankka: karta yoʻqolgani yoki ruxsatsiz operatsiya, kartani bloklash va pulni qaytarishni koʻrib chiqish.', 'В банк: утеря карты или несанкционированная операция, блокировка и возврат.', 'To a bank: lost card or unauthorised transaction, block and refund review.'),
    fields: [
      { k: 'bank', g: 'addressee', l: tr('Bank (filial)', 'Банк (филиал)', 'Bank (branch)'), ex: '«Намуна банк» АТБ Юнусобод филиали' },
      ...ap(),
      { k: 'card', g: 'request', l: tr('Karta raqami (oxirgi 4 raqam)', 'Карта (последние 4 цифры)', 'Card (last 4 digits)'), ex: '**** 4821', half: true },
      { k: 'reason', g: 'request', l: tr('Sabab', 'Причина', 'Reason'), t: 'select', opts: ['карта йўқолгани', 'карта ўғирлангани', 'ҳисобимдан рухсатсиз операция амалга оширилгани'], ex: 'ҳисобимдан рухсатсиз операция амалга оширилгани', half: true },
      { k: 'ops', g: 'request', l: tr('Operatsiyalar (boʻlsa)', 'Операции (если есть)', 'Transactions (if any)'), t: 'textarea', ex: '05.10.2026 соат 23:14 да 1 250 000 сўм миқдорида интернет-тўлов' },
      date,
    ],
    render: c => `
      ${addressee(`<b>${c.x('bank', 24)} бошқарувчисига</b>`, ...from(c))}
      <h2>Ариза</h2>
      ${p(`${c.x('reason', 24)} сабабли менинг номимга чиқарилган ${c.x('card', 8)} рақамли банк картасини зудлик билан блоклашингизни сўрайман.`)}
      ${c.has('ops') ? p(`Қуйидаги операцияни мен амалга оширмаганман ва унга рухсат бермаганман: ${c.x('ops', 30)}. Ушбу операцияни текширишингизни ва маблағни қайтариш чораларини кўришингизни сўрайман.`) : ''}
      ${p('Карта ва ҳисобга оид маълумотларни учинчи шахсларга бермаганман. Ариза кўриб чиқилиши натижаси ҳақида ёзма жавоб беришингизни сўрайман.')}
      ${signLine(c, 'date', 'ap')}`,
  },
  {
    id: 'benefit-application', cat: 'applications', sub: 'children', minutes: 3,
    docTitle: 'Болали оилаларга нафақа тайинлаш тўғрисида ариза',
    title: tr('Bolali oilalarga nafaqa arizasi', 'Заявление на пособие семьям с детьми', 'Child benefit application'),
    desc: tr('Ijtimoiy himoya organiga: oila tarkibi, bolalar, daromad; nafaqa tayinlashni soʻrash.', 'В орган соцзащиты: состав семьи, дети, доход; просьба назначить пособие.', 'To social protection: family, children, income; request for a benefit.'),
    fields: [
      { k: 'org', g: 'addressee', l: tr('Organ', 'Орган', 'Authority'), ex: 'Юнусобод тумани ижтимоий ҳимоя бўлими' },
      ...ap(),
      { k: 'kids', g: 'children', l: tr('Bolalar', 'Дети', 'Children'), t: 'rows', cols: [{ k: 'fio', l: L.fio }, { k: 'born', l: tr('Tugʻilgan sanasi', 'Дата рождения', 'Date of birth') }],
        ex: [{ fio: 'Каримов Жавоҳир Фаррухович', born: '12.03.2016' }, { fio: 'Каримова Мадина Фарруховна', born: '05.09.2019' }] },
      { k: 'members', g: 'request', l: tr('Oila aʼzolari soni', 'Членов семьи', 'Family size'), t: 'number', ex: '4', half: true },
      { k: 'income', g: 'request', l: tr('Oylik oʻrtacha daromad', 'Средний доход в месяц', 'Average monthly income'), t: 'money', ex: '3800000', half: true },
      attF, date,
    ],
    render: c => {
      const kids = c.rows('kids').filter(r => (r['fio'] ?? '').trim());
      return `
      ${addressee(`<b>${c.x('org', 24)}га</b>`, ...from(c))}
      <h2>Ариза</h2>
      ${p(`Оиламиз ${c.x('members', 2)} нафар аъзодан иборат, шу жумладан вояга етмаган фарзандларим: ${kids.length ? kids.map(r => `${c.span(esc(r['fio']))} (${c.span(esc(r['born'] ?? ''))})`).join(', ') : c.blank(30)}. Оиланинг ўртача ойлик даромади ${c.money('income')}.`)}
      ${p('Қонунчиликда белгиланган тартибда болали оилаларга бериладиган нафақани тайинлашингизни сўрайман. Тақдим этилган маълумотларнинг тўғрилиги учун жавобгарман ва уларни текширишга розилик бераман.')}
      ${attachments(c, ['Паспорт нусхаси.', 'Болаларнинг туғилганлик тўғрисидаги гувоҳномалари нусхалари.', 'Даромадлар тўғрисидаги маълумотнома.'], 'att')}
      ${signLine(c, 'date', 'ap')}`;
    },
  },
  {
    id: 'license-application', cat: 'applications', sub: 'legal', minutes: 3,
    docTitle: 'Лицензия (рухсатнома) бериш тўғрисида ариза',
    title: tr('Litsenziya (ruxsatnoma) olish arizasi', 'Заявление на лицензию (разрешение)', 'Licence / permit application'),
    desc: tr('Vakolatli organga: faoliyat turi, manzil, javobgar shaxs, ilovalar roʻyxati.', 'В уполномоченный орган: вид деятельности, адрес, ответственный, приложения.', 'To the licensing body: activity, address, responsible person, attachments.'),
    fields: [
      { k: 'org', g: 'addressee', l: tr('Litsenziyalovchi organ', 'Лицензирующий орган', 'Licensing body'), ex: 'Тошкент шаҳар ҳокимлиги' },
      { k: 'co', g: 'applicant', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
      { k: 'co_stir', g: 'applicant', l: tr('STIR', 'ИНН', 'TIN'), ex: '301234567', half: true },
      { k: 'co_phone', g: 'applicant', l: L.phone, ex: '+998 71 200-00-00', half: true },
      { k: 'co_addr', g: 'applicant', l: tr('Yuridik manzil', 'Юридический адрес', 'Registered address'), ex: 'Тошкент ш., Юнусобод тумани, Амир Темур кўчаси, 1-уй' },
      { k: 'kind', g: 'request', l: tr('Faoliyat turi', 'Вид деятельности', 'Activity'), ex: 'алкоголли маҳсулотлар чакана савдоси' },
      { k: 'place', g: 'request', l: tr('Faoliyat manzili', 'Место деятельности', 'Premises'), ex: 'Тошкент ш., Юнусобод тумани, 4-мавзе, 12-уй (савдо дўкони)' },
      attF,
      { k: 'dir', g: 'sign', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Director'), ex: 'А.Б. Каримов', half: true },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-06', half: true },
    ],
    render: c => `
      ${addressee(`<b>${c.x('org', 24)}га</b>`, `${c.x('co', 20)}дан (СТИР ${c.x('co_stir', 9)})`, `Манзил: ${c.x('co_addr', 24)}`, `Тел.: ${c.x('co_phone', 12)}`)}
      <h2>Ариза</h2>
      ${p(`${c.x('co', 18)}га ${c.x('place', 24)} манзилида ${c.x('kind', 24)} фаолиятини амалга ошириш учун лицензия (рухсатнома) беришингизни сўраймиз.`)}
      ${p('Жамият лицензия талаблари ва шартларига риоя қилиш мажбуриятини олади. Тақдим этилган ҳужжатлардаги маълумотлар тўғри.')}
      ${attachments(c, ['Давлат рўйхатидан ўтказилганлиги тўғрисидаги гувоҳнома нусхаси.', 'Бинога эгалик ёки ижара ҳуқуқини тасдиқловчи ҳужжат нусхаси.', 'Йиғим тўланганлиги тўғрисидаги ҳужжат.'], 'att')}
      <table class="sig"><tr><td>${c.date('date')}</td><td class="r">Директор ____________ ${c.x('dir', 14)}</td></tr></table>`,
  },
];

export const BATCH4_HR: DocTemplate[] = [
  {
    id: 'maternity-leave', cat: 'hr', sub: 'applications', minutes: 2,
    docTitle: 'Ҳомиладорлик ва туғиш таътили бериш тўғрисида ариза',
    title: tr('Homiladorlik va tugʻish taʼtili arizasi', 'Заявление на отпуск по беременности и родам', 'Maternity leave application'),
    desc: tr('Mehnatga layoqatsizlik varaqasi asosida taʼtil va nafaqa tayinlashni soʻrash.', 'Отпуск и пособие на основании листка нетрудоспособности.', 'Leave and benefit based on the sick-leave certificate.'),
    fields: [
      ...toDir, ...worker,
      { k: 'from', g: 'leave', l: tr('Boshlanish', 'С', 'From'), t: 'date', ex: '2026-11-01', half: true },
      { k: 'days', g: 'leave', l: tr('Kalendar kunlar', 'Календарных дней', 'Calendar days'), t: 'number', ex: '126', half: true, hint: tr('Odatda 126 kun; asoratlar yoki bir nechta bolada koʻproq.', 'Обычно 126 дней; больше при осложнениях или многоплодии.', 'Usually 126 days; more for complications or multiple births.') },
      { k: 'sheet', g: 'leave', l: tr('Mehnatga layoqatsizlik varaqasi', 'Листок нетрудоспособности', 'Sick-leave certificate'), ex: '№ 0123456, 28.10.2026' },
      date,
    ],
    render: c => `
      ${wHead(c)}
      <h2>Ариза</h2>
      ${p(`Менга ${c.x('sheet', 18)} меҳнатга лаёқатсизлик варақаси асосида ${c.date('from')}дан бошлаб ${c.x('days', 3)} календарь кун муддатга ҳомиладорлик ва туғиш таътили беришингизни ҳамда қонунчиликда белгиланган нафақани тайинлашингизни сўрайман.`)}
      ${attachments(c, ['Меҳнатга лаёқатсизлик варақаси.'])}
      ${signLine(c, 'date', 'w')}`,
  },
  {
    id: 'childcare-leave', cat: 'hr', sub: 'applications', minutes: 2,
    docTitle: 'Болани парвариш қилиш таътили бериш тўғрисида ариза',
    title: tr('Bola parvarishi taʼtili arizasi', 'Заявление на отпуск по уходу за ребёнком', 'Childcare leave application'),
    desc: tr('Bola ikki yoki uch yoshga toʻlguncha parvarish taʼtili va nafaqa.', 'Отпуск по уходу до 2 или 3 лет и пособие.', 'Childcare leave until the child turns two or three, and benefit.'),
    fields: [
      ...toDir, ...worker,
      { k: 'ch', g: 'child', l: tr('Bola F.I.Sh.', 'Ф.И.О. ребёнка', 'Child'), ex: 'Сафаров Амир Жамшидович' },
      { k: 'born', g: 'child', l: L.birth, t: 'date', ex: '2026-07-15', half: true },
      { k: 'until', g: 'child', l: tr('Taʼtil muddati', 'Срок отпуска', 'Until'), t: 'select', opts: ['бола икки ёшга тўлгунга қадар', 'бола уч ёшга тўлгунга қадар'], ex: 'бола икки ёшга тўлгунга қадар', half: true },
      { k: 'from', g: 'leave', l: tr('Boshlanish', 'С', 'From'), t: 'date', ex: '2026-11-19', half: true },
      date,
    ],
    render: c => `
      ${wHead(c)}
      <h2>Ариза</h2>
      ${p(`Менга ${c.date('from')}дан бошлаб фарзандим ${c.x('ch', 20)}ни (${c.dshort('born')} йилда туғилган) парвариш қилиш учун ${c.x('until', 20)} таътил беришингизни ва қонунчиликда белгиланган нафақани тайинлашингизни сўрайман.`)}
      ${attachments(c, ['Боланинг туғилганлик тўғрисидаги гувоҳномаси нусхаси.'])}
      ${signLine(c, 'date', 'w')}`,
  },
  {
    id: 'acting-order', cat: 'hr', sub: 'orders', minutes: 3,
    docTitle: 'Вазифасини бажарувчини тайинлаш тўғрисида буйруқ',
    title: tr('Vazifasini bajaruvchi tayinlash buyrugʻi', 'Приказ о назначении исполняющего обязанности', 'Acting appointment order'),
    desc: tr('Xodim yoʻqligida (taʼtil, kasallik) uning vazifasini boshqa xodimga yuklash, qoʻshimcha haq.', 'Возложение обязанностей отсутствующего работника, доплата.', 'Assigning an absent employee’s duties to another, with an allowance.'),
    fields: [
      ...orderHead,
      { k: 'abs', g: 'employee', l: tr('Yoʻq xodim (lavozim, F.I.Sh.)', 'Отсутствующий (должность, Ф.И.О.)', 'Absent employee'), ex: 'бош ҳисобчи Раҳимова Д.Ш.' },
      { k: 'why', g: 'employee', l: tr('Sabab', 'Причина', 'Reason'), ex: 'йиллик меҳнат таътилида бўлиши', half: true },
      { k: 'w', g: 'employee', l: tr('Tayinlanadigan xodim', 'Назначаемый', 'Appointee'), ex: 'бухгалтер Сафарова Малика Илҳомовна', half: true },
      { k: 'from', g: 'terms', l: tr('Sanadan', 'С', 'From'), t: 'date', ex: '2026-11-02', half: true },
      { k: 'to', g: 'terms', l: tr('Sanagacha', 'По', 'To'), t: 'date', ex: '2026-11-22', half: true },
      { k: 'extra', g: 'terms', l: tr('Qoʻshimcha haq, %', 'Доплата, %', 'Allowance, %'), t: 'number', ex: '30' },
      sign,
    ],
    render: c => order(c, 'Вазифасини бажарувчини тайинлаш тўғрисида', [
      `${c.x('abs', 20)}нинг ${c.x('why', 16)} муносабати билан ${c.date('from')}дан ${c.date('to')}гача унинг вазифалари ${c.x('w', 22)}га асосий ишидан ажралмаган ҳолда юклатилсин.`,
      `${c.x('w', 18)}га вазифаларни қўшиб бажаргани учун лавозим маошининг ${c.x('extra', 2)} фоизи миқдорида қўшимча ҳақ белгилансин.`,
      'Асос: ходимнинг розилиги.',
    ], `<p>Буйруқ билан танишдим ва розиман: ____________ «___» __________ 20__ й.</p>`),
  },
  {
    id: 'weekend-work-order', cat: 'hr', sub: 'orders', minutes: 3,
    docTitle: 'Дам олиш кунида ишга жалб қилиш тўғрисида буйруқ',
    title: tr('Dam olish kunida ishga jalb qilish buyrugʻi', 'Приказ о привлечении к работе в выходной', 'Weekend work order'),
    desc: tr('Ishlab chiqarish zarurati bilan dam olish yoki bayram kunida ishga jalb qilish, kompensatsiya.', 'Привлечение к работе в выходной/праздник и компенсация.', 'Calling staff to work on a day off and compensation.'),
    fields: [
      ...orderHead,
      { k: 'day', g: 'terms', l: tr('Ish kuni', 'Дата работы', 'Work date'), t: 'date', ex: '2026-10-11', half: true },
      { k: 'comp', g: 'terms', l: tr('Kompensatsiya', 'Компенсация', 'Compensation'), t: 'select', opts: ['икки баравар миқдорда ҳақ тўлаш', 'бошқа дам олиш куни бериш'], ex: 'икки баравар миқдорда ҳақ тўлаш', half: true },
      { k: 'why', g: 'terms', l: tr('Sabab', 'Причина', 'Reason'), ex: 'йиллик инвентаризацияни ўтказиш' },
      { k: 'list', g: 'employee', l: tr('Xodimlar', 'Работники', 'Employees'), t: 'rows', cols: [{ k: 'fio', l: L.fio }, { k: 'pos', l: L.position }],
        ex: [{ fio: 'Тошпўлатов Бекзод Анварович', pos: 'омборчи' }, { fio: 'Сафарова Малика Илҳомовна', pos: 'бухгалтер' }] },
      sign,
    ],
    render: c => {
      const list = c.rows('list').filter(r => (r['fio'] ?? '').trim());
      return order(c, 'Дам олиш кунида ишга жалб қилиш тўғрисида', [
        `${c.x('why', 22)} мақсадида ${c.date('day')} (дам олиш куни) қуйидаги ходимлар уларнинг ёзма розилиги билан ишга жалб қилинсин: ${list.length ? list.map(r => `${c.span(esc(r['pos'] ?? ''))} ${c.span(esc(r['fio']))}`).join('; ') : c.blank(30)}.`,
        `Ходимларга дам олиш кунидаги иш учун ${c.x('comp', 20)}.`,
        'Бухгалтерияга иш вақтини ҳисобга олиш табелида тегишли белгилар қўйиш топширилсин.',
      ], `<p>Буйруқ билан танишдик ва розимиз:</p>${ol(list.length ? list.map(r => `${c.span(esc(r['fio']))} ____________`) : [c.blank(30)])}`);
    },
  },
  {
    id: 'contract-amendment', cat: 'hr', sub: 'contracts', minutes: 3,
    docTitle: 'Меҳнат шартномасига қўшимча келишув',
    title: tr('Mehnat shartnomasiga qoʻshimcha kelishuv', 'Доп. соглашение к трудовому договору', 'Employment contract amendment'),
    desc: tr('Maosh, lavozim yoki ish rejimini oʻzgartirish: oʻzgarish sanasi va yangi shartlar.', 'Изменение оклада, должности или режима: дата и новые условия.', 'Change of salary, position or schedule: date and new terms.'),
    fields: [
      ...hrParties,
      { k: 'what', g: 'changes', l: tr('Nima oʻzgaradi', 'Что меняется', 'What changes'), t: 'select', opts: ['лавозим маоши', 'лавозим', 'иш вақти режими'], ex: 'лавозим маоши', half: true },
      { k: 'from', g: 'changes', l: tr('Sanadan', 'С даты', 'From'), t: 'date', ex: '2026-11-01', half: true },
      { k: 'new', g: 'changes', l: tr('Yangi shart', 'Новое условие', 'New term'), ex: 'ойига 7 500 000 (етти миллион беш юз минг) сўм' },
    ],
    render: c => `
      <h2>${c.x('contract', 14)} меҳнат шартномасига қўшимча келишув</h2>
      ${meta(c.x('city', 12), c.date('date'))}
      ${p(`${c.x('company', 18)} (Иш берувчи) номидан раҳбар ${c.x('head', 20)} ва ${c.x('pos', 12)} ${c.x('w', 20)} (Ходим) қуйидагилар ҳақида келишдилар:`)}
      ${ol([
        `${c.date('from')}дан бошлаб меҳнат шартномасидаги ${c.x('what', 12)} қуйидагича белгилансин: ${c.x('new', 24)}.`,
        'Меҳнат шартномасининг бошқа шартлари ўзгаришсиз қолади.',
        'Келишув меҳнат шартномасининг ажралмас қисми ҳисобланади ва икки нусхада тузилди.',
      ])}
      ${hrSign(c)}`,
  },
  {
    id: 'mutual-termination', cat: 'hr', sub: 'contracts', minutes: 3,
    docTitle: 'Меҳнат шартномасини тарафларнинг келишувига кўра бекор қилиш тўғрисида келишув',
    title: tr('Mehnat shartnomasini kelishuv bilan bekor qilish', 'Соглашение о расторжении трудового договора', 'Mutual termination of employment'),
    desc: tr('Ish beruvchi va xodim kelishuvi: oxirgi ish kuni, kompensatsiya, daʼvolar yoʻqligi.', 'Соглашение сторон: последний день, компенсация, отсутствие претензий.', 'Agreement of the parties: last day, compensation, no claims.'),
    fields: [
      ...hrParties,
      { k: 'last', g: 'terms', l: tr('Oxirgi ish kuni', 'Последний день', 'Last day'), t: 'date', ex: '2026-10-31', half: true },
      { k: 'comp', g: 'terms', l: tr('Kompensatsiya (boʻlsa)', 'Компенсация (если есть)', 'Compensation (if any)'), t: 'money', ex: '6000000', half: true },
    ],
    render: c => `
      <h2>Меҳнат шартномасини бекор қилиш тўғрисида келишув</h2>
      ${meta(c.x('city', 12), c.date('date'))}
      ${p(`${c.x('company', 18)} (Иш берувчи) номидан раҳбар ${c.x('head', 20)} ва ${c.x('pos', 12)} ${c.x('w', 20)} (Ходим) Ўзбекистон Республикаси Меҳнат кодексига мувофиқ қуйидагилар ҳақида келишдилар:`)}
      ${ol([
        `Тарафлар ўртасида тузилган ${c.x('contract', 14)} меҳнат шартномаси тарафларнинг келишувига кўра ${c.date('last')}да бекор қилинади. Ушбу кун Ходимнинг охирги иш куни ҳисобланади.`,
        `Иш берувчи охирги иш кунида Ходимга ишлаган вақти учун иш ҳақини, фойдаланилмаган таътил учун компенсацияни${c.has('comp') ? ` ва қўшимча равишда ${c.money('comp')} миқдорида компенсацияни` : ''} тўлайди.`,
        'Иш берувчи меҳнат дафтарчасига (электрон меҳнат дафтарчасига) тегишли ёзувни киритади.',
        'Ушбу келишув шартлари бажарилгандан кейин тарафлар бир-бирига нисбатан эътирозларга эга эмас. Келишув икки нусхада тузилди.',
      ])}
      ${hrSign(c)}`,
  },
  {
    id: 'remote-work', cat: 'hr', sub: 'contracts', minutes: 4,
    docTitle: 'Масофадан туриб ишлаш тўғрисида келишув',
    title: tr('Masofaviy ish kelishuvi', 'Соглашение о дистанционной работе', 'Remote work agreement'),
    desc: tr('Xodimni masofaviy ishga oʻtkazish: davr, aloqa vositalari, hisobot, jihozlar.', 'Перевод на дистанционную работу: период, связь, отчётность, оборудование.', 'Moving an employee to remote work: period, communication, reporting, equipment.'),
    fields: [
      ...hrParties,
      { k: 'from', g: 'terms', l: tr('Sanadan', 'С', 'From'), t: 'date', ex: '2026-11-01', half: true },
      { k: 'kind', g: 'terms', l: tr('Rejim', 'Режим', 'Mode'), t: 'select', opts: ['тўлиқ масофавий', 'аралаш (ҳафтада 2 кун офисда)'], ex: 'аралаш (ҳафтада 2 кун офисда)', half: true },
      { k: 'tools', g: 'terms', l: tr('Aloqa vositalari', 'Средства связи', 'Channels'), ex: 'корпоратив электрон почта, Telegram, видеоалоқа' },
      { k: 'hours', g: 'terms', l: tr('Aloqada boʻlish vaqti', 'Время на связи', 'Availability'), ex: '09:00–18:00', half: true },
      { k: 'equip', g: 'terms', l: tr('Jihozlar', 'Оборудование', 'Equipment'), t: 'select', opts: ['Иш берувчи ноутбук беради', 'Ходимнинг ўз жиҳозлари (компенсация билан)'], ex: 'Иш берувчи ноутбук беради', half: true },
    ],
    render: c => `
      <h2>Масофадан туриб ишлаш тўғрисида келишув</h2>
      ${meta(c.x('city', 12), c.date('date'))}
      ${p(`${c.x('company', 18)} (Иш берувчи) номидан раҳбар ${c.x('head', 20)} ва ${c.x('pos', 12)} ${c.x('w', 20)} (Ходим) ${c.x('contract', 14)} меҳнат шартномасига қўшимча равишда қуйидагилар ҳақида келишдилар:`)}
      ${ol([
        `${c.date('from')}дан бошлаб Ходим ${c.x('kind', 18)} режимда ишлайди.`,
        `Ходим иш кунлари ${c.x('hours', 10)} вақтда ${c.x('tools', 22)} орқали алоқада бўлади, топшириқларни белгиланган муддатларда бажаради ва ҳафтада бир марта иш натижалари ҳақида ҳисобот беради.`,
        `${c.x('equip', 24)}. Ходим берилган жиҳозлар ва маълумотларнинг сақланиши, тижорат сирини ошкор қилмаслик учун жавоб беради.`,
        'Иш ҳақи, таътил ва бошқа кафолатлар меҳнат шартномасига мувофиқ сақланади.',
        'Тарафлардан бири икки ҳафта олдин огоҳлантириб, офисда ишлашга қайтишни таклиф қилиши мумкин. Келишув икки нусхада тузилди.',
      ])}
      ${hrSign(c)}`,
  },
];
