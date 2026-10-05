import { esc, fmtMoney, parseNum } from '../core/doc/format';
import { p } from '../core/doc/engine';
import { DocTemplate } from '../core/doc/types';
import { addressee, attachments, L, signLine, tr } from './shared';

const extraAtt = { k: 'att', g: 'request', l: tr('Ilovalar (har biri yangi qatordan)', 'Приложения (каждое с новой строки)', 'Attachments (one per line)'), t: 'textarea' as const };

export const APPLICATIONS: DocTemplate[] = [
  {
    id: 'citizen-appeal', cat: 'applications', sub: 'individuals', minutes: 4,
    docTitle: 'Ариза (жисмоний шахснинг мурожаати)',
    title: tr('Fuqaroning murojaati (ariza)', 'Обращение гражданина (заявление)', 'Citizen’s application'),
    desc: tr('Davlat organi yoki tashkilotga yozma murojaat: mavzu, holatlar, soʻrov va ilovalar.', 'Письменное обращение в госорган или организацию: тема, обстоятельства, просьба, приложения.', 'Written request to an authority or organisation: subject, facts, request, attachments.'),
    fields: [
      { k: 'org', g: 'addressee', l: tr('Tashkilot nomi', 'Наименование органа', 'Authority / organisation'), ex: 'Юнусобод тумани ҳокимлиги' },
      { k: 'head', g: 'addressee', l: tr('Rahbar lavozimi va F.I.Sh.', 'Должность и Ф.И.О. руководителя', 'Head (position, name)'), ex: 'Туман ҳокими Б.Б. Бахтиёров' },
      { k: 'ap', g: 'applicant', l: L.fio, ex: 'Каримова Нигора Ботировна' },
      { k: 'ap_addr', g: 'applicant', l: L.addr, ex: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадон' },
      { k: 'ap_phone', g: 'applicant', l: L.phone, ex: '+998 90 111-22-33', half: true },
      { k: 'ap_mail', g: 'applicant', l: tr('Elektron pochta', 'Эл. почта', 'Email'), half: true },
      { k: 'subject', g: 'request', l: tr('Mavzu', 'Тема', 'Subject'), ex: 'ҳовлидаги болалар майдончасини таъмирлаш тўғрисида' },
      { k: 'body', g: 'request', l: tr('Holatlar', 'Обстоятельства', 'Facts'), t: 'textarea', ex: 'Боғишамол кўчаси, 12-уй ҳовлисидаги болалар майдончасининг жиҳозлари эскирган ва болалар учун хавфли ҳолатга келган. Уй-жой мулкдорлари ширкатига қилинган мурожаат натижасиз қолди.' },
      { k: 'ask', g: 'request', l: tr('Soʻrov', 'Просьба', 'Request'), t: 'textarea', ex: 'Болалар майдончасини кўздан кечириш ва уни таъмирлаш бўйича чора кўришингизни сўрайман.' },
      extraAtt,
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${addressee(`<b>${c.x('org', 24)}га</b>`, c.x('head', 22), `${c.x('ap', 22)}дан`, `Манзил: ${c.x('ap_addr', 24)}`, c.has('ap_phone') ? `Тел.: ${c.x('ap_phone')}` : '', c.has('ap_mail') ? `Эл. почта: ${c.x('ap_mail')}` : '')}
      <h2>Ариза</h2>
      <p class="c"><i>${c.x('subject', 30)}</i></p>
      ${p(c.x('body', 40))}
      ${p(c.x('ask', 40))}
      ${p('Мурожаатим «Жисмоний ва юридик шахсларнинг мурожаатлари тўғрисида»ги Ўзбекистон Республикаси Қонунида белгиланган тартиб ва муддатларда кўриб чиқилишини ҳамда натижаси ҳақида ёзма жавоб беришингизни сўрайман.')}
      ${attachments(c, [], 'att')}
      ${signLine(c, 'date', 'ap')}`,
  },
  {
    id: 'company-application', cat: 'applications', sub: 'legal', minutes: 4,
    docTitle: 'Ариза (юридик шахснинг мурожаати)',
    title: tr('Yuridik shaxs arizasi (rasmiy xat)', 'Заявление юрлица (официальное письмо)', 'Company application (official letter)'),
    desc: tr('Tashkilot blankasida davlat organi yoki hamkorga rasmiy murojaat: chiquvchi raqam, mavzu, soʻrov.', 'Официальное обращение организации в госорган или партнёру: исходящий номер, тема, просьба.', 'Official letter from a company to an authority or partner: reference No., subject, request.'),
    fields: [
      { k: 'co', g: 'applicant', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
      { k: 'co_stir', g: 'applicant', l: tr('STIR', 'ИНН', 'TIN'), ex: '301234567', half: true },
      { k: 'co_phone', g: 'applicant', l: L.phone, ex: '+998 71 200-00-00', half: true },
      { k: 'co_addr', g: 'applicant', l: tr('Yuridik manzil', 'Юридический адрес', 'Registered address'), ex: 'Тошкент ш., Юнусобод тумани, Амир Темур кўчаси, 1-уй' },
      { k: 'out', g: 'doc', l: tr('Chiquvchi raqam', 'Исходящий №', 'Reference No.'), ex: '45/26', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
      { k: 'org', g: 'addressee', l: tr('Kimga (tashkilot)', 'Кому (организация)', 'To (organisation)'), ex: 'Юнусобод тумани давлат солиқ инспекцияси' },
      { k: 'head', g: 'addressee', l: tr('Rahbar lavozimi va F.I.Sh.', 'Должность и Ф.И.О. руководителя', 'Head (position, name)'), ex: 'Бошлиқ Д.Д. Давронов' },
      { k: 'subject', g: 'request', l: tr('Mavzu', 'Тема', 'Subject'), ex: 'солиқ ҳисоботидаги техник хатони тузатиш тўғрисида' },
      { k: 'body', g: 'request', l: tr('Matn', 'Текст', 'Body'), t: 'textarea', ex: 'Жамият томонидан 2026 йил III чорак учун тақдим этилган қўшилган қиймат солиғи ҳисоботида техник хато (ҳисоб-фактура рақамида) йўл қўйилганини маълум қиламиз.' },
      { k: 'ask', g: 'request', l: tr('Soʻrov', 'Просьба', 'Request'), t: 'textarea', ex: 'Аниқлаштирилган ҳисоботни қабул қилишингизни сўраймиз.' },
      extraAtt,
      { k: 'sign_pos', g: 'sign', l: tr('Imzolovchi lavozimi', 'Должность подписанта', 'Signatory position'), ex: 'Директор', half: true },
      { k: 'sign_fio', g: 'sign', l: tr('Imzolovchi F.I.Sh.', 'Ф.И.О. подписанта', 'Signatory name'), ex: 'А.Б. Каримов', half: true },
      { k: 'exec', g: 'sign', l: tr('Ijrochi va telefon', 'Исполнитель и телефон', 'Prepared by, phone'), ex: 'Д.Ш. Раҳимова, +998 71 200-00-01' },
    ],
    render: c => `
      <p class="c"><b>${c.x('co', 22)}</b><br>СТИР ${c.x('co_stir', 9)} · ${c.x('co_addr', 24)} · тел. ${c.x('co_phone', 12)}</p>
      <p>${c.dshort('date')} № ${c.x('out', 6)}</p>
      ${addressee(`<b>${c.x('org', 24)}га</b>`, c.x('head', 22))}
      <p class="c"><i>${c.x('subject', 30)}</i></p>
      ${p(c.x('body', 40))}
      ${p(c.x('ask', 40))}
      ${attachments(c, [], 'att')}
      <table class="sig"><tr><td>${c.x('sign_pos', 10)}</td><td class="r">____________ ${c.x('sign_fio', 14)}</td></tr></table>
      <p><small>Ижрочи: ${c.x('exec', 18)}</small></p>`,
  },
  {
    id: 'school-admission', cat: 'applications', sub: 'children', minutes: 3,
    docTitle: 'Болани умумтаълим мактабига қабул қилиш тўғрисида ариза',
    title: tr('Bolani maktabga qabul qilish arizasi', 'Заявление о приёме ребёнка в школу', 'School admission application'),
    desc: tr('Ota-onaning maktab direktoriga arizasi: bola maʼlumotlari, sinf, taʼlim tili.', 'Заявление родителя директору школы: данные ребёнка, класс, язык обучения.', 'Parent’s application to the school head: child details, grade, language.'),
    fields: [
      { k: 'school', g: 'addressee', l: tr('Maktab', 'Школа', 'School'), ex: 'Юнусобод туманидаги 45-сон умумтаълим мактаби' },
      { k: 'dir', g: 'addressee', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Head teacher'), ex: 'М.М. Мирзаева' },
      { k: 'pa', g: 'parent', l: L.fio, ex: 'Каримова Нигора Ботировна' },
      { k: 'pa_addr', g: 'parent', l: L.addr, ex: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадон' },
      { k: 'pa_phone', g: 'parent', l: L.phone, ex: '+998 90 111-22-33', half: true },
      { k: 'pa_work', g: 'parent', l: tr('Ish joyi', 'Место работы', 'Workplace'), ex: '«Намуна Савдо» МЧЖ', half: true },
      { k: 'ch', g: 'child', l: L.fio, ex: 'Каримова Мадина Фарруховна' },
      { k: 'ch_born', g: 'child', l: L.birth, t: 'date', ex: '2019-09-05', half: true },
      { k: 'ch_cert', g: 'child', l: tr('Tugʻilganlik guvohnomasi', 'Свидетельство о рождении', 'Birth certificate'), ex: 'I-ТН 0654321', half: true },
      { k: 'grade', g: 'child', l: tr('Sinf', 'Класс', 'Grade'), ex: '1', half: true },
      { k: 'lang', g: 'child', l: tr('Taʼlim tili', 'Язык обучения', 'Language of instruction'), t: 'select', opts: ['ўзбек', 'рус', 'қорақалпоқ', 'инглиз'], ex: 'ўзбек', half: true },
      { k: 'year', g: 'child', l: tr('Oʻquv yili', 'Учебный год', 'School year'), ex: '2026-2027', half: true },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05', half: true },
    ],
    render: c => `
      ${addressee(`<b>${c.x('school', 24)} директори</b>`, `${c.x('dir', 16)}га`, `${c.x('pa', 22)}дан`, `Манзил: ${c.x('pa_addr', 24)}`, `Тел.: ${c.x('pa_phone', 12)}`)}
      <h2>Ариза</h2>
      ${p(`Фарзандим ${c.x('ch', 22)}ни (${c.dshort('ch_born')} йилда туғилган, туғилганлик тўғрисидаги гувоҳнома ${c.x('ch_cert', 12)}) ${c.x('year', 8)} ўқув йилида мактабингизнинг ${c.x('grade', 2)}-синфига ${c.x('lang', 6)} тилида таълим олиш учун қабул қилишингизни сўрайман.`)}
      ${p('Мактаб устави ва ички тартиб қоидалари билан танишдим. Шахсга доир маълумотларимни ва фарзандимнинг маълумотларини таълим жараёни мақсадида ишлов беришга розилик бераман.')}
      ${p(`Ота-онанинг иш жойи: ${c.x('pa_work', 18)}.`)}
      ${attachments(c, ['Боланинг туғилганлик тўғрисидаги гувоҳномаси нусхаси.', 'Тиббий маълумотнома.', 'Ота-онадан бирининг паспорт нусхаси.', 'Фотосурат (3×4).'])}
      ${signLine(c, 'date', 'pa')}`,
  },
  {
    id: 'kindergarten-admission', cat: 'applications', sub: 'children', minutes: 3,
    docTitle: 'Болани мактабгача таълим ташкилотига қабул қилиш тўғрисида ариза',
    title: tr('Bolani bogʻchaga qabul qilish arizasi', 'Заявление о приёме ребёнка в детский сад', 'Kindergarten admission application'),
    desc: tr('Ota-onaning MTT rahbariga arizasi: bola, guruh turi, qabul sanasi, imtiyoz.', 'Заявление родителя заведующей детсадом: ребёнок, тип группы, дата, льготы.', 'Parent’s application to a kindergarten: child, group type, start date, benefits.'),
    fields: [
      { k: 'mtt', g: 'addressee', l: tr('MTT nomi', 'Детсад', 'Kindergarten'), ex: 'Юнусобод туманидаги 312-сон давлат мактабгача таълим ташкилоти' },
      { k: 'dir', g: 'addressee', l: tr('Rahbar F.I.Sh.', 'Ф.И.О. заведующей', 'Head'), ex: 'Н.Н. Назарова' },
      { k: 'pa', g: 'parent', l: L.fio, ex: 'Каримова Нигора Ботировна' },
      { k: 'pa_addr', g: 'parent', l: L.addr, ex: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадон' },
      { k: 'pa_phone', g: 'parent', l: L.phone, ex: '+998 90 111-22-33', half: true },
      { k: 'pa_work', g: 'parent', l: tr('Ish joyi', 'Место работы', 'Workplace'), ex: '«Намуна Савдо» МЧЖ', half: true },
      { k: 'ch', g: 'child', l: L.fio, ex: 'Каримов Аброр Фаррухович' },
      { k: 'ch_born', g: 'child', l: L.birth, t: 'date', ex: '2022-04-17', half: true },
      { k: 'ch_cert', g: 'child', l: tr('Tugʻilganlik guvohnomasi', 'Свидетельство о рождении', 'Birth certificate'), ex: 'I-ТН 0777111', half: true },
      { k: 'group', g: 'child', l: tr('Guruh turi', 'Тип группы', 'Group type'), t: 'select', opts: ['умумий ривожлантирувчи гуруҳ (кун давомида)', 'қисқа муддатли гуруҳ', 'ихтисослаштирилган гуруҳ'], ex: 'умумий ривожлантирувчи гуруҳ (кун давомида)' },
      { k: 'from', g: 'child', l: tr('Qabul sanasi', 'Дата приёма', 'Start date'), t: 'date', ex: '2026-11-01', half: true },
      { k: 'benefit', g: 'child', l: tr('Imtiyoz (boʻlsa)', 'Льгота (если есть)', 'Benefit (if any)'), half: true },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${addressee(`<b>${c.x('mtt', 24)} раҳбари</b>`, `${c.x('dir', 16)}га`, `${c.x('pa', 22)}дан`, `Манзил: ${c.x('pa_addr', 24)}`, `Тел.: ${c.x('pa_phone', 12)}`)}
      <h2>Ариза</h2>
      ${p(`Фарзандим ${c.x('ch', 22)}ни (${c.dshort('ch_born')} йилда туғилган, туғилганлик тўғрисидаги гувоҳнома ${c.x('ch_cert', 12)}) ${c.date('from')}дан бошлаб мактабгача таълим ташкилотингизнинг ${c.x('group', 20)}га қабул қилишингизни сўрайман.`)}
      ${c.has('benefit') ? p(`Имтиёз: ${c.x('benefit')}. Тасдиқловчи ҳужжат илова қилинади.`) : ''}
      ${p(`Ота-онанинг иш жойи: ${c.x('pa_work', 18)}. Таълим ташкилотининг устави ва ота-она тўлови тартиби билан танишдим. Шахсга доир маълумотларга ишлов беришга розилик бераман.`)}
      ${attachments(c, ['Боланинг туғилганлик тўғрисидаги гувоҳномаси нусхаси.', 'Боланинг соғлиғи тўғрисидаги тиббий маълумотнома.', 'Ота-онадан бирининг паспорт нусхаси.'])}
      ${signLine(c, 'date', 'pa')}`,
  },
  {
    id: 'utility-recalc', cat: 'applications', sub: 'individuals', minutes: 3,
    docTitle: 'Коммунал тўловларни қайта ҳисоблаш тўғрисида ариза',
    title: tr('Kommunal toʻlovni qayta hisoblash arizasi', 'Заявление о перерасчёте коммунальных', 'Utility bill recalculation request'),
    desc: tr('Yashamagan davr yoki notoʻgʻri hisob uchun kommunal xizmat haqini qayta hisoblashni soʻrash.', 'Перерасчёт за период отсутствия или при ошибочном начислении.', 'Recalculation for a period of absence or a billing error.'),
    fields: [
      { k: 'org', g: 'addressee', l: tr('Xizmat koʻrsatuvchi tashkilot', 'Поставщик услуги', 'Service provider'), ex: 'Табиий газ таъминоти бўйича Юнусобод туман филиали' },
      { k: 'ap', g: 'applicant', l: L.fio, ex: 'Каримова Нигора Ботировна' },
      { k: 'ap_addr', g: 'applicant', l: L.addr, ex: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадон' },
      { k: 'ap_phone', g: 'applicant', l: L.phone, ex: '+998 90 111-22-33', half: true },
      { k: 'acc', g: 'applicant', l: tr('Shaxsiy hisob raqami', 'Лицевой счёт', 'Account No.'), ex: '1234567', half: true },
      { k: 'service', g: 'request', l: tr('Xizmat turi', 'Вид услуги', 'Service'), t: 'select', opts: ['табиий газ', 'электр энергия', 'ичимлик суви', 'иссиқлик таъминоти', 'маиший чиқиндиларни олиб чиқиш'], ex: 'табиий газ', half: true },
      { k: 'reason', g: 'request', l: tr('Sabab', 'Причина', 'Reason'), t: 'select', opts: ['ушбу даврда хонадонда вақтинча яшамаганим', 'ҳисоблагич кўрсаткичлари нотўғри қайд этилгани', 'хизмат кўрсатилмагани ёки сифатсиз кўрсатилгани'], ex: 'ушбу даврда хонадонда вақтинча яшамаганим', half: true },
      { k: 'from', g: 'request', l: tr('Davr boshi', 'Период с', 'From'), t: 'date', ex: '2026-06-01', half: true },
      { k: 'to', g: 'request', l: tr('Davr oxiri', 'Период по', 'To'), t: 'date', ex: '2026-08-31', half: true },
      { k: 'more', g: 'request', l: tr('Qoʻshimcha maʼlumot', 'Доп. сведения', 'Details'), t: 'textarea', ex: 'Ушбу даврда хорижда бўлганман, бу паспортдаги чегарадан ўтиш белгилари билан тасдиқланади.' },
      { k: 'att', g: 'request', l: tr('Ilovalar (har biri yangi qatordan)', 'Приложения (каждое с новой строки)', 'Attachments (one per line)'), t: 'textarea', ex: 'Паспортнинг чегарадан ўтиш белгилари қўйилган саҳифалари нусхаси' },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${addressee(`<b>${c.x('org', 24)}га</b>`, `${c.x('ap', 22)}дан`, `Манзил: ${c.x('ap_addr', 24)}`, `Шахсий ҳисоб рақами: ${c.x('acc', 10)}`, `Тел.: ${c.x('ap_phone', 12)}`)}
      <h2>Ариза</h2>
      <p class="c"><i>коммунал хизмат ҳақини қайта ҳисоблаш тўғрисида</i></p>
      ${p(`${c.date('from')}дан ${c.date('to')}гача бўлган давр учун ${c.x('service', 12)} хизмати ҳақи ${c.x('reason', 24)} сабабли нотўғри ҳисобланган.`)}
      ${p(c.x('more', 30))}
      ${p(`Шу боис кўрсатилган давр учун ${c.x('service', 12)} хизмати ҳақини қайта ҳисоблаб, шахсий ҳисоб рақамимдаги қарздорликни тузатишингизни сўрайман.`)}
      ${attachments(c, [], 'att')}
      ${signLine(c, 'date', 'ap')}`,
  },
  {
    id: 'payment-deferral', cat: 'applications', sub: 'legal', minutes: 4,
    docTitle: 'Тўловни кечиктириш тўғрисида хат',
    title: tr('Toʻlovni kechiktirish (boʻlib toʻlash) xati', 'Письмо об отсрочке (рассрочке) платежа', 'Payment deferral request'),
    desc: tr('Kreditorga qarzni jadval asosida boʻlib toʻlashni soʻrab rasmiy xat; jadval summasi avtomatik.', 'Официальная просьба к кредитору о рассрочке по графику; итог графика считается.', 'Formal request to pay a debt in instalments; schedule total computed.'),
    fields: [
      { k: 'co', g: 'applicant', l: L.company, ex: '«Мисол Хизмат» МЧЖ' },
      { k: 'co_stir', g: 'applicant', l: tr('STIR', 'ИНН', 'TIN'), ex: '302765432', half: true },
      { k: 'out', g: 'doc', l: tr('Chiquvchi raqam', 'Исходящий №', 'Reference No.'), ex: '19/26', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05' },
      { k: 'org', g: 'addressee', l: tr('Kreditor', 'Кредитор', 'Creditor'), ex: '«Намуна Савдо» МЧЖ' },
      { k: 'head', g: 'addressee', l: tr('Rahbar F.I.Sh.', 'Ф.И.О. руководителя', 'Head'), ex: 'А.Б. Каримов' },
      { k: 'c_ref', g: 'contract', l: tr('Shartnoma', 'Договор', 'Contract'), ex: '04.05.2026 йилдаги 45-сон' },
      { k: 'debt', g: 'contract', l: tr('Qarz summasi', 'Сумма долга', 'Debt'), t: 'money', ex: '20500000' },
      { k: 'why', g: 'contract', l: tr('Sabab', 'Причина', 'Reason'), t: 'textarea', ex: 'Асосий буюртмачимиз томонидан тўловларнинг кечиктирилиши натижасида жамиятда вақтинчалик молиявий қийинчилик юзага келди.' },
      { k: 'plan', g: 'payment', l: tr('Toʻlov jadvali', 'График платежей', 'Schedule'), t: 'rows',
        cols: [{ k: 'd', l: tr('Sana', 'Дата', 'Date') }, { k: 'sum', l: tr('Summa', 'Сумма', 'Amount'), num: true }],
        ex: [{ d: '31.10.2026', sum: '7000000' }, { d: '30.11.2026', sum: '7000000' }, { d: '31.12.2026', sum: '6500000' }] },
      { k: 'sign_fio', g: 'sign', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Director'), ex: 'Д.Ш. Раҳимова' },
    ],
    render: c => {
      const rows = c.rows('plan').filter(r => (r['d'] ?? '').trim() || (r['sum'] ?? '').trim());
      let total = 0;
      const body = rows.map((r, i) => { const n = parseNum(r['sum'] ?? ''); if (isFinite(n)) total += n; return `<tr><td class="n">${i + 1}</td><td>${c.span(esc(r['d'] ?? ''))}</td><td class="n">${isFinite(n) ? fmtMoney(n) : ''}</td></tr>`; }).join('');
      return `
      <p class="c"><b>${c.x('co', 22)}</b> · СТИР ${c.x('co_stir', 9)}</p>
      <p>${c.dshort('date')} № ${c.x('out', 6)}</p>
      ${addressee(`<b>${c.x('org', 20)} раҳбари</b>`, `${c.x('head', 14)}га`)}
      <p class="c"><i>тўловни кечиктириш тўғрисида</i></p>
      ${p(`${c.x('c_ref', 16)} шартнома бўйича ${c.x('co', 16)}нинг ${c.x('org', 16)} олдидаги қарзи ${c.money('debt')}ни ташкил этади.`)}
      ${p(c.x('why', 40))}
      ${p('Шу боис қарзни қуйидаги жадвал асосида бўлиб тўлашга розилик беришингизни ва бу давр учун жарима санкцияларини қўлламаслигингизни сўраймиз:')}
      <table class="t"><tr><th>№</th><th>Сана</th><th>Сумма</th></tr>${body || `<tr><td class="n">1</td><td>${c.blank(10)}</td><td>${c.blank(10)}</td></tr>`}<tr><td></td><td><b>Жами</b></td><td class="n"><b>${fmtMoney(total)}</b></td></tr></table>
      ${p('Жадвалга қатъий амал қилишни кафолатлаймиз. Ҳамкорлигимизни қадрлаймиз.')}
      <table class="sig"><tr><td>Директор</td><td class="r">____________ ${c.x('sign_fio', 14)}</td></tr></table>`;
    },
  },
];
