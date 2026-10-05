import { esc, fmtMoney, parseNum } from '../core/doc/format';
import { itemsTable, meta, ol, sigTable } from '../core/doc/engine';
import { DocTemplate } from '../core/doc/types';
import { addressee, attachments, EX_A, ITEM_COLS, L, partyFields, STD_LIABILITY, tr } from './shared';

export const CORPORATE: DocTemplate[] = [
  {
    id: 'llc-founding', cat: 'corporate', sub: 'decisions', minutes: 6,
    docTitle: 'Ягона иштирокчининг 1-сонли қарори ва 1-сонли буйруқ',
    title: tr('MChJ tashkil etish qarori va direktor buyrugʻi', 'Решение о создании ООО и приказ директора', 'LLC formation decision and director’s order'),
    desc: tr('Yagona ishtirokchining 1-sonli qarori va direktorning lavozimga kirishishi haqida 1-sonli buyruq.',
      'Решение №1 единственного участника и приказ №1 о вступлении директора в должность.',
      'Sole participant’s Decision No. 1 and the director’s Order No. 1 on taking office.'),
    fields: [
      { k: 'company', g: 'company', l: L.company, ex: 'Намуна Савдо' },
      { k: 'city', g: 'company', l: L.city, ex: 'Тошкент шаҳри', half: true },
      { k: 'date', g: 'company', l: tr('Qaror sanasi', 'Дата решения', 'Decision date'), t: 'date', ex: '2026-10-01', half: true },
      { k: 'purpose', g: 'company', l: tr('Tashkil etish maqsadi', 'Цель создания', 'Purpose'), t: 'textarea', ex: 'аҳолини сифатли озиқ-овқат маҳсулотлари билан таъминлаш' },
      { k: 'capital', g: 'company', l: tr('Ustav fondi (soʻm)', 'Уставный фонд (сум)', 'Charter capital (UZS)'), t: 'money', ex: '50000000' },
      { k: 'center', g: 'company', l: L.center, ex: 'Тошкент шаҳар Юнусобод тумани Давлат хизматлари маркази' },
      { k: 'founder', g: 'founder', l: tr('Yagona ishtirokchi F.I.Sh.', 'Ф.И.О. единственного участника', 'Sole participant'), ex: 'Каримов Алишер Баҳромович' },
      { k: 'director', g: 'director', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Director'), ex: 'Каримов Алишер Баҳромович' },
      { k: 'dir_birth', g: 'director', l: L.birth, t: 'date', ex: '1990-05-14', half: true },
      { k: 'dir_pass', g: 'director', l: L.passport, ex: 'AA 0000000', half: true },
      { k: 'dir_pass_by', g: 'director', l: L.passportBy, ex: 'Юнусобод тумани ИИБ', half: true },
      { k: 'dir_pass_date', g: 'director', l: L.passportDate, t: 'date', ex: '2015-03-20', half: true },
      { k: 'order_date', g: 'director', l: tr('Lavozimga kirish sanasi', 'Дата вступления в должность', 'Start date'), t: 'date', ex: '2026-10-02', half: true },
      { k: 'cert', g: 'director', l: tr('Roʻyxatdan oʻtish guvohnomasi №', '№ свидетельства о регистрации', 'Registration certificate No.'), half: true,
        hint: tr('Roʻyxatdan oʻtgandan keyin', 'После регистрации', 'After registration') },
    ],
    render: c => `
      <p class="c">«${c.x('company')}»<br>масъулияти чекланган жамияти ягона иштирокчисининг</p>
      <h2>1-сонли қарори</h2>
      ${meta(c.date('date'), c.x('city', 14))}
      <p>Мен, «${c.x('company')}» масъулияти чекланган жамиятининг ягона иштирокчиси ${c.x('founder', 24)}, ${c.x('purpose', 30)} мақсадида масъулияти чекланган жамият ташкил қилиш ва унинг устав фондини тасдиқлаш мақсадида,</p>
      <p class="sp">ҚАРОР ҚИЛАМАН:</p>
      ${ol([
        `«${c.x('company')}» номли масъулияти чекланган жамияти ташкил қилинсин.`,
        `«${c.x('company')}» масъулияти чекланган жамиятининг устав фонди жами ${c.money('capital')} миқдорида тасдиқлансин.`,
        `Жамиятни ташкил қилиш юзасидан тегишли ҳужжатлар ўз вақтида расмийлаштирилиб, ${c.x('center', 24)}да давлат рўйхатидан ўтказилсин.`,
        `«${c.x('company')}» МЧЖ директори этиб ${c.x('director', 22)} (${c.dshort('dir_birth')} йилда туғилган, паспорт ${c.x('dir_pass', 10)}, ${c.x('dir_pass_by', 14)} томонидан ${c.dshort('dir_pass_date')} йилда берилган) тайинлансин.`,
      ])}
      ${sigTable(`«${c.x('company')}» МЧЖ<br>ягона иштирокчиси`, `<br>____________ ${c.x('founder', 18)}`)}
      <div class="pb"></div>
      <p class="c">«${c.x('company')}» масъулияти чекланган жамияти</p>
      <h2>Буйруқ № 1</h2>
      ${meta(c.date('order_date'), c.x('city', 14))}
      <p class="c"><i>Жамият директори вазифасига киришиш тўғрисида</i></p>
      <p class="sp">БУЮРАМАН:</p>
      ${ol([
        `Мен, ${c.x('director', 22)}, ${c.date('order_date')}дан «${c.x('company')}» масъулияти чекланган жамияти директори лавозимига киришаман.`,
        'Жамият муҳри ва тўлов ҳужжатларида биринчи имзо қўйиш ҳуқуқини ўз зиммамга оламан.',
        'Ойлик маош штатлар жадвалига мувофиқ тўлансин.',
      ])}
      <p><b>Асос:</b> жамият ягона иштирокчисининг ${c.dshort('date')} йилдаги 1-сонли қарори; меҳнат шартномаси${c.has('cert') ? '; юридик шахсни давлат рўйхатидан ўтказиш тўғрисидаги ' + c.x('cert') + '-сонли гувоҳнома' : ''}.</p>
      ${sigTable('Директор', `____________ ${c.x('director', 18)}`)}`,
  },
  {
    id: 'director-change', cat: 'corporate', sub: 'decisions', minutes: 5,
    docTitle: 'Таъсисчилар умумий йиғилиши баёни',
    title: tr('Direktorni almashtirish bayoni', 'Протокол о смене директора', 'Minutes on changing the director'),
    desc: tr('Taʼsischilar umumiy yigʻilishi: amaldagi direktorni ozod qilish va yangisini tayinlash.',
      'Общее собрание учредителей: освобождение директора и назначение нового.',
      'General meeting of founders: releasing the director and appointing a new one.'),
    fields: [
      { k: 'company', g: 'meeting', l: L.company, ex: 'Намуна Савдо' },
      { k: 'no', g: 'meeting', l: L.number, ex: '5', half: true },
      { k: 'date', g: 'meeting', l: L.date, t: 'date', ex: '2026-10-01', half: true },
      { k: 'city', g: 'meeting', l: L.city, ex: 'Тошкент шаҳри' },
      { k: 'chair', g: 'meeting', l: tr('Yigʻilish raisi', 'Председатель собрания', 'Chair'), ex: 'Каримов А.Б.', half: true },
      { k: 'secr', g: 'meeting', l: tr('Yigʻilish kotibi', 'Секретарь собрания', 'Secretary'), ex: 'Раҳимова Д.Ш.', half: true },
      { k: 'present', g: 'meeting', l: tr('Qatnashdilar (har biri yangi qatorda)', 'Присутствовали (каждый с новой строки)', 'Present (one per line)'), t: 'textarea', ex: 'Каримов Алишер Баҳромович — 60%\nРаҳимова Дилноза Шавкатовна — 40%' },
      { k: 'old', g: 'decision', l: tr('Ozod qilinayotgan direktor', 'Освобождаемый директор', 'Outgoing director'), ex: 'Тошматов Бахтиёр Олимович' },
      { k: 'reason', g: 'decision', l: tr('Ozod qilish asosi', 'Основание освобождения', 'Ground for release'), ex: 'ўз аризасига' },
      { k: 'new', g: 'decision', l: tr('Yangi direktor', 'Новый директор', 'New director'), ex: 'Раҳимов Жасур Акмалович' },
      { k: 'new_pos', g: 'decision', l: tr('Yangi direktorning hozirgi lavozimi', 'Текущая должность нового директора', 'Current position of new director'), ex: 'директор ўринбосари' },
      { k: 'eff', g: 'decision', l: tr('Kuchga kirish sanasi', 'Дата вступления в силу', 'Effective date'), t: 'date', ex: '2026-10-02' },
    ],
    render: c => `
      <p class="c">«${c.x('company')}» масъулияти чекланган жамияти<br>таъсисчиларининг умумий йиғилиши</p>
      <h2>Баёни № ${c.x('no', 3)}</h2>
      ${meta(c.date('date'), c.x('city', 14))}
      <p>Йиғилиш раиси: ${c.x('chair', 18)}<br>Йиғилиш котиби: ${c.x('secr', 18)}</p>
      <p>Қатнашдилар:<br>${c.x('present', 30)}</p>
      <p>Кворум мавжуд. Йиғилиш ваколатли.</p>
      <p><b>КУН ТАРТИБИ:</b></p>
      ${ol([
        `«${c.x('company')}» МЧЖ директори ${c.x('old', 18)}ни эгаллаб турган лавозимидан озод қилиш тўғрисида.`,
        `«${c.x('company')}» МЧЖга директор тайинлаш тўғрисида.`,
      ])}
      <p><b>ЭШИТИЛДИ:</b> Йиғилиш раиси ${c.x('chair', 14)} йиғилишни очиб, ${c.x('reason', 12)} асосан жамият директори ${c.x('old', 18)}ни лавозимидан озод этишни ҳамда директор лавозимига ҳозирда ${c.x('new_pos', 14)} лавозимида ишлаб келаётган ${c.x('new', 18)}ни тайинлашни таклиф қилди. Таклиф овозга қўйилди ва бир овоздан маъқулланди.</p>
      <p class="sp">ҚАРОР ҚИЛАДИ:</p>
      ${ol([
        `${c.date('eff')}дан ${c.x('old', 18)} жамият директори лавозимидан озод этилсин.`,
        `${c.date('eff')}дан ${c.x('new', 18)} жамият директори этиб тайинлансин.`,
        `Жамият директори ${c.x('new', 18)}га жамият номидан барча расмий ҳужжатларга биринчи имзо қўйиш ҳуқуқи берилсин.`,
        'Таъсис ҳужжатларидаги тегишли ўзгаришлар белгиланган тартибда рўйхатдан ўтказилсин; қарор ижросини таъминлаш жамият директори зиммасига юклатилсин.',
      ])}
      ${sigTable('Йиғилиш раиси<br><br>Йиғилиш котиби', `____________ ${c.x('chair', 14)}<br><br>____________ ${c.x('secr', 14)}`)}`,
  },
  {
    id: 'name-change', cat: 'corporate', sub: 'decisions', minutes: 3,
    docTitle: 'Корхона номини ўзгартириш тўғрисида қарор ва буйруқ',
    title: tr('Korxona nomini oʻzgartirish', 'Изменение наименования', 'Change of company name'),
    desc: tr('Yagona taʼsischi qarori, Ustavga oʻzgartirishlar va ijro buyrugʻi.', 'Решение единственного учредителя, изменения в устав и приказ.', 'Sole founder’s decision, charter amendments and executing order.'),
    fields: [
      { k: 'old', g: 'decision', l: tr('Amaldagi nom', 'Текущее наименование', 'Current name'), ex: 'Намуна Савдо', half: true },
      { k: 'new', g: 'decision', l: tr('Yangi nom', 'Новое наименование', 'New name'), ex: 'Намуна Трейд', half: true },
      { k: 'no', g: 'decision', l: L.number, ex: '01', half: true },
      { k: 'date', g: 'decision', l: L.date, t: 'date', ex: '2026-10-01', half: true },
      { k: 'city', g: 'decision', l: L.city, ex: 'Тошкент ш.' },
      { k: 'founder', g: 'decision', l: tr('Yagona taʼsischi F.I.Sh.', 'Ф.И.О. единственного учредителя', 'Sole founder'), ex: 'Каримов Алишер Баҳромович' },
      { k: 'center', g: 'decision', l: L.center, ex: 'Тошкент шаҳар Юнусобод тумани Давлат хизматлари маркази' },
      { k: 'head', g: 'sign', l: L.head, ex: 'Каримов А.Б.' },
    ],
    render: c => `
      <p class="c">«${c.x('old')}»<br>масъулияти чекланган жамияти</p>
      <h2>Ягона таъсисчисининг қарори № ${c.x('no', 3)}</h2>
      ${meta(c.date('date'), c.x('city', 12))}
      <p>Мен, ${c.x('founder', 22)}, «${c.x('old')}» МЧЖнинг ягона таъсисчиси сифатида,</p>
      <p class="sp">ҚАРОР ҚИЛАМАН:</p>
      ${ol([
        `«${c.x('old')}» МЧЖ номи «${c.x('new')}» МЧЖ га ўзгартирилсин.`,
        'Жамият Уставига киритилган қўшимча ва ўзгартиришлар тасдиқлансин.',
        `Таъсис ҳужжатларига киритилган ўзгартиришлар белгиланган тартибда ${c.x('center', 24)}да рўйхатдан ўтказилсин.`,
      ])}
      ${sigTable('Жамиятнинг ягона таъсисчиси', `____________ ${c.x('founder', 18)}`)}
      <div class="pb"></div>
      <p class="c">«${c.x('old')}» МЧЖ</p>
      <h2>Буйруқ № ${c.x('no', 3)}</h2>
      ${meta(c.date('date'), c.x('city', 12))}
      <p>«${c.x('old')}» МЧЖ номи «${c.x('new')}» МЧЖ га ўзгартирилсин.</p>
      <p><b>Асос:</b> ягона таъсисчининг ${c.dshort('date')} йилдаги № ${c.x('no', 3)} сонли қарори.</p>
      ${sigTable('Раҳбар', `____________ ${c.x('head', 16)}`)}`,
  },
  {
    id: 'address-change', cat: 'corporate', sub: 'decisions', minutes: 4,
    docTitle: 'Юридик манзилни ўзгартириш тўғрисида қарор ва буйруқ',
    title: tr('Yuridik manzilni oʻzgartirish', 'Изменение юридического адреса', 'Change of registered address'),
    desc: tr('Yagona taʼsischi qarori (pasport maʼlumotlari bilan) va ijro buyrugʻi.', 'Решение учредителя (с паспортными данными) и приказ.', 'Founder’s decision (with passport details) and executing order.'),
    fields: [
      { k: 'company', g: 'decision', l: L.company, ex: 'Намуна Савдо' },
      { k: 'no', g: 'decision', l: L.number, ex: '02', half: true },
      { k: 'date', g: 'decision', l: L.date, t: 'date', ex: '2026-10-01', half: true },
      { k: 'city', g: 'decision', l: L.city, ex: 'Тошкент ш.' },
      { k: 'founder', g: 'founder', l: tr('Yagona taʼsischi F.I.Sh.', 'Ф.И.О. учредителя', 'Sole founder'), ex: 'Каримов Алишер Баҳромович' },
      { k: 'f_birth', g: 'founder', l: L.birth, t: 'date', ex: '1990-05-14', half: true },
      { k: 'f_pass', g: 'founder', l: L.passport, ex: 'AA 0000000', half: true },
      { k: 'f_pass_by', g: 'founder', l: L.passportBy, ex: 'Юнусобод тумани ИИБ', half: true },
      { k: 'f_pass_date', g: 'founder', l: L.passportDate, t: 'date', ex: '2015-03-20', half: true },
      { k: 'old_addr', g: 'address', l: tr('Eski manzil', 'Прежний адрес', 'Old address'), t: 'textarea', ex: 'Тошкент шаҳри, Сергели тумани, 1-мавзе, 2-уй, 22-хонадон' },
      { k: 'new_addr', g: 'address', l: tr('Yangi manzil', 'Новый адрес', 'New address'), t: 'textarea', ex: 'Тошкент шаҳри, Янгиҳаёт тумани, 5-уй, 12-хонадон' },
      { k: 'center', g: 'address', l: L.center, ex: 'Тошкент шаҳар Янгиҳаёт тумани Давлат хизматлари маркази' },
    ],
    render: c => `
      <p class="c">«${c.x('company')}»<br>масъулияти чекланган жамияти</p>
      <h2>Ягона таъсисчисининг қарори № ${c.x('no', 3)}</h2>
      ${meta(c.date('date'), c.x('city', 12))}
      <p>Мен, ${c.x('founder', 22)}, ${c.dshort('f_birth')} йилда туғилган (паспорт ${c.x('f_pass', 10)}, ${c.x('f_pass_by', 14)} томонидан ${c.dshort('f_pass_date')} йилда берилган), «${c.x('company')}» МЧЖнинг ягона таъсисчиси сифатида,</p>
      <p class="sp">ҚАРОР ҚИЛАМАН:</p>
      ${ol([
        'Жамият Уставига киритилган қўшимча ва ўзгартиришлар тасдиқлансин.',
        `«${c.x('company')}» МЧЖнинг юридик манзили ${c.x('old_addr', 30)}дан ${c.x('new_addr', 30)}га ўзгартирилсин.`,
        `Ўзгартиришлар белгиланган тартибда ${c.x('center', 24)}да рўйхатдан ўтказилсин.`,
      ])}
      ${sigTable('Жамиятнинг ягона таъсисчиси', `____________ ${c.x('founder', 18)}`)}
      <div class="pb"></div>
      <p class="c">«${c.x('company')}» МЧЖ</p>
      <h2>Буйруқ № ${c.x('no', 3)}</h2>
      ${meta(c.date('date'), c.x('city', 12))}
      <p>«${c.x('company')}» масъулияти чекланган жамиятининг юридик манзили ${c.x('old_addr', 30)}дан ${c.x('new_addr', 30)}га ўзгартирилсин.</p>
      <p><b>Асос:</b> ягона таъсисчининг ${c.dshort('date')} йилдаги № ${c.x('no', 3)} сонли қарори.</p>
      ${sigTable('Раҳбар', `____________ ${c.x('founder', 16)}`)}`,
  },
  {
    id: 'charter-contribution', cat: 'corporate', sub: 'decisions', minutes: 4,
    docTitle: 'Устав фондига мулкни қабул қилиш-топшириш далолатномаси',
    title: tr('Ustav fondiga mulk topshirish dalolatnomasi', 'Акт передачи имущества в уставный фонд', 'Act of contribution to charter capital'),
    desc: tr('Taʼsischi mulk topshiradi, direktor qabul qiladi. Jami summa soʻz bilan avtomatik.', 'Учредитель передаёт имущество, директор принимает. Итог прописью — автоматически.', 'Founder transfers property, director accepts. Total in words is automatic.'),
    fields: [
      { k: 'company', g: 'act', l: L.company, ex: 'Намуна Савдо' },
      { k: 'city', g: 'act', l: L.city, ex: 'Тошкент ш.', half: true },
      { k: 'date', g: 'act', l: L.date, t: 'date', ex: '2026-10-05', half: true },
      { k: 'decision', g: 'act', l: tr('Asos qaror', 'Решение-основание', 'Underlying decision'), ex: '01.10.2026 йилдаги 1-сонли қарор' },
      { k: 'founder', g: 'act', l: tr('Taʼsischi (topshiruvchi)', 'Учредитель (передаёт)', 'Founder (transfers)'), ex: 'Каримов Алишер Баҳромович', half: true },
      { k: 'director', g: 'act', l: tr('Direktor (qabul qiluvchi)', 'Директор (принимает)', 'Director (accepts)'), ex: 'Каримов Алишер Баҳромович', half: true },
      { k: 'items', g: 'property', l: tr('Mulk', 'Имущество', 'Property'), t: 'rows', cols: ITEM_COLS,
        ex: [{ name: 'Ёзув столи', unit: 'дона', qty: '2', price: '1500000' }, { name: 'Ноутбук', unit: 'дона', qty: '2', price: '9000000' }, { name: 'Ҳужжат жавони', unit: 'дона', qty: '1', price: '2500000' }] },
    ],
    render: c => {
      const t = itemsTable(c, 'items');
      return `
      <h2>Далолатнома</h2>
      <p class="c">«${c.x('company')}» МЧЖ устав фондига мулкни қабул қилиш-топшириш тўғрисида</p>
      ${meta(c.date('date'), c.x('city', 12))}
      <p>Биз, қуйида имзо қўювчилар, таъсисчи ${c.x('founder', 22)} ҳамда «${c.x('company')}» МЧЖ директори ${c.x('director', 22)}, ${c.x('decision', 20)}га асосан «${c.x('company')}» МЧЖ устав фондига мулкни қабул қилиш-топширишни қуйидагича амалга оширдик:</p>
      ${t.html}
      <p>Жами: ${c.moneyN(t.total)}.</p>
      <p>Топширилган мулк таъсисчига мулк ҳуқуқи асосида тегишли бўлиб, учинчи шахсларнинг ҳуқуқлари билан оғирлаштирилмаган.</p>
      ${sigTable(`Топширдим:<br>Таъсисчи<br><br>____________ ${c.x('founder', 16)}`, `Қабул қилдим:<br>Директор<br><br>____________ ${c.x('director', 16)}<br>М.Ў.`)}`;
    },
  },
  {
    id: 'dividend', cat: 'corporate', sub: 'decisions', minutes: 6,
    docTitle: 'Соф фойдани тақсимлаш тўғрисида умумий йиғилиш баёни',
    title: tr('Dividend taqsimlash bayoni', 'Протокол о распределении дивидендов', 'Dividend distribution minutes'),
    desc: tr('Choraklik sof foydani ulushlarga mutanosib taqsimlash; soliq va toʻlanadigan summa avtomatik.', 'Распределение прибыли пропорционально долям; налог и сумма к выплате — автоматически.', 'Profit split by shares; tax and net payout calculated automatically.'),
    fields: [
      { k: 'company', g: 'meeting', l: L.company, ex: 'Намуна Савдо' },
      { k: 'no', g: 'meeting', l: L.number, ex: '3', half: true },
      { k: 'date', g: 'meeting', l: L.date, t: 'date', ex: '2026-10-10', half: true },
      { k: 'city', g: 'meeting', l: L.city, ex: 'Тошкент шаҳри' },
      { k: 'chair', g: 'meeting', l: tr('Rais', 'Председатель', 'Chair'), ex: 'Каримов А.Б.', half: true },
      { k: 'secr', g: 'meeting', l: tr('Kotib', 'Секретарь', 'Secretary'), ex: 'Раҳимова Д.Ш.', half: true },
      { k: 'year', g: 'result', l: tr('Yil', 'Год', 'Year'), ex: '2026', half: true },
      { k: 'q', g: 'result', l: tr('Chorak', 'Квартал', 'Quarter'), t: 'select', opts: ['I', 'II', 'III', 'IV'], ex: 'III', half: true },
      { k: 'profit', g: 'result', l: tr('Chorak sof foydasi', 'Чистая прибыль за квартал', 'Net profit for the quarter'), t: 'money', ex: '120000000' },
      { k: 'dist', g: 'result', l: tr('Taqsimlanadigan summa', 'Сумма к распределению', 'Amount to distribute'), t: 'money', ex: '100000000' },
      { k: 'tax', g: 'result', l: tr('Dividend soligʻi, %', 'Налог на дивиденды, %', 'Dividend tax, %'), t: 'number', ex: '5',
        hint: tr('Amaldagi Soliq kodeksi boʻyicha tekshiring', 'Проверьте по действующему Налоговому кодексу', 'Check against the current Tax Code') },
      { k: 'parts', g: 'participants', l: tr('Ishtirokchilar', 'Участники', 'Participants'), t: 'rows',
        cols: [{ k: 'name', l: L.fio }, { k: 'share', l: tr('Ulush, %', 'Доля, %', 'Share, %'), num: true }],
        ex: [{ name: 'Каримов Алишер Баҳромович', share: '60' }, { name: 'Раҳимова Дилноза Шавкатовна', share: '40' }] },
    ],
    render: c => {
      const dist = c.num('dist');
      const tax = isFinite(c.num('tax')) ? c.num('tax') : 0;
      let rows = '';
      let tot = 0;
      c.rows('parts').forEach((r, i) => {
        const sh = parseNum(r['share']);
        const a = isFinite(dist) && isFinite(sh) ? Math.round(dist * sh) / 100 : NaN;
        const tx = isFinite(a) ? Math.round(a * tax) / 100 : NaN;
        const net = isFinite(a) ? a - tx : NaN;
        if (isFinite(net)) tot += net;
        rows += `<tr><td class="n">${i + 1}</td><td>${c.span(esc(r['name'] ?? ''))}</td><td class="n">${isFinite(sh) ? sh + '%' : ''}</td><td class="n">${isFinite(a) ? fmtMoney(a) : ''}</td><td class="n">${isFinite(tx) ? fmtMoney(tx) : ''}</td><td class="n">${isFinite(net) ? fmtMoney(net) : ''}</td></tr>`;
      });
      return `
      <p class="c">«${c.x('company')}» масъулияти чекланган жамияти<br>таъсисчиларининг умумий йиғилиши</p>
      <h2>Баёни № ${c.x('no', 3)}</h2>
      ${meta(c.date('date'), c.x('city', 14))}
      <p>Йиғилиш раиси: ${c.x('chair', 16)}<br>Йиғилиш котиби: ${c.x('secr', 16)}</p>
      <p><b>КУН ТАРТИБИ:</b> «${c.x('company')}» МЧЖнинг ${c.x('year', 4)} йил ${c.x('q', 3)} чораги соф фойдасини жамият иштирокчилари ўртасида тақсимлаш тўғрисида.</p>
      <p><b>ЭШИТИЛДИ:</b> Жамият директори жамият ${c.x('year', 4)} йил ${c.x('q', 3)} чорагида ${c.money('profit')} соф фойда олганлигини маълум қилди. Йиғилиш раиси соф фойдадан ${c.money('dist')}ни иштирокчиларнинг устав фондидаги улушларига мутаносиб тақсимлаш ва тўлов манбаида ${c.x('tax', 2)}% миқдорида даромад солиғини ушлаб қолишни таклиф қилди. Таклиф бир овоздан маъқулланди.</p>
      <p class="sp">ҚАРОР ҚИЛАДИ:</p>
      ${ol([
        `Жамиятнинг ${c.x('year', 4)} йил ${c.x('q', 3)} чорак молиявий ҳисоботлари тасдиқлансин.`,
        `Соф фойдадан ${c.money('dist')} иштирокчилар ўртасида устав фондидаги улушларига мутаносиб тақсимлансин:`,
      ])}
      <table class="t"><thead><tr><th>№</th><th>Иштирокчи</th><th>Улуши</th><th>Тегишли қисм, сўм</th><th>${tax}% солиқ, сўм</th><th>Тўланадиган, сўм</th></tr></thead>
      <tbody>${rows || `<tr><td></td><td>${c.blank(14)}</td><td></td><td></td><td></td><td></td></tr>`}
      <tr><td></td><td colspan="4"><b>Жами тўланадиган</b></td><td class="n"><b>${tot ? fmtMoney(tot) : ''}</b></td></tr></tbody></table>
      ${ol([
        'Ҳисобланган дивидендлардан даромад солиғи ушлаб қолиниб, давлат бюджетига ўтказилсин; банк хизматлари харажатлари жамият ҳисобидан қоплансин.',
        'Дивидендларни тўлаш бош ҳисобчига, қарор ижросини таъминлаш жамият директорига юклатилсин.',
      ], 3)}
      ${sigTable('Йиғилиш раиси<br><br>Йиғилиш котиби', `____________ ${c.x('chair', 14)}<br><br>____________ ${c.x('secr', 14)}`)}`;
    },
  },
  {
    id: 'claim-letter', cat: 'corporate', sub: 'claims', minutes: 5,
    docTitle: 'Талабнома',
    title: tr('Talabnoma (pretenziya)', 'Претензия', 'Claim letter'),
    desc: tr('Shartnoma boʻyicha qarzdorga sudgacha talab: asosiy qarz, penya va jami summa soʻz bilan; javob muddati.', 'Досудебная претензия контрагенту: основной долг, пеня, итог прописью, срок ответа.', 'Pre-trial claim to a counterparty: principal, penalty, total in words, response deadline.'),
    fields: [
      ...partyFields('cr', 'party1', EX_A),
      { k: 'out', g: 'doc', l: tr('Chiquvchi raqam', 'Исходящий №', 'Reference No.'), ex: '52/26', half: true },
      { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
      { k: 'db', g: 'party2', l: tr('Qarzdor tashkilot', 'Организация-должник', 'Debtor company'), ex: '«Мисол Хизмат» МЧЖ' },
      { k: 'db_head', g: 'party2', l: tr('Rahbar F.I.Sh.', 'Ф.И.О. руководителя', 'Head'), ex: 'Д.Ш. Раҳимова', half: true },
      { k: 'db_stir', g: 'party2', l: tr('STIR', 'ИНН', 'TIN'), ex: '302765432', half: true },
      { k: 'db_addr', g: 'party2', l: tr('Yuridik manzil', 'Юридический адрес', 'Registered address'), ex: 'Тошкент ш., Чилонзор тумани, Бунёдкор шоҳ кўчаси, 10-уй' },
      { k: 'c_no', g: 'contract', l: tr('Shartnoma raqami', 'Номер договора', 'Contract No.'), ex: '45', half: true },
      { k: 'c_date', g: 'contract', l: tr('Shartnoma sanasi', 'Дата договора', 'Contract date'), t: 'date', ex: '2026-05-04', half: true },
      { k: 'facts', g: 'contract', l: tr('Bajarilmagan majburiyat', 'Неисполненное обязательство', 'Breached obligation'), t: 'textarea', ex: 'Шартномага асосан 15.06.2026 йилда етказиб берилган товар учун тўлов 10 банк куни ичида амалга оширилиши лозим эди. Товар 15.06.2026 йилдаги 128-сонли ҳисобварақ-фактура асосида тўлиқ қабул қилинган, бироқ тўлов ҳозиргача амалга оширилмаган.' },
      { k: 'debt', g: 'payment', l: tr('Asosiy qarz', 'Основной долг', 'Principal'), t: 'money', ex: '20500000', half: true },
      { k: 'pen', g: 'payment', l: tr('Penya', 'Пеня', 'Penalty'), t: 'money', ex: '2460000', half: true },
      { k: 'days', g: 'payment', l: tr('Javob/toʻlov muddati (kun)', 'Срок ответа/оплаты (дней)', 'Deadline (days)'), t: 'number', ex: '10', half: true },
    ],
    render: c => {
      const d = c.num('debt'), pn = c.num('pen');
      const total = (isFinite(d) ? d : 0) + (isFinite(pn) ? pn : 0);
      return `
      <p class="c"><b>${c.x('cr_name', 22)}</b><br>СТИР ${c.x('cr_stir', 9)} · ${c.x('cr_addr', 24)} · тел. ${c.x('cr_phone', 12)}</p>
      <p>${c.dshort('date')} № ${c.x('out', 6)}</p>
      ${addressee(`<b>${c.x('db', 20)} раҳбари</b>`, `${c.x('db_head', 14)}га`, `СТИР: ${c.x('db_stir', 9)}`, `Манзил: ${c.x('db_addr', 24)}`)}
      <h2>Талабнома</h2>
      <p>${c.x('cr_name', 18)} (кейинги ўринларда «Кредитор») ва ${c.x('db', 18)} (кейинги ўринларда «Қарздор») ўртасида ${c.dshort('c_date')} йилда ${c.x('c_no', 4)}-сонли шартнома тузилган.</p>
      <p>${c.x('facts', 40)}</p>
      <p>Шу тариқа, Қарздор шартнома бўйича мажбуриятларини лозим даражада бажармади. ${STD_LIABILITY} ва шартнома шартларига мувофиқ, Қарздорнинг Кредитор олдидаги қарзи қуйидагича:</p>
      <table class="t">
        <tr><td>Асосий қарз</td><td class="n">${c.sum('debt')}</td></tr>
        ${c.has('pen') ? `<tr><td>Пеня</td><td class="n">${c.sum('pen')}</td></tr>` : ''}
        <tr><td><b>Жами</b></td><td class="n"><b>${total ? c.span(fmtMoney(total)) : c.blank(10)}</b></td></tr>
      </table>
      <p>Юқоридагиларга асосан, ушбу талабномани олган кундан бошлаб ${c.x('days', 2)} кун ичида ${c.moneyN(total)} миқдоридаги маблағни Кредиторнинг ${c.x('cr_acc', 16)} ҳисоб рақамига (${c.x('cr_bank', 16)}, МФО ${c.x('cr_mfo', 5)}) тўлашингизни талаб қиламиз.</p>
      <p>Белгиланган муддатда талаб қондирилмаса ёки жавоб берилмаса, Кредитор қарзни, пеняни ва суд харажатларини ундириш учун иқтисодий судга мурожаат қилишга мажбур бўлади.</p>
      ${attachments(c, ['Шартнома нусхаси.', 'Ҳисобварақ-фактура ва бошқа бирламчи ҳужжатлар нусхалари.', 'Қарз ва пеня ҳисоб-китоби.'])}
      ${sigTable(c.x('cr_pos', 10), `____________ ${c.x('cr_rep', 16)}`)}`;
    },
  },
];
