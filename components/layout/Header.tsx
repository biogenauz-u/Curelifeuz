"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn, CONTAINER_WIDE } from "@/lib/utils";

const NAV_ITEMS: Array<{ key: keyof Dictionary["nav"]; href: string }> = [
  { key: "home", href: "/#hero" },
  { key: "products", href: "/products" },
  { key: "about", href: "/about" },
  { key: "articles", href: "/articles" },
  { key: "contacts", href: "/contact" },
];

/**
 * Figma node 257:2474 — hero rasmi ustida "suzib turadigan" oq pill panel.
 * O'lchamlar 1920px maketdan: kenglik 1372, balandlik 82, radius 78,
 * chapdan 30px, o'ngdan 23px ichki bo'shliq.
 *
 * "Kontaktlar" alohida CTA tugma emas, oddiy menyu bandi — u ham qatorning
 * oxirida turadi, o'ng chetda esa faqat til almashtirgich qoladi.
 *
 * Panel `position: fixed` — sahifa pastga aylanganda tepada qoladi. Oqimdan
 * chiqqani uchun o'rniga aynan o'sha balandlikdagi bo'shliq (`--header-h`,
 * globals.css) qoldiriladi, shunda hech bir sahifada joylashuv siljimaydi.
 *
 * Menyu havolalarining bosiladigan balandligi 44px (matn 18px + padding) —
 * vizual ko'rinish maketdagidek qoladi.
 */
export function Header() {
  const { t, locale } = useLanguage();
  const homeHref = `/${locale}#hero`;
  const navHref = (href: string) => `/${locale}${href}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // Sahifa tepasidan siljiganda panel biroz yuqoriga tortiladi va soya oladi —
  // shunda u kontent ustida "suzib" turgani ko'rinib turadi.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menyu ochiq bo'lganda: sahifa scroll'i to'xtaydi, Escape va tashqariga
  // bosish yopadi, fokus menyuga o'tadi va yopilganda tugmaga qaytadi.
  useEffect(() => {
    if (!menuOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <>
      {/* Panel oqimdan chiqqani uchun uning o'rniga aynan shu balandlikdagi
          bo'shliq qoladi — sahifalar joylashuvi o'zgarmaydi. */}
      <div aria-hidden className="h-(--header-h)" />

      {/* Tashqi qatlam butun kenglikni egallaydi, shuning uchun `pointer-events`
          o'chiriladi — aks holda u ostidagi kontentni bosib bo'lmay qolardi. */}
      <div
        ref={wrapperRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            CONTAINER_WIDE,
            "transition-[padding] duration-200",
            scrolled ? "pt-3 lg:pt-4" : "pt-6 lg:pt-9",
          )}
        >
          <header
            className={cn(
              "pointer-events-auto flex h-[64px] items-center rounded-pill bg-white pr-3 pl-3 transition-shadow duration-200 lg:h-[82px] lg:pr-[23px] lg:pl-[30px]",
              scrolled && "shadow-[0_16px_40px_rgba(8,126,125,.16)]",
            )}
          >
            <a
              href={homeHref}
              aria-label="CureLife"
              className="grid h-11 shrink-0 place-items-center rounded-pill px-2"
            >
              <Image
                src="/images/curelife-logo.svg"
                alt=""
                width={182}
                height={41}
                priority
                unoptimized
                className="h-[30px] w-auto lg:h-[41px]"
              />
            </a>

            <nav
              aria-label={t.nav.home}
              className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-11"
            >
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.key}
                  href={item.key === "home" ? homeHref : navHref(item.href)}
                  className="inline-flex h-11 items-center rounded-pill px-2 text-[18px] whitespace-nowrap text-ink transition-colors hover:text-brand-600"
                >
                  {t.nav[item.key]}
                </a>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-3">
              <LanguageSwitcher />

              <button
                ref={toggleRef}
                type="button"
                onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
                className="bg-brand-gradient grid size-11 shrink-0 cursor-pointer place-items-center rounded-pill lg:hidden"
              >
                <span aria-hidden className="flex w-[18px] flex-col gap-[4px]">
                  <span className="h-[2px] w-full rounded-full bg-white" />
                  <span className="h-[2px] w-full rounded-full bg-white" />
                  <span className="h-[2px] w-full rounded-full bg-white" />
                </span>
              </button>
            </div>
          </header>

          {menuOpen && (
            <nav
              ref={panelRef}
              id="mobile-nav"
              aria-label={t.a11y.openMenu}
              className="pointer-events-auto mt-2 flex flex-col gap-1 rounded-[28px] bg-white p-4 shadow-[0_24px_60px_rgba(8,126,125,.12)] lg:hidden"
            >
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.key}
                  href={item.key === "home" ? homeHref : navHref(item.href)}
                  onClick={closeMenu}
                  className="flex min-h-11 items-center rounded-pill px-4 text-[17px] text-ink transition-colors hover:bg-brand-100"
                >
                  {t.nav[item.key]}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
