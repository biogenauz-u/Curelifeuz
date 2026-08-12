import { randomUUID } from "node:crypto";

import { APP_DATA_TABLE, supabaseAdmin } from "@/lib/admin/supabase";

/**
 * Supabase asosidagi saqlagich.
 *
 * Har bir "fayl" (avval `data/*.json`) `app_data` jadvalida bitta qator:
 * `key` — shu funksiyaga beriladigan nom (masalan `"products.json"`),
 * `value` — butun JSON. Bu qolgan kodni (normalizatorlar, `getProducts` va
 * h.k.) deyarli o'zgartirmasdan fayl tizimidan bazaga o'tkazish imkonini
 * berdi — chunki `readJson`/`writeJson` ning imzosi bir xil qoldi.
 *
 * Bir martalik migratsiya: `scripts/migrate-to-supabase.mjs`.
 */

async function readJson<T>(file: string, fallback: T): Promise<T> {
  const { data, error } = await supabaseAdmin()
    .from(APP_DATA_TABLE)
    .select("value")
    .eq("key", file)
    .maybeSingle();

  if (error) {
    console.error(`readJson(${file})`, error);
    return fallback;
  }
  return (data?.value as T) ?? fallback;
}

async function writeJson(file: string, data: unknown): Promise<void> {
  const { error } = await supabaseAdmin()
    .from(APP_DATA_TABLE)
    .upsert({ key: file, value: data });

  if (error) throw new Error(`writeJson(${file}): ${error.message}`);
}

/* ── Mahsulotlar ──────────────────────────────────────────────────────── */

/** Tarkib qatori: nomi + bitta kapsuladagi miqdori. */
export type CompositionItem = { name: string; amount: string };

/** Xavfsizlik kartochkasi. */
export type SafetyItem = { title: string; body: string };

/**
 * Mahsulot pasporti (`/products/<slug>`) uchun tilga bog'liq matnlar.
 * Bo'sh qolgan bo'lim sahifada umuman chizilmaydi.
 */
export type ProductDetail = {
  /** Hero ostidagi ogohlantirish. */
  warning: string;
  /** Hero yonidagi 4 ta faktdan 3-4 chisi (yorliqlari lug'atda, statik). */
  raw: string;
  manufacturer: string;
  /** «1 капсула в день» — oxirgi so'zi urg'u bilan chiziladi. */
  usageTitle: string;
  usageBody: string;
  /** «1 капсула в день» kartochkasidagi katta raqam. Bo'sh bo'lsa «1». */
  dailyDose: string;
  before: string[];
  safety: SafetyItem[];
  composition: CompositionItem[];
  origin: {
    /** «local» — xomashyo+ishlab chiqarish (ikki karta). «imported» — bitta davlatdan tayyor import (bitta karta). */
    type: "local" | "imported";
    rawCountry: string;
    makeCountry: string;
    rawFull: string;
    manufacturerFull: string;
    role: string;
    /** Faqat `type: "imported"` uchun. */
    importedCountry: string;
    importedFull: string;
  };
};

export type ProductLocale = {
  /** Tilga xos nom: ruschada kirill, o'zbekchada lotin. Bo'sh bo'lsa
   *  mahsulotning umumiy `name` maydoni ishlatiladi. */
  name: string;
  category: string;
  description: string;
  stats: [string, string, string];
  detail: ProductDetail;
};

export type Product = {
  id: string;
  slug: string;
  number: string;
  name: string;
  /** Katalog kartochkasidagi rasm. */
  image: string | null;
  /** Pasport sahifasidagi katta rasm (bo'lmasa `image` ishlatiladi). */
  detailImage: string | null;
  /** Sertifikat fayli — rasm yoki PDF. */
  certificate: string | null;
  /** Yo'riqnoma (instruksiya) fayli — PDF yoki rasm. */
  instruction: string | null;
  /** «Chet eldan import qilingan» holatidagi ishlab chiqaruvchi/zavod logotipi. */
  originLogo: string | null;
  visible: boolean;
  ru: ProductLocale;
  uz: ProductLocale;
};

