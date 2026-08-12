"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { dictionaries, type Dictionary } from "@/lib/i18n/dictionaries";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      setLocaleState(next);
      // Cookie — middleware'ni chetlab o'tadigan noyob holatlar uchun
      // zaxira; asosiy manba endi URL prefiksi (`/ru`, `/uz`).
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
      document.documentElement.lang = next;

      // Joriy manzilning til prefiksini almashtirib, o'sha sahifaning
      // ikkinchi tildagi versiyasiga o'tkazamiz (URL o'zgaradi — bu SEO
      // uchun ham, botlar cookie yubormagani uchun ham muhim).
      const rest = pathname.replace(/^\/(ru|uz)(?=\/|$)/, "") || "";
      // `useSearchParams()` root layout'ni Suspense'ga majburlab qo'ymasligi
      // uchun query qatorini to'g'ridan-to'g'ri brauzerdan o'qiymiz.
      const qs = typeof window !== "undefined" ? window.location.search : "";
      router.push(`/${next}${rest}${qs}`);
    },
    [locale, pathname, router],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage() faqat <LanguageProvider> ichida ishlaydi");
  }
  return ctx;
}
