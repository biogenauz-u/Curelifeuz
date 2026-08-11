/**
 * Ma'lumot modeli: turlar, konstantalar va sof (IO'siz) normalizatorlar.
 *
 * `store.ts` dan ATAYLAB ajratilgan: u `node:fs` bilan ishlaydi va shu sababli
 * klient komponentiga import qilinsa Turbopack build'i buziladi. Admin
 * paneldagi klient ko'rinishlari shu fayldan import qiladi, server kodi esa
 * `store.ts` orqali ham (u bu yerdagilarni qayta eksport qiladi) foydalanadi.
 */

/** Brauzerda ham, serverda ham ishlaydigan ID generatori. */
function newId(): string {
  return globalThis.crypto.randomUUID();
}

export const str = (v: unknown): string => (typeof v === "string" ? v : "");
export const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

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
  before: string[];
  safety: SafetyItem[];
  composition: CompositionItem[];
  origin: {
    rawCountry: string;
    makeCountry: string;
    rawFull: string;
    manufacturerFull: string;
    role: string;
  };
};

/**
 * Mahsulotning tuzilmali atributlari.
 *
 * Ilgari bu ma'lumot `stats: [string, string, string]` — ya'ni ORNIGA
 * BOG'LIQ uchta katakda saqlanardi. Natijada «6 компонентов» qiymati
 * «Форма выпуска» ustuniga tushib qolgan edi: qaysi qiymat qaysi yorliqqa
 * tegishli ekanini faqat massivdagi tartib belgilardi.
 *
 * Endi har bir qiymatning o'z nomli maydoni bor, yorliq esa shu maydondan
 * kelib chiqadi — noto'g'ri ustunga tushishi mumkin emas.
 * Eski `stats` `migrateStats()` orqali avtomatik ko'chiriladi.
 */
export type ProductAttributes = {
  /** Chiqarilish shakli: «Капсулы», «Стик». */
  dosageForm: string;
  /** Qadoq turi: «Блистер», «Саше». */
  packageType: string;
  /** Qadoqdagi miqdor: «60 капсул». */
  packageQuantity: string;
  /** Netto og'irlik: «2,47 г». */
  netWeight: string;
  /** Komponentlar soni: «6». */
  componentCount: string;
  /** Bir martalik doza: «1 капсула». */
  servingSize: string;
  /** Qabul tartibi: «1 раз в день». */
  intakeInstructions: string;
  /** Qarshi ko'rsatmalar (qisqa). */
  contraindications: string;
  /** Allergenlar. */
  allergens: string;
};

/** Katalog va pasportdagi kataklar shu tartibda to'ldiriladi. */
export const ATTRIBUTE_CHIP_ORDER = [
  "dosageForm",
  "packageQuantity",
  "netWeight",
  "componentCount",
  "servingSize",
  "intakeInstructions",
  "packageType",
] as const satisfies ReadonlyArray<keyof ProductAttributes>;

export function emptyAttributes(): ProductAttributes {
  return {
    dosageForm: "",
    packageType: "",
    packageQuantity: "",
    netWeight: "",
    componentCount: "",
    servingSize: "",
    intakeInstructions: "",
    contraindications: "",
    allergens: "",
  };
}

export type ProductLocale = {
  /** Tilga xos nom: ruschada kirill, o'zbekchada lotin. Bo'sh bo'lsa
   *  mahsulotning umumiy `name` maydoni ishlatiladi. */
  name: string;
  category: string;
  description: string;
  attributes: ProductAttributes;
  detail: ProductDetail;
  /** Sahifa meta ma'lumoti. Bo'sh bo'lsa nom va tavsifdan olinadi. */
  seoTitle: string;
  seoDescription: string;
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
  /** Sertifikat fayli — rasm yoki PDF. Yangi hujjatlar `documents.json` da. */
  certificate: string | null;
  /** Yo'riqnoma (instruksiya) fayli — PDF yoki rasm. */
  instruction: string | null;
  /**
   * Qidiruv uchun qo'shimcha yozilishlar: «Fimbrioblok», «Нова Лайф».
   * Nom va slug allaqachon indekslanadi — bu yerga faqat boshqacha
   * yozilishlar yoziladi.
   */
  aliases: string[];
  /** Katalogdagi tartib. Kichik son oldinda turadi. */
  sortOrder: number;
  visible: boolean;
  /**
   * Arxivlangan mahsulot saytda ham, admin ro'yxatining asosiy
   * ko'rinishida ham chiqmaydi, lekin o'chirilmaydi.
   */
  archived: boolean;
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
    before: [],
    safety: [],
    composition: [],
    origin: {
      rawCountry: "",
      makeCountry: "",
      rawFull: "",
      manufacturerFull: "",
      role: "",
    },
  };
}


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
      rawCountry: str(origin.rawCountry),
      makeCountry: str(origin.makeCountry),
      rawFull: str(origin.rawFull),
      manufacturerFull: str(origin.manufacturerFull),
      role: str(origin.role),
    },
  };
}

