"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { updateSettings } from "@/app/admin/data-actions";
import type { Settings } from "@/lib/admin/store";

const FIELDS: Array<[keyof Settings, string]> = [
  ["phone", "Telefon"],
  ["email", "E-mail"],
  ["address", "Manzil"],
  ["hours", "Ish vaqti"],
];

const TOGGLES: Array<[keyof Settings, string, string]> = [
  ["telegramNotify", "Telegram xabarnomalari", "Yangi murojaat kelganda xabar (integratsiya keyin ulanadi)"],
  ["emailNotify", "E-mail xabarnomalari", "Yangi murojaat kelganda xabar (integratsiya keyin ulanadi)"],
  ["analytics", "Google Analytics", "Sahifa ko‘rishlarini yig‘ish (skript keyin ulanadi)"],
];

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="bg-brand-gradient mt-7 cursor-pointer rounded-[12px] px-6 py-3.5 text-[10px] font-bold text-white disabled:opacity-60"
    >
      {pending ? "Saqlanmoqda…" : "Sozlamalarni saqlash"}
    </button>
  );
}

export function SettingsViewPanel({ settings }: { settings: Settings }) {
  const [saved, setSaved] = useState(false);

  return (
    <section>
      <h1 className="font-display text-[32px] font-bold">Sozlamalar</h1>
      <p className="mt-2 text-[11px] text-body">
        Bu ma’lumotlar saytning footer va «Aloqa» sahifasida ko‘rsatiladi.
      </p>

      <form
        action={async (fd) => {
          await updateSettings(fd);
          setSaved(true);
        }}
        className="mt-7 max-w-[820px] rounded-[24px] border border-[#dfeae9] bg-white p-6 sm:p-8"
      >
        <h2 className="font-display text-[19px] font-bold">Kompaniya ma’lumotlari</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {FIELDS.map(([key, label]) => (
            <label key={key} className="text-[10px] font-bold text-label">
              {label}
              <input
                name={key}
                defaultValue={String(settings[key])}
                className="mt-2 h-12 w-full rounded-[13px] border border-[#dce9e8] px-4 text-[12px] font-normal text-ink-deep outline-none focus:border-accent"
              />
            </label>
          ))}
        </div>

        <h2 className="mt-9 border-t border-[#e7eeee] pt-7 font-display text-[19px] font-bold">
          Integratsiyalar
        </h2>
        <div className="mt-5 space-y-3">
          {TOGGLES.map(([key, label, note]) => (
            <label
              key={key}
              className="flex items-center justify-between gap-4 rounded-[14px] bg-[#f6faf9] p-4"
            >
              <span>
                <span className="block text-[11px] font-semibold">{label}</span>
                <span className="mt-1 block text-[9px] text-body">{note}</span>
              </span>
              <input
                type="checkbox"
                name={key}
                defaultChecked={Boolean(settings[key])}
                className="size-4 shrink-0 accent-[#0ba7a6]"
              />
            </label>
          ))}
        </div>

        <SaveButton />

        {saved && (
          <p
            role="status"
            className="mt-4 rounded-[12px] bg-brand-100 p-4 text-[10px] font-semibold text-brand-700"
          >
            Saqlandi — o‘zgarishlar saytda ko‘rinadi.
          </p>
        )}
      </form>
    </section>
  );
}
