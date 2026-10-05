import { esc, fmtMoney, parseNum } from '../core/doc/format';
import { Ctx, itemsTable, meta, ol, p, partyIntro, reqCell, sigTable } from '../core/doc/engine';
import { DocTemplate, FieldDef } from '../core/doc/types';
import { EX_A, EX_B, ITEM_COLS, L, partyFields, personCell, personFields, STD_LIABILITY, tr, vehicleFields, vehicleText } from './shared';

const head = (title: string, c: Ctx) => `<h2>${title} № ${c.x('no', 3)}</h2>${meta(c.x('city', 14), c.date('date'))}`;
const docFields: FieldDef[] = [
  { k: 'no', g: 'doc', l: L.number, ex: '12', half: true },
  { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
  { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент шаҳри' },
];
const court: FieldDef = { k: 'court', g: 'payment', l: tr('Sud', 'Суд', 'Court'), ex: 'Тошкент шаҳар иқтисодий суди' };
const closing = (c: Ctx) => [
  `Тарафлар мажбуриятларни бажармаганлик ёки лозим даражада бажармаганлик учун ${STD_LIABILITY}га мувофиқ жавоб берадилар.`,
  `Низолар талабнома тартибида, ҳал этилмаганда ${c.x('court', 18)}да кўрилади.`,
  'Шартнома имзоланган кундан кучга киради, мажбуриятлар тўлиқ бажарилгунга қадар амал қилади ва бир хил юридик кучга эга икки нусхада тузилди.',
];
const P1 = { fio: 'Юсупов Шерзод Анварович', pass: 'AC 7654321, Миробод тумани ИИБ, 10.02.2017', addr: 'Тошкент ш., Миробод тумани, Нукус кўчаси, 20-уй, 21-хонадон' };
const P2 = { fio: 'Алиев Тимур Рустамович', pass: 'AB 1234567, Чилонзор тумани ИИБ, 12.08.2018', addr: 'Тошкент ш., Чилонзор тумани, 5-мавзе, 3-уй, 7-хонадон' };

export const BATCH3_CONTRACTS: DocTemplate[] = [
  {
    id: 'cargo', cat: 'contracts', sub: 'legal', minutes: 6,
    docTitle: 'Юк ташиш шартномаси',
    title: tr('Yuk tashish shartnomasi', 'Договор перевозки груза', 'Freight agreement'),
    desc: tr('Avtotransportda yuk tashish: yoʻnalish, yuk, tarif, yuklash-tushirish, butlik uchun javobgarlik.', 'Автоперевозка груза: маршрут, груз, тариф, погрузка, ответственность за сохранность.', 'Road freight: route, cargo, rate, loading, liability for safety.'),
    fields: [
      ...docFields,
      ...partyFields('cu', 'customer', EX_A),
      ...partyFields('ex', 'executor', EX_B),
      { k: 'cargo', g: 'items', l: tr('Yuk', 'Груз', 'Cargo'), ex: 'озиқ-овқат маҳсулотлари (қадоқланган), 10 тоннагача' },
      { k: 'from', g: 'items', l: tr('Qayerdan', 'Откуда', 'From'), ex: 'Тошкент ш., Юнусобод тумани', half: true },
      { k: 'to', g: 'items', l: tr('Qayerga', 'Куда', 'To'), ex: 'Самарқанд ш., Сиёб тумани', half: true },
      { k: 'rate', g: 'payment', l: tr('Bir reys narxi', 'Цена за рейс', 'Price per trip'), t: 'money', ex: '3500000', half: true },
      { k: 'days', g: 'payment', l: tr('Toʻlov muddati (bank kuni)', 'Срок оплаты (банк. дней)', 'Payment term (bank days)'), t: 'number', ex: '5', half: true },
      { k: 'until', g: 'payment', l: tr('Shartnoma muddati', 'Срок договора', 'Valid until'), t: 'date', ex: '2026-12-31', half: true },
      court,
    ],
    render: c => `
      ${head('Юк ташиш шартномаси', c)}
      ${p(`${partyIntro(c, 'cu', 'Юк жўнатувчи')} бир томондан, ва ${partyIntro(c, 'ex', 'Ташувчи')} иккинчи томондан, ушбу шартномани қуйидагилар ҳақида туздилар:`)}
      ${ol([
        `Ташувчи Юк жўнатувчининг буюртманомаларига асосан ${c.x('cargo', 24)}ни ${c.x('from', 14)}дан ${c.x('to', 14)}га ўз автотранспортида ташиш, Юк жўнатувчи эса ташиш ҳақини тўлаш мажбуриятини олади.`,
        `Бир рейс учун ташиш ҳақи ${c.money('rate')}. Тўлов ҳар бир рейс бажарилгандан ва товар-транспорт юк хати имзолангандан кейин ${c.x('days', 2)} банк куни ичида амалга оширилади.`,
        'Юкни ортиш Юк жўнатувчи, тушириш юк олувчи томонидан амалга оширилади. Ташувчи юкни қабул қилган пайтдан топширгунга қадар унинг бутлиги учун жавоб беради.',
        'Ташувчи транспорт воситасининг техник соз бўлиши, ҳайдовчининг тегишли ҳужжатлари ва йўл ҳаракати қоидаларига риоя этилишини таъминлайди.',
        'Юк йўқолган ёки шикастланган тақдирда Ташувчи ҳақиқий зарарни юкнинг ҳужжатлардаги қиймати доирасида қоплайди.',
        ...closing(c),
        `Шартнома ${c.date('until')}гача амал қилади.`,
      ])}
      ${sigTable(reqCell(c, 'cu', 'Юк жўнатувчи'), reqCell(c, 'ex', 'Ташувчи'))}`,
  },
  {
    id: 'storage', cat: 'contracts', sub: 'legal', minutes: 5,
    docTitle: 'Сақлаш шартномаси',
    title: tr('Saqlash shartnomasi', 'Договор хранения', 'Storage agreement'),
    desc: tr('Omborda tovar saqlash: tovarlar roʻyxati, oylik haq, saqlash shartlari, qaytarish.', 'Хранение товаров на складе: перечень, плата в месяц, условия, возврат.', 'Warehouse storage: list of goods, monthly fee, conditions, return.'),
    fields: [
      ...docFields,
      ...partyFields('cu', 'customer', EX_A),
      ...partyFields('ex', 'executor', EX_B),
      { k: 'items', g: 'items', l: tr('Saqlanadigan tovarlar', 'Товары на хранение', 'Goods'), t: 'rows', cols: ITEM_COLS,
        ex: [{ name: 'Маиший техника (кир ювиш машинаси)', unit: 'дона', qty: '25', price: '4200000' }] },
      { k: 'place', g: 'object', l: tr('Ombor manzili', 'Адрес склада', 'Warehouse address'), ex: 'Тошкент ш., Сергели тумани, Янги Сергели кўчаси, 2-уй' },
      { k: 'fee', g: 'payment', l: tr('Oylik saqlash haqi', 'Плата в месяц', 'Monthly fee'), t: 'money', ex: '6000000', half: true },
      { k: 'until', g: 'payment', l: tr('Saqlash muddati (gacha)', 'Срок хранения (до)', 'Store until'), t: 'date', ex: '2027-03-31', half: true },
      court,
    ],
    render: c => {
      const t = itemsTable(c, 'items');
      return `
      ${head('Сақлаш шартномаси', c)}
      ${p(`${partyIntro(c, 'cu', 'Юк эгаси')} бир томондан, ва ${partyIntro(c, 'ex', 'Сақловчи')} иккинчи томондан, ушбу шартномани қуйидагилар ҳақида туздилар:`)}
      ${p(`1. Сақловчи Юк эгаси топширган қуйидаги товарларни ${c.x('place', 22)} манзилидаги омборда ${c.date('until')}гача сақлаш ва уларни бутлигича қайтариш мажбуриятини олади:`)}
      ${t.html}
      ${ol([
        `Сақланадиган товарларнинг умумий баҳоланган қиймати ${c.moneyN(t.total)}.`,
        `Сақлаш ҳақи ойига ${c.money('fee')} бўлиб, ҳар ойнинг 10-санасигача тўланади.`,
        'Товарлар топшириш-қабул қилиш далолатномаси асосида қабул қилинади ва қайтарилади. Сақловчи товарларни ёнғин, намлик ва ўғирликдан ҳимоя қилиш учун зарур шароитларни таъминлайди.',
        'Товарлар йўқолган ёки шикастланган тақдирда Сақловчи уларнинг баҳоланган қиймати миқдорида зарарни қоплайди.',
        ...closing(c),
      ], 2)}
      ${sigTable(reqCell(c, 'cu', 'Юк эгаси'), reqCell(c, 'ex', 'Сақловчи'))}`;
    },
  },
  {
    id: 'nda', cat: 'contracts', sub: 'legal', minutes: 4,
    docTitle: 'Махфийлик тўғрисида келишув',
    title: tr('Maxfiylik toʻgʻrisida kelishuv (NDA)', 'Соглашение о конфиденциальности (NDA)', 'Non-disclosure agreement'),
    desc: tr('Tijorat sirini oshkor qilmaslik: maxfiy maʼlumot, maqsad, muddat, jarima.', 'Неразглашение коммерческой тайны: информация, цель, срок, штраф.', 'Non-disclosure of trade secrets: information, purpose, term, penalty.'),
    fields: [
      ...docFields,
      ...partyFields('a', 'party1', EX_A).filter(f => !['a_acc', 'a_mfo', 'a_bank'].includes(f.k)),
      ...partyFields('b', 'party2', EX_B).filter(f => !['b_acc', 'b_mfo', 'b_bank'].includes(f.k)),
      { k: 'goal', g: 'terms', l: tr('Maqsad', 'Цель', 'Purpose'), ex: 'қўшма лойиҳа бўйича ҳамкорлик имкониятларини ўрганиш' },
      { k: 'years', g: 'terms', l: tr('Maxfiylik muddati (yil)', 'Срок конфиденциальности (лет)', 'Confidentiality term (years)'), t: 'number', ex: '3', half: true },
      { k: 'fine', g: 'terms', l: tr('Jarima', 'Штраф', 'Penalty'), t: 'money', ex: '50000000', half: true },
      court,
    ],
    render: c => `
      ${head('Махфийлик тўғрисида келишув', c)}
      ${p(`${partyIntro(c, 'a', '1-тараф')} ва ${partyIntro(c, 'b', '2-тараф')} ${c.x('goal', 24)} мақсадида ушбу келишувни туздилар:`)}
      ${ol([
        'Махфий маълумот деганда тарафлар бир-бирига ёзма, оғзаки ёки электрон шаклда тақдим этадиган тижорат, молиявий, техник, мижозларга оид ва бошқа маълумотлар тушунилади, оммавий манбалардан эркин олиш мумкин бўлган маълумотлар бундан мустасно.',
        `Тарафлар махфий маълумотдан фақат ${c.x('goal', 20)} мақсадида фойдаланишга, уни учинчи шахсларга иккинчи тарафнинг ёзма розилигисиз ошкор қилмасликка мажбурдирлар.`,
        'Махфий маълумотга фақат уни билиши зарур бўлган ходимлар киритилади. Тараф ўз ходимларининг ушбу келишувга риоя қилиши учун жавоб беради.',
        'Қонунчиликда белгиланган ҳолларда ваколатли давлат органларига маълумот тақдим этиш ушбу келишувнинг бузилиши ҳисобланмайди.',
        `Махфийлик мажбуриятлари келишув имзоланган кундан бошлаб ${c.x('years', 2)} йил давомида амал қилади.`,
        `Келишув бузилганда айбдор тараф ${c.money('fine')} миқдорида жарима тўлайди ва жарима билан қопланмаган зарарни ҳам қоплайди.`,
        `Низолар ${c.x('court', 18)}да кўрилади. Келишув икки нусхада тузилди.`,
      ])}
      ${sigTable(`<b>1-тараф</b><br>${c.x('a_name', 16)}<br>${c.x('a_pos', 10)}<br><br>____________ ${c.x('a_rep', 16)}<br>М.Ў.`, `<b>2-тараф</b><br>${c.x('b_name', 16)}<br>${c.x('b_pos', 10)}<br><br>____________ ${c.x('b_rep', 16)}<br>М.Ў.`)}`,
  },
  {
    id: 'equipment-lease', cat: 'contracts', sub: 'legal', minutes: 6,
    docTitle: 'Асбоб-ускуналарни ижарага бериш шартномаси',
    title: tr('Uskuna ijarasi shartnomasi', 'Договор аренды оборудования', 'Equipment lease'),
    desc: tr('Asbob-uskuna yoki texnikani ijaraga berish: roʻyxat, oylik haq, kafolat puli, qaytarish.', 'Аренда оборудования или техники: перечень, плата, залог, возврат.', 'Equipment or machinery lease: list, monthly rent, deposit, return.'),
    fields: [
      ...docFields,
      ...partyFields('ll', 'lessor', EX_B),
      ...partyFields('tn', 'lessee', EX_A),
      { k: 'items', g: 'items', l: tr('Uskunalar', 'Оборудование', 'Equipment'), t: 'rows', cols: ITEM_COLS,
        ex: [{ name: 'Бетон аралаштиргич, 300 л', unit: 'дона', qty: '2', price: '9500000' }, { name: 'Ҳавоза (қурилиш лесаси), секция', unit: 'дона', qty: '40', price: '650000' }] },
      { k: 'rent', g: 'payment', l: tr('Oylik ijara haqi', 'Плата в месяц', 'Monthly rent'), t: 'money', ex: '4800000', half: true },
      { k: 'deposit', g: 'payment', l: tr('Kafolat puli', 'Залог', 'Deposit'), t: 'money', ex: '5000000', half: true },
      { k: 'from', g: 'payment', l: tr('Ijara boshlanishi', 'Начало аренды', 'From'), t: 'date', ex: '2026-10-10', half: true },
      { k: 'until', g: 'payment', l: tr('Ijara tugashi', 'Окончание аренды', 'Until'), t: 'date', ex: '2027-01-10', half: true },
      court,
    ],
    render: c => {
      const t = itemsTable(c, 'items');
      return `
      ${head('Асбоб-ускуналарни ижарага бериш шартномаси', c)}
      ${p(`${partyIntro(c, 'll', 'Ижарага берувчи')} бир томондан, ва ${partyIntro(c, 'tn', 'Ижарачи')} иккинчи томондан, ушбу шартномани қуйидагилар ҳақида туздилар:`)}
      ${p('1. Ижарага берувчи қуйидаги асбоб-ускуналарни (кейинги ўринларда «Ускуна») Ижарачига вақтинча эгалик қилиш ва фойдаланиш учун беради:')}
      ${t.html}
      ${ol([
        `Ускунанинг баҳоланган қиймати ${c.moneyN(t.total)}. Ижара муддати: ${c.date('from')}дан ${c.date('until')}гача.`,
        `Ойлик ижара ҳақи ${c.money('rent')} бўлиб, ҳар ойнинг 5-санасигача олдиндан тўланади.`,
        `Ижарачи шартнома имзолангандан кейин 3 банк куни ичида ${c.money('deposit')} миқдорида кафолат пули тўлайди. Кафолат пули Ускуна соз ҳолатда қайтарилгандан кейин қайтарилади.`,
        'Ускуна топшириш-қабул қилиш далолатномаси асосида соз ҳолатда топширилади ва табиий эскиришни ҳисобга олган ҳолда шу ҳолатда қайтарилади.',
        'Ижарачи Ускунадан мақсадига кўра фойдаланади, уни учинчи шахсларга бермайди. Ижарачининг айби билан шикастланган Ускуна унинг ҳисобидан таъмирланади ёки қиймати қопланади.',
        ...closing(c),
      ], 2)}
      ${sigTable(reqCell(c, 'll', 'Ижарага берувчи'), reqCell(c, 'tn', 'Ижарачи'))}`;
    },
  },
  {
    id: 'car-rental', cat: 'contracts', sub: 'vehicle', minutes: 5,
    docTitle: 'Автотранспорт воситасини ижарага бериш шартномаси',
    title: tr('Avtomobil ijarasi shartnomasi', 'Договор аренды автомобиля', 'Car rental agreement'),
    desc: tr('Jismoniy shaxslar oʻrtasida haydovchisiz avtomobil ijarasi: kunlik/oylik haq, garov, javobgarlik.', 'Аренда авто без экипажа между физлицами: плата, залог, ответственность.', 'Car rental without driver between individuals: rent, deposit, liability.'),
    fields: [
      ...docFields,
      ...personFields('ll', 'lessor', P1),
      ...personFields('tn', 'lessee', P2).filter(f => !f.k.endsWith('_acc')),
      { k: 'lic', g: 'lessee', l: tr('Haydovchilik guvohnomasi', 'Водительское удостоверение', 'Driving licence'), ex: 'AF 1234567' },
      ...vehicleFields('vehicle'),
      { k: 'rent', g: 'payment', l: tr('Ijara haqi', 'Арендная плата', 'Rent'), t: 'money', ex: '250000', half: true },
      { k: 'per', g: 'payment', l: tr('Davr', 'За период', 'Per'), t: 'select', opts: ['бир сутка', 'бир ой'], ex: 'бир сутка', half: true },
      { k: 'deposit', g: 'payment', l: tr('Garov puli', 'Залог', 'Deposit'), t: 'money', ex: '2000000', half: true },
      { k: 'until', g: 'payment', l: tr('Ijara tugashi', 'Окончание аренды', 'Until'), t: 'date', ex: '2026-10-20', half: true },
    ],
    render: c => `
      ${head('Автотранспорт воситасини ижарага бериш шартномаси', c)}
      ${p(`${c.x('ll', 22)} (кейинги ўринларда «Ижарага берувчи») ва ${c.x('tn', 22)} (ҳайдовчилик гувоҳномаси ${c.x('lic', 10)}, кейинги ўринларда «Ижарачи») ушбу шартномани қуйидагилар ҳақида туздилар:`)}
      ${ol([
        `Ижарага берувчи ўзига тегишли ${vehicleText(c)}ни Ижарачига экипажсиз вақтинча фойдаланиш учун ${c.date('until')}гача беради.`,
        `Ижара ҳақи ${c.x('per', 8)} учун ${c.money('rent')}. Ижарачи ${c.money('deposit')} миқдорида гаров пули тўлайди, у автомобиль шикастланмаган ҳолда қайтарилганда қайтарилади.`,
        'Автомобиль, калитлар ва қайд этиш гувоҳномаси топшириш-қабул қилиш далолатномаси асосида топширилади. Ёқилғи харажатлари Ижарачи зиммасида.',
        'Ижарачи автомобилни фақат ўзи бошқаради, уни учинчи шахсларга бермайди, йўл ҳаракати қоидаларига риоя қилади. Ижара даврида содир этилган қоидабузарликлар учун жарималарни Ижарачи тўлайди.',
        'Ижарачининг айби билан автомобилга етказилган зарарни Ижарачи тўлиқ қоплайди.',
        'Низолар музокаралар, келишилмаганда суд орқали ҳал этилади. Шартнома икки нусхада тузилди.',
      ])}
      ${sigTable(personCell(c, 'll', 'Ижарага берувчи'), `<b>«Ижарачи»</b><br>${c.x('tn', 20)}<br>Паспорт: ${c.x('tn_pass', 18)}<br>Манзил: ${c.x('tn_addr', 22)}<br>Гувоҳнома: ${c.x('lic', 10)}<br><br>____________ ${c.x('tn', 14)}`)}`,
  },
  {
    id: 'handover-act', cat: 'contracts', sub: 'annex', minutes: 3,
    docTitle: 'Топшириш-қабул қилиш далолатномаси',
    title: tr('Topshirish-qabul qilish dalolatnomasi', 'Акт приёма-передачи', 'Handover certificate'),
    desc: tr('Mol-mulk, tovar yoki hujjatlarni topshirish: roʻyxat, holati, jami qiymat.', 'Передача имущества, товара или документов: перечень, состояние, итог.', 'Transfer of property, goods or documents: list, condition, total.'),
    fields: [
      ...docFields,
      { k: 'basis', g: 'contract', l: tr('Asos', 'Основание', 'Basis'), ex: '04.05.2026 йилдаги 45-сон олди-сотди шартномаси' },
      ...partyFields('a', 'party1', EX_B).filter(f => ['a_name', 'a_pos', 'a_rep'].includes(f.k)),
      ...partyFields('b', 'party2', EX_A).filter(f => ['b_name', 'b_pos', 'b_rep'].includes(f.k)),
      { k: 'items', g: 'items', l: tr('Topshiriladigan narsalar', 'Передаваемое', 'Items'), t: 'rows', cols: ITEM_COLS,
        ex: [{ name: 'Ноутбук Lenovo ThinkPad E14', unit: 'дона', qty: '5', price: '9800000' }] },
      { k: 'state', g: 'contract', l: tr('Holati', 'Состояние', 'Condition'), t: 'select', opts: ['соз, шикастланмаган, тўлиқ бутланган', 'фойдаланишда бўлган, ишлайдиган ҳолатда'], ex: 'соз, шикастланмаган, тўлиқ бутланган' },
    ],
    render: c => {
      const t = itemsTable(c, 'items');
      return `
      ${head('Топшириш-қабул қилиш далолатномаси', c)}
      ${p(`${c.x('a_name', 16)} номидан ${c.x('a_pos', 8)} ${c.x('a_rep', 16)} (Топширувчи) ва ${c.x('b_name', 16)} номидан ${c.x('b_pos', 8)} ${c.x('b_rep', 16)} (Қабул қилувчи) ${c.x('basis', 24)}га асосан мазкур далолатномани туздилар:`)}
      ${p('1. Топширувчи топширди, Қабул қилувчи эса қабул қилди:')}
      ${t.html}
      ${ol([`Топширилган мол-мулкнинг жами қиймати ${c.moneyN(t.total)}.`, `Мол-мулк ${c.x('state', 20)} ҳолатда топширилди. Тарафларнинг миқдор, сифат ва бутлик бўйича бир-бирига эътирозлари йўқ.`, 'Далолатнома икки нусхада тузилди.'], 2)}
      ${sigTable(`<b>Топширувчи</b><br>${c.x('a_name', 16)}<br><br>____________ ${c.x('a_rep', 16)}`, `<b>Қабул қилувчи</b><br>${c.x('b_name', 16)}<br><br>____________ ${c.x('b_rep', 16)}`)}`;
    },
  },
  {
    id: 'invoice', cat: 'contracts', sub: 'annex', minutes: 3,
    docTitle: 'Тўлов учун ҳисобварақ',
    title: tr('Toʻlov uchun hisobvaraq', 'Счёт на оплату', 'Invoice for payment'),
    desc: tr('Mijozga toʻlov uchun hisob: tovar/xizmatlar, QQS (ixtiyoriy), jami soʻz bilan, rekvizitlar.', 'Счёт клиенту: товары/услуги, НДС (опц.), итог прописью, реквизиты.', 'Invoice: goods/services, VAT (optional), total in words, bank details.'),
    fields: [
      ...docFields.filter(f => f.k !== 'city'),
      ...partyFields('s', 'seller', EX_B),
      { k: 'b_name', g: 'buyer', l: tr('Xaridor', 'Покупатель', 'Buyer'), ex: '«Намуна Савдо» МЧЖ' },
      { k: 'b_stir', g: 'buyer', l: tr('Xaridor STIR', 'ИНН покупателя', 'Buyer TIN'), ex: '301234567', half: true },
      { k: 'basis', g: 'buyer', l: tr('Asos (shartnoma)', 'Основание (договор)', 'Basis (contract)'), ex: '45-сон, 04.05.2026', half: true },
      { k: 'items', g: 'items', l: tr('Tovar va xizmatlar', 'Товары и услуги', 'Goods & services'), t: 'rows', cols: ITEM_COLS,
        ex: [{ name: 'Бухгалтерия хизматлари (сентябрь 2026)', unit: 'хизмат', qty: '1', price: '3500000' }, { name: 'Солиқ ҳисоботларини тайёрлаш', unit: 'хизмат', qty: '1', price: '1200000' }] },
      { k: 'vat', g: 'payment', l: tr('QQS stavkasi, % (0 — QQSsiz)', 'НДС, % (0 — без НДС)', 'VAT, % (0 = none)'), t: 'number', ex: '12', half: true },
      { k: 'due', g: 'payment', l: tr('Toʻlash muddati', 'Оплатить до', 'Due date'), t: 'date', ex: '2026-10-15', half: true },
    ],
    render: c => {
      const t = itemsTable(c, 'items');
      const rate = parseNum(c.raw('vat'));
      // prices include VAT: VAT share = total × rate / (100 + rate)
      const vat = isFinite(rate) && rate > 0 ? Math.round(t.total * rate / (100 + rate) * 100) / 100 : 0;
      return `
      <h2>Тўлов учун ҳисобварақ № ${c.x('no', 3)}</h2>
      <p class="c">${c.date('date')}</p>
      <table class="t">
        <tr><td><b>Етказиб берувчи</b></td><td>${c.x('s_name', 18)}, СТИР ${c.x('s_stir', 9)}<br>${c.x('s_addr', 22)}<br>Ҳ/р ${c.x('s_acc', 16)}, ${c.x('s_bank', 16)}, МФО ${c.x('s_mfo', 5)}</td></tr>
        <tr><td><b>Харидор</b></td><td>${c.x('b_name', 18)}, СТИР ${c.x('b_stir', 9)}</td></tr>
        <tr><td><b>Асос</b></td><td>${c.x('basis', 16)}</td></tr>
      </table>
      ${t.html}
      ${vat ? `<p class="r">Шу жумладан ҚҚС (${c.span(esc(c.raw('vat')))}%): ${c.span(fmtMoney(vat))}</p>` : '<p class="r">ҚҚСсиз</p>'}
      ${p(`Жами тўланадиган сумма: ${c.moneyN(t.total)}.`)}
      ${p(`Илтимос, ҳисобварақни ${c.date('due')}гача тўланг. Тўлов топшириқномасида ҳисобварақ рақамини кўрсатинг.`)}
      ${sigTable(`Раҳбар ____________ ${c.x('s_rep', 14)}`, 'Бош ҳисобчи ____________')}`;
    },
  },
];
