import { p } from '../core/doc/engine';
import { DocTemplate, FieldDef } from '../core/doc/types';
import { addressee, L, signLine, tr } from './shared';

const toHead: FieldDef[] = [
  { k: 'co', g: 'employer', l: L.company, ex: '«Намуна Савдо» МЧЖ' },
  { k: 'head', g: 'employer', l: tr('Direktor F.I.Sh.', 'Ф.И.О. директора', 'Director'), ex: 'А.Б. Каримов' },
];
const emp = (pos = true): FieldDef[] => [
  { k: 'w', g: 'employee', l: L.fio, ex: 'Алиев Тимур Рустамович' },
  ...(pos ? [{ k: 'pos', g: 'employee', l: L.position, ex: 'савдо менежери', half: true }, { k: 'dept', g: 'employee', l: tr('Boʻlim', 'Отдел', 'Department'), ex: 'савдо бўлими', half: true }] as FieldDef[] : []),
];
const head = (c: import('../core/doc/engine').Ctx, withPos = true) => addressee(
  `<b>${c.x('co', 20)} директори</b>`, `${c.x('head', 14)}га`,
  withPos ? `${c.x('dept', 12)} ${c.x('pos', 14)}` : '', `${c.x('w', 22)}дан`);

export const HR_REQUESTS: DocTemplate[] = [
  {
    id: 'hire-application', cat: 'hr', sub: 'applications', minutes: 2,
    docTitle: 'Ишга қабул қилиш тўғрисида ариза',
    title: tr('Ishga qabul qilish toʻgʻrisida ariza', 'Заявление о приёме на работу', 'Job application'),
    desc: tr('Nomzodning direktorga arizasi: lavozim, sana, ish turi.', 'Заявление кандидата директору: должность, дата, вид работы.', 'Candidate’s application to the director: position, date, type.'),
    fields: [
      ...toHead,
      { k: 'w', g: 'employee', l: L.fio, ex: 'Алиев Тимур Рустамович' },
      { k: 'w_addr', g: 'employee', l: L.addr, ex: 'Тошкент ш., Чилонзор тумани, 5-мавзе, 3-уй, 7-хонадон' },
      { k: 'w_phone', g: 'employee', l: L.phone, ex: '+998 90 000-00-00', half: true },
      { k: 'pos', g: 'terms', l: L.position, ex: 'савдо менежери', half: true },
      { k: 'dept', g: 'terms', l: tr('Boʻlim', 'Отдел', 'Department'), ex: 'савдо бўлими', half: true },
      { k: 'kind', g: 'terms', l: tr('Ish turi', 'Вид работы', 'Type'), t: 'select', opts: ['асосий иш жойи сифатида', 'ўриндошлик асосида'], ex: 'асосий иш жойи сифатида', half: true },
      { k: 'start', g: 'terms', l: tr('Ish boshlash sanasi', 'Дата начала', 'Start date'), t: 'date', ex: '2026-10-12' },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${addressee(`<b>${c.x('co', 20)} директори</b>`, `${c.x('head', 14)}га`, `${c.x('w', 22)}дан`, `Манзил: ${c.x('w_addr', 24)}`, `Тел.: ${c.x('w_phone', 12)}`)}
      <h2>Ариза</h2>
      ${p(`Мени ${c.date('start')}дан бошлаб ${c.x('dept', 12)} ${c.x('pos', 14)} лавозимига ${c.x('kind', 16)} ишга қабул қилишингизни сўрайман.`)}
      ${p('Ички меҳнат тартиби қоидалари, лавозим йўриқномаси ва меҳнат шартлари билан танишишга розиман.')}
      ${signLine(c, 'date', 'w')}`,
  },
  {
    id: 'resignation-application', cat: 'hr', sub: 'applications', minutes: 2,
    docTitle: 'Ишдан бўшаш тўғрисида ариза',
    title: tr('Oʻz xohishiga koʻra ishdan boʻshash arizasi', 'Заявление об увольнении по собственному желанию', 'Resignation letter'),
    desc: tr('Xodimning mehnat shartnomasini bekor qilish haqidagi arizasi va oxirgi ish kuni.', 'Заявление работника о расторжении трудового договора и последний рабочий день.', 'Employee’s notice to terminate the employment contract and last working day.'),
    fields: [
      ...toHead, ...emp(),
      { k: 'last', g: 'terms', l: tr('Oxirgi ish kuni', 'Последний рабочий день', 'Last working day'), t: 'date', ex: '2026-10-19', half: true },
      { k: 'reason', g: 'terms', l: tr('Asos', 'Основание', 'Ground'), t: 'select', opts: ['ўз хоҳишимга кўра', 'бошқа ишга ўтишим муносабати билан', 'пенсияга чиқишим муносабати билан', 'ўқишга киришим муносабати билан'], ex: 'ўз хоҳишимга кўра', half: true },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${head(c)}
      <h2>Ариза</h2>
      ${p(`Мени ${c.x('reason', 16)} ${c.date('last')}дан эгаллаб турган лавозимимдан озод қилишингизни ва меҳнат шартномасини бекор қилишингизни сўрайман.`)}
      ${p('Ҳисоб-китоб ва меҳнат дафтарчаси (электрон меҳнат дафтарчасидаги ёзув) қонунчиликда белгиланган тартибда расмийлаштирилишини сўрайман.')}
      ${signLine(c, 'date', 'w')}`,
  },
  {
    id: 'leave-application', cat: 'hr', sub: 'applications', minutes: 2,
    docTitle: 'Таътил бериш тўғрисида ариза',
    title: tr('Taʼtil berish toʻgʻrisida ariza', 'Заявление на отпуск', 'Leave request'),
    desc: tr('Yillik mehnat taʼtili, haq saqlanmaydigan yoki oʻquv taʼtili: sana va kunlar soni.', 'Ежегодный, без сохранения зарплаты или учебный отпуск: даты и количество дней.', 'Annual, unpaid or study leave: dates and number of days.'),
    fields: [
      ...toHead, ...emp(),
      { k: 'kind', g: 'leave', l: tr('Taʼtil turi', 'Вид отпуска', 'Leave type'), t: 'select', opts: ['йиллик асосий меҳнат таътили', 'иш ҳақи сақланмайдиган таътил', 'ўқув таътили', 'йиллик қўшимча таътил'], ex: 'йиллик асосий меҳнат таътили' },
      { k: 'from', g: 'leave', l: tr('Boshlanish sanasi', 'С какой даты', 'From'), t: 'date', ex: '2026-11-02', half: true },
      { k: 'days', g: 'leave', l: tr('Kalendar kunlar soni', 'Календарных дней', 'Calendar days'), t: 'number', ex: '21', half: true },
      { k: 'period', g: 'leave', l: tr('Ish davri (yillik taʼtil uchun)', 'Рабочий период (для ежегодного)', 'Working period (annual leave)'), ex: '2025-2026 йиллар' },
      { k: 'date', g: 'sign', l: L.date, t: 'date', ex: '2026-10-05' },
    ],
    render: c => `
      ${head(c)}
      <h2>Ариза</h2>
      ${p(`Менга ${c.date('from')}дан бошлаб ${c.x('days', 3)} календарь кун муддатга ${c.x('kind', 20)}${c.has('period') ? ` (${c.x('period')} иш даври учун)` : ''} беришингизни сўрайман.`)}
      ${signLine(c, 'date', 'w')}`,
  },
];
