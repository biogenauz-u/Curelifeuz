"use server";

import { headers } from "next/headers";

import { recordVisit } from "@/lib/admin/store";
import { parseBrowser, parseDevice, parseOS } from "@/lib/analytics/parse-ua";

/**
 * Sahifa tashrifini qayd qiladi. `registerArticleView` kabi ochiq action —
 * autentifikatsiyasiz, faqat statistika hisoblagichiga yozadi.
 */
export async function registerVisit(
  rawPath: string,
  referrer: string | null,
): Promise<void> {
  if (!rawPath) return;

  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  if (/bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp/i.test(ua)) {
    return;
  }

  const locale = rawPath.startsWith("/uz") ? "uz" : "ru";
  const path = rawPath.replace(/^\/(ru|uz)(?=\/|$)/, "") || "/";

  let referrerHost: string | null = null;
  if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, "");
      if (!host.includes("curelife")) referrerHost = host;
    } catch {
      // yaroqsiz referrer — e'tiborsiz qoldiriladi
    }
  }

  const rawCity = h.get("x-vercel-ip-city");

  await recordVisit({
    path,
    locale,
    device: parseDevice(ua),
    browser: parseBrowser(ua),
    os: parseOS(ua),
    country: h.get("x-vercel-ip-country"),
    city: rawCity ? decodeURIComponent(rawCity) : null,
    referrerHost,
  });
}
