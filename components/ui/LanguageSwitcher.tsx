"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { locales } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * RU / UZ almashtirgich. Figma dizaynida yo'q — qo'shimcha element,
 * shuning uchun brend uslubiga (pill + brand-200 ramka) moslashtirilgan.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.a11y.language}
      className={cn(
        // Ichki tugma aynan 44px bo'lishi uchun ramka qalinligi qo'shilgan.
        "flex h-[46px] shrink-0 items-center rounded-pill border border-brand-200 bg-white/72 p-0 backdrop-blur-[6px] lg:h-[45px] lg:p-[3px]",
        className,
      )}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={cn(
              "h-full min-w-11 cursor-pointer rounded-pill px-[13px] text-[13px] font-bold uppercase tracking-[0.04em] transition-colors",
              active
                ? "bg-brand-gradient text-white"
                : "text-muted hover:text-ink",
            )}
          >
            {code}
            {/* Joriy til ekran o'quvchi uchun ham aniq bo'lsin. */}
            {active && <span className="sr-only"> — {t.a11y.languageActive}</span>}
          </button>
        );
      })}
    </div>
  );
}
