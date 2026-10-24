import { esc } from '../../core/doc/format';
import { Ctx } from '../../core/doc/engine';

export const STD_LIABILITY_RU = 'Законом Республики Узбекистан «О договорно-правовой базе деятельности хозяйствующих субъектов»';
export const NOTARY_BOX_RU = `<div class="pb"></div><p class="c"><b>Место для нотариального удостоверения</b></p><p class="c"><i>(заполняется нотариусом)</i></p>`;

export const personCellRu = (c: Ctx, pfx: string, role: string) =>
  `<b>«${role}»</b><br>${c.x(pfx, 20)}<br>Паспорт: ${c.x(pfx + '_pass', 18)}<br>Адрес: ${c.x(pfx + '_addr', 22)}<br>ПИНФЛ: ${c.x(pfx + '_pinfl', 14)}<br>Счёт/карта: ${c.x(pfx + '_acc', 18)}<br><br>____________ ${c.x(pfx, 14)}`;

export const whoRu = (c: Ctx, k: string) => `${c.x(k, 22)} (паспорт: ${c.x(k + '_pass', 18)}, адрес проживания: ${c.x(k + '_addr', 24)})`;

export const attachmentsRu = (c: Ctx, fixed: string[], extraKey?: string) => {
  const extra = extraKey ? c.raw(extraKey).split('\n').map(s => s.trim()).filter(Boolean).map(s => c.span(esc(s))) : [];
  const all = [...fixed, ...extra];
  return all.length ? `<p><b>Приложение:</b></p><ol>${all.map(i => `<li>${i}</li>`).join('')}</ol>` : '';
};

export const ackRu = (c: Ctx, k = 'w') => `<p>С приказом ознакомлен(а): ____________ ${c.x(k, 16)} &nbsp; «___» __________ 20__ г.</p>`;

export const vehicleTextRu = (c: Ctx) =>
  `транспортное средство марки ${c.x('v_model', 14)}, ${c.x('v_year', 4)} года выпуска, цвет ${c.x('v_color', 6)}, государственный номер ${c.x('v_plate', 10)}, номер кузова (VIN) ${c.x('v_vin', 14)}, номер двигателя ${c.x('v_engine', 10)} (свидетельство о регистрации: ${c.x('v_doc', 16)})`;

export const orderHeadRu = (c: Ctx, subject: string, dateKey = 'date') => `
  <p class="c">Общество с ограниченной ответственностью «${c.x('company')}»</p>
  <h2>Приказ № ${c.x('no', 4)}</h2>
  <div class="meta"><span>${c.date(dateKey)}</span><span>${c.x('city', 12)}</span></div>
  <p class="c"><i>${subject}</i></p>
  <p class="sp">ПРИКАЗЫВАЮ:</p>`;