export function normalizeAttributes(input: unknown): ProductAttributes {
  const a = (input ?? {}) as Record<string, unknown>;
  const base = emptyAttributes();
  for (const key of Object.keys(base) as Array<keyof ProductAttributes>) {
    base[key] = str(a[key]).trim();
  }
  return base;
}

/**
 * Eski `stats: [shakl, qadoq, qabul]` ni nomli maydonlarga ko'chiradi.
 *
 * Massivdagi tartibga ISHONMAYDI — har bir qiymat mazmuniga qarab
 * joylashtiriladi. Aynan shu sababli «6 компонентов» endi «Форма выпуска»
 * emas, «Компонентов» maydoniga tushadi.
 */
export function migrateStats(values: string[]): ProductAttributes {
  const attrs = emptyAttributes();

  const put = (key: keyof ProductAttributes, value: string) => {
    if (!attrs[key]) attrs[key] = value;
  };

  for (const raw of values) {
    const value = raw.trim();
    if (!value) continue;
    const low = value.toLowerCase();

    // «6 компонентов» / «20 komponent» → faqat sonning o'zi qoladi.
    const components = low.match(/^(\d+)\s*(компонент|komponent)/);
    if (components) {
      put("componentCount", components[1]);
      continue;
    }
    // «2,47 г» / «500 mg» — sof og'irlik.
    if (/^[\d.,]+\s*(г|g|мг|mg|кг|kg)$/i.test(value)) {
      put("netWeight", value);
      continue;
    }
    // «1 раз в день» / «Kuniga 1 marta» — qabul tartibi.
    if (/раз в день|в день|marta|kuniga|sutkada/i.test(low)) {
      put("intakeInstructions", value);
      continue;
    }
    // «60 капсул» — sondan boshlansa qadoqdagi miqdor.
    if (/^\d/.test(value)) {
      put("packageQuantity", value);
      continue;
    }
    // «Капсулы», «Стик» — chiqarilish shakli.
    put("dosageForm", value);
  }

  return attrs;
}

export function normalizeLocale(input: unknown): ProductLocale {
  const l = (input ?? {}) as Record<string, unknown>;
  const attributes = normalizeAttributes(l.attributes);
  const hasAttributes = Object.values(attributes).some(Boolean);

  return {
    name: str(l.name),
    category: str(l.category),
    description: str(l.description),
    // Atributlar hali to'ldirilmagan bo'lsa — eski `stats` dan ko'chiriladi.
    attributes: hasAttributes ? attributes : migrateStats(list(l.stats).map(str)),
    detail: normalizeDetail(l.detail),
    seoTitle: str(l.seoTitle),
    seoDescription: str(l.seoDescription),
  };
}

/** Eski `products.json` da yangi maydonlar yo'q — o'qishda to'ldiriladi. */
export function normalizeProduct(input: Product, index: number): Product {
  const aliases = list((input as unknown as Record<string, unknown>).aliases)
    .map(str)
    .map((a) => a.trim())
    .filter(Boolean);
  const order = (input as unknown as Record<string, unknown>).sortOrder;

  return {
    ...input,
    image: input.image ?? null,
    detailImage: input.detailImage ?? null,
    certificate: input.certificate ?? null,
    instruction: input.instruction ?? null,
    aliases: [...new Set(aliases)],
    sortOrder: typeof order === "number" && Number.isFinite(order) ? order : index,
    visible: input.visible !== false,
    archived: input.archived === true,
    ru: normalizeLocale(input.ru),
    uz: normalizeLocale(input.uz),
  };
}

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

