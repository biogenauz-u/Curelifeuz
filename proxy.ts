import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/auth";

/**
 * Next.js 16 da middleware "proxy" deb ataladi.
 *
 * Bu yerda faqat TEZKOR tekshiruv: sessiyasi yo'q foydalanuvchini panel
 * render bo'lishidan oldin login sahifasiga yuboradi. Asosiy himoya
 * `app/admin/(protected)/layout.tsx` da — Next.js hujjati proxy'ni yagona
 * himoya sifatida ishlatmaslikni tavsiya qiladi.
 */
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (await verifySessionToken(token)) return NextResponse.next();

  const url = new URL("/admin/login", request.url);
  return NextResponse.redirect(url);
}

export const config = {
  // Login sahifasining o'zi va statik fayllar tekshirilmaydi.
  matcher: ["/admin", "/admin/((?!login).*)"],
};
