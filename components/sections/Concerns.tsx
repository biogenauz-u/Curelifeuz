"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PillIcon, ShieldIcon } from "@/components/ui/icons";
import { BODY, CONTAINER, H2, H2_LG, SECTION_PT } from "@/lib/utils";

/** Har bir qatorning o'ng tomonidagi belgi — maketdagi tartibda. */
const MARKS = [
  { type: "text", value: "?" },
  { type: "icon", value: "shield" },
  { type: "icon", value: "pill" },
  { type: "text", value: "!" },
  { type: "text", value: "+" },
] as const;

/** Figma node 189:708 — "02 / Вопросы при выборе". */
export function Concerns() {
  const { t } = useLanguage();

  return (
    <section id="concerns" className={`${SECTION_PT} pb-12 lg:pt-[166px] lg:pb-[88px]`}>
      <div className={CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,659px)] lg:gap-[21px]">
          <div>
            <SectionLabel>{t.concerns.label}</SectionLabel>

            <h2 className={`${H2} ${H2_LG[62]} mt-[16px] max-w-[500px]`}>
              {t.concerns.title}{" "}
              <span className="text-accent">{t.concerns.titleAccent}</span>
            </h2>

            <p className={`${BODY} mt-[22px] max-w-[500px]`}>
              {t.concerns.body}
            </p>
          </div>

          <ul className="glass-panel self-start rounded-[28px] px-[26px] py-[10px]">
            {t.concerns.items.map((item, i) => {
              const mark = MARKS[i];
              return (
                <li
                  key={item}
                  className={
                    "flex items-center gap-[24px] py-[18px] " +
                    (i < t.concerns.items.length - 1
                      ? "border-b border-hairline"
                      : "")
                  }
                >
                  <span className="num-chip grid size-[34px] shrink-0 place-items-center rounded-[12px] text-[11px] font-bold text-brand-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1 text-[14px] font-bold text-ink-deep">
                    {item}
                  </span>

                  <span className="grid size-[30px] shrink-0 place-items-center rounded-[10px] bg-accent/8 text-[16px] text-accent">
                    {mark.type === "text" ? (
                      mark.value
                    ) : mark.value === "shield" ? (
                      <ShieldIcon className="size-[20px]" />
                    ) : (
                      <PillIcon className="size-[20px]" />
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
