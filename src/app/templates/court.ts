import { esc, parseNum } from '../core/doc/format';
import { Ctx, ol, p } from '../core/doc/engine';
import { DocTemplate, FieldDef } from '../core/doc/types';
import { addressee, attachments, L, signLine, tr } from './shared';

const EX_PL = { fio: 'Каримова Нигора Ботировна', addr: 'Тошкент ш., Юнусобод тумани, Боғишамол кўчаси, 12-уй, 34-хонадон', phone: '+998 90 111-22-33' };
const EX_DF = { fio: 'Каримов Фаррух Олимович', addr: 'Тошкент ш., Мирзо Улуғбек тумани, Буюк Ипак йўли кўчаси, 45-уй, 7-хонадон', work: '«Мисол Хизмат» МЧЖ ҳайдовчиси' };
const COURT_EX = 'Фуқаролик ишлари бўйича Юнусобод туманлараро суди';

const courtField: FieldDef = { k: 'court', g: 'court', l: tr('Sud nomi', 'Наименование суда', 'Court'), ex: COURT_EX, hint: tr('Odatda javobgarning yashash joyidagi sud.', 'Обычно суд по месту жительства ответчика.', 'Usually the court of the defendant’s residence.') };
const partiesFields = (pl = EX_PL, df = EX_DF): FieldDef[] => [
  { k: 'pl', g: 'plaintiff', l: L.fio, ex: pl.fio },
  { k: 'pl_addr', g: 'plaintiff', l: tr('Yashash manzili', 'Адрес проживания', 'Residential address'), ex: pl.addr },
  { k: 'pl_phone', g: 'plaintiff', l: L.phone, ex: pl.phone, half: true },
  { k: 'pl_pinfl', g: 'plaintiff', l: tr('JShShIR', 'ПИНФЛ', 'Personal ID (PINFL)'), half: true },
  { k: 'df', g: 'defendant', l: L.fio, ex: df.fio },
  { k: 'df_addr', g: 'defendant', l: tr('Yashash manzili', 'Адрес проживания', 'Residential address'), ex: df.addr },
  { k: 'df_work', g: 'defendant', l: tr('Ish joyi va lavozimi', 'Место работы и должность', 'Employer and position'), ex: df.work },
];
const head = (c: Ctx, plRole = 'Даъвогар', dfRole = 'Жавобгар') => addressee(
  `<b>${c.x('court', 26)}га</b>`,
  `<b>${plRole}:</b> ${c.x('pl', 22)}`,
  `Яшаш манзили: ${c.x('pl_addr', 26)}`,
  c.has('pl_phone') ? `Тел.: ${c.x('pl_phone')}` : '',
  c.has('pl_pinfl') ? `ЖШШИР: ${c.x('pl_pinfl')}` : '',
  `<b>${dfRole}:</b> ${c.x('df', 22)}`,
  `Яшаш манзили: ${c.x('df_addr', 26)}`,
  c.has('df_work') ? `Иш жойи: ${c.x('df_work')}` : '',
);
const childrenRows = (c: Ctx, k = 'kids') => c.rows(k).filter(r => (r['fio'] ?? '').trim());
const kidsList = (c: Ctx, k = 'kids') => {
  const kids = childrenRows(c, k);
  return kids.length
    ? kids.map(r => `${c.span(esc(r['fio'].trim()))} (${c.span(esc((r['born'] ?? '').trim()) || '____')} йилда туғилган)`).join(', ')
    : c.blank(30);
};
const KID_COLS = [{ k: 'fio', l: L.fio }, { k: 'born', l: tr('Tugʻilgan sanasi', 'Дата рождения', 'Date of birth') }];
const SHARES = ['чорак (1/4) қисми', 'учдан бир (1/3) қисми', 'ярми (1/2) қисми'];

