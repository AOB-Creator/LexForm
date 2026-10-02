import { esc, fmtMoney, parseNum } from '../core/doc/format';
import { meta, ol, partyIntro, reqCell, sigTable } from '../core/doc/engine';
import { DocTemplate } from '../core/doc/types';
import { EX_A, L, partyFields, tr } from './shared';

const ackLine = (who: string) => `<p class="ack">Буйруқ билан танишдим: ____________ ${who} &nbsp; «___» __________ 20__ й.</p>`;

export const HR: DocTemplate[] = [
  {
    id: 'employment-contract', cat: 'hr', minutes: 8,
    docTitle: 'Меҳнат шартномаси',
    title: tr('Mehnat shartnomasi', 'Трудовой договор', 'Employment contract'),
    desc: tr('Ish beruvchi va xodim oʻrtasida: lavozim, muddat, sinov, maosh, taʼtil, rekvizitlar.', 'Между работодателем и работником: должность, срок, испытание, оклад, отпуск, реквизиты.', 'Between employer and employee: position, term, probation, salary, leave, details.'),
    fields: [
      { k: 'no', g: 'doc', l: L.number, ex: '12', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-01', half: true },
      { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент шаҳри' },
      ...partyFields('e', 'employer', EX_A),
      { k: 'w', g: 'employee', l: L.fio, ex: 'Алиев Тимур Рустамович' },
      { k: 'w_pass', g: 'employee', l: L.passport, ex: 'AB 1234567', half: true },
      { k: 'w_pass_by', g: 'employee', l: tr('Kim bergan, sana', 'Кем и когда выдан', 'Issued by, date'), ex: 'Чилонзор тумани ИИБ, 12.08.2018', half: true },
      { k: 'w_addr', g: 'employee', l: L.addr, ex: 'Тошкент ш., Чилонзор тумани, 5-мавзе, 3-уй, 7-хонадон' },
      { k: 'w_phone', g: 'employee', l: L.phone, ex: '+998 90 000-00-00', half: true },
      { k: 'w_pinfl', g: 'employee', l: tr('JShShIR', 'ПИНФЛ', 'Personal ID (PINFL)'), half: true },
      { k: 'pos', g: 'terms', l: L.position, ex: 'савдо менежери' },
      { k: 'kind', g: 'terms', l: tr('Shartnoma turi', 'Вид договора', 'Contract type'), t: 'select', opts: ['асосий иш бўйича', 'ўриндошлик бўйича'], ex: 'асосий иш бўйича', half: true },
      { k: 'term', g: 'terms', l: tr('Muddat', 'Срок', 'Term'), t: 'select', opts: ['номуайян муддатга', 'муайян муддатга', 'муайян ишни бажариш вақтига'], ex: 'номуайян муддатга', half: true },
      { k: 'start', g: 'terms', l: tr('Ish boshlanishi', 'Начало работы', 'Start date'), t: 'date', ex: '2026-10-02', half: true },
      { k: 'end', g: 'terms', l: tr('Tugashi (muddatli boʻlsa)', 'Окончание (для срочного)', 'End date (fixed-term)'), t: 'date', half: true },
      { k: 'prob', g: 'terms', l: tr('Sinov muddati', 'Испытательный срок', 'Probation'), ex: '3 ой', half: true },
      { k: 'week', g: 'terms', l: tr('Ish haftasi', 'Рабочая неделя', 'Working week'), t: 'select', opts: ['5 кунлик', '6 кунлик'], ex: '5 кунлик', half: true },
      { k: 'hours', g: 'terms', l: tr('Ish vaqti', 'Рабочее время', 'Working hours'), ex: '09:00–18:00, тушлик 13:00–14:00' },
      { k: 'salary', g: 'terms', l: tr('Oylik maosh', 'Оклад в месяц', 'Monthly salary'), t: 'money', ex: '6000000' },
      { k: 'leave', g: 'terms', l: tr('Yillik taʼtil (kalendar kun)', 'Ежегодный отпуск (календ. дней)', 'Annual leave (calendar days)'), t: 'number', ex: '21', half: true },
      { k: 'leave_add', g: 'terms', l: tr('Qoʻshimcha taʼtil (kun)', 'Доп. отпуск (дней)', 'Additional leave (days)'), t: 'number', half: true },
    ],
    render: c => `
      <h2>Меҳнат шартномаси № ${c.x('no', 3)}</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      <p>1. ${partyIntro(c, 'e', 'Иш берувчи')} бир томондан, ва Ўзбекистон Республикаси фуқароси ${c.x('w', 24)} (кейинги ўринларда «Ходим» деб юритилади) иккинчи томондан, мазкур шартномани қуйидагилар ҳақида туздилар:</p>
      <p>2. Ходим ${c.x('pos', 18)} лавозимига ишга қабул қилинади.</p>
      <p>3. Шартнома ${c.x('kind', 12)} ҳисобланади. Шартнома муддати — ${c.x('term', 12)}.</p>
      <p>4. Ишни бошлаш санаси: ${c.date('start')}${c.has('end') ? '. Тугаш санаси: ' + c.date('end') : ''}.</p>
      <p>5. Синов муддати: ${c.x('prob', 8)}.</p>
      <p>6. Ходимнинг мажбуриятлари: меҳнат интизомига ва ички меҳнат тартиби қоидаларига риоя қилиш; иш берувчининг қонуний буйруқ ва фармойишларини бажариш; меҳнатни муҳофаза қилиш ва ёнғин хавфсизлиги талабларига риоя қилиш; лавозим йўриқномасига амал қилиш; ишониб топширилган мулкни асраш; тижорат сирини сақлаш.</p>
      <p>7. Иш берувчининг мажбуриятлари: ходимнинг меҳнатини ташкил этиш ва уни ички ҳужжатлар билан таништириш; хавфсиз меҳнат шароитларини яратиш; иш ҳақини ўз вақтида тўлаш; меҳнат қонунчилиги ва жамоа шартномасига риоя қилиш.</p>
      <p>8. Иш вақти тартиби: ${c.x('week', 8)} иш ҳафтаси, ${c.x('hours', 18)}.</p>
      <p>9. Меҳнатга ҳақ тўлаш: лавозим маоши ойига ${c.money('salary')}; қонунчиликда ва жамоа шартномасида назарда тутилган қўшимча тўловлар ва мукофотлар.</p>
      <p>10. Ходимга ${c.x('leave', 3)} календарь кундан иборат ҳақ тўланадиган йиллик асосий таътил${c.has('leave_add') ? ' ва ' + c.x('leave_add', 2) + ' кунлик қўшимча таътил' : ''} берилади.</p>
      <p>11. Шартнома Ўзбекистон Республикасининг Меҳнат кодексида назарда тутилган асосларда ўзгартирилиши ва бекор қилиниши мумкин. Шартномада назарда тутилмаган масалалар меҳнат тўғрисидаги қонунчилик билан тартибга солинади.</p>
      <p>12. Шартнома бир хил юридик кучга эга икки нусхада тузилди.</p>
      <h3>Тарафларнинг реквизитлари ва имзолари</h3>
      ${sigTable(reqCell(c, 'e', 'Иш берувчи'), `<b>«Ходим»</b><br>${c.x('w', 20)}<br>Паспорт: ${c.x('w_pass', 10)}<br>Берилган: ${c.x('w_pass_by', 16)}<br>Манзил: ${c.x('w_addr', 22)}<br>Тел.: ${c.x('w_phone', 12)}<br>ЖШШИР: ${c.x('w_pinfl', 14)}<br><br>____________ (имзо)<br><br>Ички меҳнат тартиби қоидалари ва лавозим йўриқномаси билан танишдим: ____________`)}`,
  },
  {
    id: 'hiring-order', cat: 'hr', minutes: 3,
    docTitle: 'Ишга қабул қилиш тўғрисида буйруқ',
    title: tr('Ishga qabul qilish buyrugʻi', 'Приказ о приёме на работу', 'Hiring order'),
    desc: tr('Mehnat shartnomasi asosida xodimni lavozimga qabul qilish.', 'Приём работника на должность на основании трудового договора.', 'Appointing an employee on the basis of the employment contract.'),
    fields: [
      { k: 'company', g: 'doc', l: L.company, ex: 'Намуна Савдо' },
      { k: 'no', g: 'doc', l: L.number, ex: '15-К', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-01', half: true },
      { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент ш.' },
      { k: 'w', g: 'employee', l: L.fio, ex: 'Алиев Тимур Рустамович' },
      { k: 'pos', g: 'employee', l: L.position, ex: 'савдо менежери', half: true },
      { k: 'dept', g: 'employee', l: tr('Boʻlim', 'Отдел', 'Department'), ex: 'савдо бўлими', half: true },
      { k: 'start', g: 'employee', l: tr('Qabul sanasi', 'Дата приёма', 'Start date'), t: 'date', ex: '2026-10-02', half: true },
      { k: 'prob', g: 'employee', l: tr('Sinov muddati', 'Испытательный срок', 'Probation'), ex: '3 ой', half: true },
      { k: 'salary', g: 'employee', l: tr('Oylik maosh', 'Оклад', 'Salary'), t: 'money', ex: '6000000' },
      { k: 'tab', g: 'employee', l: tr('Tabel raqami', 'Табельный номер', 'Personnel No.'), ex: '0042', half: true },
      { k: 'contract', g: 'employee', l: tr('Mehnat shartnomasi', 'Трудовой договор', 'Employment contract'), ex: '01.10.2026 йилдаги 12-сон', half: true },
      { k: 'head', g: 'sign', l: L.head, ex: 'Каримов А.Б.' },
    ],
    render: c => `
      <p class="c">«${c.x('company')}» масъулияти чекланган жамияти</p>
      <h2>Буйруқ № ${c.x('no', 4)}</h2>
      ${meta(c.date('date'), c.x('city', 12))}
      <p class="c"><i>Ишга қабул қилиш тўғрисида</i></p>
      <p class="sp">БУЮРАМАН:</p>
      <p>${c.x('w', 22)} ${c.date('start')}дан ${c.x('dept', 14)}га ${c.x('pos', 16)} лавозимига ${c.x('prob', 6)} синов муддати билан, лавозим маоши ойига ${c.money('salary')} миқдорида белгиланган ҳолда ишга қабул қилинсин. Табель рақами ${c.x('tab', 5)}.</p>
      <p><b>Асос:</b> ${c.x('contract', 18)} меҳнат шартномаси, ходимнинг аризаси.</p>
      ${sigTable('Директор', `____________ ${c.x('head', 16)}`)}
      ${ackLine(c.x('w', 16))}`,
  },
  {
    id: 'dismissal-order', cat: 'hr', minutes: 3,
    docTitle: 'Меҳнат шартномасини бекор қилиш тўғрисида буйруқ',
    title: tr('Ishdan boʻshatish buyrugʻi', 'Приказ об увольнении', 'Dismissal order'),
    desc: tr('Mehnat shartnomasini bekor qilish, foydalanilmagan taʼtil uchun kompensatsiya.', 'Прекращение трудового договора, компенсация за неиспользованный отпуск.', 'Termination of employment with unused-leave compensation.'),
    fields: [
      { k: 'company', g: 'doc', l: L.company, ex: 'Намуна Савдо' },
      { k: 'no', g: 'doc', l: L.number, ex: '21-К', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-11-30', half: true },
      { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент ш.' },
      { k: 'w', g: 'employee', l: L.fio, ex: 'Алиев Тимур Рустамович' },
      { k: 'pos', g: 'employee', l: L.position, ex: 'савдо менежери', half: true },
      { k: 'end', g: 'employee', l: tr('Boʻshatish sanasi', 'Дата увольнения', 'Last working day'), t: 'date', ex: '2026-11-30', half: true },
      { k: 'reason', g: 'employee', l: tr('Asos', 'Основание', 'Ground'), t: 'select',
        opts: ['ходимнинг ташаббусига кўра (ўз хоҳишига кўра)', 'тарафларнинг келишувига кўра', 'муддатли меҳнат шартномасининг муддати тугаши муносабати билан'],
        ex: 'ходимнинг ташаббусига кўра (ўз хоҳишига кўра)' },
      { k: 'days', g: 'employee', l: tr('Foydalanilmagan taʼtil kunlari', 'Дней неиспользованного отпуска', 'Unused leave days'), t: 'number', ex: '8', half: true },
      { k: 'period', g: 'employee', l: tr('Ish yili davri', 'Рабочий период', 'Working-year period'), ex: '02.10.2026–30.11.2026', half: true },
      { k: 'basis', g: 'employee', l: tr('Asos hujjat', 'Документ-основание', 'Supporting document'), ex: 'ходимнинг 16.11.2026 йилдаги аризаси' },
      { k: 'head', g: 'sign', l: L.head, ex: 'Каримов А.Б.' },
    ],
    render: c => `
      <p class="c">«${c.x('company')}» масъулияти чекланган жамияти</p>
      <h2>Буйруқ № ${c.x('no', 4)}</h2>
      ${meta(c.date('date'), c.x('city', 12))}
      <p class="c"><i>Меҳнат шартномасини бекор қилиш тўғрисида</i></p>
      <p class="sp">БУЮРАМАН:</p>
      ${ol([
        `${c.x('pos', 14)} ${c.x('w', 22)} билан тузилган меҳнат шартномаси ${c.x('reason', 24)} ${c.date('end')}дан бекор қилинсин.`,
        `Бухгалтерия ходим билан тўлиқ ҳисоб-китоб қилсин ва ${c.x('period', 16)} иш йили учун фойдаланилмаган ${c.x('days', 2)} кунлик таътил учун пуллик компенсация тўласин.`,
        'Кадрлар бўйича масъул ходим меҳнат фаолияти тўғрисидаги маълумотларни белгиланган тартибда расмийлаштирсин.',
      ])}
      <p><b>Асос:</b> ${c.x('basis', 24)}.</p>
      ${sigTable('Раҳбар', `____________ ${c.x('head', 16)}`)}
      ${ackLine(c.x('w', 16))}`,
  },
  {
    id: 'staffing', cat: 'hr', minutes: 5,
    docTitle: 'Штат жадвалини тасдиқлаш тўғрисида буйруқ ва штат жадвали',
    title: tr('Shtat jadvali va buyruq', 'Штатное расписание и приказ', 'Staffing table and order'),
    desc: tr('Buyruq va ilova: lavozimlar, birliklar, maoshlar; oylik fond avtomatik hisoblanadi.', 'Приказ и приложение: должности, единицы, оклады; месячный фонд — автоматически.', 'Order plus annex: positions, headcount, salaries; monthly payroll is calculated.'),
    fields: [
      { k: 'company', g: 'doc', l: L.company, ex: 'Намуна Савдо' },
      { k: 'no', g: 'doc', l: L.number, ex: '3', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-01-02', half: true },
      { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент ш.', half: true },
      { k: 'year', g: 'doc', l: tr('Yil', 'Год', 'Year'), ex: '2026', half: true },
      { k: 'head', g: 'sign', l: L.head, ex: 'Каримов А.Б.', half: true },
      { k: 'acc', g: 'sign', l: tr('Bosh hisobchi', 'Главный бухгалтер', 'Chief accountant'), ex: 'Раҳимова Д.Ш.', half: true },
      { k: 'rows', g: 'staffing', l: tr('Lavozimlar', 'Должности', 'Positions'), t: 'rows',
        cols: [{ k: 'pos', l: L.position }, { k: 'units', l: tr('Birlik', 'Единиц', 'Headcount'), num: true }, { k: 'salary', l: tr('Maosh', 'Оклад', 'Salary'), num: true }],
        ex: [{ pos: 'Директор', units: '1', salary: '9000000' }, { pos: 'Бош ҳисобчи', units: '1', salary: '7000000' }, { pos: 'Савдо менежери', units: '2', salary: '6000000' }, { pos: 'Омборчи', units: '1', salary: '4500000' }] },
    ],
    render: c => {
      let body = '';
      let units = 0;
      let fund = 0;
      c.rows('rows').forEach((r, i) => {
        const u = parseNum(r['units']), s = parseNum(r['salary']);
        const t = isFinite(u) && isFinite(s) ? u * s : NaN;
        if (isFinite(u)) units += u;
        if (isFinite(t)) fund += t;
        body += `<tr><td class="n">${i + 1}</td><td>${c.span(esc(r['pos'] ?? ''))}</td><td class="n">${isFinite(u) ? u : ''}</td><td class="n">${isFinite(s) ? fmtMoney(s) : ''}</td><td class="n">${isFinite(t) ? fmtMoney(t) : ''}</td></tr>`;
      });
      return `
      <p class="c">«${c.x('company')}» масъулияти чекланган жамияти</p>
      <h2>Буйруқ № ${c.x('no', 3)}</h2>
      ${meta(c.date('date'), c.x('city', 12))}
      <p class="c"><i>Штат жадвалини тасдиқлаш тўғрисида</i></p>
      <p class="sp">БУЮРАМАН:</p>
      ${ol([
        `«${c.x('company')}» МЧЖнинг ${c.x('year', 4)} йил учун штат жадвали ${units || c.blank(3)} та штат бирлиги, ойлик меҳнатга ҳақ тўлаш жамғармаси ${c.moneyN(fund)} миқдорида илова асосида тасдиқлансин.`,
        'Жамиятнинг молиявий ҳолатига қараб штат бирликлари ва лавозим маошлари ўзгартирилиши мумкин.',
        'Ушбу буйруқ ижросини назорат қилишни ўз зиммамда қолдираман.',
      ])}
      ${sigTable('Раҳбар', `____________ ${c.x('head', 16)}`)}
      <div class="pb"></div>
      <p class="r">${c.dshort('date')} йилдаги ${c.x('no', 3)}-сон буйруққа илова</p>
      <h2>Штат жадвали</h2>
      <p class="c">«${c.x('company')}» МЧЖ — ${c.x('year', 4)} йилдан амалга киритилади</p>
      <table class="t"><thead><tr><th>№</th><th>Лавозим</th><th>Штат бирлиги</th><th>Лавозим маоши, сўм</th><th>Ойлик фонд, сўм</th></tr></thead>
      <tbody>${body}<tr><td></td><td><b>Жами</b></td><td class="n"><b>${units || ''}</b></td><td></td><td class="n"><b>${fund ? fmtMoney(fund) : ''}</b></td></tr></tbody></table>
      ${sigTable('Директор<br><br>Бош ҳисобчи', `____________ ${c.x('head', 14)}<br><br>____________ ${c.x('acc', 14)}`)}`;
    },
  },
];
