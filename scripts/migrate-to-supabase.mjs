/**
 * Bir martalik migratsiya: `data/*.json` → Supabase jadvali (`app_data`),
 * `public/uploads/*` → Supabase Storage (`uploads` bucket).
 *
 * Oldin bajarilishi kerak:
 *   1. `supabase/schema.sql` — Supabase dashboard → SQL Editor'da bir marta.
 *   2. `node scripts/setup-supabase.mjs` — "uploads" bucket'ini yaratadi.
 *
 * Keyin:
 *   node scripts/migrate-to-supabase.mjs
 *
 * Qayta ishga tushirish xavfsiz: fayllar bir xil nom bilan qayta yuklanadi
 * (upsert), jadval qatorlari ustidan yoziladi.
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs/promises";
import path from "node:path";

import { loadEnvLocal } from "./load-env.mjs";

loadEnvLocal();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Xato: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY .env.local da topilmadi.");
  process.exit(1);
}

const supabase = createClient(url, key);
const BUCKET = "uploads";
const DATA_DIR = path.resolve(process.cwd(), "data");
const UPLOADS_DIR = path.resolve(process.cwd(), "public", "uploads");

const CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

async function readJsonFile(name, fallback) {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, name), "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** `public/uploads/`dagi barcha fayllarni Storage'ga yuklaydi, eski nom → yangi URL xaritasini qaytaradi. */
async function migrateUploads() {
  const map = new Map();

  let names;
  try {
    names = await fs.readdir(UPLOADS_DIR);
  } catch {
    console.log("public/uploads topilmadi — o'tkazib yuborildi.");
    return map;
  }

  for (const name of names) {
    const ext = path.extname(name).toLowerCase();
    const contentType = CONTENT_TYPES[ext];
    if (!contentType) {
      console.warn(`  ⚠ ${name} — noma'lum format, o'tkazib yuborildi.`);
      continue;
    }

    const bytes = await fs.readFile(path.join(UPLOADS_DIR, name));
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(name, bytes, { contentType, upsert: true });

    if (error) {
      console.error(`  ✗ ${name}:`, error.message);
      continue;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(name);
    map.set(`/uploads/${name}`, data.publicUrl);
    console.log(`  ✓ ${name}`);
  }

  return map;
}

/** JSON ichidagi `/uploads/...` havolalarni Storage URL'lariga almashtiradi (chuqur). */
function remapUploads(value, map) {
  if (typeof value === "string") return map.get(value) ?? value;
  if (Array.isArray(value)) return value.map((v) => remapUploads(v, map));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = remapUploads(v, map);
    return out;
  }
  return value;
}

async function upsertTable(key, value) {
  const { error } = await supabase.from("app_data").upsert({ key, value });
  if (error) throw new Error(`app_data(${key}): ${error.message}`);
  console.log(`  ✓ ${key}`);
}

console.log("1. Fayllarni Supabase Storage'ga yuklash...");
const uploadMap = await migrateUploads();

console.log("\n2. Ma'lumotlarni jadvalga ko'chirish...");
const files = [
  ["products.json", []],
  ["articles.json", []],
  ["certificates.json", []],
  ["documents.json", []],
  ["messages.json", []],
  ["settings.json", {}],
  ["pages.json", {}],
];

for (const [name, fallback] of files) {
  const raw = await readJsonFile(name, fallback);
  const remapped = remapUploads(raw, uploadMap);
  await upsertTable(name, remapped);
}

console.log("\nTayyor. Endi saytni qayta ishga tushiring — ma'lumot Supabase'dan o'qiladi.");