export const COURT: DocTemplate[] = [
  {
    id: 'court-alimony', cat: 'court', sub: 'claims', minutes: 6,
    docTitle: 'Алимент ундириш тўғрисида даъво аризаси',
    title: tr('Aliment undirish toʻgʻrisida daʼvo ariza', 'Иск о взыскании алиментов', 'Claim for child support'),
    desc: tr('Voyaga yetmagan bolalar taʼminoti uchun daromadning ulushi miqdorida aliment undirish. Ulush bolalar soniga qarab avtomatik.', 'Взыскание алиментов на несовершеннолетних детей в долях от дохода. Доля считается по числу детей.', 'Child support as a share of income; the share follows the number of children.'),
    fields: [
      courtField,
      ...partiesFields(),
      { k: 'status', g: 'marriage', l: tr('Nikoh holati', 'Состояние брака', 'Marriage status'), t: 'select', opts: ['никоҳда турамиз', 'никоҳ бекор қилинган'], ex: 'никоҳ бекор қилинган', half: true },
      { k: 'since', g: 'marriage', l: tr('Nikoh qayd etilgan sana', 'Дата регистрации брака', 'Date of marriage'), t: 'date', ex: '2014-06-20', half: true },
      { k: 'kids', g: 'children', l: tr('Voyaga yetmagan bolalar', 'Несовершеннолетние дети', 'Minor children'), t: 'rows', cols: KID_COLS,
        ex: [{ fio: 'Каримов Жавоҳир Фаррухович', born: '12.03.2016' }, { fio: 'Каримова Мадина Фарруховна', born: '05.09.2019' }] },
      { k: 'facts', g: 'claim', l: tr('Holatlar (qisqacha)', 'Обстоятельства (кратко)', 'Facts (briefly)'), t: 'textarea', ex: 'Жавобгар болалар таъминоти учун ихтиёрий равишда маблағ бермаяпти, бу борадаги келишувга эришилмади.' },
      { k: 'att', g: 'claim', l: tr('Qoʻshimcha ilovalar (har biri yangi qatordan)', 'Доп. приложения (каждое с новой строки)', 'Extra attachments (one per line)'), t: 'textarea' },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => {
      const n = childrenRows(c).length;
      const share = n ? SHARES[Math.min(n, 3) - 1] : c.blank(14);
      return `
      ${head(c)}
      <h2>Даъво аризаси</h2>
      <p class="c"><i>вояга етмаган болалар таъминоти учун алимент ундириш тўғрисида</i></p>
      ${p(`Мен жавобгар ${c.x('df', 20)} билан ${c.date('since')}дан бошлаб никоҳ қайд эттирганман, ҳозирда ${c.x('status', 14)}.`)}
      ${p(`Никоҳдан ${n || c.blank(2)} нафар фарзанд туғилган: ${kidsList(c)}. Болалар ҳозирда мен билан бирга яшайди ва менинг қарамоғимда.`)}
      ${p(c.x('facts', 40))}
      ${p('Ўзбекистон Республикаси Оила кодексининг 99-моддасига мувофиқ, вояга етмаган болалар учун алимент суд томонидан ота-онадан ҳар ойда бир бола учун — иш ҳақи ва (ёки) бошқа даромадининг чорак қисми, икки бола учун — учдан бир қисми, уч ва ундан ортиқ бола учун — ярми миқдорида ундирилади.')}
      ${p('Юқоридагиларга асосан,')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`Жавобгар ${c.x('df', 20)}дан менинг фойдамга вояга етмаган ${kidsList(c)} таъминоти учун иш ҳақи ва (ёки) бошқа даромадининг ${share} миқдорида, даъво аризаси берилган кундан бошлаб болалар вояга етгунига қадар ҳар ойда алимент ундирилсин.`])}
      ${attachments(c, ['Никоҳ (никоҳни бекор қилиш) тўғрисидаги гувоҳнома нусхаси.', 'Болаларнинг туғилганлик тўғрисидаги гувоҳномалари нусхалари.', 'Болалар даъвогар билан яшашини тасдиқловчи ҳужжат.', 'Даъво аризасининг жавобгар учун нусхаси.'], 'att')}
      ${signLine(c, 'date', 'pl')}`;
    },
  },
  {
    id: 'court-divorce', cat: 'court', sub: 'claims', minutes: 6,
    docTitle: 'Никоҳни бекор қилиш тўғрисида даъво аризаси',
    title: tr('Nikohni bekor qilish toʻgʻrisida daʼvo ariza', 'Иск о расторжении брака', 'Claim for divorce'),
    desc: tr('Nikoh sud tartibida bekor qilinishi: nikoh maʼlumotlari, bolalar, sabab va mol-mulk boʻyicha holat.', 'Расторжение брака в суде: данные брака, дети, причина, имущество.', 'Divorce through the court: marriage details, children, grounds, property.'),
    fields: [
      courtField,
      ...partiesFields(),
      { k: 'since', g: 'marriage', l: tr('Nikoh qayd etilgan sana', 'Дата регистрации брака', 'Date of marriage'), t: 'date', ex: '2014-06-20', half: true },
      { k: 'rec', g: 'marriage', l: tr('Dalolatnoma yozuvi №', '№ актовой записи', 'Record No.'), ex: '412', half: true },
      { k: 'zags', g: 'marriage', l: tr('FHDYo organi', 'Орган ЗАГС', 'Registry office'), ex: 'Юнусобод тумани ФҲДЁ бўлими' },
      { k: 'kids', g: 'children', l: tr('Voyaga yetmagan bolalar (boʻlsa)', 'Несовершеннолетние дети (если есть)', 'Minor children (if any)'), t: 'rows', cols: KID_COLS,
        ex: [{ fio: 'Каримов Жавоҳир Фаррухович', born: '12.03.2016' }] },
      { k: 'kids_with', g: 'children', l: tr('Bolalar kim bilan qoladi', 'С кем остаются дети', 'Children live with'), ex: 'даъвогар (онаси) билан' },
      { k: 'apart', g: 'claim', l: tr('Alohida yashash boshlangan sana', 'Раздельно проживают с', 'Living apart since'), t: 'date', ex: '2026-02-01', half: true },
      { k: 'prop', g: 'claim', l: tr('Mol-mulk', 'Имущество', 'Property'), t: 'select', opts: ['мол-мулк бўйича низо йўқ', 'мол-мулк тақсимоти тўғрисидаги низо алоҳида ҳал қилинади'], ex: 'мол-мулк бўйича низо йўқ', half: true },
      { k: 'reason', g: 'claim', l: tr('Sabablar', 'Причины', 'Grounds'), t: 'textarea', ex: 'Ўртамизда характерлар мос келмаслиги сабабли доимий келишмовчиликлар юзага келди. Оилани сақлаб қолиш учун кўрилган чоралар натижа бермади, оилавий муносабатлар амалда тугаган.' },
      { k: 'att', g: 'claim', l: tr('Qoʻshimcha ilovalar (har biri yangi qatordan)', 'Доп. приложения (каждое с новой строки)', 'Extra attachments (one per line)'), t: 'textarea' },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => {
      const kids = childrenRows(c);
      return `
      ${head(c)}
      <h2>Даъво аризаси</h2>
      <p class="c"><i>никоҳни бекор қилиш тўғрисида</i></p>
      ${p(`Мен жавобгар ${c.x('df', 20)} билан ${c.date('since')}да ${c.x('zags', 18)} томонидан никоҳдан ўтганман (далолатнома ёзуви № ${c.x('rec', 4)}).`)}
      ${p(kids.length ? `Никоҳдан вояга етмаган фарзандларимиз бор: ${kidsList(c)}. Болалар ${c.x('kids_with', 14)} қолади.` : 'Никоҳдан вояга етмаган фарзандларимиз йўқ.')}
      ${p(c.x('reason', 40))}
      ${p(`${c.date('apart')}дан бошлаб алоҳида яшаймиз. Оилани сақлаб қолиш имконияти йўқ. ${c.x('prop', 20)}.`)}
      ${p('Юқоридагиларга асосан, Ўзбекистон Республикаси Оила кодексига мувофиқ,')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`${c.date('since')}да ${c.x('zags', 18)} томонидан қайд этилган (далолатнома ёзуви № ${c.x('rec', 4)}) ${c.x('pl', 18)} ва ${c.x('df', 18)} ўртасидаги никоҳ бекор қилинсин.`])}
      ${attachments(c, ['Никоҳ тўғрисидаги гувоҳноманинг асл нусхаси.', ...(kids.length ? ['Болаларнинг туғилганлик тўғрисидаги гувоҳномалари нусхалари.'] : []), 'Давлат божи тўланганлиги тўғрисидаги ҳужжат.', 'Даъво аризасининг жавобгар учун нусхаси.'], 'att')}
      ${signLine(c, 'date', 'pl')}`;
    },
  },
  {
    id: 'court-debt', cat: 'court', sub: 'claims', minutes: 5,
    docTitle: 'Қарзни ундириш тўғрисида даъво аризаси',
    title: tr('Qarzni undirish toʻgʻrisida daʼvo ariza', 'Иск о взыскании долга', 'Claim for debt recovery'),
    desc: tr('Jismoniy shaxslar oʻrtasidagi qarz: qarz summasi, qaytarilgan qism va qoldiq avtomatik hisoblanadi.', 'Долг между физлицами: сумма займа, возвращённая часть, остаток считается автоматически.', 'Loan between individuals: amount, repaid part, the balance is computed.'),
    fields: [
      courtField,
      ...partiesFields(
        { fio: 'Юсупов Шерзод Анварович', addr: 'Тошкент ш., Миробод тумани, Нукус кўчаси, 20-уй, 21-хонадон', phone: '+998 93 444-55-66' },
        { fio: 'Алиев Тимур Рустамович', addr: 'Тошкент ш., Чилонзор тумани, 5-мавзе, 3-уй, 7-хонадон', work: '' }),
      { k: 'basis', g: 'debt', l: tr('Qarz hujjati', 'Документ о займе', 'Loan document'), t: 'select', opts: ['тилхат', 'қарз шартномаси'], ex: 'тилхат', half: true },
      { k: 'given', g: 'debt', l: tr('Qarz berilgan sana', 'Дата займа', 'Loan date'), t: 'date', ex: '2025-11-10', half: true },
      { k: 'amount', g: 'debt', l: tr('Qarz summasi', 'Сумма займа', 'Loan amount'), t: 'money', ex: '30000000' },
      { k: 'due', g: 'debt', l: tr('Qaytarish muddati', 'Срок возврата', 'Due date'), t: 'date', ex: '2026-05-10', half: true },
      { k: 'repaid', g: 'debt', l: tr('Qaytarilgan qism', 'Возвращено', 'Repaid'), t: 'money', ex: '5000000', half: true },
      { k: 'facts', g: 'claim', l: tr('Qoʻshimcha holatlar', 'Доп. обстоятельства', 'Further facts'), t: 'textarea', ex: 'Қарзни қайтариш тўғрисидаги оғзаки ва ёзма талабларим жавобсиз қолди.' },
      { k: 'att', g: 'claim', l: tr('Qoʻshimcha ilovalar (har biri yangi qatordan)', 'Доп. приложения (каждое с новой строки)', 'Extra attachments (one per line)'), t: 'textarea' },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => {
      const a = c.num('amount'), r = parseNum(c.raw('repaid') || '0');
      const left = isFinite(a) ? a - (isFinite(r) ? r : 0) : NaN;
      return `
      ${head(c)}
      <h2>Даъво аризаси</h2>
      <p class="c"><i>қарзни ундириш тўғрисида</i></p>
      ${p(`${c.date('given')}да мен жавобгар ${c.x('df', 20)}га ${c.money('amount')} миқдорида пулни қарзга бердим. Бу ${c.x('basis', 12)} билан тасдиқланади. Жавобгар қарзни ${c.date('due')}гача қайтариш мажбуриятини олган.`)}
      ${p(`Белгиланган муддатда қарз тўлиқ қайтарилмади. Жавобгар ${c.has('repaid') && r ? c.money('repaid') + ' миқдорида қисман қайтарди, ' : ''}қолган ${c.moneyN(left)} ҳозиргача тўланмаган.`)}
      ${p(c.x('facts', 40))}
      ${p('Ўзбекистон Республикаси Фуқаролик кодексига мувофиқ, қарз олувчи олинган пул суммасини шартномада назарда тутилган муддатда ва тартибда қарз берувчига қайтариши шарт. Мажбуриятларни бажаришдан бир томонлама бош тортишга йўл қўйилмайди.')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([
        `Жавобгар ${c.x('df', 20)}дан менинг фойдамга ${c.moneyN(left)} миқдоридаги қарз ундирилсин.`,
        'Жавобгардан суд харажатлари (давлат божи ва бошқа харажатлар) ундирилсин.',
      ])}
      ${attachments(c, [`${c.x('basis', 10)} нусхаси.`, 'Давлат божи тўланганлиги тўғрисидаги ҳужжат.', 'Даъво аризасининг жавобгар учун нусхаси.'], 'att')}
      ${signLine(c, 'date', 'pl')}`;
    },
  },
  {
    id: 'court-order', cat: 'court', sub: 'applications', minutes: 4,
    docTitle: 'Суд буйруғи чиқариш тўғрисида ариза',
    title: tr('Sud buyrugʻi chiqarish toʻgʻrisida ariza', 'Заявление о выдаче судебного приказа', 'Application for a court order'),
    desc: tr('Nizosiz talablar boʻyicha (yozma bitim, aliment va boshq.) soddalashtirilgan tartibda undirish.', 'Взыскание по бесспорным требованиям в упрощённом порядке (письменная сделка, алименты и др.).', 'Simplified recovery for undisputed claims (written transaction, support, etc.).'),
    fields: [
      courtField,
      ...partiesFields(
        { fio: 'Юсупов Шерзод Анварович', addr: 'Тошкент ш., Миробод тумани, Нукус кўчаси, 20-уй, 21-хонадон', phone: '+998 93 444-55-66' },
        { fio: 'Алиев Тимур Рустамович', addr: 'Тошкент ш., Чилонзор тумани, 5-мавзе, 3-уй, 7-хонадон', work: '' }),
      { k: 'ground', g: 'claim', l: tr('Talab asosi', 'Основание требования', 'Grounds'), t: 'select', opts: ['оддий ёзма шаклда тузилган битим', 'нотариал тасдиқланган битим', 'иш ҳақини тўламаслик'], ex: 'оддий ёзма шаклда тузилган битим' },
      { k: 'what', g: 'claim', l: tr('Talab mazmuni', 'Суть требования', 'Claim details'), t: 'textarea', ex: '01.12.2025 йилдаги тилхатга асосан қарздор 15 000 000 сўмни 01.06.2026 йилгача қайтариш мажбуриятини олган, лекин мажбуриятни бажармади.' },
      { k: 'amount', g: 'claim', l: tr('Undiriladigan summa', 'Сумма к взысканию', 'Amount to recover'), t: 'money', ex: '15000000' },
      { k: 'att', g: 'claim', l: tr('Qoʻshimcha ilovalar (har biri yangi qatordan)', 'Доп. приложения (каждое с новой строки)', 'Extra attachments (one per line)'), t: 'textarea' },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${head(c, 'Ундирувчи', 'Қарздор')}
      <h2>Ариза</h2>
      <p class="c"><i>суд буйруғи чиқариш тўғрисида</i></p>
      ${p(c.x('what', 40))}
      ${p(`Талаб ${c.x('ground', 18)}га асосланган ва низоли эмас. Ўзбекистон Республикаси Фуқаролик процессуал кодексининг суд буйруғи чиқаришга оид нормаларига асосан,`)}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`Қарздор ${c.x('df', 20)}дан ундирувчи ${c.x('pl', 20)} фойдасига ${c.money('amount')} ундириш тўғрисида суд буйруғи чиқарилсин.`])}
      ${attachments(c, ['Талабни тасдиқловчи ҳужжат нусхаси.', 'Давлат божи тўланганлиги тўғрисидаги ҳужжат.', 'Ариза нусхаси қарздор учун.'], 'att')}
      ${signLine(c, 'date', 'pl')}`,
  },
  {
    id: 'court-appeal', cat: 'court', sub: 'appeals', minutes: 7,
    docTitle: 'Апелляция шикояти',
    title: tr('Apellyatsiya shikoyati', 'Апелляционная жалоба', 'Appeal'),
    desc: tr('Birinchi instansiya sudining hal qiluv qaroriga shikoyat: ish maʼlumotlari, asoslar va soʻrov.', 'Жалоба на решение суда первой инстанции: данные дела, доводы, просьба.', 'Appeal against a first-instance decision: case details, grounds and relief.'),
    fields: [
      { k: 'court', g: 'court', l: tr('Apellyatsiya instansiyasi', 'Апелляционная инстанция', 'Appeal court'), ex: 'Тошкент шаҳар суди фуқаролик ишлари бўйича судлов ҳайъати' },
      { k: 'court1', g: 'court', l: tr('Birinchi instansiya sudi', 'Суд первой инстанции', 'First-instance court'), ex: COURT_EX },
      ...partiesFields().map(f => f.g === 'plaintiff' ? { ...f, l: f.k === 'pl' ? tr('Shikoyatchi F.I.Sh.', 'Ф.И.О. заявителя жалобы', 'Appellant full name') : f.l } : f.k === 'df' ? { ...f, l: tr('Ikkinchi tomon F.I.Sh.', 'Ф.И.О. другой стороны', 'Other party full name') } : f),
      { k: 'case', g: 'case', l: tr('Ish raqami', 'Номер дела', 'Case No.'), ex: '2-1234/2026', half: true },
      { k: 'dec', g: 'case', l: tr('Hal qiluv qarori sanasi', 'Дата решения', 'Decision date'), t: 'date', ex: '2026-09-15', half: true },
      { k: 'gist', g: 'case', l: tr('Qaror mazmuni', 'Суть решения', 'What the court decided'), t: 'textarea', ex: 'даъво талаблари қисман қаноатлантирилган' },
      { k: 'grounds', g: 'claim', l: tr('Shikoyat asoslari', 'Доводы жалобы', 'Grounds of appeal'), t: 'textarea', ex: 'Суд иш учун аҳамиятга эга бўлган ҳолатларни тўлиқ аниқламаган, тақдим этилган далилларга ҳуқуқий баҳо бермаган ва моддий ҳуқуқ нормаларини нотўғри қўллаган.' },
      { k: 'ask', g: 'claim', l: tr('Soʻrov', 'Просьба', 'Relief sought'), t: 'select', opts: ['бекор қилиниб, ишда янги қарор қабул қилинсин', 'ўзгартирилсин', 'бекор қилиниб, иш янгидан кўриш учун юборилсин'], ex: 'бекор қилиниб, ишда янги қарор қабул қилинсин' },
      { k: 'att', g: 'claim', l: tr('Qoʻshimcha ilovalar (har biri yangi qatordan)', 'Доп. приложения (каждое с новой строки)', 'Extra attachments (one per line)'), t: 'textarea' },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${addressee(
        `<b>${c.x('court', 26)}га</b>`,
        `<i>${c.x('court1', 22)} орқали</i>`,
        `<b>Шикоят берувчи:</b> ${c.x('pl', 22)}`,
        `Яшаш манзили: ${c.x('pl_addr', 26)}`,
        c.has('pl_phone') ? `Тел.: ${c.x('pl_phone')}` : '',
        `<b>Иккинчи тараф:</b> ${c.x('df', 22)}`,
        `Яшаш манзили: ${c.x('df_addr', 26)}`,
      )}
      <h2>Апелляция шикояти</h2>
      <p class="c"><i>${c.x('court1', 20)}нинг ${c.date('dec')}даги ҳал қилув қарорига (иш № ${c.x('case', 8)})</i></p>
      ${p(`${c.x('court1', 20)}нинг ${c.date('dec')}даги ҳал қилув қарори билан ${c.x('gist', 30)}.`)}
      ${p('Мен ушбу ҳал қилув қарорига қўшилмайман ва уни қуйидаги асосларга кўра қонунсиз ва асоссиз деб ҳисоблайман:')}
      ${p(c.x('grounds', 40))}
      ${p('Юқоридагиларга асосан, Ўзбекистон Республикаси Фуқаролик процессуал кодексининг апелляция тартибида иш юритишга оид нормаларига амал қилиб,')}
      <p class="sp">СЎРАЙМАН:</p>
      ${ol([`${c.x('court1', 20)}нинг ${c.date('dec')}даги ${c.x('case', 8)}-сонли иш бўйича ҳал қилув қарори ${c.x('ask', 20)}.`])}
      ${attachments(c, ['Ҳал қилув қарорининг нусхаси.', 'Давлат божи тўланганлиги тўғрисидаги ҳужжат.', 'Шикоятнинг ишда иштирок этувчи шахслар сонига мувофиқ нусхалари.'], 'att')}
      ${signLine(c, 'date', 'pl')}`,
  },
];

