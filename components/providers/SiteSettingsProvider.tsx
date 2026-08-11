"use client";

import { createContext, useContext } from "react";

import type { Settings } from "@/lib/admin/store";

const SiteSettingsContext = createContext<Settings | null>(null);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: Settings;
  children: React.ReactNode;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

/** Admin panelda kiritilgan kompaniya ma'lumotlari. */
export function useSiteSettings(): Settings {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings() provider ichida ishlaydi");
  return ctx;
}
