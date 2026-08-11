/**
 * Bir martalik sozlash: Supabase Storage'da "uploads" (ochiq) bucket bor-yo'qligini
 * tekshiradi, bo'lmasa yaratadi.
 *
 *   node scripts/setup-supabase.mjs
 *
 * Bundan oldin `supabase/schema.sql` ni Supabase dashboard → SQL Editor'da
 * bir marta ishga tushirish kerak (jadval shu yerda yaratilmaydi — Storage
 * bucket'dan farqli, jadval yaratish uchun to'g'ridan-to'g'ri SQL kerak).
 */
import { createClient } from "@supabase/supabase-js";

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

const { data: buckets, error: listError } = await supabase.storage.listBuckets();
if (listError) {
  console.error("Bucket ro'yxatini olib bo'lmadi:", listError.message);
  process.exit(1);
}

if (buckets.some((b) => b.name === BUCKET)) {
  console.log(`✓ Bucket "${BUCKET}" allaqachon mavjud.`);
} else {
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
  });
  if (error) {
    console.error(`Bucket yaratib bo'lmadi:`, error.message);
    process.exit(1);
  }
  console.log(`✓ Bucket "${BUCKET}" yaratildi (ochiq, 10 MB chegara).`);
}
