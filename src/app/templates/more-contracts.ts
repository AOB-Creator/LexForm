import { esc, fmtMoney, parseNum } from '../core/doc/format';
import { Ctx, itemsTable, meta, ol, p, partyIntro, reqCell, sigTable } from '../core/doc/engine';
import { DocTemplate, FieldDef } from '../core/doc/types';
import { EX_A, EX_B, ITEM_COLS, L, partyFields, personCell, personFields, STD_LIABILITY, tr } from './shared';

const EX_P1 = { fio: 'Юсупов Шерзод Анварович', pass: 'AC 7654321, Миробод тумани ИИБ, 10.02.2017', addr: 'Тошкент ш., Миробод тумани, Нукус кўчаси, 20-уй, 21-хонадон' };
const EX_P2 = { fio: 'Алиев Тимур Рустамович', pass: 'AB 1234567, Чилонзор тумани ИИБ, 12.08.2018', addr: 'Тошкент ш., Чилонзор тумани, 5-мавзе, 3-уй, 7-хонадон' };
const cityDate = (no = true): FieldDef[] => [
  ...(no ? [{ k: 'no', g: 'doc', l: L.number, ex: '7', half: true } as FieldDef] : []),
  { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
  { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент шаҳри', half: !no },
];
const who = (c: Ctx, k: string) => `${c.x(k, 22)} (паспорт: ${c.x(k + '_pass', 18)}, яшаш манзили: ${c.x(k + '_addr', 24)})`;
const num = (v?: string) => { const n = parseNum(v ?? ''); return isFinite(n) ? n : 0; };

export const MORE_CONTRACTS: DocTemplate[] = [
  {
    id: 'loan-individual', cat: 'contracts', sub: 'individuals', minutes: 5,
    docTitle: 'Қарз шартномаси',
    title: tr('Qarz shartnomasi (jismoniy shaxslar)', 'Договор займа (физлица)', 'Loan agreement (individuals)'),
    desc: tr('Jismoniy shaxslar oʻrtasida pul qarzi: summa soʻz bilan, muddat, foiz, qaytarish tartibi.', 'Денежный заём между физлицами: сумма прописью, срок, проценты, возврат.', 'Cash loan between individuals: amount in words, term, interest, repayment.'),
    fields: [
      ...cityDate(),
      ...personFields('ln', 'lender', EX_P1),
      ...personFields('br', 'borrower', EX_P2),
      { k: 'amount', g: 'payment', l: tr('Qarz summasi', 'Сумма займа', 'Loan amount'), t: 'money', ex: '30000000' },
      { k: 'due', g: 'payment', l: tr('Qaytarish muddati', 'Срок возврата', 'Repay by'), t: 'date', ex: '2027-04-05', half: true },
      { k: 'rate', g: 'payment', l: tr('Yillik foiz (0 — foizsiz)', 'Годовых, % (0 — беспроцентный)', 'Annual interest, % (0 = none)'), t: 'number', ex: '0', half: true },
      { k: 'how', g: 'payment', l: tr('Berish/qaytarish usuli', 'Способ передачи/возврата', 'Transfer method'), t: 'select', opts: ['нақд пулда', 'банк картасига ўтказиш йўли билан', 'банк ҳисоб рақамига ўтказиш йўли билан'], ex: 'нақд пулда' },
      { k: 'pen', g: 'payment', l: tr('Kechikkanlik uchun penya, %/kun', 'Пеня за просрочку, %/день', 'Late penalty, %/day'), t: 'number', ex: '0.1', half: true },
    ],
    render: c => `
      <h2>Қарз шартномаси № ${c.x('no', 3)}</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Биз, ${who(c, 'ln')}, кейинги ўринларда «Қарз берувчи», ва ${who(c, 'br')}, кейинги ўринларда «Қарз олувчи», ушбу шартномани қуйидагилар ҳақида туздик:`)}
      ${ol([
        `Қарз берувчи Қарз олувчига ${c.money('amount')} миқдоридаги пулни ${c.x('how', 14)} қарзга беради, Қарз олувчи эса уни ${c.date('due')}гача қайтариш мажбуриятини олади.`,
        num(c.raw('rate')) > 0 ? `Қарз суммасига йиллик ${c.x('rate', 2)} фоиз миқдорида фоиз ҳисобланади ва қарз суммаси билан бирга тўланади.` : 'Қарз фоизсиз берилади.',
        'Қарз олувчи қарзни муддатидан олдин тўлиқ ёки қисман қайтаришга ҳақли.',
        `Қарз белгиланган муддатда қайтарилмаса, Қарз олувчи Қарз берувчига кечиктирилган ҳар бир кун учун қайтарилмаган сумманинг ${c.x('pen', 3)} фоизи миқдорида пеня тўлайди.`,
        'Пулнинг берилиши ва қайтарилиши тарафлар имзолаган тилхат ёки банк тўлов ҳужжати билан тасдиқланади.',
        'Шартнома бўйича низолар музокаралар йўли билан, келишувга эришилмаганда эса суд тартибида ҳал қилинади.',
        'Шартнома пул Қарз олувчига берилган пайтдан кучга киради ва икки нусхада тузилди.',
      ])}
      ${sigTable(personCell(c, 'ln', 'Қарз берувчи'), personCell(c, 'br', 'Қарз олувчи'))}`,
  },
  {
    id: 'receipt', cat: 'contracts', sub: 'individuals', minutes: 2,
    docTitle: 'Тилхат',
    title: tr('Qarz tilxati', 'Расписка в получении денег', 'Money receipt (IOU)'),
    desc: tr('Pul olinganini tasdiqlovchi tilxat: summa soʻz bilan, qaytarish sanasi, guvohlar.', 'Расписка о получении денег: сумма прописью, дата возврата, свидетели.', 'Receipt for money received: amount in words, repayment date, witnesses.'),
    fields: [
      { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент шаҳри', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
      ...personFields('br', 'borrower', EX_P2).filter(f => !f.k.endsWith('_acc')),
      ...personFields('ln', 'lender', EX_P1).filter(f => !f.k.endsWith('_acc') && !f.k.endsWith('_pinfl')),
      { k: 'amount', g: 'payment', l: tr('Summa', 'Сумма', 'Amount'), t: 'money', ex: '15000000', half: true },
      { k: 'due', g: 'payment', l: tr('Qaytarish sanasi', 'Дата возврата', 'Repay by'), t: 'date', ex: '2027-01-05', half: true },
      { k: 'wit', g: 'payment', l: tr('Guvohlar (F.I.Sh., ixtiyoriy)', 'Свидетели (Ф.И.О., необязательно)', 'Witnesses (optional)'), t: 'textarea' },
    ],
    render: c => {
      const wit = c.raw('wit').split('\n').map(s => s.trim()).filter(Boolean);
      return `
      <h2>Тилхат</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Мен, ${who(c, 'br')}${c.has('br_pinfl') ? ', ЖШШИР ' + c.x('br_pinfl') : ''}, ${who(c, 'ln')}дан ${c.money('amount')} миқдоридаги пулни қарзга олдим.`)}
      ${p(`Олинган пулни ${c.date('due')}гача тўлиқ қайтариш мажбуриятини оламан.`)}
      ${p('Тилхат ўз хоҳишимга кўра, ҳеч қандай тазйиқсиз, соғлом ақл билан ёзилди. Пул тўлиқ ҳажмда олинди.')}
      ${wit.length ? `<p><b>Гувоҳлар:</b></p>${ol(wit.map(w => `${c.span(esc(w))} ____________`))}` : ''}
      <table class="sig"><tr><td>${c.date('date')}</td><td class="r">____________ ${c.x('br', 18)}</td></tr></table>`;
    },
  },
  {
    id: 'residential-lease', cat: 'contracts', sub: 'realty', minutes: 6,
    docTitle: 'Турар жойни ижарага бериш шартномаси',
    title: tr('Turar joy ijarasi shartnomasi', 'Договор найма жилья', 'Residential lease'),
    desc: tr('Jismoniy shaxslar oʻrtasida kvartira ijarasi: ijara haqi, garov puli, kommunal toʻlovlar, muddat.', 'Найм квартиры между физлицами: плата, залог, коммунальные, срок.', 'Flat rental between individuals: rent, deposit, utilities, term.'),
    fields: [
      ...cityDate(),
      ...personFields('ll', 'lessor', EX_P1),
      ...personFields('tn', 'lessee', EX_P2).filter(f => !f.k.endsWith('_acc')),
      { k: 'addr', g: 'object', l: L.addr, ex: 'Тошкент ш., Юнусобод тумани, 4-мавзе, 15-уй, 42-хонадон' },
      { k: 'rooms', g: 'object', l: tr('Xonalar soni', 'Комнат', 'Rooms'), t: 'number', ex: '2', half: true },
      { k: 'area', g: 'object', l: tr('Maydon, m²', 'Площадь, м²', 'Area, m²'), t: 'number', ex: '54', half: true },
      { k: 'cad', g: 'object', l: tr('Mulk hujjati / kadastr', 'Документ о праве / кадастр', 'Title / cadastre'), ex: '10:05:01:02:03:0045' },
      { k: 'from', g: 'payment', l: tr('Ijara boshlanishi', 'Начало найма', 'From'), t: 'date', ex: '2026-10-10', half: true },
      { k: 'until', g: 'payment', l: tr('Ijara tugashi', 'Окончание найма', 'Until'), t: 'date', ex: '2027-10-09', half: true },
      { k: 'rent', g: 'payment', l: tr('Oylik ijara haqi', 'Плата в месяц', 'Monthly rent'), t: 'money', ex: '5000000', half: true },
      { k: 'deposit', g: 'payment', l: tr('Garov puli', 'Залог', 'Deposit'), t: 'money', ex: '5000000', half: true },
      { k: 'payday', g: 'payment', l: tr('Toʻlov kuni (har oyning)', 'День оплаты (каждого месяца)', 'Pay day (of each month)'), t: 'number', ex: '10', half: true },
      { k: 'util', g: 'payment', l: tr('Kommunal toʻlovlar', 'Коммунальные платежи', 'Utilities'), t: 'select', opts: ['Ижарачи томонидан ҳисоблагич кўрсаткичлари бўйича тўланади', 'ижара ҳақига киритилган', 'Ижарага берувчи томонидан тўланади'], ex: 'Ижарачи томонидан ҳисоблагич кўрсаткичлари бўйича тўланади', half: true },
      { k: 'live', g: 'object', l: tr('Birga yashovchilar', 'Совместно проживают', 'Co-occupants'), ex: 'турмуш ўртоғи ва бир нафар фарзанди' },
    ],
    render: c => `
      <h2>Турар жойни ижарага бериш шартномаси № ${c.x('no', 3)}</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`${who(c, 'll')}, кейинги ўринларда «Ижарага берувчи», ва ${who(c, 'tn')}, кейинги ўринларда «Ижарачи», ушбу шартномани қуйидагилар ҳақида туздилар:`)}
      ${ol([
        `Ижарага берувчи ўзига мулк ҳуқуқи асосида тегишли бўлган ${c.x('addr', 26)} манзилидаги ${c.x('rooms', 2)} хонали, умумий майдони ${c.x('area', 4)} кв.м бўлган турар жойни (кадастр: ${c.x('cad', 14)}) Ижарачига вақтинча яшаш учун ижарага беради.`,
        `Ижара муддати: ${c.date('from')}дан ${c.date('until')}гача.`,
        `Ойлик ижара ҳақи ${c.money('rent')}ни ташкил этади ва ҳар ойнинг ${c.x('payday', 2)}-санасигача олдиндан тўланади.`,
        `Ижарачи шартнома имзоланганда ${c.money('deposit')} миқдорида гаров пули тўлайди. Гаров пули шартнома тугаганда турар жой ва мол-мулк шикастланмаган тақдирда қайтарилади.`,
        `Коммунал тўловлар: ${c.x('util', 24)}.`,
        `Ижарачи билан бирга ${c.x('live', 18)} яшайди.`,
        'Ижарачи турар жойдан мақсадига кўра фойдаланади, уни озода сақлайди, Ижарага берувчининг розилигисиз қайта ижарага бермайди ва қайта қурмайди.',
        'Ижарага берувчи турар жойни яшаш учун яроқли ҳолатда топширади ва Ижарачининг фойдаланишига тўсқинлик қилмайди.',
        'Тарафлардан бири шартномани муддатидан олдин бекор қилмоқчи бўлса, иккинчи тарафни камида бир ой олдин ёзма огоҳлантиради.',
        'Шартнома қонунчиликда белгиланган тартибда давлат солиқ хизмати органларида ҳисобга қўйилади. Низолар музокара, келишилмаганда суд орқали ҳал этилади. Шартнома икки нусхада тузилди.',
      ])}
      ${sigTable(personCell(c, 'll', 'Ижарага берувчи'), `<b>«Ижарачи»</b><br>${c.x('tn', 20)}<br>Паспорт: ${c.x('tn_pass', 18)}<br>Манзил: ${c.x('tn_addr', 22)}<br>ЖШШИР: ${c.x('tn_pinfl', 14)}<br><br>____________ ${c.x('tn', 14)}`)}`,
  },
  {
    id: 'supply', cat: 'contracts', sub: 'legal', minutes: 8,
    docTitle: 'Маҳсулот етказиб бериш шартномаси',
    title: tr('Yetkazib berish shartnomasi', 'Договор поставки', 'Supply agreement'),
    desc: tr('Tovarlarni partiyalarda yetkazib berish: spetsifikatsiya, jami summa, oldindan toʻlov, muddatlar.', 'Поставка товаров партиями: спецификация, итог, предоплата, сроки.', 'Delivery of goods in batches: specification, total, prepayment, deadlines.'),
    fields: [
      ...cityDate(),
      ...partyFields('s', 'seller', EX_B),
      ...partyFields('b', 'buyer', EX_A),
      { k: 'items', g: 'items', l: tr('Spetsifikatsiya', 'Спецификация', 'Specification'), t: 'rows', cols: ITEM_COLS,
        ex: [{ name: 'Шакар (50 кг қопда)', unit: 'қоп', qty: '40', price: '520000' }, { name: 'Ўсимлик ёғи, 5 л', unit: 'дона', qty: '100', price: '98000' }] },
      { k: 'until', g: 'payment', l: tr('Yetkazib berish muddati', 'Срок поставки', 'Delivery period'), ex: 'ҳар ойда Харидорнинг буюртманомасига асосан, 2026 йил 31 декабргача' },
      { k: 'place', g: 'payment', l: tr('Yetkazib berish joyi', 'Место поставки', 'Delivery place'), ex: 'Харидорнинг омбори (Тошкент ш., Юнусобод тумани)' },
      { k: 'pre', g: 'payment', l: tr('Oldindan toʻlov, %', 'Предоплата, %', 'Prepayment, %'), t: 'number', ex: '30', half: true },
      { k: 'rest', g: 'payment', l: tr('Qolgan toʻlov (bank kuni)', 'Остаток (банк. дней)', 'Balance (bank days)'), t: 'number', ex: '10', half: true },
      { k: 'court', g: 'payment', l: tr('Sud', 'Суд', 'Court'), ex: 'Тошкент шаҳар иқтисодий суди' },
    ],
    render: c => {
      const t = itemsTable(c, 'items');
      return `
      <h2>Маҳсулот етказиб бериш шартномаси № ${c.x('no', 3)}</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`${partyIntro(c, 's', 'Етказиб берувчи')} бир томондан, ва ${partyIntro(c, 'b', 'Харидор')} иккинчи томондан, ушбу шартномани қуйидагилар ҳақида туздилар:`)}
      <h3>1. Шартнома предмети</h3>
      ${p('1.1. Етказиб берувчи қуйидаги спецификацияга мувофиқ маҳсулотни Харидорга етказиб бериш, Харидор эса уни қабул қилиш ва ҳақини тўлаш мажбуриятини олади:')}
      ${t.html}
      ${p(`1.2. Шартноманинг умумий қиймати ${c.moneyN(t.total)}.`)}
      <h3>2. Етказиб бериш</h3>
      ${p(`2.1. Етказиб бериш муддати: ${c.x('until', 24)}. Жойи: ${c.x('place', 22)}.`)}
      ${p('2.2. Маҳсулот ҳисобварақ-фактура ва юк хати асосида топширилади. Миқдор ва сифат бўйича қабул қилиш топшириш вақтида амалга оширилади.')}
      <h3>3. Тўлов</h3>
      ${p(`3.1. Харидор ҳар бир партия қийматининг ${c.x('pre', 2)} фоизини олдиндан, қолган қисмини маҳсулот қабул қилинганидан кейин ${c.x('rest', 2)} банк куни ичида тўлайди.`)}
      <h3>4. Жавобгарлик ва низолар</h3>
      ${p(`4.1. Тарафлар мажбуриятларни бажармаганлик учун ${STD_LIABILITY}га мувофиқ жавоб берадилар.`)}
      ${p(`4.2. Низолар талабнома тартибида, ҳал этилмаганда ${c.x('court', 18)}да кўрилади.`)}
      ${p('4.3. Шартнома имзоланган кундан кучга киради, мажбуриятлар тўлиқ бажарилгунга қадар амал қилади ва икки нусхада тузилди.')}
      <h3>5. Тарафларнинг реквизитлари</h3>
      ${sigTable(reqCell(c, 's', 'Етказиб берувчи'), reqCell(c, 'b', 'Харидор'))}`;
    },
  },
  {
    id: 'work-contract', cat: 'contracts', sub: 'legal', minutes: 7,
    docTitle: 'Пудрат шартномаси',
    title: tr('Pudrat shartnomasi', 'Договор подряда', 'Works contract'),
    desc: tr('Ishlarni bajarish (taʼmirlash, qurilish, oʻrnatish): smeta, muddat, materiallar, kafolat.', 'Выполнение работ (ремонт, строительство, монтаж): смета, сроки, материалы, гарантия.', 'Works (repair, construction, installation): estimate, deadlines, materials, warranty.'),
    fields: [
      ...cityDate(),
      ...partyFields('cu', 'customer', EX_A),
      ...partyFields('ex', 'executor', EX_B),
      { k: 'work', g: 'items', l: tr('Ishlar tavsifi', 'Описание работ', 'Works'), t: 'textarea', ex: 'офис биносининг 2-қаватидаги 4 та хонани жорий таъмирлаш (сувоқ, бўёқ, пол қопламасини алмаштириш)' },
      { k: 'site', g: 'items', l: tr('Obyekt manzili', 'Адрес объекта', 'Site address'), ex: 'Тошкент ш., Юнусобод тумани, Амир Темур кўчаси, 1-уй' },
      { k: 'price', g: 'payment', l: tr('Ishlar qiymati', 'Стоимость работ', 'Price'), t: 'money', ex: '85000000' },
      { k: 'mat', g: 'payment', l: tr('Materiallar', 'Материалы', 'Materials'), t: 'select', opts: ['Пудратчининг материалларидан (қийматга киритилган)', 'Буюртмачининг материалларидан'], ex: 'Пудратчининг материалларидан (қийматга киритилган)' },
      { k: 'start', g: 'payment', l: tr('Boshlanish', 'Начало', 'Start'), t: 'date', ex: '2026-10-12', half: true },
      { k: 'end', g: 'payment', l: tr('Tugash', 'Окончание', 'Finish'), t: 'date', ex: '2026-11-30', half: true },
      { k: 'adv', g: 'payment', l: tr('Avans, %', 'Аванс, %', 'Advance, %'), t: 'number', ex: '30', half: true },
      { k: 'warr', g: 'payment', l: tr('Kafolat muddati (oy)', 'Гарантия (мес.)', 'Warranty (months)'), t: 'number', ex: '12', half: true },
    ],
    render: c => `
      <h2>Пудрат шартномаси № ${c.x('no', 3)}</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`${partyIntro(c, 'cu', 'Буюртмачи')} бир томондан, ва ${partyIntro(c, 'ex', 'Пудратчи')} иккинчи томондан, ушбу шартномани қуйидагилар ҳақида туздилар:`)}
      ${ol([
        `Пудратчи Буюртмачининг топшириғига кўра ${c.x('site', 22)} манзилида қуйидаги ишларни бажаради: ${c.x('work', 30)}. Буюртмачи бажарилган ишларни қабул қилади ва ҳақини тўлайди.`,
        `Ишларнинг қиймати ${c.money('price')}. Ишлар ${c.x('mat', 22)} бажарилади.`,
        `Ишларни бажариш муддати: ${c.date('start')}дан ${c.date('end')}гача.`,
        `Буюртмачи шартнома қийматининг ${c.x('adv', 2)} фоизини аванс сифатида шартнома имзолангандан кейин 5 банк куни ичида, қолган қисмини бажарилган ишлар далолатномаси имзолангандан кейин 10 банк куни ичида тўлайди.`,
        'Бажарилган ишлар икки тараф имзолаган далолатнома билан топширилади. Камчиликлар аниқланса, Пудратчи уларни ўз ҳисобидан келишилган муддатда бартараф этади.',
        `Пудратчи бажарилган ишлар сифатига ${c.x('warr', 2)} ой кафолат беради.`,
        `Тарафлар мажбуриятларни бажармаганлик учун ${STD_LIABILITY}га мувофиқ жавоб берадилар. Низолар иқтисодий судда кўрилади.`,
        'Шартнома имзоланган кундан кучга киради ва икки нусхада тузилди.',
      ])}
      ${sigTable(reqCell(c, 'cu', 'Буюртмачи'), reqCell(c, 'ex', 'Пудратчи'))}`,
  },
  {
    id: 'reconciliation-act', cat: 'contracts', sub: 'annex', minutes: 5,
    docTitle: 'Ўзаро ҳисоб-китобларни солиштириш далолатномаси',
    title: tr('Solishtirma dalolatnoma (akt sverki)', 'Акт сверки взаиморасчётов', 'Reconciliation statement'),
    desc: tr('Davr boshidagi qoldiq, debet/kredit operatsiyalari va yakuniy qoldiq avtomatik hisoblanadi.', 'Начальное сальдо, обороты дебет/кредит и конечное сальдо считаются автоматически.', 'Opening balance, debit/credit entries and closing balance computed automatically.'),
    fields: [
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
      { k: 'c_ref', g: 'doc', l: tr('Shartnoma', 'Договор', 'Contract'), ex: '04.05.2026 йилдаги 45-сон', half: true },
      { k: 'from', g: 'doc', l: tr('Davr boshi', 'Начало периода', 'Period from'), t: 'date', ex: '2026-07-01', half: true },
      { k: 'to', g: 'doc', l: tr('Davr oxiri', 'Конец периода', 'Period to'), t: 'date', ex: '2026-09-30', half: true },
      ...partyFields('a', 'party1', EX_A).filter(f => ['a_name', 'a_pos', 'a_rep', 'a_stir'].includes(f.k)),
      ...partyFields('b', 'party2', EX_B).filter(f => ['b_name', 'b_pos', 'b_rep', 'b_stir'].includes(f.k)),
      { k: 'open', g: 'items', l: tr('Boshlangʻich qoldiq (1-tomon foydasiga, minus — 2-tomon)', 'Начальное сальдо (в пользу стороны 1, минус — стороны 2)', 'Opening balance (for party 1; minus = party 2)'), t: 'number', ex: '4500000' },
      { k: 'ops', g: 'items', l: tr('Operatsiyalar', 'Операции', 'Entries'), t: 'rows',
        cols: [{ k: 'd', l: L.date }, { k: 'doc', l: tr('Hujjat', 'Документ', 'Document') }, { k: 'dt', l: tr('Debet (1-tomon berdi)', 'Дебет (сторона 1 отгрузила)', 'Debit (party 1 supplied)'), num: true }, { k: 'kt', l: tr('Kredit (2-tomon toʻladi)', 'Кредит (сторона 2 оплатила)', 'Credit (party 2 paid)'), num: true }],
        ex: [{ d: '15.07.2026', doc: 'Ҳисобварақ-фактура № 101', dt: '20500000', kt: '' }, { d: '28.07.2026', doc: 'Тўлов топшириқномаси № 77', dt: '', kt: '15000000' }, { d: '12.09.2026', doc: 'Ҳисобварақ-фактура № 128', dt: '8200000', kt: '' }] },
    ],
    render: c => {
      const open = num(c.raw('open'));
      let dt = 0, kt = 0, body = '';
      c.rows('ops').forEach(r => {
        const d = num(r['dt']), k = num(r['kt']);
        dt += d; kt += k;
        body += `<tr><td>${c.span(esc(r['d'] ?? ''))}</td><td>${c.span(esc(r['doc'] ?? ''))}</td><td class="n">${d ? fmtMoney(d) : ''}</td><td class="n">${k ? fmtMoney(k) : ''}</td></tr>`;
      });
      const close = open + dt - kt;
      const side = close >= 0 ? c.x('a_name', 14) : c.x('b_name', 14);
      return `
      <h2>Ўзаро ҳисоб-китобларни солиштириш далолатномаси</h2>
      <p class="c">${c.date('from')}дан ${c.date('to')}гача бўлган давр учун<br>${c.x('c_ref', 16)} шартнома бўйича</p>
      ${p(`${c.x('a_name', 18)} (СТИР ${c.x('a_stir', 9)}) ва ${c.x('b_name', 18)} (СТИР ${c.x('b_stir', 9)}) ўртасидаги ҳисоб-китоблар солиштирилиб, қуйидагилар аниқланди:`)}
      <table class="t">
        <tr><th>Сана</th><th>Ҳужжат</th><th>Дебет</th><th>Кредит</th></tr>
        <tr><td colspan="2"><b>Давр бошидаги қолдиқ</b></td><td class="n">${open > 0 ? fmtMoney(open) : ''}</td><td class="n">${open < 0 ? fmtMoney(-open) : ''}</td></tr>
        ${body}
        <tr><td colspan="2"><b>Давр айланмаси</b></td><td class="n">${fmtMoney(dt)}</td><td class="n">${fmtMoney(kt)}</td></tr>
        <tr><td colspan="2"><b>Давр охиридаги қолдиқ</b></td><td class="n"><b>${close > 0 ? fmtMoney(close) : ''}</b></td><td class="n"><b>${close < 0 ? fmtMoney(-close) : ''}</b></td></tr>
      </table>
      ${p(close === 0 ? `${c.date('to')} ҳолатига тарафлар ўртасида қарздорлик йўқ.` : `${c.date('to')} ҳолатига ${side} фойдасига ${c.moneyN(Math.abs(close))} миқдорида қарздорлик мавжуд.`)}
      ${sigTable(`<b>${c.x('a_name', 16)}</b><br>${c.x('a_pos', 10)}<br><br>____________ ${c.x('a_rep', 16)}<br>М.Ў.`, `<b>${c.x('b_name', 16)}</b><br>${c.x('b_pos', 10)}<br><br>____________ ${c.x('b_rep', 16)}<br>М.Ў.`)}`;
    },
  },
  {
    id: 'termination-agreement', cat: 'contracts', sub: 'annex', minutes: 3,
    docTitle: 'Шартномани бекор қилиш тўғрисида келишув',
    title: tr('Shartnomani bekor qilish kelishuvi', 'Соглашение о расторжении договора', 'Termination agreement'),
    desc: tr('Tomonlar kelishuviga koʻra shartnomani bekor qilish: sana, hisob-kitob holati, daʼvolar yoʻqligi.', 'Расторжение договора по соглашению сторон: дата, расчёты, отсутствие претензий.', 'Mutual termination: date, settlement status, no further claims.'),
    fields: [
      ...cityDate(),
      ...partyFields('a', 'party1', EX_A).filter(f => !['a_acc', 'a_mfo', 'a_bank', 'a_phone'].includes(f.k)),
      ...partyFields('b', 'party2', EX_B).filter(f => !['b_acc', 'b_mfo', 'b_bank', 'b_phone'].includes(f.k)),
      { k: 'c_no', g: 'contract', l: tr('Shartnoma raqami', 'Номер договора', 'Contract No.'), ex: '45', half: true },
      { k: 'c_date', g: 'contract', l: tr('Shartnoma sanasi', 'Дата договора', 'Contract date'), t: 'date', ex: '2026-05-04', half: true },
      { k: 'c_kind', g: 'contract', l: tr('Shartnoma turi', 'Вид договора', 'Contract type'), ex: 'хизмат кўрсатиш' },
      { k: 'end', g: 'contract', l: tr('Bekor qilinish sanasi', 'Дата расторжения', 'Termination date'), t: 'date', ex: '2026-10-31', half: true },
      { k: 'calc', g: 'contract', l: tr('Hisob-kitob', 'Расчёты', 'Settlement'), t: 'select', opts: ['тарафлар ўртасида ҳисоб-китоблар тўлиқ амалга оширилган', 'қарздорлик ушбу келишувга иловадаги жадвал асосида узилади'], ex: 'тарафлар ўртасида ҳисоб-китоблар тўлиқ амалга оширилган', half: true },
    ],
    render: c => `
      <h2>${c.dshort('c_date')} йилдаги ${c.x('c_no', 3)}-сон шартномани бекор қилиш тўғрисида келишув № ${c.x('no', 3)}</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`${partyIntro(c, 'a', '1-тараф')} ва ${partyIntro(c, 'b', '2-тараф')} Ўзбекистон Республикаси Фуқаролик кодексининг шартномани ўзгартириш ва бекор қилишга оид нормаларига асосан ушбу келишувни туздилар:`)}
      ${ol([
        `Тарафлар ўртасида тузилган ${c.dshort('c_date')} йилдаги ${c.x('c_no', 3)}-сон ${c.x('c_kind', 14)} шартномаси тарафларнинг келишувига кўра ${c.date('end')}дан бекор қилинади.`,
        `Келишув имзоланган кунга ${c.x('calc', 24)}.`,
        'Бекор қилиш санасидан бошлаб тарафларнинг шартнома бўйича мажбуриятлари тугайди. Тарафлар бир-бирига нисбатан бошқа талаб ва эътирозларга эга эмас.',
        'Келишув шартноманинг ажралмас қисми ҳисобланади, имзоланган пайтдан кучга киради ва икки нусхада тузилди.',
      ])}
      ${sigTable(`<b>1-тараф</b><br>${c.x('a_name', 16)}<br>${c.x('a_pos', 10)}<br><br>____________ ${c.x('a_rep', 16)}<br>М.Ў.`, `<b>2-тараф</b><br>${c.x('b_name', 16)}<br>${c.x('b_pos', 10)}<br><br>____________ ${c.x('b_rep', 16)}<br>М.Ў.`)}`,
  },
];
