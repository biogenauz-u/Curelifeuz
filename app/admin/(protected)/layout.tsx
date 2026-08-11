import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/auth";

/**
 * Haqiqiy himoya shu yerda: har bir so'rovda sessiya cookie'si tekshiriladi.
 * `proxy.ts` faqat tezkor (optimistik) yo'naltirish uchun — Next.js hujjatiga
 * ko'ra u yakkayu-yagona himoya bo'lmasligi kerak.
 */
export default async function ProtectedAdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  if (!(await verifySessionToken(token))) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
