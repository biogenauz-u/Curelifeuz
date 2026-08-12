import Link from "next/link";
import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { withLocale } from "@/lib/i18n/config";
import { getServerDictionary, resolveLocale } from "@/lib/i18n/server";
import { CONTAINER } from "@/lib/utils";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Har qanday mos kelmagan manzil yoki `notFound()` chaqirilgan joyda
 * ko'rsatiladi (haqiqiy HTTP 404 statusi bilan — Next.js avtomatik beradi).
 */
export default async function NotFound() {
  const [dict, locale] = await Promise.all([getServerDictionary(), resolveLocale()]);
  const t = dict.notFound;

  return (
    <>
      <main className="flex-1 bg-[#f8ffff] text-ink-deep">
        <Header />
        <div className={`${CONTAINER} grid min-h-[50vh] place-items-center py-24 text-center`}>
          <div>
            <p className="font-display text-[80px] leading-none font-bold text-accent">404</p>
            <h1 className="mt-4 font-display text-[28px] font-bold tracking-[-.03em] sm:text-[36px]">
              {t.title}
            </h1>
            <p className="mx-auto mt-4 max-w-[440px] text-[14px] leading-6 text-body">
              {t.body}
            </p>
            <Link
              href={withLocale(locale, "/")}
              className="bg-brand-gradient mt-8 inline-flex h-12 items-center rounded-pill px-6 text-[13px] font-bold text-white"
            >
              {t.cta}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
