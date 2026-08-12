"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { assertAdmin } from "@/lib/admin/guard";
import { sanitizeArticleBody } from "@/lib/admin/sanitize";
import {
  emptyDetail,
  getArticles,
  getCertificates,
  getMessages,
  getPagesMeta,
  getProducts,
  normalizeDetail,
  type PagesMeta,
  type Product,
  type ProductDetail,
  saveArticles,
  saveCertificates,
  saveMessages,
  savePagesMeta,
  saveProducts,
  saveSettings,
  type Settings,
} from "@/lib/admin/store";
import {
  deleteUploadedFile,
  saveUploadedFile,
  type UploadKind,
} from "@/lib/admin/uploads";

/** Saytdagi va admindagi ma'lumotni yangilash. */
function refresh(): void {
  revalidatePath("/admin");
  revalidatePath("/products");
  // Ro'yxat sahifasini yangilash mahsulot/maqolaning O'Z sahifasini
  // keshdan chiqarmaydi — shu ikkalasi alohida ko'rsatilishi kerak,
  // aks holda tahrirlangan mahsulot/maqola sahifasi eski holatda qolib ketadi.
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/about");
  revalidatePath("/articles");
  revalidatePath("/articles/[slug]", "page");
  revalidatePath("/contact");
  revalidatePath("/", "layout");
}

/* ── Mahsulotlar ──────────────────────────────────────────────────────── */

export async function toggleProduct(id: string): Promise<void> {
  await assertAdmin();
  const products = await getProducts();
  await saveProducts(
    products.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)),
  );
  refresh();
}

