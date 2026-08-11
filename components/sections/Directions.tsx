"use client";

import Image from "next/image";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CONTAINER, H2, H2_LG, SECTION_Y } from "@/lib/utils";

/**
 * Rasm har bir kartada boshqacha kesilgan. Maketdagi absolyut qiymatlar
 * (352.66 × 230 li ramkaga nisbatan) foizga o'girilgan — shunda karta
 * kichraysa ham kadr bir xil qoladi.
 */
const CARDS = [
  {
    src: "/images/direction-women.png",
    // Figma 261:2498 — 225×434 @ (39, −84.78)
    box: { left: "11.06%", top: "-36.86%", width: "63.80%", height: "188.70%" },
    // ramka ichidagi rasm yana bir bor kesilgan
    inner: { left: "-6.49%", width: "128.52%" },
  },
  {
    src: "/images/direction-men.png",
    // Figma 261:2496 — 357×357 @ (−1.66, −28.78)
    box: { left: "-0.47%", top: "-12.51%", width: "101.23%", height: "155.22%" },
    inner: { left: "0%", width: "100%" },
  },
  {
    src: "/images/direction-planning.png",
    // Figma 261:2499 — 349×233 @ (58.67, 0.22)
    box: { left: "16.64%", top: "0.10%", width: "98.96%", height: "101.30%" },
    inner: { left: "0%", width: "100%" },
  },
] as const;

/** Figma node 189:526 — "03 / Направления". */
export function Directions() {
  const { t } = useLanguage();

  return (
    <section
      id="products"
      className={`${SECTION_Y} bg-gradient-to-b from-[rgba(221,247,243,0.56)] to-[rgba(243,255,253,0.3)] lg:pt-[90px] lg:pb-[86px]`}
    >
      <div className={CONTAINER}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,600px)_minmax(0,549px)] lg:items-end lg:justify-between lg:gap-10">
          <div>
            <SectionLabel>{t.directions.label}</SectionLabel>
            <h2
              className={`${H2} ${H2_LG[58]} mt-[36px] max-w-[572px]`}
            >
              {t.directions.title}
            </h2>
          </div>

          <p className="max-w-[549px] text-[15px] leading-[1.7] text-body">
            {t.directions.body}
          </p>
        </div>

        <ul className="mt-[40px] grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.directions.cards.map((card, i) => {
            const art = CARDS[i];
            return (
              <li
                key={card.title}
                className="glass-panel flex flex-col rounded-[28px] p-[14px]"
              >
                <div className="relative h-[230px] overflow-hidden rounded-[20px] bg-gradient-to-br from-[rgba(221,247,243,0.75)] to-[rgba(255,255,255,0.8)]">
                  <div className="absolute overflow-hidden" style={art.box}>
                    <div className="absolute inset-y-0" style={art.inner}>
                      <Image
                        src={art.src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="mt-[23px] px-[8px] font-display text-[24px] leading-[27px] font-bold tracking-[-0.045em] text-ink-deep">
                  {card.title}
                </h3>
                <p className="mt-[11px] px-[8px] text-[13px] leading-[20.8px] text-body">
                  {card.body}
                </p>

                <a
                  href="/products"
                  className="mt-auto flex min-h-11 items-center justify-between gap-4 px-[8px] pt-[16px] pb-[6px] text-[14px] font-bold text-brand-700 transition-colors hover:text-accent"
                >
                  {t.directions.link}
                  <ArrowRightIcon className="size-[20px]" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
