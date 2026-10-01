# LexForm knowledge base — Uzbek legal & business document templates

Source: Google Drive folder "My documents" (owner business.alpamis@gmail.com), read 2026-10-01.
~140 files / **~80 unique documents** (many files are duplicated across sub-folders) in Uzbek Cyrillic, Uzbek Latin
and Russian. Jurisdiction: **Republic of Uzbekistan** (a few samples are Russian-Federation documents — flagged).

## Folder structure in Drive
- `Shartnomalar` (contracts) → Молиявий ёрдам · Ишлар бажариш, хизмат кўрсатиш · Договор-ГПХ · Договор купли продажи
  помещений · Ижара шартномалари · Товар олди сотди · Юк ташиш
- `Таъсисчилик билан боғлиқ` (founder/corporate) · `Tasis hujjatlar` (charter docs)
- `Кадрга боғлиқ` (HR)
- `Бирламчи хужжатлар намуналари янгиланган` (primary document samples, updated — superset of most others)

## Notes by category
| File | Covers |
|---|---|
| [01-corporate.md](01-corporate.md) | LLC establishment, director appointment/release, name & address change, charter (new edition), charter-fund increase/decrease & contribution acts, dividends, gift, vehicle sale order |
| [02-hr-labour.md](02-hr-labour.md) | Employment contracts (standard form, LLC, IE), dismissal & staffing orders, inventory order, ~45 HR orders library, collective agreement, job descriptions, objektivka, CV, pension salary certificate |
| [03-lease.md](03-lease.md) | Premises / building / equipment / vehicle leases, state-tax registration of real-estate leases + housing lease model form |
| [04-services-works.md](04-services-works.md) | Services (incl. budget/Treasury), GPH with individual + act, advertising, university paid services, pudrat (construction), subcontract (RF), outstaffing, simple partnership |
| [05-finance-sale-transport.md](05-finance-sale-transport.md) | Financial aid / interest-free loans, non-repayable aid, suretyship, debt transfer, goods sale, premises sale, cargo carriage, supplementary agreements |
| [06-primary-accounting.md](06-primary-accounting.md) | Accounting policy, document-flow schedule, tax forms 04/08, М-7, М-29, Т-53, defect act, tolling return act, document handover, material report, staffing table |

## Cross-cutting conventions (what a form generator must handle)
- **Document families**: Қарор/Решение (decision of sole participant) or Баён(нома)/Протокол (general meeting) →
  executed by Буйруқ/Приказ (director's order) with "Асос:/Основание:" referencing the decision; contracts →
  acceptance acts (далолатнома/акт), invoices (ҳисоб-фактура), supplementary agreements.
- **Parties block**: legal entity name in «», form (МЧЖ/ООО/MChJ, ХК/ЧП private enterprise, ХТ/ИП individual
  entrepreneur, АЖ/АО), represented by position + FIO "acting on the basis of" Устав/Низом/ишончнома (Charter/
  Regulation/POA); individuals by FIO, birth date, passport series+№, issuing ИИБ district, date, registered address.
- **Requisites**: СТИР/ИНН (TIN, 9 digits), х/р / р/с (20-digit settlement account), bank & branch, МФО (5-digit bank
  code), ОКЭД/ХХТУТ (activity code), ОКОНХ (legacy), legal address, phone; signature + М.Ў./М.П. (seal).
- **Amounts** always in digits **and words** (сўм/сум + тийин) — several samples contain digit/word mismatches, so a
  generator should produce words automatically (Uzbek Cyrillic, Uzbek Latin, Russian).
- **Dates**: «__» ______ 20__ йил / г.; notarial style writes date in words.
- **Standard liability clauses** (Law №670-I of 29.08.1998 "On contractual-legal basis of business entities"):
  supplier/executor delay 0.5%/day ≤ 50%; late payment 0.4%/day ≤ 50%; poor quality 20% fine.
- **Disputes**: negotiation → pre-trial claim (1 month) → Economic court (formerly "Хўжалик суди") at defendant's
  location; arbitration (третейский суд) optional.
- **Registrations**: LLC changes via Davlat xizmatlari markazi / Ягона дарча (re-registration within 30 days; tax
  office within 10 days); real-estate leases with tax service within 10 days (QR notice); budget contracts with
  Treasury; vehicle leases/gifts notarized; real-estate sale/gift — notarization + state registration.
- **Languages**: Uzbek Cyrillic (majority), Uzbek Latin (newer docs, charter), Russian (many contracts/HR orders).

## Data-quality flags found while reading
- Misnamed files: "Устав изменен" is an RF article on IP in charter capital; "Протокол_Приказ_на_получ_дивиденд"
  is an LLC-establishment decision.
- Russian-Federation templates needing localization: car lease with individual (roubles, RF law),
  subcontract (Novosibirsk, ГК РФ, VAT 18%), premises sale ("арбитражный суд").
- Outdated references: old Labour Code article numbers (new LC since 30.04.2023), dividend tax 10% sample (5% in
  Uzbek template), VAT 15% (2019 change), minimum wage amounts, "Хўжалик суди" naming.
- Drafting errors to fix in templates: seller/buyer swapped in a sale clause; garbled disputes clause in "Договор
  аренда СНОВ"; arithmetic errors in car-lease totals; party labels swapped in pudrat requisites; amount-in-words
  mismatches; leftover company names in filled examples.
- Personal data present in filled examples (real names, passport numbers, TINs, bank accounts) — strip before
  reusing as public templates.
