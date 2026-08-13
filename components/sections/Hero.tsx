"use client";

import Image from "next/image";

import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { withLocale } from "@/lib/i18n/config";
import { CERTIFICATES_HREF } from "@/lib/site-config";
import { cn, CONTAINER_WIDE } from "@/lib/utils";

/**
 * Figma node 257:2455 — bosh oyna (1920 × 1080).
 * Vertikal masofalar maketdan aynan olingan:
 * 36 (header ustidan) + 82 (header) + 149 + 32 (badge) + 37 + 177 (h1)
 * + 47 + 58 (matn) + 48 + 52 (tugmalar) + 15 + 36 (ogohlantirish) + 311 = 1080.
 */
export function Hero() {
  const { t, locale } = useLanguage();

  return (
    // Balandlik `.hero-frame` orqali globals.css da beriladi: keng ekranda
    // maketdagi aniq 1080px, torroq desktopda 16:9 nisbat (56.25vw).
    // `isolate` va `-z-10` ATAYLAB ishlatilmagan: ular bo'lsa bo'lim alohida
    // stacking context yaratadi va uning ichidagi `fixed` navbar keyingi
    // bo'limlar ostida qolib ketadi. Shuning uchun fon ham, kontent ham
    // pozitsiyalangan qatlam — tartibni DOM ketma-ketligi hal qiladi.
    <section id="hero" className="hero-frame relative w-full overflow-hidden">
      {/* Fon — node 257:2458. Maketda rasm 2005×1119 o'lchamda (-85, -20)
          nuqtaga qo'yilgan, ya'ni freymdan bir oz kattaroq va chapga surilgan.
          Shu nisbatlar foizga o'girilgan; mobil ekranda oddiy cover yetarli. */}
      <div className="absolute inset-0 overflow-hidden bg-[#edf7fb]">
        <div className="absolute inset-0">
          {/* Tor ekranda rasmning chap qismi (molekulalar) ko'rinadi —
              o'ng tomondagi quti-mahsulotlar matn ostiga tushmaydi. */}
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[18%_50%] lg:object-center"
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(180deg,transparent,rgba(210,242,244,.18))]"
        />
      </div>

      <Header />

      <div className={cn(CONTAINER_WIDE, "relative")}>
        {/* Hero'da barcha matn Manrope bilan terilgan (maketdagidek) */}
        <div className="pt-10 pb-[92px] font-display sm:pt-[60px] lg:pt-[149px] lg:pb-0">
          {/* Sarlavha — node 257:2462 */}
          <h1 className="mt-6 max-w-[686px] text-[34px] sm:mt-[28px] sm:text-[36px] leading-[1.05] font-extrabold tracking-[-0.029em] text-ink sm:text-[46px] lg:mt-[37px] lg:text-[60px] lg:leading-[59px]">
            <span className="text-brand-gradient">{t.hero.titleAccent}</span>{" "}
            {t.hero.titleRest}
          </h1>

          {/* Tavsif — node 257:2463 */}
          <p className="mt-5 max-w-[486px] text-[17px] leading-[1.6] text-muted sm:mt-[28px] sm:text-[18px] lg:mt-[47px]">
            {t.hero.subtitle}
          </p>

          {/* Tugmalar — node 257:2464 */}
          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-[32px] lg:mt-[48px]">
            <a
              href={withLocale(locale, "/products")}
              className="bg-brand-gradient inline-flex h-[52px] items-center gap-2 rounded-pill pr-[23px] pl-[17px] text-[16px] text-white transition-opacity hover:opacity-90"
            >
              {t.hero.ctaPrimary}
              <ArrowRightIcon className="size-[19px]" />
            </a>

            <a
              href={withLocale(locale, CERTIFICATES_HREF)}
              className="inline-flex h-[52px] items-center rounded-pill border border-brand-200 bg-white/72 px-[20px] text-[16px] text-ink transition-colors hover:bg-white"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>

          {/* Ogohlantirish — node 257:2471 + 257:2473 */}
          <div className="mt-[20px] flex max-w-[459px] items-start gap-[10px] lg:mt-[15px]">
            <span
              aria-hidden="true"
              className="mt-[7px] grid size-[22px] shrink-0 place-items-center rounded-full border border-brand-200 text-[11px] leading-none font-bold text-muted"
            >
              i
            </span>
            <p className="max-w-[427px] text-[13px] leading-[1.55] text-[#5a6470]">
              {t.hero.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