export async function deleteProduct(id: string): Promise<void> {
  await assertAdmin();
  const products = await getProducts();
  const removed = products.find((p) => p.id === id);
  await saveProducts(products.filter((p) => p.id !== id));

  if (removed) {
    for (const url of [
      removed.image,
      removed.detailImage,
      removed.certificate,
      removed.instruction,
      removed.originLogo,
    ]) {
      await deleteUploadedFile(url);
    }
  }
  refresh();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’'`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Slug takrorlanmasligi uchun oxiriga raqam qo'shiladi. */
function uniqueSlug(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export type ProductFormState = { error?: string };

/** Formadagi fayl maydonlari: nomi + qanday tur qabul qilinishi. */
const FILE_FIELDS: ReadonlyArray<{
  field: "image" | "detailImage" | "certificate" | "instruction" | "originLogo";
  kind: UploadKind;
}> = [
  { field: "image", kind: "image" },
  { field: "detailImage", kind: "image" },
  { field: "certificate", kind: "document" },
  { field: "instruction", kind: "document" },
  { field: "originLogo", kind: "image" },
];

type FileResult = {
  urls: Record<string, string | null>;
  /** Saqlash muvaffaqiyatli tugagach o'chiriladigan eski fayllar. */
  stale: Array<string | null>;
};

/**
 * Yangi fayllarni saqlaydi. Bir fayl xato bersa, shu chaqiruvda yozilgan
 * fayllar o'chiriladi va eski fayllarga tegilmaydi.
 */
async function resolveFiles(
  formData: FormData,
  existing: Product | undefined,
): Promise<FileResult> {
  const urls: Record<string, string | null> = {};
  const stale: Array<string | null> = [];
  const written: string[] = [];

  try {
    for (const { field, kind } of FILE_FIELDS) {
      const current = existing?.[field] ?? null;
      const upload = formData.get(field);

      if (upload instanceof File && upload.size > 0) {
        const url = await saveUploadedFile(upload, kind);
        written.push(url);
        urls[field] = url;
        stale.push(current);
      } else if (formData.get(`remove_${field}`) === "on") {
        urls[field] = null;
        stale.push(current);
      } else {
        urls[field] = current;
      }
    }
  } catch (error) {
    for (const url of written) await deleteUploadedFile(url);
    throw error;
  }

  return { urls, stale };
}

/** Tarkib/xavfsizlik kabi ro'yxatlar formaga JSON bo'lib keladi. */
function readDetail(formData: FormData, key: string): ProductDetail {
  const raw = String(formData.get(key) ?? "");
  if (!raw) return emptyDetail();
  try {
    return normalizeDetail(JSON.parse(raw));
  } catch {
    return emptyDetail();
  }
}

/**
 * Mahsulotni saqlaydi (yangi yoki tahrirlangan) va mahsulotlar ro'yxatiga
 * qaytaradi. Forma alohida sahifada, `useActionState` bilan ishlatiladi.
 */
export async function saveProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await assertAdmin();

  const read = (key: string) => String(formData.get(key) ?? "").trim();

  const id = read("id");
  const name = read("name");
  if (!name) return { error: "Mahsulot nomini kiriting." };

  const products = await getProducts();
  const existing = id ? products.find((p) => p.id === id) : undefined;
  if (id && !existing) return { error: "Mahsulot topilmadi." };

  const otherSlugs = new Set(
    products.filter((p) => p.id !== existing?.id).map((p) => p.slug),
  );
  const wantedSlug = slugify(read("slug") || name) || "mahsulot";
  const slug =
    existing && existing.slug === wantedSlug
      ? existing.slug
      : uniqueSlug(wantedSlug, otherSlugs);

  // ── Fayllar: rasm, pasport rasmi, sertifikat, yo'riqnoma ──
  let files: FileResult;
  try {
    files = await resolveFiles(formData, existing);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Faylni yuklab bo‘lmadi.",
    };
  }

  const next: Product = {
    id: existing?.id ?? randomUUID(),
    slug,
    number: read("number") || String(products.length + 1).padStart(2, "0"),
    name,
    image: files.urls.image,
    detailImage: files.urls.detailImage,
    certificate: files.urls.certificate,
    instruction: files.urls.instruction,
    originLogo: files.urls.originLogo,
    visible: formData.get("visible") === "on",
    ru: {
      name: read("ru_name"),
      category: read("ru_category"),
      description: read("ru_description"),
      stats: [read("ru_s1"), read("ru_s2"), read("ru_s3")],
      detail: readDetail(formData, "ru_detail"),
    },
    uz: {
      name: read("uz_name"),
      category: read("uz_category"),
      description: read("uz_description"),
      stats: [read("uz_s1"), read("uz_s2"), read("uz_s3")],
      detail: readDetail(formData, "uz_detail"),
    },
  };

  await saveProducts(
    existing
      ? products.map((p) => (p.id === existing.id ? next : p))
      : [...products, next],
  );
  for (const url of files.stale) await deleteUploadedFile(url);
  refresh();

  redirect("/admin?view=products");
}

/* ── Sertifikatlar ────────────────────────────────────────────────────── */

export type CertificateFormState = { error?: string };

export async function addCertificate(
  _prev: CertificateFormState,
  formData: FormData,
): Promise<CertificateFormState> {
  await assertAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const upload = formData.get("file");

  if (!title) return { error: "Sertifikat nomini kiriting." };
  if (!(upload instanceof File) || upload.size === 0) {
    return { error: "Sertifikat faylini tanlang." };
  }

  let file: string;
  try {
    file = await saveUploadedFile(upload, "document");
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Faylni yuklab bo‘lmadi.",
    };
  }

  const list = await getCertificates();
  await saveCertificates([...list, { id: randomUUID(), title, file }]);
  refresh();
  return {};
}

export async function deleteCertificate(id: string): Promise<void> {
  await assertAdmin();
  const list = await getCertificates();
  const removed = list.find((c) => c.id === id);
  await saveCertificates(list.filter((c) => c.id !== id));
  await deleteUploadedFile(removed?.file ?? null);
  refresh();
}

/* ── Maqolalar ────────────────────────────────────────────────────────── */

const CYRILLIC: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/** Sarlavhadan havola yasaydi — kirill harflar lotinga o'giriladi. */
function slugifyTitle(value: string): string {
  return slugify(
    value.toLowerCase().replace(/[а-яё]/g, (ch) => CYRILLIC[ch] ?? ch),
  );
}

