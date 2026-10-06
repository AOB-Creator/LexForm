# LexForm — Angular (v1.1)

Hujjat shablonlari generatori: forma to‘ldiriladi, hujjat jonli ko‘rinishda yig‘iladi va Word (.doc), chop etish yoki nusxa ko‘chirish orqali olinadi.

- **Interfeys tillari:** O‘zbekcha (lotin), Русский, English — sarlavhadagi UZ / RU / EN tugmalari.
- **Hujjat tili:** faqat o‘zbek tili — **kirill** yoki **lotin** yozuvida. Shablonlar kirillda yozilgan, lotin varianti rasmiy alifbo qoidalari bo‘yicha avtomatik transliteratsiya qilinadi (ʻ U+02BB, ʼ U+02BC).
- **127 ta shablon, 6 boʻlim** (yurxizmat.uz tuzilmasi asosida):
  - **Shartnomalar (30)** — xizmat, oldi-sotdi, yetkazib berish, pudrat, yuk tashish, saqlash, NDA, ijara (noturar, turar joy, uskuna, avtomobil), avtomobil oldi-sotdi, qarz va tilxat, dalolatnomalar, hisobvaraq, bekor qilish kelishuvi, komissiya, topshiriq, dasturiy taʼminot, garov, kafillik, sessiya, oʻzaro hisobga olish, ayirboshlash
  - **Arizalar (15)** — fuqaro murojaati, isteʼmolchi talabnomasi, kredit kechiktirish, kommunal qayta hisob, rasmiy xat, soliq qaytarish, toʻlov kechiktirish, maktab/bogʻcha/oʻtkazish, mahalla maʼlumotnomasi, bolaning darsga kelmagani, kartani bloklash, bolali oilalarga nafaqa, litsenziya
  - **Shaxsiy tarkib (27)** — xodim arizalari, buyruqlar (qabul, boʻshatish, taʼtil, intizomiy, safar, oʻtkazish, mukofot, shtat), mehnat va moddiy javobgarlik shartnomalari, maʼlumotnomalar, bildirgi, ogohlantirish, lavozim yoʻriqnomasi, homiladorlik va bola parvarishi taʼtillari, v.b. tayinlash, dam olish kunida ishlash, qoʻshimcha kelishuv, kelishuv bilan bekor qilish, masofaviy ish
  - **Notarial hujjatlar (15)** — vasiyatnoma, ishonchnomalar, meros, rozilik (bola, er-xotin), hadya, kvartira, nikoh shartnomasi, aliment kelishuvi, pensiya va bank ishonchnomalari, vasiyatnomani bekor qilish
  - **Sudga oid hujjatlar (19)** — daʼvolar (aliment, nikoh, mol-mulk, qarz, ish haqi, zarar, isteʼmolchi), sud buyrugʻi, iltimosnoma, eʼtiroz, nusxa, apellyatsiya, kassatsiya, ishga tiklash, bolaning yashash joyi, aliment miqdorini oʻzgartirish, ijro varaqasi, daʼvoni taʼminlash
  - **Korporativ hujjatlar (21)** — MChJ qarorlari va ustavi, yillik yigʻilish, yirik bitim, ulush sotish, ishtirokchi chiqishi, talabnoma va javob, kafolat va rekvizitlar xati, ishonchnoma, filial, tugatish, rekvizit oʻzgarishi, tovar va avtomobil ishonchnomalari
- Summalar avtomatik so‘z bilan yoziladi (so‘m / tiyin), qoralamalar brauzerda (localStorage) saqlanadi, yorug‘ / qorong‘i mavzu.

## Qulay funksiyalar

- **Rekvizitlar kitobi** — tashkilot yoki shaxs maʼlumotlarini «Kitobga saqlash» bilan saqlab, istalgan hujjatdagi tomon blokiga bir bosishda qoʻyish.
- **Mening hujjatlarim** (`/my`) — barcha qoralamalar (tahrir vaqti, toʻldirilganlik %), rekvizitlar kitobi, **zaxira nusxa** (.json eksport/import, import qilinadigan qiymatlar tozalanadi).
- **Sevimlilar** (★) va **oxirgi ochilganlar** bosh sahifada.
- **Tezkor qidiruv** — `Ctrl+K` (lotin/kirill/rus/ingliz nomlar boʻyicha).
- **Maydonlarni tekshirish** — STIR (9), JShShIR (14), MFO (5), hisob raqami (20), telefon, pasport formati.
- **«Bugun»** tugmasi sana maydonlarida, **masshtab** (70–150%), `Ctrl+S` — Word, `Ctrl+P` — chop etish.

## SEO

- **Prerender (SSG):** `npm run build` bosh sahifa, 6 ta boʻlim (`/c/:id`) va barcha shablonlarni (`/t/:id`) statik HTML'ga aylantiradi — qidiruv tizimlari toʻliq matnni koʻradi.
- Har bir sahifada: `title`, `description`, `canonical`, `robots`, Open Graph va Twitter teglari (`core/services/seo.service.ts`).
- **JSON-LD:** WebSite (+ SearchAction `/?q=`), Organization, WebApplication, FAQPage (bosh sahifa), BreadcrumbList + CollectionPage/ItemList (boʻlimlar), BreadcrumbList + WebPage (shablonlar).
- `scripts/postbuild.mjs` — `sitemap.xml` va `404.html`; `public/robots.txt`, `site.webmanifest`, `og.png`, ikonlar.
- Ichki havolalar: boʻlim sahifalari, footer'dagi boʻlimlar, har bir shablonda «Oʻxshash shablonlar».
- `vercel.json`: `www` → asosiy domen 301, statik fayllar keshi, `/my` uchun `noindex`, mavjud boʻlmagan sahifalar haqiqiy 404.

**Ishga tushirgandan keyin:** Google Search Console va Yandex Webmaster'da `lexform.uz` ni tasdiqlang va `https://lexform.uz/sitemap.xml` ni yuboring.

## Ishga tushirish

```bash
npm install      # .npmrc: legacy-peer-deps=true
npm start        # http://localhost:4200
npm test         # vitest: transliteratsiya, summa so‘zda, barcha shablonlar render testi
npm run build    # prerender + sitemap → dist/lexform-app/browser (statik hosting)
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
  templates/       contracts, applications, hr, hr-requests, notarial, court, corporate, acts; shared.ts (CATEGORIES + kichik boʻlimlar)
  features/home/   bosh sahifa: hero, katalog, qidiruv, filtrlar
  features/editor/ forma + jonli hujjat, Word/chop etish/nusxa
  layout/          header, ikonlar
```

## Yangi shablon qo‘shish

1. Tegishli `templates/*.ts` faylida `DocTemplate` obyektini yarating: `id`, `cat`, `sub` (kichik boʻlim, `CATEGORIES` dan), `title`/`desc` (uz/ru/en), `docTitle`, `fields`, `render(c)`.
2. Maydon nomlari (`l`) uchala tilda bo‘lishi shart; `ex` — **to‘qima** namuna qiymat (haqiqiy shaxsiy ma’lumot ishlatmang).
3. `render` hujjatni **o‘zbek kirillida** qaytaradi; `c.x(k)`, `c.money(k)`, `c.date(k)` qiymatlarni xavfsiz (escape qilingan) chiqaradi.
4. Shablonni `templates/index.ts` dagi `TEMPLATES` ga qo‘shing va `npm test` ni ishga tushiring — test har bir shablonni ikkala yozuvda tekshiradi.