export function emptyDetail(): ProductDetail {
  return {
    warning: "",
    raw: "",
    manufacturer: "",
    usageTitle: "",
    usageBody: "",
    dailyDose: "",
    before: [],
    safety: [],
    composition: [],
    origin: {
      type: "local",
      rawCountry: "",
      makeCountry: "",
      rawFull: "",
      manufacturerFull: "",
      role: "",
      importedCountry: "",
      importedFull: "",
    },
  };
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

/** Klientdan/eski JSON'dan kelgan `detail` ni ishonchli shaklga keltiradi. */
export function normalizeDetail(input: unknown): ProductDetail {
  const d = (input ?? {}) as Record<string, unknown>;
  const origin = (d.origin ?? {}) as Record<string, unknown>;

  return {
    warning: str(d.warning),
    raw: str(d.raw),
    manufacturer: str(d.manufacturer),
    usageTitle: str(d.usageTitle),
    usageBody: str(d.usageBody),
    dailyDose: str(d.dailyDose),
    before: list(d.before).map(str).filter(Boolean).slice(0, 12),
    safety: list(d.safety)
      .map((x) => {
        const s = (x ?? {}) as Record<string, unknown>;
        return { title: str(s.title), body: str(s.body) };
      })
      .filter((s) => s.title || s.body)
      .slice(0, 12),
    composition: list(d.composition)
      .map((x) => {
        const c = (x ?? {}) as Record<string, unknown>;
        return { name: str(c.name), amount: str(c.amount) };
      })
      .filter((c) => c.name || c.amount)
      .slice(0, 40),
    origin: {
      type: origin.type === "imported" ? "imported" : "local",
      rawCountry: str(origin.rawCountry),
      makeCountry: str(origin.makeCountry),
      rawFull: str(origin.rawFull),
      manufacturerFull: str(origin.manufacturerFull),
      role: str(origin.role),
      importedCountry: str(origin.importedCountry),
      importedFull: str(origin.importedFull),
    },
  };
}

function normalizeLocale(input: unknown): ProductLocale {
  const l = (input ?? {}) as Record<string, unknown>;
  let stats = list(l.stats).map(str);

  // Eski `data/products.json` bir muddat boshqa formatda (`attributes: {...}`)
  // saqlangan edi — bu holatda `stats` maydoni umuman yo'q bo'ladi. Mavjud
  // bo'lsa, shu maydonlardan Shakli/Qadoq/Qabul qiymatlarini tiklaymiz.
  if (!stats.some(Boolean)) {
    const a = (l.attributes ?? {}) as Record<string, unknown>;
    const fallback = [str(a.dosageForm), str(a.packageQuantity), str(a.intakeInstructions)];
    if (fallback.some(Boolean)) stats = fallback;
  }

  return {
    name: str(l.name),
    category: str(l.category),
    description: str(l.description),
    stats: [stats[0] ?? "", stats[1] ?? "", stats[2] ?? ""],
    detail: normalizeDetail(l.detail),
  };
}

/** Eski `products.json` da yangi maydonlar yo'q — o'qishda to'ldiriladi. */
function normalizeProduct(input: Product): Product {
  return {
    ...input,
    image: input.image ?? null,
    detailImage: input.detailImage ?? null,
    certificate: input.certificate ?? null,
    instruction: input.instruction ?? null,
    originLogo: input.originLogo ?? null,
    ru: normalizeLocale(input.ru),
    uz: normalizeLocale(input.uz),
  };
}

/**
 * Barcha CureLife mahsulotlari uchun bir xil bo'lgan pasport matnlari.
 * Bular admin panelda tahrirlanadi — bu yerda faqat boshlang'ich qiymat.
 */
const SHARED_RU = {
  raw: "SternVitamin · Германия",
  manufacturer: "EVERT Pharma AG · Узбекистан",
  before: [
    "Проверьте целостность упаковки и срок годности.",
    "Учитывайте индивидуальную чувствительность к компонентам.",
    "При беременности, кормлении грудью и приёме препаратов проконсультируйтесь с врачом.",
    "Не превышайте рекомендуемую суточную дозу.",
  ],
  safety: [
    {
      title: "Противопоказания",
      body: "Не применять при индивидуальной непереносимости компонентов продукта. Перед применением рекомендуется консультация специалиста.",
    },
    {
      title: "Возможные нежелательные реакции",
      body: "При возникновении нежелательной реакции прекратите приём и обратитесь к специалисту.",
    },
    {
      title: "Беременность и грудное вскармливание",
      body: "В эти периоды продукт следует применять только по рекомендации врача.",
    },
    {
      title: "Хранение",
      body: "Храните в сухом, защищённом от света месте при комнатной температуре, недоступно для детей.",
    },
  ],
  origin: {
    type: "local" as const,
    rawCountry: "Германия",
    makeCountry: "Узбекистан",
    rawFull: "SternVitamin GmbH & Co. KG · Германия",
    manufacturerFull: "EVERT Pharma AG · Узбекистан",
    role: "Заказчик",
    importedCountry: "",
    importedFull: "",
  },
};

const SHARED_UZ = {
  raw: "SternVitamin · Germaniya",
  manufacturer: "EVERT Pharma AG · O‘zbekiston",
  before: [
    "Qadoqning butunligi va yaroqlilik muddatini tekshiring.",
    "Komponentlarga individual sezuvchanlikni hisobga oling.",
    "Homiladorlik, emizish va preparatlar qabul qilish davrida shifokor bilan maslahatlashing.",
    "Tavsiya etilgan kunlik dozadan oshirmang.",
  ],
  safety: [
    {
      title: "Qarshi ko‘rsatmalar",
      body: "Mahsulot komponentlariga individual chidamsizlik bo‘lganda qo‘llamang. Qo‘llashdan oldin mutaxassis maslahati tavsiya etiladi.",
    },
    {
      title: "Mumkin bo‘lgan nojo‘ya reaksiyalar",
      body: "Nojo‘ya reaksiya yuzaga kelsa, qabulni to‘xtating va mutaxassisga murojaat qiling.",
    },
    {
      title: "Homiladorlik va emizish",
      body: "Bu davrlarda mahsulotni faqat shifokor tavsiyasi bilan qo‘llash kerak.",
    },
    {
      title: "Saqlash",
      body: "Quruq, yorug‘likdan himoyalangan joyda, xona haroratida, bolalar yeta olmaydigan joyda saqlang.",
    },
  ],
  origin: {
    type: "local" as const,
    rawCountry: "Germaniya",
    makeCountry: "O‘zbekiston",
    rawFull: "SternVitamin GmbH & Co. KG · Germaniya",
    manufacturerFull: "EVERT Pharma AG · O‘zbekiston",
    role: "Buyurtmachi",
    importedCountry: "",
    importedFull: "",
  },
};

function detail(
  shared: typeof SHARED_RU,
  extra: Partial<ProductDetail> = {},
): ProductDetail {
  return { ...emptyDetail(), ...shared, ...extra };
}

const PRODUCTS_SEED: Product[] = [
  {
    id: "p-fimbriolok",
    slug: "fimbriolok-plus",
    number: "01",
    name: "Fimbriolok Plus",
    image: "/images/product-fimbriolok.png",
    detailImage: "/images/product-fimbriolok.png",
    certificate: null,
    instruction: null,
    originLogo: null,
    visible: true,
    ru: {
      name: "Фимбриолок Плюс",
      category: "Для женщин",
      description:
        "Формула из 6 компонентов в удобном формате стика. Информация о составе и способе применения доступна в паспорте продукта.",
      stats: ["6 компонентов", "Стик", "2,47 г"],
      detail: detail(SHARED_RU),
    },
    uz: {
      name: "Fimbriolok Plus",
      category: "Ayollar uchun",
      description:
        "Qulay stik formatidagi 6 komponentli formula. Tarkib va qo‘llash usuli haqidagi ma’lumot mahsulot pasportida mavjud.",
      stats: ["6 komponent", "Stik", "2,47 g"],
      detail: detail(SHARED_UZ),
    },
  },
  {
    id: "p-novalife",
    slug: "novalife-plus",
    number: "02",
    name: "NovaLife Plus",
    image: "/images/product-novalife-catalog.png",
    detailImage: "/images/product-novalife.png",
    certificate: "/images/certificate.jpg",
    instruction: null,
    originLogo: null,
    visible: true,
    ru: {
      name: "НоваЛайф Плюс",
      category: "Период планирования",
      description:
        "Комплекс витаминов, минералов и рыбьего жира для поддержки физиологических потребностей женского организма.",
      stats: ["Капсулы", "60 капсул", "1 раз в день"],
      detail: detail(SHARED_RU, {
        warning:
          "Перед приёмом во время беременности и грудного вскармливания необходимо проконсультироваться с врачом.",
        usageTitle: "1 капсула в день",
        usageBody:
          "Лицам старше 14 лет рекомендуется принимать по 1 капсуле один раз в день. Запивайте капсулу водой. Не превышайте рекомендуемую дозу.",
        composition: [
          { name: "Рыбий жир", amount: "500 mg" },
          { name: "Vitamin E", amount: "12 mg" },
          { name: "Цинк", amount: "10 mg" },
          { name: "Фолиевая кислота", amount: "0,4 mg" },
        ],
      }),
    },
    uz: {
      name: "NovaLife Plus",
      category: "Rejalashtirish davri",
      description:
        "Ayol organizmining fiziologik ehtiyojlarini qo‘llab-quvvatlash uchun vitaminlar, minerallar va baliq yog‘i kompleksi.",
      stats: ["Kapsulalar", "60 kapsula", "Kuniga 1 marta"],
      detail: detail(SHARED_UZ, {
        warning:
          "Homiladorlik va emizish davrida qabul qilishdan oldin shifokor bilan maslahatlashish zarur.",
        usageTitle: "Kuniga 1 kapsula",
        usageBody:
          "14 yoshdan katta shaxslarga kuniga bir marta 1 kapsuladan qabul qilish tavsiya etiladi. Kapsulani suv bilan iching. Tavsiya etilgan dozadan oshirmang.",
        composition: [
          { name: "Baliq yog‘i", amount: "500 mg" },
          { name: "Vitamin E", amount: "12 mg" },
          { name: "Rux", amount: "10 mg" },
          { name: "Foliy kislotasi", amount: "0,4 mg" },
        ],
      }),
    },
  },
  {
    id: "p-amino",
    slug: "amino-max",
    number: "03",
    name: "Amino Max",
    image: null,
    detailImage: null,
    certificate: null,
    instruction: null,
    originLogo: null,
    visible: true,
    ru: {
      name: "Амино Макс",
      category: "Для активности",
      description:
        "Комплекс из 20 компонентов в капсулах. Предназначен для категории продуктов, связанных с ежедневной активностью.",
      stats: ["20 компонентов", "Капсулы", "30 капсул"],
      detail: detail(SHARED_RU),
    },
    uz: {
      name: "Amino Max",
      category: "Faollik uchun",
      description:
        "Kapsuladagi 20 komponentli kompleks. Kundalik faollik bilan bog‘liq mahsulotlar toifasi uchun mo‘ljallangan.",
      stats: ["20 komponent", "Kapsulalar", "30 kapsula"],
      detail: detail(SHARED_UZ),
    },
  },
  {
    id: "p-triser",
    slug: "triser-plus",
    number: "04",
    name: "Triser Plus",
    image: "/images/product-triser.png",
    detailImage: "/images/product-triser.png",
    certificate: null,
    instruction: null,
    originLogo: null,
    visible: true,
    ru: {
      name: "Трисер Плюс",
      category: "Ферментная формула",
      description:
        "Формула из 6 компонентов. Полная информация о составе, противопоказаниях и способе применения размещается в паспорте продукта.",
      stats: ["6 компонентов", "Капсулы", "30 капсул"],
      detail: detail(SHARED_RU),
    },
    uz: {
      name: "Triser Plus",
      category: "Ferment formulasi",
      description:
        "6 komponentli formula. Tarkib, qarshi ko‘rsatmalar va qo‘llash usuli haqidagi to‘liq ma’lumot mahsulot pasportida joylashtiriladi.",
      stats: ["6 komponent", "Kapsulalar", "30 kapsula"],
      detail: detail(SHARED_UZ),
    },
  },
];

export async function getProducts(): Promise<Product[]> {
  const list = await readJson("products.json", PRODUCTS_SEED);
  return list.map(normalizeProduct);
}

export async function saveProducts(products: Product[]): Promise<void> {
  await writeJson("products.json", products);
}

/* ── Sertifikatlar ────────────────────────────────────────────────────── */

/**
 * "Biz haqimizda" sahifasidagi sertifikatlar galereyasi.
 * Ataylab minimal: sarlavha (odatda mahsulot nomi) + hujjat fayli.
 */
export type Certificate = {
  id: string;
  title: string;
  /** Rasm yoki PDF: `/uploads/...` yoki `/images/...`. */
  file: string;
};

const CERTIFICATES_SEED: Certificate[] = [
  { id: "c-novalife", title: "NovaLife Plus", file: "/images/about-certificate.png" },
  { id: "c-fimbriolok", title: "Fimbriolok Plus", file: "/images/about-certificate.png" },
  { id: "c-triser", title: "Triser Plus", file: "/images/about-certificate.png" },
];

export async function getCertificates(): Promise<Certificate[]> {
  const list = await readJson("certificates.json", CERTIFICATES_SEED);
  return list
    .filter((c) => c && typeof c.file === "string")
    .map((c) => ({ id: str(c.id), title: str(c.title), file: str(c.file) }));
}

export async function saveCertificates(list: Certificate[]): Promise<void> {
  await writeJson("certificates.json", list);
}

/* ── Maqolalar ────────────────────────────────────────────────────────── */

export type ArticleLocale = { title: string; body: string };

/**
 * Maqola. Ataylab minimal: sarlavha, matn, rasm, ko'rishlar soni va sana.
 * `slug` sarlavhadan avtomatik yasaladi — admin panelda alohida maydon yo'q.
 */
export type Article = {
  id: string;
  slug: string;
  image: string | null;
  views: number;
  /** ISO sana: "2026-08-08". */
  publishedAt: string;
  /** Maqola oxirida ko'rsatiladigan mahsulot. Bo'sh bo'lsa hech narsa chiqmaydi. */
  relatedProductId: string | null;
  ru: ArticleLocale;
  uz: ArticleLocale;
};

const ARTICLES_SEED: Article[] = [
  {
    id: "a-sertifikat",
    slug: "kak-chitat-sertifikat",
    image: null,
    views: 0,
    relatedProductId: null,
    publishedAt: "2026-07-14",
    ru: {
      title: "Как читать сертификат продукта",
      body: "Сертификат подтверждает, что продукт прошёл проверку и соответствует установленным требованиям.\n\nОбратите внимание на три вещи: кто выдал документ, на какой продукт он оформлен и до какой даты действует. Название продукта в сертификате должно полностью совпадать с названием на упаковке.\n\nЕсли в документе указан номер партии, сверьте его с номером на вашей упаковке.",
    },
    uz: {
      title: "Mahsulot sertifikatini qanday o‘qish kerak",
      body: "Sertifikat mahsulot tekshiruvdan o‘tganini va belgilangan talablarga mos kelishini tasdiqlaydi.\n\nUchta narsaga e’tibor bering: hujjatni kim bergan, u qaysi mahsulotga rasmiylashtirilgan va qaysi sanagacha amal qiladi. Sertifikatdagi mahsulot nomi qadoqdagi nom bilan to‘liq mos tushishi kerak.\n\nHujjatda partiya raqami ko‘rsatilgan bo‘lsa, uni o‘z qadog‘ingizdagi raqam bilan solishtiring.",
    },
  },
  {
    id: "a-tarkib",
    slug: "sostav-na-upakovke",
    image: null,
    views: 0,
    relatedProductId: null,
    publishedAt: "2026-06-30",
    ru: {
      title: "Что означают цифры в составе",
      body: "Рядом с каждым компонентом указано его количество в одной капсуле или порции.\n\nЭто количество относится именно к рекомендуемой дозе, а не ко всей упаковке. Если в инструкции написано «1 капсула в день», то указанные миллиграммы — это суточное поступление компонента.\n\nСравнивайте состав с инструкцией к продукту: там приводится полный перечень, включая вспомогательные вещества.",
    },
    uz: {
      title: "Tarkibdagi raqamlar nimani anglatadi",
      body: "Har bir komponent yonida uning bitta kapsula yoki porsiyadagi miqdori ko‘rsatiladi.\n\nBu miqdor butun qadoqqa emas, aynan tavsiya etilgan dozaga tegishli. Yo‘riqnomada «kuniga 1 kapsula» deb yozilgan bo‘lsa, ko‘rsatilgan milligrammlar — komponentning kunlik miqdori.\n\nTarkibni mahsulot yo‘riqnomasi bilan solishtiring: u yerda yordamchi moddalar ham kiritilgan to‘liq ro‘yxat beriladi.",
    },
  },
  {
    id: "a-saqlash",
    slug: "kak-hranit",
    image: null,
    views: 0,
    relatedProductId: null,
    publishedAt: "2026-06-12",
    ru: {
      title: "Как хранить биодобавки дома",
      body: "Большинству добавок подходит сухое место при комнатной температуре, защищённое от прямого света.\n\nКухня рядом с плитой и ванная комната — не лучшие места: там перепады температуры и влажность. Держите упаковку закрытой и вне досягаемости детей.\n\nЕсли в инструкции указаны отдельные условия хранения, следуйте им — они важнее общих рекомендаций.",
    },
    uz: {
      title: "Biofaol qo‘shimchalarni uyda qanday saqlash kerak",
      body: "Ko‘pchilik qo‘shimchalarga xona haroratidagi quruq, to‘g‘ridan-to‘g‘ri yorug‘likdan himoyalangan joy mos keladi.\n\nPlita yonidagi oshxona va hammom eng yaxshi joy emas: u yerda harorat o‘zgarib turadi va namlik yuqori. Qadoqni yopiq va bolalar yeta olmaydigan joyda saqlang.\n\nYo‘riqnomada alohida saqlash shartlari ko‘rsatilgan bo‘lsa, ularga amal qiling — ular umumiy tavsiyalardan muhimroq.",
    },
  },
  {
    id: "a-shifokor",
    slug: "kogda-nuzhen-vrach",
    image: null,
    views: 0,
    relatedProductId: null,
    publishedAt: "2026-05-28",
    ru: {
      title: "Когда стоит посоветоваться с врачом",
      body: "Биологически активные добавки не являются лекарственными средствами и не заменяют назначенное лечение.\n\nПроконсультируйтесь со специалистом, если вы принимаете лекарства, готовитесь к операции, ждёте ребёнка или кормите грудью, а также если у вас есть хронические заболевания.\n\nВрач учитывает ваше состояние целиком — это то, чего не может сделать ни одна инструкция.",
    },
    uz: {
      title: "Qachon shifokor bilan maslahatlashish kerak",
      body: "Biologik faol qo‘shimchalar dori vositasi emas va tayinlangan davolashning o‘rnini bosmaydi.\n\nDori qabul qilayotgan bo‘lsangiz, operatsiyaga tayyorlanayotgan bo‘lsangiz, homilador yoki emizikli bo‘lsangiz, shuningdek surunkali kasalliklaringiz bo‘lsa mutaxassis bilan maslahatlashing.\n\nShifokor holatingizni yaxlit hisobga oladi — buni hech qanday yo‘riqnoma qila olmaydi.",
    },
  },
];

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Rich-text muharrirdan oldingi maqolalar oddiy matn edi (xatboshilar bo'sh
 * qator bilan ajratilgan). Ular endi HTML sifatida ko'rsatiladi/tahrirlanadi —
 * shuning uchun o'qishda avtomatik `<p>` bloklariga o'giriladi. Allaqachon
 * HTML bo'lgan matnga tegilmaydi.
 */
function ensureHtmlBody(body: string): string {
  const trimmed = body.trim();
  if (!trimmed) return "";
  if (/^</.test(trimmed)) return trimmed;
  return trimmed
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function normalizeArticle(input: Article): Article {
  return {
    ...input,
    image: input.image ?? null,
    views: Number.isFinite(input.views) ? Math.max(0, Math.trunc(input.views)) : 0,
    relatedProductId: str((input as { relatedProductId?: unknown }).relatedProductId) || null,
    ru: { title: str(input.ru?.title), body: ensureHtmlBody(str(input.ru?.body)) },
    uz: { title: str(input.uz?.title), body: ensureHtmlBody(str(input.uz?.body)) },
  };
}

/** Yangisi birinchi bo'lib qaytadi. */
export async function getArticles(): Promise<Article[]> {
  const list = await readJson("articles.json", ARTICLES_SEED);
  return list
    .map(normalizeArticle)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function saveArticles(articles: Article[]): Promise<void> {
  await writeJson("articles.json", articles);
}

/** Maqola sahifasi ochilganda ko'rishlar sonini bittaga oshiradi. */
export async function bumpArticleViews(id: string): Promise<void> {
  const list = await readJson<Article[]>("articles.json", ARTICLES_SEED);
  const next = list.map((a) =>
    a.id === id ? { ...a, views: (a.views ?? 0) + 1 } : a,
  );
  await writeJson("articles.json", next);
}

/* ── Murojaatlar ──────────────────────────────────────────────────────── */

export type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  text: string;
  createdAt: string;
  read: boolean;
};

export async function getMessages(): Promise<Message[]> {
  const list = await readJson<Message[]>("messages.json", []);
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addMessage(
  input: Omit<Message, "id" | "createdAt" | "read">,
): Promise<void> {
  const list = await readJson<Message[]>("messages.json", []);
  list.push({
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    read: false,
  });
  // Fayl cheksiz o'smasligi uchun oxirgi 500 tasi saqlanadi.
  await writeJson("messages.json", list.slice(-500));
}

export async function saveMessages(list: Message[]): Promise<void> {
  await writeJson("messages.json", list);
}

/* ── Sozlamalar ───────────────────────────────────────────────────────── */

export type Settings = {
  phone: string;
  email: string;
  address: string;
  hours: string;
  telegramNotify: boolean;
  emailNotify: boolean;
  analytics: boolean;
};

const SETTINGS_SEED: Settings = {
  phone: "+998 97 144 04 44",
  email: "info@curelife.uz",
  address: "Toshkent, Zargarlik ko‘chasi 30V",
  hours: "Du–Ju · 09:00–18:00",
  telegramNotify: true,
  emailNotify: true,
  analytics: false,
};

export async function getSettings(): Promise<Settings> {
  return { ...SETTINGS_SEED, ...(await readJson("settings.json", {})) };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await writeJson("settings.json", settings);
}

/* ── Sahifa meta ma'lumotlari ─────────────────────────────────────────── */

export type PageMeta = { title: string; description: string };
export type PagesMeta = Record<string, { ru: PageMeta; uz: PageMeta }>;

/**
 * Meta tahrirlanadigan statik sahifalar. Mahsulot pasportlari bu yerda yo'q —
 * ularning `title`/`description` i mahsulotning o'z nomi va tavsifidan olinadi.
 */
export const PAGE_KEYS = [
  "/",
  "/products",
  "/about",
  "/contact",
  "/articles",
] as const;

export async function getPagesMeta(): Promise<PagesMeta> {
  return readJson<PagesMeta>("pages.json", {});
}

export async function savePagesMeta(meta: PagesMeta): Promise<void> {
  await writeJson("pages.json", meta);
}