export const DOCUMENT_TYPES = [
  "certificate",
  "declaration",
  "instruction",
  "other",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

/**
 * Barcha rasmiy hujjatlar uchun yagona model.
 *
 * `productId` bo'sh bo'lsa — hujjat butun kompaniyaga tegishli va faqat
 * «Biz haqimizda» sahifasida chiqadi.
 */
export type ProductDocument = {
  id: string;
  productId: string | null;
  type: DocumentType;
  titleRu: string;
  titleUz: string;
  documentNumber: string;
  /** ISO sana («2026-01-31») yoki bo'sh satr. */
  issuedAt: string;
  expiresAt: string;
  /** Asosiy fayl — PDF yoki rasm. */
  fileUrl: string;
  /** PDF uchun ko'rinadigan rasm (ixtiyoriy). */
  previewImage: string | null;
  isPublished: boolean;
  sortOrder: number;
};

export function isDocumentType(value: unknown): value is DocumentType {
  return DOCUMENT_TYPES.includes(value as DocumentType);
}

/** ISO sana formatini tekshiradi — noto'g'ri qiymat bo'sh satrga aylanadi. */
export function isoDate(value: unknown): string {
  const raw = str(value).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : "";
}

export function normalizeDocument(input: unknown, index: number): ProductDocument {
  const d = (input ?? {}) as Record<string, unknown>;
  const order = d.sortOrder;
  return {
    id: str(d.id) || newId(),
    productId: str(d.productId) || null,
    type: isDocumentType(d.type) ? d.type : "certificate",
    titleRu: str(d.titleRu).trim(),
    titleUz: str(d.titleUz).trim(),
    documentNumber: str(d.documentNumber).trim(),
    issuedAt: isoDate(d.issuedAt),
    expiresAt: isoDate(d.expiresAt),
    fileUrl: str(d.fileUrl),
    previewImage: str(d.previewImage) || null,
    isPublished: d.isPublished !== false,
    sortOrder: typeof order === "number" && Number.isFinite(order) ? order : index,
  };
}

/** Amal qilish muddati shu kun ichida tugaydiganlar «ogohlantirish» zonasida. */
export const DOCUMENT_EXPIRY_WARNING_DAYS = 60;

export type DocumentExpiry = "expired" | "soon" | "ok" | "none";

export function documentExpiry(
  document: ProductDocument,
  now = new Date(),
): DocumentExpiry {
  if (!document.expiresAt) return "none";
  const end = new Date(`${document.expiresAt}T00:00:00Z`).getTime();
  if (!Number.isFinite(end)) return "none";
  const days = Math.floor((end - now.getTime()) / 86_400_000);
  if (days < 0) return "expired";
  return days <= DOCUMENT_EXPIRY_WARNING_DAYS ? "soon" : "ok";
}

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
  ru: ArticleLocale;
  uz: ArticleLocale;
};

export function normalizeArticle(input: Article): Article {
  return {
    ...input,
    image: input.image ?? null,
    views: Number.isFinite(input.views) ? Math.max(0, Math.trunc(input.views)) : 0,
    ru: { title: str(input.ru?.title), body: str(input.ru?.body) },
    uz: { title: str(input.uz?.title), body: str(input.uz?.body) },
  };
}

export const MESSAGE_STATUSES = ["new", "read", "answered", "spam"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  text: string;
  createdAt: string;
  status: MessageStatus;
  /** Faqat admin ko'radigan izoh. */
  note: string;
};

export function normalizeMessage(input: unknown): Message {
  const m = (input ?? {}) as Record<string, unknown>;
  const status = MESSAGE_STATUSES.includes(m.status as MessageStatus)
    ? (m.status as MessageStatus)
    : // Eski format: faqat `read: boolean` bor edi.
      m.read === true
      ? "read"
      : "new";

  return {
    id: str(m.id) || newId(),
    name: str(m.name),
    email: str(m.email),
    phone: str(m.phone),
    topic: str(m.topic),
    text: str(m.text),
    createdAt: str(m.createdAt) || new Date(0).toISOString(),
    status,
    note: str(m.note),
  };
}

export type Settings = {
  phone: string;
  email: string;
  /**
   * Manzil va ish vaqti IKKALA tilda: ruscha sahifada «Ташкент», o'zbekchada
   * «Toshkent» chiqishi kerak. Bo'sh qoldirilsa umumiy qiymat ishlatiladi.
   */
  address: string;
  addressRu: string;
  addressUz: string;
  hours: string;
  hoursRu: string;
  hoursUz: string;
  /** Yandex Xaritalardagi joy havolasi. */
  mapUrl: string;
  instagram: string;
  telegram: string;
  facebook: string;
  youtube: string;
  /**
   * «Assortimentdagi mahsulotlar» soni. Bo'sh (0) bo'lsa saytdagi faol
   * mahsulotlardan avtomatik hisoblanadi — qo'lda takrorlanmaydi.
   */
  productCountOverride: number;
  telegramNotify: boolean;
  emailNotify: boolean;
  analytics: boolean;
};

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
