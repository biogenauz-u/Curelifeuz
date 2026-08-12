"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { registerVisit } from "@/app/analytics/actions";

/**
 * Sayt bo'ylab har bir sahifa o'tishini (to'liq yuklash ham, klient
 * navigatsiyasi ham) bir marta qayd qiladi. `ViewCounter` bilan bir xil
 * mantiq: render paytida emas, mount/pathname o'zgarishidan keyin.
 * Admin panel sahifalari hisoblanmaydi.
 */
export function VisitTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    void registerVisit(pathname, document.referrer || null);
  }, [pathname]);

  return null;
}