export async function deleteArticle(id: string): Promise<void> {
  await assertAdmin();
  const list = await getArticles();
  const removed = list.find((a) => a.id === id);
  await saveArticles(list.filter((a) => a.id !== id));
  await deleteUploadedFile(removed?.image ?? null);
  refresh();
}

export type ArticleFormState = { error?: string };

export async function saveArticle(
  _prev: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  await assertAdmin();

  const read = (key: string) => String(formData.get(key) ?? "").trim();

  const id = read("id");
  const ruTitle = read("ru_title");
  const uzTitle = read("uz_title");
  if (!ruTitle && !uzTitle) return { error: "Maqola sarlavhasini kiriting." };

  const list = await getArticles();
  const existing = id ? list.find((a) => a.id === id) : undefined;
  if (id && !existing) return { error: "Maqola topilmadi." };

  // ── Rasm ──
  let image = existing?.image ?? null;
  let stale: string | null = null;
  const upload = formData.get("image");

  if (upload instanceof File && upload.size > 0) {
    try {
      image = await saveUploadedFile(upload, "image");
      stale = existing?.image ?? null;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Rasmni yuklab bo‘lmadi.",
      };
    }
  } else if (formData.get("remove_image") === "on") {
    stale = existing?.image ?? null;
    image = null;
  }

  const taken = new Set(list.filter((a) => a.id !== existing?.id).map((a) => a.slug));
  const wanted = slugifyTitle(uzTitle || ruTitle) || "maqola";
  const slug =
    existing && existing.slug === wanted ? existing.slug : uniqueSlug(wanted, taken);

  const views = Number.parseInt(read("views"), 10);

  const next = {
    id: existing?.id ?? randomUUID(),
    slug,
    image,
    views: Number.isFinite(views) && views >= 0 ? views : (existing?.views ?? 0),
    relatedProductId: read("relatedProductId") || null,
    publishedAt: read("publishedAt") || new Date().toISOString().slice(0, 10),
    ru: { title: ruTitle, body: sanitizeArticleBody(read("ru_body")) },
    uz: { title: uzTitle, body: sanitizeArticleBody(read("uz_body")) },
  };

  await saveArticles(
    existing ? list.map((a) => (a.id === existing.id ? next : a)) : [...list, next],
  );
  await deleteUploadedFile(stale);
  refresh();

  redirect("/admin?view=articles");
}

/* ── Murojaatlar ──────────────────────────────────────────────────────── */

export async function markMessageRead(
  id: string,
  read: boolean,
): Promise<void> {
  await assertAdmin();
  const list = await getMessages();
  await saveMessages(list.map((m) => (m.id === id ? { ...m, read } : m)));
  revalidatePath("/admin");
}

export async function deleteMessage(id: string): Promise<void> {
  await assertAdmin();
  const list = await getMessages();
  await saveMessages(list.filter((m) => m.id !== id));
  revalidatePath("/admin");
}

/* ── Sozlamalar ───────────────────────────────────────────────────────── */

export async function updateSettings(formData: FormData): Promise<void> {
  await assertAdmin();
  const read = (key: string) => String(formData.get(key) ?? "").trim();

  const settings: Settings = {
    phone: read("phone"),
    email: read("email"),
    address: read("address"),
    hours: read("hours"),
    telegramNotify: formData.get("telegramNotify") === "on",
    emailNotify: formData.get("emailNotify") === "on",
    analytics: formData.get("analytics") === "on",
  };

  await saveSettings(settings);
  refresh();
}

/* ── Sahifa meta ──────────────────────────────────────────────────────── */

export async function updatePageMeta(formData: FormData): Promise<void> {
  await assertAdmin();
  const key = String(formData.get("key") ?? "");
  if (!key) return;

  const read = (k: string) => String(formData.get(k) ?? "").trim();
  const meta: PagesMeta = await getPagesMeta();

  meta[key] = {
    ru: { title: read("ru_title"), description: read("ru_description") },
    uz: { title: read("uz_title"), description: read("uz_description") },
  };

  await savePagesMeta(meta);
  refresh();
}
