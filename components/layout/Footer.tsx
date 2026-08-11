"use client";

import Image from "next/image";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  YoutubeIcon,
} from "@/components/ui/icons";
import { CERTIFICATES_HREF, SOCIAL_LINKS } from "@/lib/site-config";
import { CONTAINER } from "@/lib/utils";

const MENU = [
  { key: "products", href: "/products" },
  { key: "about", href: "/about" },
  { key: "certificates", href: CERTIFICATES_HREF },
  { key: "articles", href: "/articles" },
] as const;

/** Manzili yo'q tarmoq soxta havola bo'lmasin — o'chirilgan holda chiziladi. */
const SOCIALS = [
  { name: "Instagram", href: SOCIAL_LINKS.instagram, Icon: InstagramIcon, size: "size-[20px]" },
  { name: "Telegram", href: SOCIAL_LINKS.telegram, Icon: TelegramIcon, size: "w-[20px]" },
  { name: "Facebook", href: SOCIAL_LINKS.facebook, Icon: FacebookIcon, size: "h-[18px]" },
  { name: "YouTube", href: SOCIAL_LINKS.youtube, Icon: YoutubeIcon, size: "w-[21px]" },
];

/** Figma node 189:884. */
export function Footer() {
  const { t } = useLanguage();
  const settings = useSiteSettings();

  return (
    <footer id="contacts" className="bg-[linear-gradient(150deg,#123c3b_0%,#0e2c2c_55%,#0d2726_100%)] pt-[48px] pb-[24px]">
      <div className={CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,376px)_minmax(0,256px)_minmax(0,283px)_minmax(0,266px)]">
          <div>
            <Image
              src="/images/curelife-logo-footer.svg"
              alt="CureLife"
              width={182}
              height={41}
              unoptimized
              className="h-[38px] w-auto"
            />
            <p className="mt-[24px] max-w-[316px] text-[14px] leading-[1.55] text-white/70">
              {t.footer.tagline}
            </p>
          </div>

          <nav>
            <h2 className="font-display text-[15px] font-bold text-white">
              {t.footer.menuTitle}
            </h2>
            <ul className="mt-[10px]">
              {MENU.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-[14px] text-white/75 transition-colors hover:text-white"
                  >
                    {t.footer.menu[item.key]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-[15px] font-bold text-white">
              {t.footer.warningTitle}
            </h2>
            <p className="mt-[18px] max-w-[240px] text-[14px] leading-[1.55] text-white/70">
              {t.footer.warning}
            </p>
          </div>

          <div>
            <h2 className="font-display text-[15px] font-bold text-white">
              {t.footer.legalTitle}
            </h2>
            <p className="mt-[18px] max-w-[280px] text-[14px] leading-[1.55] text-white/70">
              {t.footer.legal}
            </p>

            <a
              href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
              className="mt-[16px] inline-flex min-h-11 items-center font-display text-[22px] font-bold text-white transition-colors hover:text-brand-200"
            >
              {settings.phone}
            </a>

            <ul className="mt-[10px] flex items-center gap-1">
              {SOCIALS.map(({ name, href, Icon, size }) =>
                href ? (
                  <li key={name}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={name}
                      className="grid size-11 place-items-center rounded-pill text-white/85 transition-colors hover:text-brand-200"
                    >
                      <Icon className={size} />
                    </a>
                  </li>
                ) : (
                  // TODO: manzil `lib/site-config.ts` ga yozilsa havolaga aylanadi.
                  <li key={name}>
                    <span
                      aria-label={`${name} — ${t.footer.socialSoon}`}
                      title={t.footer.socialSoon}
                      className="grid size-11 cursor-not-allowed place-items-center rounded-pill text-white/30"
                    >
                      <Icon className={size} />
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-[42px] flex flex-col gap-2 border-t border-white/10 pt-[21px] text-[13px] text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.copyright}</p>
          <p>{t.footer.slogan}</p>
        </div>
      </div>
    </footer>
  );
}
