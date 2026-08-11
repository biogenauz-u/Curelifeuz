"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { plural, PRODUCTS_FORMS } from "@/lib/i18n/plural";
import { CONTAINER, H2, H2_LG, SECTION_Y } from "@/lib/utils";

/** Figma node 189:807 — "06 / О CureLife". */
export function About({ productCount }: { productCount: number }) {
  const { t, locale } = useLanguage();

  // "{count}" — mahsulotlar soni, tilga mos son-kelishik bilan.
  const products = plural(locale, productCount, PRODUCTS_FORMS);

  return (
    <section
      id="about"
      className={`${SECTION_Y} lg:pt-[53px] lg:pb-[117px]`}
    >
      <div className={CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,607px)_minmax(0,550px)] lg:justify-between lg:gap-[22px]">
          <div>
            <SectionLabel>{t.about.label}</SectionLabel>

            <h2 className={`${H2} ${H2_LG[50]} mt-[34px]`}>
              {t.about.title}
            </h2>

            <div className="mt-8 space-y-6 text-[16px] leading-[1.75] text-body lg:mt-[42px] lg:space-y-[28px]">
              {t.about.paragraphs.map((p) => (
                <p key={p}>{p.replace("{count}", products)}</p>
              ))}
            </div>
          </div>

          {/* Missiya kartasi — node 189:812 */}
          <aside className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(145deg,rgba(6,121,120,0.97)_0%,rgba(11,167,166,0.84)_100%)] p-[34px]">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-[80px] -right-[100px] size-[260px] rounded-full bg-[rgba(151,225,219,0.16)]"
            />

            <div className="relative flex h-full flex-col">
              <p className="text-[10px] tracking-[0.14em] text-white">
                {t.about.missionLabel}
              </p>

              <blockquote className="mt-[38px] font-display text-[30px] leading-[1.06] font-bold tracking-[-0.045em] text-white lg:text-[42px] lg:leading-[44.1px]">
                {t.about.mission}
              </blockquote>

              <p className="mt-[52px] text-[13px] text-[#d8f5f2] lg:mt-auto lg:pt-[52px]">
                {t.about.missionNote}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
