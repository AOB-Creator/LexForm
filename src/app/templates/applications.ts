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
];
