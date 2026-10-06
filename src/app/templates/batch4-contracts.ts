import { esc, fmtMoney, parseNum } from '../core/doc/format';
import { Ctx, itemsTable, meta, ol, p, partyIntro, reqCell, sigTable } from '../core/doc/engine';
import { DocTemplate, FieldDef } from '../core/doc/types';
import { EX_A, EX_B, ITEM_COLS, L, partyFields, STD_LIABILITY, tr } from './shared';

const head = (title: string, c: Ctx) => `<h2>${title} № ${c.x('no', 3)}</h2>${meta(c.x('city', 14), c.date('date'))}`;
const docF: FieldDef[] = [
  { k: 'no', g: 'doc', l: L.number, ex: '18', half: true },
  { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-06', half: true },
  { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент шаҳри' },
];
const court: FieldDef = { k: 'court', g: 'payment', l: tr('Sud', 'Суд', 'Court'), ex: 'Тошкент шаҳар иқтисодий суди' };
const end = (c: Ctx) => [
  `Тарафлар мажбуриятларни бажармаганлик учун ${STD_LIABILITY}га мувофиқ жавоб берадилар. Низолар талабнома тартибида, ҳал этилмаганда ${c.x('court', 18)}да кўрилади.`,
  'Шартнома имзоланган кундан кучга киради ва бир хил юридик кучга эга икки нусхада тузилди.',
];
const two = (c: Ctx, a: string, b: string, ra: string, rb: string) => p(`${partyIntro(c, a, ra)} бир томондан, ва ${partyIntro(c, b, rb)} иккинчи томондан, ушбу шартномани қуйидагилар ҳақида туздилар:`);
const sides = (c: Ctx, a: string, b: string, ra: string, rb: string) => sigTable(reqCell(c, a, ra), reqCell(c, b, rb));
const short = (pfx: string, g: string, ex = EX_A) => partyFields(pfx, g, ex).filter(f => [pfx + '_name', pfx + '_pos', pfx + '_rep', pfx + '_stir', pfx + '_addr'].includes(f.k));
const sideShort = (c: Ctx, pfx: string, role: string) => `<b>${role}</b><br>${c.x(pfx + '_name', 16)}<br>СТИР ${c.x(pfx + '_stir', 9)}<br>${c.x(pfx + '_pos', 10)}<br><br>____________ ${c.x(pfx + '_rep', 16)}<br>М.Ў.`;

export const BATCH4_CONTRACTS: DocTemplate[] = [
  {
    id: 'commission', cat: 'contracts', sub: 'legal', minutes: 6,
    docTitle: 'Комиссия шартномаси',
    title: tr('Komissiya shartnomasi', 'Договор комиссии', 'Commission agreement'),
    desc: tr('Komissioner tovarni oʻz nomidan, komitent hisobidan sotadi: tovarlar, komissiya %, hisobot.', 'Комиссионер продаёт товар от своего имени за счёт комитента: товары, вознаграждение %, отчёт.', 'Agent sells goods in its own name for the principal: goods, fee %, reporting.'),
    fields: [
      ...docF,
      ...partyFields('cm', 'principal', EX_A),
      ...partyFields('ag', 'agent', EX_B),
      { k: 'items', g: 'items', l: tr('Tovarlar', 'Товары', 'Goods'), t: 'rows', cols: ITEM_COLS, ex: [{ name: 'Аёллар сумкаси (чарм)', unit: 'дона', qty: '60', price: '450000' }] },
      { k: 'fee', g: 'payment', l: tr('Komissiya haqi, %', 'Вознаграждение, %', 'Commission, %'), t: 'number', ex: '15', half: true },
      { k: 'days', g: 'payment', l: tr('Pulni oʻtkazish (bank kuni)', 'Перечисление (банк. дней)', 'Remit within (bank days)'), t: 'number', ex: '5', half: true },
      court,
    ],
    render: c => {
      const t = itemsTable(c, 'items');
      return `${head('Комиссия шартномаси', c)}
      ${two(c, 'cm', 'ag', 'Комитент', 'Комиссионер')}
      ${p('1. Комиссионер Комитентнинг топшириғига кўра ҳақ эвазига ўз номидан, лекин Комитент ҳисобидан қуйидаги товарларни сотиш мажбуриятини олади:')}
      ${t.html}
      ${ol([
        `Товарларнинг умумий сотиш қиймати ${c.moneyN(t.total)}. Комиссионер товарларни кўрсатилган нархлардан паст бўлмаган нархда сотади.`,
        `Комиссионернинг ҳақи сотилган товарлар қийматининг ${c.x('fee', 2)} фоизини ташкил этади ва Комитентга ўтказиладиган маблағдан ушлаб қолинади.`,
        `Комиссионер товарлар сотилгандан кейин ${c.x('days', 2)} банк куни ичида тушган маблағни (ўз ҳақини чегирган ҳолда) Комитентга ўтказади ва ҳар ойда комиссионер ҳисоботини тақдим этади.`,
        'Товарларга бўлган мулк ҳуқуқи улар учинчи шахсга сотилгунга қадар Комитентда қолади. Комиссионер ўзида сақланаётган товарларнинг бутлиги учун жавоб беради.',
        ...end(c),
      ], 2)}
      ${sides(c, 'cm', 'ag', 'Комитент', 'Комиссионер')}`;
    },
  },
  {
    id: 'mandate', cat: 'contracts', sub: 'legal', minutes: 5,
    docTitle: 'Топшириқ шартномаси',
    title: tr('Topshiriq shartnomasi', 'Договор поручения', 'Mandate agreement'),
    desc: tr('Vakil ishonch bildiruvchi nomidan va hisobidan muayyan yuridik harakatlarni bajaradi.', 'Поверенный совершает юридические действия от имени и за счёт доверителя.', 'An attorney performs legal acts in the name and at the expense of the principal.'),
    fields: [
      ...docF,
      ...partyFields('pr', 'principal', EX_A),
      ...partyFields('ag', 'agent', EX_B),
      { k: 'task', g: 'items', l: tr('Topshiriq mazmuni', 'Содержание поручения', 'Mandate'), t: 'textarea', ex: 'Ишонч билдирувчи номидан божхона органларида импорт қилинган товарларни расмийлаштириш, зарур ҳужжатларни тайёрлаш ва топшириш' },
      { k: 'fee', g: 'payment', l: tr('Vakil haqi', 'Вознаграждение', 'Fee'), t: 'money', ex: '6000000', half: true },
      { k: 'until', g: 'payment', l: tr('Muddat', 'Срок', 'Until'), t: 'date', ex: '2026-12-31', half: true },
      court,
    ],
    render: c => `${head('Топшириқ шартномаси', c)}
      ${two(c, 'pr', 'ag', 'Ишонч билдирувчи', 'Вакил')}
      ${ol([
        `Вакил Ишонч билдирувчининг номидан ва унинг ҳисобидан қуйидаги ҳаракатларни амалга ошириш мажбуриятини олади: ${c.x('task', 30)}.`,
        'Ишонч билдирувчи Вакилга зарур ишончнома ва ҳужжатларни беради, топшириқни бажариш билан боғлиқ асосли харажатларни қоплайди.',
        `Вакилнинг ҳақи ${c.money('fee')} бўлиб, топшириқ бажарилгани тўғрисидаги ҳисобот қабул қилингандан кейин 5 банк куни ичида тўланади.`,
        'Вакил топшириқни шахсан, Ишонч билдирувчининг кўрсатмаларига мувофиқ бажаради, унинг талабига кўра топшириқнинг бориши ҳақида маълумот беради ва олинган барча нарсаларни кечиктирмай топширади.',
        `Шартнома ${c.date('until')}гача амал қилади.`,
        ...end(c),
      ])}
      ${sides(c, 'pr', 'ag', 'Ишонч билдирувчи', 'Вакил')}`,
  },
  {
    id: 'software-dev', cat: 'contracts', sub: 'legal', minutes: 8,
    docTitle: 'Дастурий маҳсулот ишлаб чиқиш шартномаси',
    title: tr('Dasturiy taʼminot ishlab chiqish shartnomasi', 'Договор на разработку ПО', 'Software development agreement'),
    desc: tr('Sayt yoki ilova ishlab chiqish: bosqichlar va toʻlovlar jadvali, huquqlar oʻtishi, kafolat.', 'Разработка сайта или приложения: этапы и платежи, переход прав, гарантия.', 'Website or app development: milestones and payments, IP transfer, warranty.'),
    fields: [
      ...docF,
      ...partyFields('cu', 'customer', EX_A),
      ...partyFields('ex', 'executor', EX_B),
      { k: 'what', g: 'items', l: tr('Mahsulot', 'Продукт', 'Product'), t: 'textarea', ex: 'Буюртмачининг интернет-дўкони (веб-сайт ва мобил илова), техник топшириққа мувофиқ (1-илова)' },
      { k: 'stages', g: 'items', l: tr('Bosqichlar', 'Этапы', 'Milestones'), t: 'rows',
        cols: [{ k: 'name', l: tr('Bosqich', 'Этап', 'Stage') }, { k: 'due', l: tr('Muddat', 'Срок', 'Due') }, { k: 'sum', l: tr('Summa', 'Сумма', 'Amount'), num: true }],
        ex: [{ name: 'Дизайн-макетлар', due: '31.10.2026', sum: '15000000' }, { name: 'Веб-сайт ва бошқарув панели', due: '15.12.2026', sum: '35000000' }, { name: 'Мобил илова ва ишга тушириш', due: '31.01.2027', sum: '30000000' }] },
      { k: 'warr', g: 'payment', l: tr('Kafolat (oy)', 'Гарантия (мес.)', 'Warranty (months)'), t: 'number', ex: '6', half: true },
      court,
    ],
    render: c => {
      let total = 0;
      const rows = c.rows('stages').filter(r => (r['name'] ?? '').trim());
      const body = rows.map((r, i) => { const n = parseNum(r['sum'] ?? ''); if (isFinite(n)) total += n; return `<tr><td class="n">${i + 1}</td><td>${c.span(esc(r['name']))}</td><td>${c.span(esc(r['due'] ?? ''))}</td><td class="n">${isFinite(n) ? fmtMoney(n) : ''}</td></tr>`; }).join('');
      return `${head('Дастурий маҳсулот ишлаб чиқиш шартномаси', c)}
      ${two(c, 'cu', 'ex', 'Буюртмачи', 'Бажарувчи')}
      ${p(`1. Бажарувчи ${c.x('what', 30)}ни (кейинги ўринларда «Маҳсулот») ишлаб чиқади ва Буюртмачига топширади, Буюртмачи эса уни қабул қилиб, ҳақини тўлайди. Ишлар қуйидаги босқичларда бажарилади:`)}
      <table class="t"><tr><th>№</th><th>Босқич</th><th>Муддат</th><th>Сумма</th></tr>${body}<tr><td></td><td colspan="2"><b>Жами</b></td><td class="n"><b>${fmtMoney(total)}</b></td></tr></table>
      ${ol([
        `Шартноманинг умумий қиймати ${c.moneyN(total)}. Ҳар бир босқич ҳақи шу босқич бўйича бажарилган ишлар далолатномаси имзолангандан кейин 5 банк куни ичида тўланади.`,
        'Буюртмачи босқич натижасини 5 иш куни ичида кўриб чиқади ва уни қабул қилади ёки асосланган эътирозларини ёзма юборади.',
        'Маҳсулотга (дастур коди, дизайн ва ҳужжатларга) бўлган мулкий ҳуқуқлар тўлиқ ҳақ тўлангандан кейин Буюртмачига ўтади.',
        `Бажарувчи Маҳсулот топширилгандан кейин ${c.x('warr', 2)} ой давомида аниқланган хатоларни бепул тузатади.`,
        'Тарафлар бир-бирининг махфий маълумотларини ошкор қилмайди.',
        ...end(c),
      ], 2)}
      ${sides(c, 'cu', 'ex', 'Буюртмачи', 'Бажарувчи')}`;
    },
  },
  {
    id: 'pledge', cat: 'contracts', sub: 'legal', minutes: 6,
    docTitle: 'Гаров шартномаси',
    title: tr('Garov shartnomasi', 'Договор залога', 'Pledge agreement'),
    desc: tr('Asosiy majburiyatni garov bilan taʼminlash: garov predmeti, baholangan qiymat, undirish tartibi.', 'Обеспечение обязательства залогом: предмет, оценка, обращение взыскания.', 'Securing an obligation with a pledge: collateral, valuation, enforcement.'),
    fields: [
      ...docF,
      ...partyFields('pg', 'party1', EX_A),
      ...partyFields('pe', 'party2', EX_B),
      { k: 'main', g: 'contract', l: tr('Asosiy shartnoma', 'Основной договор', 'Main contract'), ex: '06.10.2026 йилдаги 17-сон қарз шартномаси' },
      { k: 'debt', g: 'contract', l: tr('Taʼminlanadigan summa', 'Обеспечиваемая сумма', 'Secured amount'), t: 'money', ex: '100000000' },
      { k: 'obj', g: 'object', l: tr('Garov predmeti', 'Предмет залога', 'Collateral'), t: 'textarea', ex: 'Гаровга қўювчининг балансидаги юк автомобили ISUZU NPR, 2022 йил, давлат рақам белгиси 01 777 ААА' },
      { k: 'value', g: 'object', l: tr('Baholangan qiymati', 'Оценочная стоимость', 'Valuation'), t: 'money', ex: '180000000', half: true },
      { k: 'keep', g: 'object', l: tr('Garov kimda qoladi', 'У кого остаётся', 'Kept by'), t: 'select', opts: ['Гаровга қўювчида қолади', 'Гаровга олувчига топширилади'], ex: 'Гаровга қўювчида қолади', half: true },
      court,
    ],
    render: c => `${head('Гаров шартномаси', c)}
      ${two(c, 'pg', 'pe', 'Гаровга қўювчи', 'Гаровга олувчи')}
      ${ol([
        `Гаровга қўювчи ${c.x('main', 22)} бўйича ${c.money('debt')} миқдоридаги мажбуриятнинг бажарилишини таъминлаш учун ўзига тегишли ${c.x('obj', 26)}ни (кейинги ўринларда «Гаров предмети») гаровга қўяди.`,
        `Тарафлар келишувига кўра Гаров предметининг қиймати ${c.money('value')}.`,
        `Гаров предмети ${c.x('keep', 18)}. Гаровга қўювчи Гаров предметини Гаровга олувчининг розилигисиз бегоналаштирмайди, қайта гаровга қўймайди ва уни сақлаш учун зарур чораларни кўради.`,
        'Асосий мажбурият бажарилмаганда Гаровга олувчи Гаров предметига суд ёки қонунчиликда назарда тутилган бошқа тартибда ундирувни қаратиш ҳуқуқига эга.',
        'Гаров асосий мажбурият тўлиқ бажарилганда бекор бўлади. Қонунчиликда талаб этилганда гаров тегишли реестрда рўйхатдан ўтказилади.',
        ...end(c),
      ])}
      ${sides(c, 'pg', 'pe', 'Гаровга қўювчи', 'Гаровга олувчи')}`,
  },
  {
    id: 'surety', cat: 'contracts', sub: 'legal', minutes: 5,
    docTitle: 'Кафиллик шартномаси',
    title: tr('Kafillik shartnomasi', 'Договор поручительства', 'Surety agreement'),
    desc: tr('Kafil qarzdorning majburiyati uchun kreditor oldida javob berishi: summa, javobgarlik turi, muddat.', 'Поручитель отвечает перед кредитором за должника: сумма, вид ответственности, срок.', 'A guarantor answers to the creditor for the debtor: amount, liability type, term.'),
    fields: [
      ...docF,
      ...partyFields('su', 'party1', EX_B),
      ...short('cr', 'party2', EX_A),
      { k: 'debtor', g: 'contract', l: tr('Qarzdor', 'Должник', 'Debtor'), ex: '«Учинчи Мисол» МЧЖ (СТИР 303111222)' },
      { k: 'main', g: 'contract', l: tr('Asosiy shartnoma', 'Основной договор', 'Main contract'), ex: '06.10.2026 йилдаги 15-сон етказиб бериш шартномаси' },
      { k: 'debt', g: 'contract', l: tr('Kafillik summasi', 'Сумма поручительства', 'Amount'), t: 'money', ex: '75000000', half: true },
      { k: 'kind', g: 'contract', l: tr('Javobgarlik', 'Ответственность', 'Liability'), t: 'select', opts: ['солидар', 'субсидиар'], ex: 'солидар', half: true },
      { k: 'until', g: 'contract', l: tr('Kafillik muddati', 'Срок поручительства', 'Valid until'), t: 'date', ex: '2027-10-06' },
      court,
    ],
    render: c => `${head('Кафиллик шартномаси', c)}
      ${p(`${partyIntro(c, 'su', 'Кафил')} бир томондан, ва ${c.x('cr_name', 18)} (кейинги ўринларда «Кредитор») номидан ${c.x('cr_pos', 8)} ${c.x('cr_rep', 18)} иккинчи томондан, ушбу шартномани қуйидагилар ҳақида туздилар:`)}
      ${ol([
        `Кафил ${c.x('debtor', 20)} (кейинги ўринларда «Қарздор») томонидан ${c.x('main', 22)} бўйича мажбуриятлар бажарилиши учун Кредитор олдида ${c.money('debt')} доирасида жавоб беради.`,
        `Кафил ва Қарздор Кредитор олдида ${c.x('kind', 8)} жавобгар бўлади.`,
        'Қарздор мажбуриятни бажармаганда Кредитор Кафилга ёзма талаб юборади. Кафил талабни олган кундан бошлаб 10 банк куни ичида уни бажаради.',
        'Мажбуриятни бажарган Кафилга Кредиторнинг Қарздорга нисбатан ҳуқуқлари ўтади. Кредитор Кафилга зарур ҳужжатларни топширади.',
        `Кафиллик ${c.date('until')}гача амал қилади ва асосий мажбурият бекор бўлганда тугайди.`,
        ...end(c),
      ])}
      ${sigTable(reqCell(c, 'su', 'Кафил'), sideShort(c, 'cr', 'Кредитор'))}`,
  },
  {
    id: 'assignment', cat: 'contracts', sub: 'legal', minutes: 5,
    docTitle: 'Талаб ҳуқуқини ўтказиш (цессия) шартномаси',
    title: tr('Talabni oʻtkazish (sessiya) shartnomasi', 'Договор уступки права требования (цессия)', 'Assignment of claim'),
    desc: tr('Kreditor qarzdordan talab qilish huquqini yangi kreditorga oʻtkazadi: qarz, narx, hujjatlar.', 'Кредитор уступает право требования новому кредитору: долг, цена, документы.', 'A creditor assigns its claim to a new creditor: debt, price, documents.'),
    fields: [
      ...docF,
      ...partyFields('ce', 'party1', EX_A),
      ...partyFields('cs', 'party2', EX_B),
      { k: 'debtor', g: 'contract', l: tr('Qarzdor', 'Должник', 'Debtor'), ex: '«Учинчи Мисол» МЧЖ (СТИР 303111222)' },
      { k: 'main', g: 'contract', l: tr('Talab asosi', 'Основание требования', 'Underlying contract'), ex: '04.05.2026 йилдаги 45-сон олди-сотди шартномаси' },
      { k: 'debt', g: 'contract', l: tr('Talab summasi', 'Сумма требования', 'Claim amount'), t: 'money', ex: '40000000', half: true },
      { k: 'price', g: 'payment', l: tr('Oʻtkazish narxi', 'Цена уступки', 'Price'), t: 'money', ex: '36000000', half: true },
      court,
    ],
    render: c => `${head('Талаб ҳуқуқини ўтказиш (цессия) шартномаси', c)}
      ${two(c, 'ce', 'cs', 'Цедент', 'Цессионарий')}
      ${ol([
        `Цедент ${c.x('main', 22)} асосида ${c.x('debtor', 20)}дан (кейинги ўринларда «Қарздор») ${c.money('debt')} миқдоридаги қарзни талаб қилиш ҳуқуқини Цессионарийга ўтказади.`,
        'Цессионарийга талаб ҳуқуқи у ўтказилган пайтда мавжуд бўлган ҳажмда ва шартларда, шу жумладан мажбуриятнинг бажарилишини таъминловчи ҳуқуқлар билан бирга ўтади.',
        `Цессионарий талаб ҳуқуқи учун Цедентга ${c.money('price')}ни шартнома имзолангандан кейин 10 банк куни ичида тўлайди.`,
        'Цедент шартнома имзоланган кундан бошлаб 5 иш куни ичида талабни тасдиқловчи барча ҳужжатларни Цессионарийга далолатнома бўйича топширади ва Қарздорни ҳуқуқ ўтказилгани ҳақида ёзма хабардор қилади.',
        'Цедент ўтказилаётган талабнинг ҳақиқийлиги учун жавоб беради, лекин Қарздор томонидан унинг бажарилиши учун жавоб бермайди.',
        ...end(c),
      ])}
      ${sides(c, 'ce', 'cs', 'Цедент', 'Цессионарий')}`,
  },
  {
    id: 'offset-act', cat: 'contracts', sub: 'annex', minutes: 3,
    docTitle: 'Ўзаро талабларни ҳисобга олиш далолатномаси',
    title: tr('Oʻzaro talablarni hisobga olish dalolatnomasi', 'Акт взаимозачёта', 'Mutual offset statement'),
    desc: tr('Ikki tomonning bir-biriga qarzlari hisobga olinadi; qolgan qarz avtomatik.', 'Зачёт встречных долгов сторон; остаток считается автоматически.', 'Offset of the parties’ mutual debts; the remaining balance is computed.'),
    fields: [
      ...docF,
      ...short('a', 'party1', EX_A),
      ...short('b', 'party2', EX_B),
      { k: 'a_owes', g: 'contract', l: tr('1-tomonning 2-tomonga qarzi', 'Долг стороны 1 перед стороной 2', 'Party 1 owes party 2'), t: 'money', ex: '12000000', half: true },
      { k: 'a_basis', g: 'contract', l: tr('Asos', 'Основание', 'Basis'), ex: '01.07.2026 йилдаги 30-сон хизмат шартномаси', half: true },
      { k: 'b_owes', g: 'contract', l: tr('2-tomonning 1-tomonga qarzi', 'Долг стороны 2 перед стороной 1', 'Party 2 owes party 1'), t: 'money', ex: '20500000', half: true },
      { k: 'b_basis', g: 'contract', l: tr('Asos', 'Основание', 'Basis'), ex: '04.05.2026 йилдаги 45-сон олди-сотди шартномаси', half: true },
    ],
    render: c => {
      const a = c.num('a_owes'), b = c.num('b_owes');
      const off = isFinite(a) && isFinite(b) ? Math.min(a, b) : NaN;
      const rest = isFinite(a) && isFinite(b) ? Math.abs(a - b) : NaN;
      return `${head('Ўзаро талабларни ҳисобга олиш далолатномаси', c)}
      ${p(`${c.x('a_name', 18)} (1-тараф) ва ${c.x('b_name', 18)} (2-тараф) Ўзбекистон Республикаси Фуқаролик кодексининг қарама-қарши бир хил турдаги талабни ҳисобга олишга оид нормаларига мувофиқ қуйидагилар ҳақида далолатнома туздилар:`)}
      ${ol([
        `1-тарафнинг 2-тарафга ${c.x('a_basis', 22)} бўйича қарзи ${c.money('a_owes')}.`,
        `2-тарафнинг 1-тарафга ${c.x('b_basis', 22)} бўйича қарзи ${c.money('b_owes')}.`,
        `Тарафлар ${c.moneyN(off)} миқдоридаги ўзаро талабларни ҳисобга оладилар.`,
        rest ? `Ҳисобга олишдан кейин ${a > b ? '1-тарафнинг 2-тарафга' : '2-тарафнинг 1-тарафга'} қарзи ${c.moneyN(rest)}ни ташкил этади.` : 'Ҳисобга олишдан кейин тарафларнинг бир-бирига қарзи қолмайди.',
        'Далолатнома икки нусхада тузилди ва имзоланган пайтдан кучга киради.',
      ])}
      ${sigTable(sideShort(c, 'a', '1-тараф'), sideShort(c, 'b', '2-тараф'))}`;
    },
  },
  {
    id: 'barter', cat: 'contracts', sub: 'legal', minutes: 6,
    docTitle: 'Айирбошлаш шартномаси',
    title: tr('Ayirboshlash (barter) shartnomasi', 'Договор мены (бартер)', 'Barter agreement'),
    desc: tr('Ikki tomon tovarlarini bir-biriga almashtiradi: ikkala roʻyxat, qiymat farqi avtomatik.', 'Обмен товарами: два перечня, разница в стоимости — автоматически.', 'Exchange of goods: two lists, value difference computed.'),
    fields: [
      ...docF,
      ...partyFields('a', 'party1', EX_A),
      ...partyFields('b', 'party2', EX_B),
      { k: 'ga', g: 'items', l: tr('1-tomon beradi', 'Передаёт сторона 1', 'Party 1 gives'), t: 'rows', cols: ITEM_COLS, ex: [{ name: 'Цемент М400', unit: 'тонна', qty: '20', price: '1100000' }] },
      { k: 'gb', g: 'items', l: tr('2-tomon beradi', 'Передаёт сторона 2', 'Party 2 gives'), t: 'rows', cols: ITEM_COLS, ex: [{ name: 'Арматура Ø12', unit: 'тонна', qty: '2.5', price: '8400000' }] },
      court,
    ],
    render: c => {
      const ta = itemsTable(c, 'ga'), tb = itemsTable(c, 'gb');
      const diff = ta.total - tb.total;
      return `${head('Айирбошлаш шартномаси', c)}
      ${two(c, 'a', 'b', '1-тараф', '2-тараф')}
      ${p('1. 1-тараф 2-тарафга қуйидаги товарларни беради:')}${ta.html}
      ${p('2. 2-тараф 1-тарафга қуйидаги товарларни беради:')}${tb.html}
      ${ol([
        `1-тараф берадиган товарлар қиймати ${c.moneyN(ta.total)}, 2-тараф берадиган товарлар қиймати ${c.moneyN(tb.total)}. ${diff ? `Қиймат фарқи ${c.moneyN(Math.abs(diff))}ни ${diff > 0 ? '2-тараф 1-тарафга' : '1-тараф 2-тарафга'} товарлар топширилгандан кейин 5 банк куни ичида тўлайди.` : 'Товарлар тенг қийматли деб топилди.'}`,
        'Ҳар бир тараф товарларни ҳисобварақ-фактура ва топшириш-қабул қилиш далолатномаси асосида 10 кун ичида топширади. Мулк ҳуқуқи иккала тараф ҳам ўз мажбуриятини бажарган пайтдан ўтади.',
        ...end(c),
      ], 3)}
      ${sides(c, 'a', 'b', '1-тараф', '2-тараф')}`;
    },
  },
];
