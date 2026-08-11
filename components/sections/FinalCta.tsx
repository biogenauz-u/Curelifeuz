"use client";

import Image from "next/image";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BODY, CONTAINER, H2, H2_LG, SECTION_Y } from "@/lib/utils";

/** Figma node 189:860 — "10 / Финальный призыв". */
export function FinalCta() {
  const { t } = useLanguage();

  return (
    <section
      id="cta"
      className={`${SECTION_Y} relative lg:-mt-[25px] lg:pt-0 lg:pb-[60px]`}
    >
      <div className={CONTAINER}>
        <div className="glass-panel grid gap-8 rounded-[32px] p-[28px] lg:grid-cols-[minmax(0,574px)_minmax(0,520px)] lg:items-center lg:gap-[38px] lg:p-[57px]">
          <div>
            <SectionLabel>{t.cta.label}</SectionLabel>

            <h2 className={`${H2} ${H2_LG[50]} mt-[15px]`}>
              {t.cta.title}
            </h2>

            <p className={`${BODY} mt-[21px] max-w-[537px]`}>{t.cta.body}</p>

            <a
              href="/products"
              className="bg-cta-gradient mt-[35px] inline-flex h-[50px] items-center gap-[14px] rounded-[16px] px-[20px] text-[16px] font-bold text-white shadow-[0_12px_13px_rgba(11,167,166,0.24)] transition-opacity hover:opacity-90"
            >
              {t.common.viewProducts}
              <ArrowRightIcon className="size-[20px]" />
            </a>
          </div>

          {/* Rasm — node 189:870, gradient bilan yumshatilgan */}
          <div className="relative aspect-[520/320] overflow-hidden rounded-[24px]">
            <Image
              src="/images/cta-capsule.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover object-center"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.35)_0%,rgba(221,247,243,0)_60%)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
