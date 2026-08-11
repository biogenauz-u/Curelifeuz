"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn, CONTAINER, SECTION_PB } from "@/lib/utils";

/** Figma node 189:817 — "07 / Путь продукта". Butun bo'lim — qorong'i karta. */
export function Journey() {
  const { t } = useLanguage();

  return (
    <section id="journey" className={`${SECTION_PB} lg:pb-[96px]`}>
      <div className={CONTAINER}>
        <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#102021_0%,#123938_100%)] p-[24px] lg:p-[36px]">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,595px)_minmax(0,448px)] lg:justify-between lg:gap-10">
            <div>
              <SectionLabel tone="dark" className="!text-[#9dd5d1]">
                {t.journey.label}
              </SectionLabel>
              <h2 className="mt-[38px] font-display text-[32px] leading-[1.05] font-bold tracking-[-0.045em] text-white sm:text-[42px] lg:text-[52px] lg:leading-[53.56px]">
                {t.journey.title}
              </h2>
            </div>

            <p className="text-[16px] leading-[27.2px] text-[#bcd5d2] lg:pt-[46px]">
              {t.journey.body}
            </p>
          </div>

          <ol className="mt-[60px] grid gap-[10px] sm:grid-cols-2 lg:grid-cols-4">
            {t.journey.steps.map((step, i) => {
              // Maketda oxirgi karta "shaffof" — u hali kelajakdagi bosqich.
              const ghost = i === t.journey.steps.length - 1;
              return (
                <li
                  key={step.title}
                  className={cn(
                    "rounded-[18px] border border-white/13 px-[22px] pt-[19px] pb-[26px]",
                    ghost ? "bg-white/7" : "bg-white/92",
                  )}
                >
                  <p className="font-display text-[70px] leading-[70px] font-bold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className={cn(
                      "mt-[16px] font-display text-[18px] leading-[20px] font-bold tracking-[-0.045em]",
                      ghost ? "text-white" : "text-ink-deep",
                    )}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-[11px] text-[11px] leading-[17.05px]",
                      ghost ? "text-[#b8cfcc]" : "text-[#6b8280]",
                    )}
                  >
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
