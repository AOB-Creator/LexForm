# LexForm — Angular

Hujjat shablonlari generatori: forma to‘ldiriladi, hujjat jonli ko‘rinishda yig‘iladi va Word (.doc), chop etish yoki nusxa ko‘chirish orqali olinadi.

- **Interfeys tillari:** O‘zbekcha (lotin), Русский, English — sarlavhadagi UZ / RU / EN tugmalari.
- **Hujjat tili:** faqat o‘zbek tili — **kirill** yoki **lotin** yozuvida. Shablonlar kirillda yozilgan, lotin varianti rasmiy alifbo qoidalari bo‘yicha avtomatik transliteratsiya qilinadi (ʻ U+02BB, ʼ U+02BC).
- **19 ta shablon:** korporativ (6), kadrlar (5), shartnomalar (6), dalolatnoma va ishonchnoma (2).
- Summalar avtomatik so‘z bilan yoziladi (so‘m / tiyin), qoralamalar brauzerda (localStorage) saqlanadi, yorug‘ / qorong‘i mavzu.

## Ishga tushirish

```bash
npm install      # .npmrc: legacy-peer-deps=true
npm start        # http://localhost:4200
npm test         # vitest: transliteratsiya, summa so‘zda, barcha shablonlar render testi
npm run build    # dist/lexform-app/browser — istalgan statik hostingga (SPA fallback → index.html)
```

Node 22.22+ talab qilinadi (Angular 21).

## Tuzilma

```
knowledge/       Drive’dagi hujjatlar bo‘yicha bilimlar bazasi (shablonlar manbasi)
web/             avvalgi bir faylli HTML versiya
src/app/
  core/doc/        types.ts, engine.ts (Ctx + yordamchi HTML), format.ts (sana, summa so‘zda), translit.ts
  core/i18n/       dictionary.ts (UI matnlari 3 tilda), i18n.service.ts (`t` va `tr` pipe’lari)
  core/services/   storage, prefs (yozuv, mavzu, belgilash), drafts
  templates/       corporate.ts, hr.ts, contracts.ts, acts.ts, shared.ts, index.ts
  features/home/   bosh sahifa: hero, katalog, qidiruv, filtrlar
  features/editor/ forma + jonli hujjat, Word/chop etish/nusxa
  layout/          header, ikonlar
```

## Yangi shablon qo‘shish

1. Tegishli `templates/*.ts` faylida `DocTemplate` obyektini yarating: `id`, `cat`, `title`/`desc` (uz/ru/en), `docTitle`, `fields`, `render(c)`.
2. Maydon nomlari (`l`) uchala tilda bo‘lishi shart; `ex` — **to‘qima** namuna qiymat (haqiqiy shaxsiy ma’lumot ishlatmang).
3. `render` hujjatni **o‘zbek kirillida** qaytaradi; `c.x(k)`, `c.money(k)`, `c.date(k)` qiymatlarni xavfsiz (escape qilingan) chiqaradi.
4. Shablonni `templates/index.ts` dagi `TEMPLATES` ga qo‘shing va `npm test` ni ishga tushiring — test har bir shablonni ikkala yozuvda tekshiradi.
