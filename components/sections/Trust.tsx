"use client";

import Image from "next/image";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FileIcon, MapIcon, ShieldIcon } from "@/components/ui/icons";
import { CERTIFICATES_HREF } from "@/lib/site-config";
import { BODY, CONTAINER, H2, H2_LG, SECTION_Y } from "@/lib/utils";

const CARD_ICONS = [ShieldIcon, FileIcon, MapIcon];

/**
 * Ikkala sertifikat ham bitta rasm — maketda turli burchak va joyda.
 * Foizlar 609×481 li o'ng panelga nisbatan, varaq MARKAZI bo'yicha olingan
 * (node 261:2501 / 261:2502). Pastki qismi panel chetida kesiladi.
 */
const CERTS = [
  { left: "37.4%", top: "74.8%", rotate: "-15.09deg" },
  { left: "68.6%", top: "74.9%", rotate: "10.2deg" },
] as const;

/** Figma node 189:566 — "05 / Доверие". */
export function Trust() {
  const { t } = useLanguage();

  return (
    <section
      id="trust"
      className={`${SECTION_Y} bg-gradient-to-b from-[rgba(221,247,243,0.56)] to-[rgba(243,255,253,0.3)] lg:py-[110px]`}
    >
      <div className={CONTAINER}>
        <div className="glass-panel relative overflow-hidden rounded-[30px] p-[24px]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,495px)_minmax(0,609px)] lg:gap-4">
            <div className="px-[6px] pt-[43px] pb-[10px] lg:px-[26px]">
              <SectionLabel>{t.trust.label}</SectionLabel>

              <h2
                className={`${H2} ${H2_LG[50]} mt-[24px]`}
              >
                {t.trust.title}{" "}
                <span className="text-accent">{t.trust.titleAccent}</span>
              </h2>

              <p className={`${BODY} mt-[26px]`}>{t.trust.body}</p>

              <a
                href={CERTIFICATES_HREF}
                className="bg-cta-gradient mt-[36px] inline-flex h-[50px] items-center gap-[14px] rounded-[16px] px-[20px] text-[14px] font-bold text-white shadow-[0_12px_13px_rgba(11,167,166,0.24)] transition-opacity hover:opacity-90"
              >
                {t.trust.cta}
                <FileIcon className="size-[20px]" />
              </a>
            </div>

            {/* Sertifikatlar paneli — node 189:578 */}
            <div className="relative aspect-[609/481] overflow-hidden rounded-[24px] bg-[linear-gradient(137deg,rgba(255,255,255,0.88)_0%,rgba(221,247,243,0.6)_100%)]">
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(closest-side_at_60%_40%,rgba(151,225,219,0.65),rgba(151,225,219,0)_70%)]"
              />
              {CERTS.map((c) => (
                <div
                  key={c.rotate}
                  className="absolute aspect-[262/370] w-[43%] overflow-hidden rounded-[6px] shadow-[0_18px_40px_rgba(0,119,118,0.18)]"
                  style={{
                    left: c.left,
                    top: c.top,
                    transform: `translate(-50%, -50%) rotate(${c.rotate})`,
                  }}
                >
                  <Image
                    src="/images/certificate.jpg"
                    alt={t.trust.certAlt}
                    fill
                    sizes="(max-width: 1024px) 45vw, 262px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <ul className="mt-[14px] grid gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
          {t.trust.cards.map((card, i) => {
            const Icon = CARD_ICONS[i];
            return (
              <li
                key={card.title}
                className="glass-panel rounded-[22px] p-[24px]"
              >
                <span className="icon-tile grid size-[46px] place-items-center rounded-[15px] text-accent">
                  <Icon className="size-[20px]" />
                </span>
                <h3 className="mt-[22px] font-display text-[18px] leading-[20px] font-bold tracking-[-0.045em] text-ink-deep">
                  {card.title}
                </h3>
                <p className="mt-[12px] text-[14px] leading-[1.6] text-body">
                  {card.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
