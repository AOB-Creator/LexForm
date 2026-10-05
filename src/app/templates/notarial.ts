import { esc } from '../core/doc/format';
import { Ctx, meta, ol, p, sigTable } from '../core/doc/engine';
import { DocTemplate, FieldDef } from '../core/doc/types';
import { addressee, attachments, L, personFields, signLine, tr, vehicleFields, vehicleText } from './shared';

const passLabel = tr('Pasport (seriya, raqam, kim bergan, sana)', 'Паспорт (серия, номер, кем и когда выдан)', 'Passport (series, number, issuer, date)');
const who = (c: Ctx, k: string) => `${c.x(k, 22)} (паспорт: ${c.x(k + '_pass', 18)}, яшаш манзили: ${c.x(k + '_addr', 24)})`;
const notaryBox = `<div class="pb"></div><p class="c"><b>Нотариал тасдиқлаш учун жой</b></p><p class="c"><i>(нотариус тўлдиради)</i></p>`;
const cityDate: FieldDef[] = [
  { k: 'city', g: 'doc', l: L.city, ex: 'Тошкент шаҳри', half: true },
  { k: 'date', g: 'doc', l: L.date, t: 'date', ex: '2026-10-05', half: true },
];

export const NOTARIAL: DocTemplate[] = [
  {
    id: 'will', cat: 'notarial', sub: 'wills', minutes: 6,
    docTitle: 'Васиятнома',
    title: tr('Vasiyatnoma', 'Завещание', 'Will'),
    desc: tr('Mol-mulkni bir yoki bir necha merosxoʻrga vasiyat qilish; ulushlar jadvali. Notarial tasdiqlanadi.', 'Завещание имущества одному или нескольким наследникам с долями. Удостоверяется нотариусом.', 'Leave property to one or more heirs with shares. Certified by a notary.'),
    fields: [
      ...cityDate,
      { k: 'ts', g: 'testator', l: L.fio, ex: 'Раҳимов Аҳмад Каримович' },
      { k: 'ts_born', g: 'testator', l: L.birth, t: 'date', ex: '1958-04-11', half: true },
      { k: 'ts_pass', g: 'testator', l: passLabel, ex: 'AB 7654321, Ургут тумани ИИБ, 02.05.2016', half: true },
      { k: 'ts_addr', g: 'testator', l: L.addr, ex: 'Самарқанд вилояти, Ургут тумани, Боғишамол кўчаси, 8-уй' },
      { k: 'scope', g: 'heirs', l: tr('Vasiyat hajmi', 'Объём завещания', 'Scope'), t: 'select', opts: ['барча мол-мулкимни', 'қуйидаги мол-мулкимни'], ex: 'барча мол-мулкимни' },
      { k: 'what', g: 'heirs', l: tr('Mol-mulk tavsifi (agar aniq mulk boʻlsa)', 'Описание имущества (если конкретное)', 'Property description (if specific)'), t: 'textarea', hint: tr('Masalan: kvartira manzili, kadastr raqami.', 'Например: адрес квартиры, кадастровый номер.', 'E.g. flat address, cadastre number.') },
      { k: 'heirs', g: 'heirs', l: tr('Merosxoʻrlar', 'Наследники', 'Heirs'), t: 'rows',
        cols: [{ k: 'fio', l: L.fio }, { k: 'kin', l: tr('Qarindoshligi', 'Родство', 'Relation') }, { k: 'born', l: tr('Tugʻilgan sanasi', 'Дата рождения', 'Date of birth') }, { k: 'share', l: tr('Ulushi', 'Доля', 'Share') }],
        ex: [{ fio: 'Раҳимов Жасур Аҳмадович', kin: 'ўғли', born: '14.06.1986', share: '1/2' }, { fio: 'Раҳимова Нодира Аҳмадовна', kin: 'қизи', born: '02.02.1990', share: '1/2' }] },
    ],
    render: c => {
      const heirs = c.rows('heirs').filter(r => (r['fio'] ?? '').trim());
      const list = heirs.length
        ? heirs.map(r => `${c.span(esc(r['fio'].trim()))}${(r['kin'] ?? '').trim() ? ' (' + c.span(esc(r['kin'].trim())) + ')' : ''}${(r['born'] ?? '').trim() ? ', ' + c.span(esc(r['born'].trim())) + ' йилда туғилган' : ''}${(r['share'] ?? '').trim() ? ' — ' + c.span(esc(r['share'].trim())) + ' улушда' : ''}`)
        : [c.blank(40)];
      return `
      <h2>Васиятнома</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Мен, ${c.x('ts', 22)}, ${c.dshort('ts_born')} йилда туғилган, паспорт: ${c.x('ts_pass', 18)}, яшаш манзили: ${c.x('ts_addr', 24)}, ақли расо ва соғлом ҳолатда, ўз хоҳишимга кўра ушбу васиятнома билан қуйидаги фармойишни бераман:`)}
      ${p(`Вафотимдан сўнг менга тегишли бўлган ${c.x('scope', 14)}${c.raw('scope').startsWith('барча') ? ', қаерда бўлишидан ва нимадан иборат бўлишидан қатъи назар,' : ':'} ${c.has('what') ? c.x('what') + ',' : ''} қуйидаги шахсларга васият қиламан:`)}
      ${ol(list)}
      ${p('Ўзбекистон Республикаси Фуқаролик кодексининг мерос ҳуқуқига оид нормалари, шу жумладан мажбурий улуш тўғрисидаги қоидалар менга нотариус томонидан тушунтирилди.')}
      ${p('Васиятноманинг мазмуни менга тўлиқ тушунарли, у менинг хоҳиш-иродамга мос келади. Васиятнома мен томонидан шахсан ўқиб чиқилди ва имзоланди.')}
      ${p('Ушбу васиятнома икки нусхада тузилди: бир нусхаси нотариал идорада сақланади, иккинчиси васият қилувчига берилади.')}
      ${sigTable('Васият қилувчи', `____________ ${c.x('ts', 18)}`)}
      ${notaryBox}`;
    },
  },
  {
    id: 'vehicle-poa', cat: 'notarial', sub: 'poa', minutes: 5,
    docTitle: 'Автотранспорт воситасига ишончнома',
    title: tr('Avtomobilga ishonchnoma', 'Доверенность на автомобиль', 'Vehicle power of attorney'),
    desc: tr('Jismoniy shaxs nomidan avtomobilni boshqarish, foydalanish yoki tasarruf etish uchun ishonchnoma.', 'Доверенность физлица на управление, пользование или распоряжение автомобилем.', 'An individual’s power of attorney to drive, use or dispose of a car.'),
    fields: [
      ...cityDate,
      ...personFields('pr', 'principal', { fio: 'Юсупов Шерзод Анварович', pass: 'AC 7654321, Миробод тумани ИИБ, 10.02.2017', addr: 'Тошкент ш., Миробод тумани, Нукус кўчаси, 20-уй, 21-хонадон' }).filter(f => !f.k.endsWith('_acc')),
      ...personFields('ag', 'agent', { fio: 'Алиев Тимур Рустамович', pass: 'AB 1234567, Чилонзор тумани ИИБ, 12.08.2018', addr: 'Тошкент ш., Чилонзор тумани, 5-мавзе, 3-уй, 7-хонадон' }).filter(f => !f.k.endsWith('_acc')),
      ...vehicleFields('vehicle'),
      { k: 'powers', g: 'powers', l: tr('Vakolatlar', 'Полномочия', 'Powers'), t: 'select', opts: ['бошқариш ва ундан фойдаланиш', 'бошқариш, фойдаланиш, техник кўрикдан ўтказиш ва таъмирлаш', 'бошқариш, фойдаланиш ва тасарруф этиш (сотиш, гаровга қўйиш, ҳисобдан чиқариш)'], ex: 'бошқариш ва ундан фойдаланиш' },
      { k: 'until', g: 'powers', l: tr('Amal qilish muddati (gacha)', 'Срок действия (до)', 'Valid until'), t: 'date', ex: '2027-10-05', half: true },
      { k: 'deleg', g: 'powers', l: tr('Boshqaga ishonish', 'Передоверие', 'Delegation'), t: 'select', opts: ['ваколатларни бошқа шахсга ишониш ҳуқуқисиз', 'ваколатларни бошқа шахсга ишониш ҳуқуқи билан'], ex: 'ваколатларни бошқа шахсга ишониш ҳуқуқисиз', half: true },
    ],
    render: c => `
      <h2>Ишончнома</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Мен, ${who(c, 'pr')}, ушбу ишончнома билан ${who(c, 'ag')}га менга мулк ҳуқуқи асосида тегишли бўлган ${vehicleText(c)}ни ${c.x('powers', 20)} ҳуқуқини бераман.`)}
      ${p('Шу мақсадда ишончли вакилга қуйидаги ҳуқуқлар берилади: автотранспорт воситасини Ўзбекистон Республикаси ҳудудида бошқариш; йўл ҳаракати хавфсизлиги органлари ва бошқа ташкилотларда менинг номимдан вакиллик қилиш; зарур ҳужжатларни олиш ва топшириш, аризалар бериш ва имзолаш; ушбу ишончнома билан боғлиқ бошқа ҳаракатларни амалга ошириш.')}
      ${p(`Ишончнома ${c.date('until')}гача амал қилади ва ${c.x('deleg', 20)} берилди.`)}
      ${p('Фуқаролик кодексининг ишончнома ва уни бекор қилишга оид нормалари менга тушунтирилди.')}
      ${sigTable('Ишонч билдирувчи', `____________ ${c.x('pr', 18)}`)}
      ${notaryBox}`,
  },
  {
    id: 'inheritance-application', cat: 'notarial', sub: 'applications', minutes: 5,
    docTitle: 'Меросни қабул қилиш тўғрисида ариза',
    title: tr('Merosni qabul qilish toʻgʻrisida ariza', 'Заявление о принятии наследства', 'Application to accept inheritance'),
    desc: tr('Notariusga: meros qoldiruvchi, merosxoʻr asoslari, mol-mulk va boshqa merosxoʻrlar. Meros huquqi guvohnomasini soʻrash.', 'Нотариусу: наследодатель, основания, имущество, другие наследники; просьба о свидетельстве.', 'To a notary: deceased, grounds, estate and other heirs; request for a certificate.'),
    fields: [
      { k: 'notary', g: 'addressee', l: tr('Notarial idora / notarius', 'Нотариальная контора / нотариус', 'Notary office / notary'), ex: 'Юнусобод тумани давлат нотариал идораси' },
      { k: 'ap', g: 'applicant', l: L.fio, ex: 'Раҳимов Жасур Аҳмадович' },
      { k: 'ap_pass', g: 'applicant', l: passLabel, ex: 'AD 1122334, Юнусобод тумани ИИБ, 01.03.2020' },
      { k: 'ap_addr', g: 'applicant', l: L.addr, ex: 'Тошкент шаҳри, Юнусобод тумани, Боғишамол кўчаси, 10-уй, 15-хонадон' },
      { k: 'ap_phone', g: 'applicant', l: L.phone, ex: '+998 90 222-33-44', half: true },
      { k: 'kin', g: 'applicant', l: tr('Meros qoldiruvchiga kimligi', 'Кем приходится наследодателю', 'Relation to the deceased'), ex: 'ўғли', half: true },
      { k: 'dc', g: 'deceased', l: L.fio, ex: 'Раҳимов Аҳмад Каримович' },
      { k: 'dc_died', g: 'deceased', l: tr('Vafot etgan sana', 'Дата смерти', 'Date of death'), t: 'date', ex: '2026-05-14', half: true },
      { k: 'dc_cert', g: 'deceased', l: tr('Oʻlim haqida guvohnoma', 'Свидетельство о смерти', 'Death certificate'), ex: 'I-СР 0123456', half: true },
      { k: 'dc_addr', g: 'deceased', l: tr('Oxirgi yashash joyi', 'Последнее место жительства', 'Last residence'), ex: 'Самарқанд вилояти, Ургут тумани, Боғишамол кўчаси, 8-уй' },
      { k: 'basis', g: 'heirs', l: tr('Meros asosi', 'Основание наследования', 'Basis'), t: 'select', opts: ['қонун бўйича', 'васиятнома бўйича'], ex: 'қонун бўйича', half: true },
      { k: 'estate', g: 'heirs', l: tr('Meros mol-mulki', 'Наследственное имущество', 'Estate'), t: 'textarea', ex: 'Самарқанд вилояти, Ургут тумани, Боғишамол кўчаси, 8-уйда жойлашган турар жой уйи; банкдаги омонатлар.' },
      { k: 'others', g: 'heirs', l: tr('Boshqa merosxoʻrlar', 'Другие наследники', 'Other heirs'), t: 'rows',
        cols: [{ k: 'fio', l: L.fio }, { k: 'kin', l: tr('Qarindoshligi', 'Родство', 'Relation') }, { k: 'addr', l: L.addr }],
        ex: [{ fio: 'Раҳимова (Солиева) Мунира', kin: 'турмуш ўртоғи', addr: 'Самарқанд вилояти, Ургут тумани, Боғишамол кўчаси, 8-уй' }] },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => {
      const others = c.rows('others').filter(r => (r['fio'] ?? '').trim());
      return `
      ${addressee(`<b>${c.x('notary', 26)}га</b>`, `${c.x('ap', 22)}дан`, `Паспорт: ${c.x('ap_pass', 18)}`, `Яшаш манзили: ${c.x('ap_addr', 24)}`, c.has('ap_phone') ? `Тел.: ${c.x('ap_phone')}` : '')}
      <h2>Ариза</h2>
      <p class="c"><i>меросни қабул қилиш тўғрисида</i></p>
      ${p(`${c.date('dc_died')}да ${c.x('dc', 22)} вафот этди (ўлим тўғрисидаги гувоҳнома ${c.x('dc_cert', 12)}). Унинг охирги яшаш жойи: ${c.x('dc_addr', 24)}.`)}
      ${p(`Мен марҳумнинг ${c.x('kin', 8)} бўламан ва ${c.x('basis', 12)} меросхўр ҳисобланаман. Ушбу ариза билан унинг вафотидан сўнг очилган меросни қабул қилаётганимни маълум қиламан.`)}
      ${p(`Мерос таркибига қуйидагилар киради: ${c.x('estate', 30)}`)}
      ${p(others.length ? 'Мендан ташқари қуйидаги меросхўрлар бор:' : 'Мендан бошқа меросхўрлар маълум эмас.')}
      ${others.length ? ol(others.map(r => `${c.span(esc(r['fio'].trim()))}${(r['kin'] ?? '').trim() ? ' — ' + c.span(esc(r['kin'].trim())) : ''}${(r['addr'] ?? '').trim() ? ', ' + c.span(esc(r['addr'].trim())) : ''}`)) : ''}
      ${p('Мерос ҳуқуқи тўғрисида гувоҳнома беришингизни сўрайман.')}
      ${attachments(c, ['Ўлим тўғрисидаги гувоҳнома нусхаси.', 'Қариндошликни тасдиқловчи ҳужжатлар нусхалари.', 'Мерос мол-мулкига оид ҳужжатлар нусхалари.'])}
      ${signLine(c, 'date', 'ap')}`;
    },
  },
  {
    id: 'gift-contract', cat: 'notarial', sub: 'contracts', minutes: 6,
    docTitle: 'Ҳадя шартномаси',
    title: tr('Hadya shartnomasi', 'Договор дарения', 'Gift agreement'),
    desc: tr('Mol-mulkni (uy-joy, avtomobil va boshq.) bepul hadya qilish. Koʻchmas mulk uchun notarial tasdiqlanadi.', 'Безвозмездная передача имущества (жильё, автомобиль и др.). Для недвижимости — у нотариуса.', 'Gratuitous transfer of property (home, car, etc.); notarised for real estate.'),
    fields: [
      ...cityDate,
      ...personFields('dn', 'donor', { fio: 'Раҳимов Аҳмад Каримович', pass: 'AB 7654321, Ургут тумани ИИБ, 02.05.2016', addr: 'Самарқанд вилояти, Ургут тумани, Боғишамол кўчаси, 8-уй' }).filter(f => !f.k.endsWith('_acc')),
      ...personFields('de', 'donee', { fio: 'Раҳимов Жасур Аҳмадович', pass: 'AD 1122334, Юнусобод тумани ИИБ, 01.03.2020', addr: 'Тошкент шаҳри, Юнусобод тумани, Боғишамол кўчаси, 10-уй, 15-хонадон' }).filter(f => !f.k.endsWith('_acc')),
      { k: 'kin', g: 'donee', l: tr('Hadya qiluvchiga kimligi', 'Кем приходится дарителю', 'Relation to donor'), ex: 'ўғли', half: true },
      { k: 'obj', g: 'gift', l: tr('Hadya predmeti', 'Предмет дарения', 'Gift'), t: 'textarea', ex: 'Тошкент шаҳри, Юнусобод тумани, Боғишамол кўчаси, 10-уй, 15-хонадонда жойлашган, умумий майдони 72 кв.м бўлган икки хонали квартира (кадастр рақами 10:05:01:02:03:0045)' },
      { k: 'title', g: 'gift', l: tr('Mulk huquqini tasdiqlovchi hujjat', 'Правоустанавливающий документ', 'Title document'), ex: '12.03.2019 йилдаги кадастр кўчирмаси' },
      { k: 'value', g: 'gift', l: tr('Baholangan qiymati', 'Оценочная стоимость', 'Valuation'), t: 'money', ex: '650000000' },
    ],
    render: c => `
      <h2>Ҳадя шартномаси</h2>
      ${meta(c.x('city', 14), c.date('date'))}
      ${p(`Биз, бир тарафдан ${who(c, 'dn')} (кейинги ўринларда «Ҳадя қилувчи»), ва иккинчи тарафдан ${who(c, 'de')} (кейинги ўринларда «Ҳадя олувчи»), ушбу шартномани қуйидагилар ҳақида туздик:`)}
      ${ol([
        `Ҳадя қилувчи ўзига мулк ҳуқуқи асосида тегишли бўлган ${c.x('obj', 30)}ни (кейинги ўринларда «Мулк») Ҳадя олувчига бепул ҳадя қилади, Ҳадя олувчи эса уни миннатдорчилик билан қабул қилади.`,
        `Мулк Ҳадя қилувчига ${c.x('title', 18)} асосида тегишли.`,
        `Мулкнинг баҳоланган қиймати ${c.money('value')}ни ташкил этади.`,
        'Ҳадя қилувчи шартнома тузилгунга қадар Мулк ҳеч кимга сотилмаганлиги, гаровга қўйилмаганлиги, низоли эмаслиги ва тақиқ остида эмаслигини кафолатлайди.',
        'Ҳадя олувчи Мулкка нисбатан мулк ҳуқуқини қонунчиликда белгиланган тартибда давлат рўйхатидан ўтказилган пайтдан бошлаб олади. Рўйхатдан ўтказиш билан боғлиқ харажатларни Ҳадя олувчи тўлайди.',
        `Ҳадя олувчи Ҳадя қилувчининг ${c.x('kin', 8)} ҳисобланади.`,
        'Тарафларга Фуқаролик кодексининг ҳадя шартномасига оид нормалари, шу жумладан ҳадядан бош тортиш ва ҳадяни бекор қилиш асослари тушунтирилди.',
        'Шартнома уч нусхада тузилди: биттаси нотариал идорада сақланади, қолганлари тарафларга берилади.',
      ])}
      <h3>Тарафларнинг имзолари</h3>
      ${sigTable(`<b>Ҳадя қилувчи</b><br><br>____________ ${c.x('dn', 18)}`, `<b>Ҳадя олувчи</b><br><br>____________ ${c.x('de', 18)}`)}
      ${notaryBox}`,
  },
];
