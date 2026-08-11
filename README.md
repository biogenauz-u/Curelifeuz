# CureLife

CureLife landing sahifasi. Figma maketidan kod: [CureLife](https://www.figma.com/design/C7RQZEOVBntyPJzTiUvceH/CureLife?node-id=189-519)

Maketdagi **barcha bo'limlar tayyor** — hero'dan footergacha, RU/UZ ikki tilda.

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # production serverni ishga tushirish
```

## Texnologiyalar

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + TypeScript |
| Stil | Tailwind CSS v4 (CSS-first `@theme`) |
| Shrift | Manrope (sarlavhalar) + Inter (matn) — `next/font/google` |

## Papkalar

```
app/
  layout.tsx           root layout — shriftlar, metadata, til provideri
  page.tsx             bo'limlar tartibi
  globals.css          Tailwind + CureLife dizayn tokenlari va utility'lari
components/
  layout/              Header, Footer
  sections/            har bir bo'lim alohida fayl
  providers/           LanguageProvider (RU/UZ konteksti)
  ui/                  SectionLabel, LanguageSwitcher, ikonkalar
lib/
  i18n/dictionaries.ts BARCHA matnlar shu yerda (ru / uz)
  utils.ts             CONTAINER, H2, BODY va cn()
public/images/         Figma'dan eksport qilingan asset'lar
```

## Bo'limlar

| # | Komponent | Figma node |
|---|---|---|
| — | [Header](components/layout/Header.tsx) | `257:2474` |
| 01 | [Hero](components/sections/Hero.tsx) | `257:2455` |
| — | [Stats](components/sections/Stats.tsx) — hero ustiga chiqadi | `189:695` |
| 02 | [Concerns](components/sections/Concerns.tsx) | `189:708` |
| 03 | [Directions](components/sections/Directions.tsx) | `189:526` |
| 04 | [ProductPassport](components/sections/ProductPassport.tsx) — tablar | `189:749` |
| 05 | [Trust](components/sections/Trust.tsx) | `189:566` |
| 06 | [About](components/sections/About.tsx) | `189:807` |
| 07 | [Journey](components/sections/Journey.tsx) | `189:817` |
| 08 | [VideoBlock](components/sections/VideoBlock.tsx) | `261:2503` |
| 09 | [Faq](components/sections/Faq.tsx) — accordion | `189:610` |
| 10 | [FinalCta](components/sections/FinalCta.tsx) | `189:860` |
| — | [Footer](components/layout/Footer.tsx) | `189:884` |

## Dizayn tokenlari

`app/globals.css` ichidagi `@theme` blokida, Figma qiymatlari bilan:

| Token | Qiymat | Qayerda |
|---|---|---|
| `accent` | `#0ba7a6` | bo'lim aksenti, ikonka, chiziq |
| `brand-200` | `#97e1db` | ingichka ramkalar |
| `brand-400` → `brand-600` | `#32c8c4` → `#087e7d` | tugma gradienti |
| `brand-700` | `#067978` | badge matni |
| `ink-deep` | `#102021` | bo'lim sarlavhalari |
| `body` | `#607776` | bo'lim matni |
| `label` | `#527370` | "02 / ..." yorliqlari |

Tayyor utility'lar: `glass-panel` (muzli oq panel), `num-chip`, `icon-tile`,
`bg-brand-gradient`, `bg-cta-gradient`, `text-brand-gradient`, `border-hairline`.

Konteynerlar (`lib/utils.ts`): maketda ikki xil kenglik bor —
`CONTAINER_WIDE` (1372px, header/hero) va `CONTAINER` (1180px, qolgan bo'limlar).

## Ikki til (RU / UZ)

- Barcha matnlar `lib/i18n/dictionaries.ts` da. Komponentlarda hardcode matn yo'q.
- Tanlangan til `curelife-locale` **cookie**'da saqlanadi va serverda o'qiladi,
  shuning uchun sahifa to'g'ri tilda ochiladi (`<html lang>`, `<title>` ham almashadi).
- Komponentda ishlatish: `const { t, locale, setLocale } = useLanguage()`.

Yangi matn qo'shish: `Dictionary` tipiga kalit → `ru` va `uz` obyektlariga
qiymat → komponentda `t.<bo'lim>.<kalit>`.

## Mijozdan olinishi kerak bo'lgan ma'lumotlar

| Nima | Qayerda | Holati |
|---|---|---|
| Fimbriolok Plus, Triser Plus, Amino Max raqamlari (komponent/kapsula/qabul) | `lib/i18n/dictionaries.ts` → `passport.products` | `—` turibdi, maketda ham to'ldirilmagan |
| Shu 3 mahsulotning rasmi | `passport.products[].image` | yo'q — karta o'rniga mahsulot nomi ko'rsatiladi |
| Telefon raqami | `footer.phone` | maketdagi `+998 90 123 45 67` |
| Ijtimoiy tarmoq havolalari | `components/layout/Footer.tsx` → `SOCIALS` | hozircha `#` |
| Video havolasi | `components/sections/VideoBlock.tsx` | tugma bosiladi, lekin plyer ulanmagan |
| Hujjat/sertifikat PDF fayllari | `Trust`, `FinalCta` tugmalari | havolalar `#certificates` ga boradi |

## Maketga moslik

O'lchamlar 1920px maketdan piksel-aniq olingan (tekshirilgan: header
`1372×82` @ `(274, 36)`, hero balandligi `1080px`, fon rasmi `2005×1119` @ `(−85, −20)`).

**Bo'limlar orasidagi masofa** ham maketdan olingan — har bir bo'limning
`pt`/`pb` qiymatlari shunga sozlangan, 9 ta oraliqning hammasi maketga aynan
mos (`178 / 222 / 185 / 163 / 117 / 96 / 206 / 85 / 108` px). Shuning uchun
bo'limlarda bir xil `py-*` emas, alohida `pt-*` va `pb-*` ishlatilgan —
o'zgartirishdan oldin shuni hisobga oling. CTA kartasi maketdagidek FAQ
fonining oxirgi 25px'iga chiqib turadi (`lg:-mt-[25px]`).

### Desktop masshtabi

Maket 1920px uchun chizilgan, lekin ko'pchilik noutbukda oyna 1440–1520px.
Shuning uchun `globals.css` da **≥1280px** dan boshlab `body { zoom }` qo'llanadi
va sayt brauzer zoom'ini o'zgartirmasdan, 100% da ham to'g'ri proportsiyada
ko'rinadi.

**Etalon kenglik — 1680px** (`zoom = breakpoint / 1680`). Maketning to'liq
1920px'i tor ekranda juda kichik chiqqani uchun shu oraliq qiymat tanlangan.

| Oyna | zoom | Kontent maydoni | Header ekran kengligining |
|---|---|---|---|
| 1920px+ | 1 | 1920px (maket) | 71% |
| 1470px (MacBook) | 0.857 | 1715px | 80% |
| 1280px | 0.762 | 1680px | 82% |
| <1280px | yo'q | responsive layout | — |

**O'lchamni sozlash:** `globals.css` dagi zoom qiymatlari `breakpoint / 1680`
formulasi bilan hisoblangan. Kattaroq ko'rinsin desangiz etalonni kamaytiring
(1600), kichikroq bo'lsin desangiz oshiring (1800) va qiymatlarni qayta
hisoblang.

`zoom: calc(100vw / 1680)` Chrome'da ishlamaydi (qiymat `1` ga tushadi), shuning
uchun bosqichli media query'lar. `zoom` ichida `vw` haqiqiy oynaga tegishli
bo'lgani uchun hero balandligi `.hero-frame` da alohida beriladi.

Maketdan ataylab farq qilgan joylar:

- **RU/UZ almashtirgich** — Figma'da yo'q, qo'shilgan. Shu sababli header menyusi
  markazda (maketda biroz o'ngroqda edi).
- **Mobil va planshet versiyalari** — Figma'da faqat desktop bor, ular noldan
  qilingan: gamburger menyu, ustunlar ustma-ust, mahsulot tablari gorizontal
  siljiydi, hero fonining chap qismi ko'rsatiladi.
- **Sahifa `dynamic`** — til cookie'si serverda o'qilgani uchun. To'liq statik
  kerak bo'lsa, `/ru` va `/uz` marshrutlariga o'tkazish mumkin.

## Admin panel

Manzil: `/admin` (login: `/admin/login`). Sahifa `robots: noindex` bilan yopilgan.

```bash
npm run admin:password              # yangi tasodifiy parol yaratadi
npm run admin:password -- "MyPass"  # o'z parolingizni o'rnatadi
```

Parol hech qayerda ochiq saqlanmaydi — `.env.local` da faqat PBKDF2 hash
(210 000 iteratsiya) va tasodifiy salt turadi. `.env.local` `.gitignore` da.

**Himoya qanday ishlaydi**

| Qatlam | Fayl | Vazifasi |
|---|---|---|
| Tezkor yo'naltirish | [proxy.ts](proxy.ts) | sessiyasiz so'rovni panel render bo'lgunicha login'ga yuboradi |
| Asosiy tekshiruv | [app/admin/(protected)/layout.tsx](app/admin/(protected)/layout.tsx) | har bir so'rovda imzolangan cookie'ni tekshiradi |
| Kirish / chiqish | [app/admin/actions.ts](app/admin/actions.ts) | server action, `httpOnly` cookie o'rnatadi |

Sessiya 8 soat amal qiladi, cookie `httpOnly` + `sameSite=lax` (productionda `secure`).

### Panel nima qila oladi

| Bo'lim | Imkoniyat | Saytga ta'siri |
|---|---|---|
| Boshqaruv paneli | mahsulot/murojaat sonlari, 7 kunlik grafik | — |
| Mahsulotlar | qo'shish, tahrirlash, o'chirish, yashirish, rasm yuklash, avtomatik tarjima (RU+UZ) | `/products` katalogi |
| Sayt kontenti | sahifa `title` va `description` (RU+UZ) | brauzer sarlavhasi, SEO |
| Murojaatlar | ro'yxat, o'qish, o'qilmagan/o'chirish, mailto javob | — |
| Sozlamalar | telefon, e-mail, manzil, ish vaqti | footer va `/contact` |

### Mahsulotlar soni — yagona manba

Hero statistikasi, «CureLife haqida» matni va «Mahsulot pasporti» bo'limi
bitta manbadan oziqlanadi: `getProducts()` dagi **ko'rinadigan** mahsulotlar.
`app/page.tsx` ularni bir marta o'qib, `Stats`, `About` va `ProductPassport`
ga uzatadi — lug'atda hardcode qilingan son yo'q.

Ruscha sonlar `lib/i18n/plural.ts` orqali kelishikka solinadi
(1 просмотр · 2–4 просмотра · 5–20 просмотров · 21 просмотр).

### Tashqi manzillar

`lib/site-config.ts` — ijtimoiy tarmoqlar, video va sertifikatlar
bo'limining yagona manzili. Ijtimoiy tarmoq yoki video manzili `null` bo'lsa,
sayt **soxta havola chizmaydi**: ikonka o'chirilgan holatda ko'rinadi, video
esa oddiy rasmga aylanadi. Manzil kelganda shu faylga yozilsa yetarli.

Sertifikatlarga olib boruvchi hamma havola (header, footer, hero, «Doverie»
bloki) `CERTIFICATES_HREF` = `/about#certificates` ga birlashtirilgan.

### Sertifikatlar

«Biz haqimizda» sahifasidagi galereya `data/certificates.json` dan keladi.
Kartochkaga bosilganda hujjat modal oynada kattalashib ochiladi
([components/about/CertificateGallery.tsx](components/about/CertificateGallery.tsx)) —
brauzerning `<dialog>` elementi ishlatilgani uchun fokus tuzog'i va Escape
bilan yopish tayyor holda keladi. PDF esa yangi oynada ochiladi.

Admin panelda **«Sertifikatlar»** bo'limi bor: nom + fayl (PDF yoki rasm)
qo'shiladi, keraksizi o'chiriladi. O'chirilganda yuklangan fayl ham
diskdan ketadi.

### Maqolalar

Header'dagi «Вопросы и ответы» o'rniga «Статьи / Maqolalar» qo'yildi, bosh
sahifadagi FAQ bo'limi esa maqolalar bo'limiga almashtirildi (CTA'dan bitta
oldingi joy). FAQ matnlari lug'atda saqlanib qoldi — kerak bo'lsa qaytarish
oson; `/contact` dagi savol-javob bo'limi tegilmagan.

| Joy | Nima chiqadi |
|---|---|
| Bosh sahifa, `#articles` | Eng yangi **4 ta** maqola |
| `/articles` | Barcha maqolalar |
| `/articles/<slug>` | Maqola matni + oxirida 3 ta boshqa maqola |

Maqolada faqat 5 ta maydon bor (ataylab minimal): **sarlavha, matn, rasm,
ko'rilganlar soni, chop etilgan sana** — har biri RU va UZ uchun alohida
(sarlavha va matn). Havola (slug) sarlavhadan avtomatik yasaladi, kirill
harflar lotinga o'giriladi.

**Ko'rishlar soni** maqola ochilganda avtomatik oshadi
([components/articles/ViewCounter.tsx](components/articles/ViewCounter.tsx)) —
render paytida emas, sahifa yuklangandan keyin, shuning uchun prefetch
hisobga qo'shilmaydi. Admin panelda qo'lda ham o'zgartirsa bo'ladi.

Matnda xatboshilar bo'sh qator bilan ajratiladi. Tarjima tugmasi maqolaning
sarlavhasi va har bir xatboshisini alohida yuboradi.

### Mahsulot pasporti — statik va dinamik qismlar

`/products/<slug>` — barcha mahsulotlar uchun **bitta shablon**
([app/products/[slug]/page.tsx](app/products/%5Bslug%5D/page.tsx)).

| Sahifadagi joy | Qayerdan keladi |
|---|---|
| Bo'lim yorliqlari (СОСТАВ, БЕЗОПАСНОСТЬ…), sarlavhalar, tugma matnlari, fakt yorliqlari, «Xavfsizlik» va «Kelib chiqishi» sarlavhalari | **Statik** — `t.productPage` ([lib/i18n/dictionaries.ts](lib/i18n/dictionaries.ts)) |
| Nomi, yo'nalish, tartib №, tavsif, 3 ta stat | Admin — «Katalog» |
| Ogohlantirish, xomashyo/ishlab chiqaruvchi faktlari | Admin — «Pasport — yuqori qism» |
| Tarkib jadvali (nom + miqdor) | Admin — «Tarkib» |
| Qo'llash sarlavhasi va matni | Admin — «Qo'llash usuli» |
| «Qabuldan oldin» ro'yxati | Admin — «Qabuldan oldin» |
| Xavfsizlik kartochkalari | Admin — «Xavfsizlik» |
| Davlatlar va to'liq nomlar | Admin — «Kelib chiqishi» |
| Katalog rasmi, pasport rasmi, sertifikat, yo'riqnoma | Admin — o'ng ustundagi fayl maydonlari |
| «Boshqa mahsulotlar» | Avtomatik — qolgan ko'rinadigan mahsulotlar |

**Bo'sh bo'lim chizilmaydi.** Masalan tarkib kiritilmagan bo'lsa «Состав»
bo'limi ham, hero'dagi «Посмотреть состав» tugmasi ham ko'rinmaydi.

Sarlavhalardagi urg'u avtomatik: nomning va qo'llash sarlavhasining **oxirgi
so'zi** firma rangida chiziladi («NovaLife **Plus**», «1 капсула **в день**»).

Pasport sahifasining `title`/`description` i mahsulot nomi va tavsifidan
olinadi — «Sayt kontenti» bo'limida alohida yozish shart emas.

### Mahsulot qo'shish / tahrirlash

Modal emas, **alohida sahifa**:
`/admin/products/new` va `/admin/products/<id>`
([components/admin/ProductForm.tsx](components/admin/ProductForm.tsx)).
Ikkalasi `(protected)` guruhida, ya'ni bir xil himoya ostida.

- **Slug** yangi mahsulotda nomdan avtomatik yasaladi; qo'lda tegilsa
  avtomatik yangilanish to'xtaydi. Takrorlansa oxiriga raqam qo'shiladi.
- **4 ta fayl maydoni**: katalog rasmi, pasport rasmi, sertifikat, yo'riqnoma.
  Hammasi `public/uploads/` ga tasodifiy nom bilan yoziladi
  ([lib/admin/uploads.ts](lib/admin/uploads.ts)), 10 MB gacha — MIME emas,
  **fayl imzosi** tekshiriladi. Rasm maydonlari faqat PNG/JPG/WEBP/AVIF;
  sertifikat va yo'riqnoma qo'shimcha PDF ham qabul qiladi. SVG ataylab
  qabul qilinmaydi (XSS xavfi). Fayl almashtirilsa yoki mahsulot o'chirilsa
  eski fayl diskdan ham o'chadi.
- Yo'riqnoma yuklangach saytda «Открыть инструкцию» tugmasi paydo bo'ladi
  (pasportdagi «Hujjatlar» bo'limi va katalogdagi hujjat ikonkasi).
- Fayllar server action orqali o'tishi uchun `next.config.ts` da
  `serverActions.bodySizeLimit` oshirilgan.

### Avtomatik tarjima

Har bir til bloki ustidagi **«⇄ Hammasini … tarjima qilish»** tugmasi o'sha
tildagi **barcha** maydonlarni (yo'nalish, tavsif, statlar, ogohlantirish,
tarkib, qo'llash, qabuldan oldin, xavfsizlik, kelib chiqishi) ikkinchi tilga
to'ldiradi ([app/admin/translate-actions.ts](app/admin/translate-actions.ts)).
Raqamlar, o'lchov birliklari va kompaniya nomlari o'zgarmaydi.

Ikkita provayder bor, `TRANSLATE_PROVIDER` bilan tanlanadi
([lib/admin/translator.ts](lib/admin/translator.ts)):

| Qiymat | Xizmat | Kalit | To'lov | Sifat |
|---|---|---|---|---|
| `google` (standart) | Google Translate ochiq endpointi | kerak emas | bepul | yaxshi, lekin ba'zi atamalarni noto'g'ri tarjima qiladi |
| `claude` | Claude API (`claude-opus-5`) | `ANTHROPIC_API_KEY` | pullik | atamalar va uslub aniqroq |

Google tanlanganda hech qanday sozlash shart emas. Claude uchun:

```
TRANSLATE_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
```

Ikkalasi ham bir xil interfeysdan (`translateMany`) foydalanadi, shuning uchun
provayderni almashtirish qolgan kodga tegmaydi.

**Nima tarjima qilinmaydi:** miqdorlar (`500 mg`) o'zgarishsiz ko'chiriladi;
firma nomlari (SternVitamin, EVERT Pharma AG) saqlanadi. Natijani baribir
ko'zdan kechirish kerak — mashina tarjimasi ba'zi atamalarni (masalan «Стик»)
noto'g'ri o'giradi.

Google javobidagi apostroflar sayt uslubiga keltiriladi: `o'`/`g'` → `o‘`/`g‘`,
qolgan tutuq belgisi `’`.

### Ma'lumot qayerda saqlanadi

`data/` papkasidagi JSON fayllar: `products.json`, `messages.json`,
`settings.json`, `pages.json`. Yozish **atomik** (avval `.tmp`, keyin
`rename`) — server to'xtab qolsa ham fayl buzilmaydi. Fayl yo'q bo'lsa
`lib/admin/store.ts` dagi standart qiymatlar ishlatiladi.

Yuklangan rasmlar `public/uploads/` da yotadi.

**⚠️ Hosting:** bu VPS/Docker kabi doimiy diskli muhitda ishlaydi. Vercel
kabi serverless'da disk vaqtinchalik — u yerda `store.ts` dagi
`readJson`/`writeJson` ni bazaga (Postgres, Supabase), `uploads.ts` ni esa
obyekt saqlagichga (S3, Cloudinary) almashtirish kerak. Boshqa kod tegilmaydi.

### Xavfsizlik

Har bir yozish amali server action ichida qayta tekshiriladi
(`assertAdmin()`), chunki server action'lar HTTP endpoint — ularni
to'g'ridan-to'g'ri chaqirish mumkin. Layout'dagi himoya yolg'iz yetarli emas.

Yashirin mahsulotlar **serverda** ajratiladi, shuning uchun ularning
ma'lumoti sahifa HTML manbasiga ham tushmaydi.
