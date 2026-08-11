import { cookies } from "next/headers";

import { SESSION_COOKIE, verifySessionToken } from "./auth";

/**
 * Har bir yozish/AI amalidan oldin sessiya tekshiriladi.
 *
 * Server action'lar HTTP endpoint bo'lgani uchun layout'dagi himoya yetarli
 * emas — action'ni to'g'ridan-to'g'ri chaqirish mumkin.
 */
export async function assertAdmin(): Promise<void> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    throw new Error("Ruxsat yo‘q");
  }
}
