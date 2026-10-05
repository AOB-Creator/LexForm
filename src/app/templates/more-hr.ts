import { Ctx, meta, ol, p, sigTable } from '../core/doc/engine';
import { DocTemplate, FieldDef } from '../core/doc/types';
import { addressee, L, signLine, tr } from './shared';

const orderHead: FieldDef[] = [
  { k: 'company', g: 'doc', l: L.company, ex: 'Намуна Савдо' },
  { k: 'no', g: 'doc', l: L.number, ex: '21-К', half: true },
  { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
  { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент ш.' },
];
const worker: FieldDef[] = [
  { k: 'w', g: 'employee', l: L.fio, ex: 'Алиев Тимур Рустамович' },
  { k: 'pos', g: 'employee', l: L.position, ex: 'савдо менежери', half: true },
  { k: 'dept', g: 'employee', l: tr('Boʻlim', 'Отдел', 'Department'), ex: 'савдо бўлими', half: true },
];
const sign: FieldDef = { k: 'head', g: 'sign', l: L.head, ex: 'Каримов А.Б.' };
const order = (c: Ctx, subject: string, items: string[], ack = true) => `
  <p class="c">«${c.x('company')}» масъулияти чекланган жамияти</p>
  <h2>Буйруқ № ${c.x('no', 4)}</h2>
  ${meta(c.date('date'), c.x('city', 12))}
  <p class="c"><i>${subject}</i></p>
  <p class="sp">БУЮРАМАН:</p>
  ${ol(items)}
  ${sigTable('Директор', `____________ ${c.x('head', 16)}`)}
  ${ack ? `<p>Буйруқ билан танишдим: ____________ ${c.x('w', 16)} &nbsp; «___» __________ 20__ й.</p>` : ''}`;

export const MORE_HR: DocTemplate[] = [
  {
    id: 'leave-order', cat: 'hr', sub: 'orders', minutes: 3,
    docTitle: 'Таътил бериш тўғрисида буйруқ',
    title: tr('Taʼtil berish buyrugʻi', 'Приказ о предоставлении отпуска', 'Leave order'),
    desc: tr('Xodimga yillik yoki boshqa turdagi taʼtil berish: sana, kunlar, ish davri, taʼtil puli.', 'Предоставление ежегодного или иного отпуска: даты, дни, период, отпускные.', 'Granting annual or other leave: dates, days, period, holiday pay.'),
    fields: [
      ...orderHead, ...worker,
      { k: 'kind', g: 'leave', l: tr('Taʼtil turi', 'Вид отпуска', 'Leave type'), t: 'select', opts: ['йиллик асосий меҳнат таътили', 'иш ҳақи сақланмайдиган таътил', 'ўқув таътили', 'йиллик қўшимча таътил'], ex: 'йиллик асосий меҳнат таътили' },
      { k: 'from', g: 'leave', l: tr('Boshlanish', 'С', 'From'), t: 'date', ex: '2026-11-02', half: true },
      { k: 'days', g: 'leave', l: tr('Kalendar kunlar', 'Календарных дней', 'Calendar days'), t: 'number', ex: '21', half: true },
      { k: 'period', g: 'leave', l: tr('Ish davri', 'Рабочий период', 'Working period'), ex: '2025-2026 йиллар' },
      { k: 'basis', g: 'leave', l: tr('Asos', 'Основание', 'Basis'), ex: 'ходимнинг 05.10.2026 йилдаги аризаси, таътиллар жадвали' },
      sign,
    ],
    render: c => order(c, 'Таътил бериш тўғрисида', [
      `${c.x('dept', 12)} ${c.x('pos', 14)} ${c.x('w', 20)}га ${c.x('period', 10)} иш даври учун ${c.date('from')}дан бошлаб ${c.x('days', 3)} календарь кун муддатга ${c.x('kind', 20)} берилсин.`,
      c.raw('kind').includes('сақланмайдиган') ? 'Таътил даври учун иш ҳақи сақланмайди.' : 'Бухгалтерияга таътил пулини қонунчиликда белгиланган муддатда ҳисоблаб тўлаш топширилсин.',
      `Асос: ${c.x('basis', 24)}.`,
    ]),
  },
  {
    id: 'disciplinary-order', cat: 'hr', sub: 'orders', minutes: 4,
    docTitle: 'Интизомий жазо қўллаш тўғрисида буйруқ',
    title: tr('Intizomiy jazo buyrugʻi', 'Приказ о дисциплинарном взыскании', 'Disciplinary order'),
    desc: tr('Mehnat intizomini buzganlik uchun hayfsan yoki jarima: holat, tushuntirish xati, asos.', 'Выговор или штраф за нарушение дисциплины: обстоятельства, объяснительная, основание.', 'Reprimand or fine for a disciplinary breach: facts, explanation, basis.'),
    fields: [
      ...orderHead, ...worker,
      { k: 'what', g: 'claim', l: tr('Qoidabuzarlik', 'Нарушение', 'Breach'), t: 'textarea', ex: '2026 йил 28 сентябрь куни узрли сабабсиз иш жойида 3 соатдан ортиқ бўлмаган' },
      { k: 'expl', g: 'claim', l: tr('Tushuntirish xati', 'Объяснительная', 'Explanation'), t: 'select', opts: ['ходимдан ёзма тушунтириш олинди', 'ходим ёзма тушунтириш беришдан бош тортди (далолатнома тузилди)'], ex: 'ходимдан ёзма тушунтириш олинди' },
      { k: 'kind', g: 'claim', l: tr('Jazo turi', 'Вид взыскания', 'Sanction'), t: 'select', opts: ['ҳайфсан', 'жарима'], ex: 'ҳайфсан', half: true },
      { k: 'fine', g: 'claim', l: tr('Jarima summasi (jarima boʻlsa)', 'Сумма штрафа (если штраф)', 'Fine amount (if fine)'), t: 'money', half: true },
      sign,
    ],
    render: c => order(c, 'Интизомий жазо қўллаш тўғрисида', [
      `${c.x('dept', 12)} ${c.x('pos', 14)} ${c.x('w', 20)} ${c.x('what', 30)}. Бу ички меҳнат тартиби қоидаларининг бузилиши ҳисобланади. Ушбу ҳолат юзасидан ${c.x('expl', 20)}.`,
      `Ўзбекистон Республикаси Меҳнат кодексига мувофиқ ${c.x('w', 20)}га ${c.raw('kind') === 'жарима' ? `${c.money('fine')} миқдорида жарима` : c.x('kind', 8)} тарзидаги интизомий жазо қўллансин.`,
      'Кадрлар бўлимига ходимни ушбу буйруқ билан имзо қўйдириб таништириш топширилсин.',
      `Асос: ${c.x('w', 16)}нинг тушунтириш хати (ёки далолатнома), бўлим бошлиғининг билдиргиси.`,
    ]),
  },
  {
    id: 'trip-order', cat: 'hr', sub: 'orders', minutes: 3,
    docTitle: 'Хизмат сафарига юбориш тўғрисида буйруқ',
    title: tr('Xizmat safari buyrugʻi', 'Приказ о командировке', 'Business trip order'),
    desc: tr('Xodimni xizmat safariga yuborish: joy, muddat, maqsad, xarajatlar.', 'Направление работника в командировку: место, срок, цель, расходы.', 'Sending an employee on a business trip: destination, dates, purpose, expenses.'),
    fields: [
      ...orderHead, ...worker,
      { k: 'where', g: 'terms', l: tr('Qayerga', 'Куда', 'Destination'), ex: 'Самарқанд шаҳри, «Мисол Хизмат» МЧЖ филиали' },
      { k: 'from', g: 'terms', l: tr('Boshlanish', 'С', 'From'), t: 'date', ex: '2026-10-12', half: true },
      { k: 'to', g: 'terms', l: tr('Tugash', 'По', 'To'), t: 'date', ex: '2026-10-15', half: true },
      { k: 'goal', g: 'terms', l: tr('Maqsad', 'Цель', 'Purpose'), ex: 'ҳамкор билан шартнома шартларини келишиш ва маҳсулот намуналарини топшириш' },
      { k: 'transport', g: 'terms', l: tr('Transport', 'Транспорт', 'Transport'), t: 'select', opts: ['темир йўл транспорти', 'авиатранспорт', 'хизмат автомобили', 'шахсий автомобиль'], ex: 'темир йўл транспорти', half: true },
      { k: 'acc', g: 'sign', l: tr('Bosh hisobchi', 'Главный бухгалтер', 'Chief accountant'), ex: 'Раҳимова Д.Ш.', half: true },
      sign,
    ],
    render: c => order(c, 'Хизмат сафарига юбориш тўғрисида', [
      `${c.x('dept', 12)} ${c.x('pos', 14)} ${c.x('w', 20)} ${c.date('from')}дан ${c.date('to')}гача ${c.x('where', 22)}га ${c.x('goal', 24)} мақсадида хизмат сафарига юборилсин.`,
      `Сафарга ${c.x('transport', 14)}да борилсин.`,
      `Бухгалтерияга (${c.x('acc', 12)}) кунлик, йўл ва яшаш харажатларини қонунчиликда ва жамиятнинг ички ҳужжатларида белгиланган тартибда тўлаш топширилсин.`,
      `${c.x('w', 16)}га хизмат сафаридан қайтгандан кейин уч иш куни ичида бўнак ҳисоботи ва сафар натижалари бўйича ҳисобот тақдим этиш юклатилсин.`,
    ]),
  },
  {
    id: 'explanatory-note', cat: 'hr', sub: 'applications', minutes: 2,
    docTitle: 'Тушунтириш хати',
    title: tr('Tushuntirish xati', 'Объяснительная записка', 'Explanatory note'),
    desc: tr('Xodimning ish beruvchiga voqea yuzasidan yozma tushuntirishi.', 'Письменное объяснение работника по поводу события.', 'Employee’s written explanation of an incident.'),
    fields: [
      { k: 'co', g: 'employer', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
      { k: 'head_to', g: 'employer', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Director'), ex: 'А.Б. Каримов' },
      ...worker,
      { k: 'when', g: 'claim', l: tr('Voqea sanasi', 'Дата события', 'Date of the incident'), t: 'date', ex: '2026-09-28', half: true },
      { k: 'about', g: 'claim', l: tr('Nima haqida', 'По поводу', 'About'), ex: 'ишга кечикиб келганим', half: true },
      { k: 'text', g: 'claim', l: tr('Tushuntirish', 'Объяснение', 'Explanation'), t: 'textarea', ex: 'Ушбу куни эрталаб фарзандим тўсатдан бетоб бўлиб қолгани сабабли уни поликлиникага олиб боришга мажбур бўлдим. Бу ҳақда бўлим бошлиғини телефон орқали огоҳлантирганман. Тасдиқловчи маълумотнома илова қилинади.' },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-09-29' },
    ],
    render: c => `
      ${addressee(`<b>${c.x('co', 20)} директори</b>`, `${c.x('head_to', 14)}га`, `${c.x('dept', 12)} ${c.x('pos', 14)}`, `${c.x('w', 22)}дан`)}
      <h2>Тушунтириш хати</h2>
      ${p(`${c.date('when')}да ${c.x('about', 20)} юзасидан қуйидагиларни маълум қиламан:`)}
      ${p(c.x('text', 40))}
      ${signLine(c, 'date', 'w')}`,
  },
  {
    id: 'employment-certificate', cat: 'hr', sub: 'references', minutes: 2,
    docTitle: 'Иш жойидан маълумотнома',
    title: tr('Ish joyidan maʼlumotnoma', 'Справка с места работы', 'Employment certificate'),
    desc: tr('Xodim haqida maʼlumotnoma: lavozim, ishga kirgan sana, oʻrtacha oylik (ixtiyoriy), qayerga berish.', 'Справка о работнике: должность, дата приёма, средняя зарплата (опционально), куда.', 'Employee certificate: position, start date, average salary (optional), recipient.'),
    fields: [
      { k: 'company', g: 'doc', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
      { k: 'stir', g: 'doc', l: tr('STIR', 'ИНН', 'TIN'), ex: '301234567', half: true },
      { k: 'no', g: 'doc', l: L.number, ex: '118', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05' },
      ...worker,
      { k: 'since', g: 'employee', l: tr('Ishga kirgan sana', 'Дата приёма', 'Employed since'), t: 'date', ex: '2024-03-01', half: true },
      { k: 'salary', g: 'employee', l: tr('Oʻrtacha oylik (ixtiyoriy)', 'Средняя зарплата (опц.)', 'Average monthly pay (optional)'), t: 'money', ex: '6000000', half: true },
      { k: 'months', g: 'employee', l: tr('Oxirgi necha oy uchun', 'За последние месяцев', 'Over last N months'), t: 'number', ex: '6', half: true },
      { k: 'to', g: 'employee', l: tr('Qayerga berish uchun', 'Для предоставления в', 'For'), ex: 'талаб қилинган жойга', half: true },
      sign,
      { k: 'acc', g: 'sign', l: tr('Bosh hisobchi', 'Главный бухгалтер', 'Chief accountant'), ex: 'Раҳимова Д.Ш.' },
    ],
    render: c => `
      <p class="c"><b>${c.x('company', 22)}</b><br>СТИР ${c.x('stir', 9)}</p>
      <p>${c.dshort('date')} № ${c.x('no', 4)}</p>
      <h2>Маълумотнома</h2>
      ${p(`Ушбу маълумотнома ${c.x('w', 22)}га ҳақиқатан ҳам ${c.x('company', 18)}да ${c.dshort('since')} йилдан бошлаб ҳозирги кунгача ${c.x('dept', 12)} ${c.x('pos', 14)} лавозимида ишлаётганлиги тўғрисида берилди.`)}
      ${c.has('salary') ? p(`Охирги ${c.x('months', 2)} ойдаги ўртача ойлик иш ҳақи ${c.money('salary')}ни ташкил этади.`) : ''}
      ${p(`Маълумотнома ${c.x('to', 16)} тақдим этиш учун берилди.`)}
      ${sigTable('Директор', `____________ ${c.x('head', 16)}`)}
      ${c.has('salary') ? sigTable('Бош ҳисобчи', `____________ ${c.x('acc', 16)}`) : ''}
      <p>М.Ў.</p>`,
  },
  {
    id: 'character-reference', cat: 'hr', sub: 'references', minutes: 4,
    docTitle: 'Тавсифнома',
    title: tr('Tavsifnoma', 'Характеристика', 'Character reference'),
    desc: tr('Xodimning ish faoliyati, malakasi va shaxsiy fazilatlari haqida tavsifnoma.', 'Характеристика работника: деятельность, квалификация, личные качества.', 'Reference on an employee’s work, skills and personal qualities.'),
    fields: [
      { k: 'company', g: 'doc', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05' },
      ...worker,
      { k: 'born', g: 'employee', l: tr('Tugʻilgan yili', 'Год рождения', 'Year of birth'), ex: '1994', half: true },
      { k: 'since', g: 'employee', l: tr('Ishga kirgan sana', 'Дата приёма', 'Employed since'), t: 'date', ex: '2024-03-01', half: true },
      { k: 'edu', g: 'employee', l: tr('Maʼlumoti', 'Образование', 'Education'), ex: 'олий, Тошкент давлат иқтисодиёт университети' },
      { k: 'work', g: 'claim', l: tr('Faoliyati va natijalari', 'Деятельность и результаты', 'Work and results'), t: 'textarea', ex: 'Ўз вазифаларини масъулият билан бажаради, савдо режаларини мунтазам бажариб келмоқда. Янги мижозлар базасини шакллантиришда ташаббус кўрсатди.' },
      { k: 'qual', g: 'claim', l: tr('Shaxsiy fazilatlari', 'Личные качества', 'Personal qualities'), t: 'textarea', ex: 'Жамоада ҳурматга сазовор, хушмуомала, интизомли. Интизомий жазолари йўқ.' },
      { k: 'to', g: 'claim', l: tr('Qayerga', 'Куда', 'For'), ex: 'талаб қилинган жойга' },
      sign,
    ],
    render: c => `
      <h2>Тавсифнома</h2>
      ${p(`${c.x('w', 22)}, ${c.x('born', 4)} йилда туғилган, маълумоти ${c.x('edu', 20)}, ${c.dshort('since')} йилдан бошлаб ${c.x('company', 18)}да ${c.x('dept', 12)} ${c.x('pos', 14)} лавозимида ишлайди.`)}
      ${p(c.x('work', 40))}
      ${p(c.x('qual', 40))}
      ${p(`Тавсифнома ${c.x('to', 16)} тақдим этиш учун берилди.`)}
      ${sigTable('Директор', `____________ ${c.x('head', 16)}`)}
      ${meta(c.date('date'), 'М.Ў.')}`,
  },
];
