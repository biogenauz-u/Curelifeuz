import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/auth";
import { defaultLocale, isLocale, LOCALE_COOKIE, LOCALE_HEADER, type Locale } from "@/lib/i18n/config";

/**
 * Next.js 16 da middleware "proxy" deb ataladi. Ikki vazifasi bor:
 *
 * 1. Admin panel himoyasi (o'zgarmagan) — sessiyasi yo'q foydalanuvchini
 *    login sahifasiga yuboradi.
 * 2. RU/UZ til marshrutlash — Google/Yandex cookie yubormaydi, shuning
 *    uchun har bir til alohida, indekslanadigan URL'da bo'lishi kerak
 *    (`/ru/...`, `/uz/...`). Bu App Router'ning `app/` tuzilmasini
 *    o'zgartirmasdan, faqat REWRITE orqali amalga oshiriladi — sahifa
 *    kodlari (`resolveLocale()`) o'zgarishsiz ishlayveradi, faqat manba
 *    endi cookie emas, shu middleware qo'ygan sarlavha.
 *
 * Eski (prefiksiz) manzillar — `/products`, `/about` va h.k. — allaqachon
 * qidiruvda va tashqi havolalarda bo'lishi mumkin, shuning uchun ular
 * o'chirilmaydi: 308 (doimiy) redirect bilan mos tildagi versiyaga
 * yo'naltiriladi. Bu trafik/backlink qiymatini yo'qotmaydi.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin panel — til prefiksisiz, faqat sessiya tekshiruvi ──
  if (pathname.startsWith("/admin")) {
    if (pathname.startsWith("/admin/login")) return NextResponse.next();

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (await verifySessionToken(token)) return NextResponse.next();

    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // ── Til prefiksi bilan kelgan so'rov: /ru/... yoki /uz/... ──
  const match = pathname.match(/^\/(ru|uz)(\/.*)?$/);
  if (match) {
    const locale = match[1] as Locale;
    const rest = match[2] ?? "/";

    const url = request.nextUrl.clone();
    url.pathname = rest;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER, locale);

    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
    return response;
  }

  // ── Prefiksiz eski manzil — mos tildagi versiyaga doimiy yo'naltiriladi ──
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Statik fayllar (kengaytmali har qanday manzil), _next va Next.js'ning
  // o'zi chiqaradigan metadata route'lari (favicon, icon, robots, sitemap)
  // middleware'dan chetlab o'tadi.
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
