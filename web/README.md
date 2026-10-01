# LexForm web templates

A single-page app (`index.html`, no build step) that turns the templates described in `../knowledge/` into
fill-in forms with a live A4 preview.

Open `index.html` in a browser, or host the folder on any static host (Vercel, GitHub Pages, Nginx).

## Features
- 16 templates in 3 groups (corporate, HR, contracts) in Uzbek Cyrillic and Russian.
- Amounts written in words automatically (сўм/тийин, сумы/тийины); dates in document style.
- Calculated tables: goods/services totals, dividend tax and net payout, staffing-table payroll fund.
- Empty fields appear as underlines, so a blank document can be printed and filled by hand.
- Drafts saved per template in the browser (localStorage); deep links via `#template-id`.
- Copy as formatted text (paste into Word / Google Docs); when opened directly (not embedded),
  also Word (.doc) download and Print / PDF.

## Adding a template
Add an object to `TEMPLATES` in `index.html`:
`{ id, cat, lang: 'uz'|'ru', title, desc, fields: [...], render: c => html }`.
Field types: text (default), `date`, `money`, `number`, `select` (`opts`), `textarea`, `rows` (`cols`).
Use `partyFields(prefix, group, example)` for company requisites and the `c` helpers in `render`
(`c.x`, `c.money`, `c.date`, `c.dshort`, `c.rows`, `itemsTable`, `sigTable`, `reqCell`).
Example data in the templates is fictional.
