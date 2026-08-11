import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Faqat serverda ishlatiladigan Supabase klienti — `service_role` kaliti
 * bilan (RLS'ni chetlab o'tadi). Hech qachon klient komponentiga yoki
 * brauzerga chiqarilmasligi kerak. Barcha o'qish/yozish `lib/admin/store.ts`
 * va `lib/admin/uploads.ts` orqali, server action'lar ichida bo'ladi.
 */

let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY .env.local da yo'q. Supabase loyihangizning Project Settings → API bo'limidan oling.",
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

/** Barcha "fayl" (JSON o'rniga) ma'lumotlari saqlanadigan yagona jadval. */
export const APP_DATA_TABLE = "app_data";

/** Yuklangan fayllar (rasm/PDF) uchun ochiq Storage bucket. */
export const UPLOADS_BUCKET = "uploads";
