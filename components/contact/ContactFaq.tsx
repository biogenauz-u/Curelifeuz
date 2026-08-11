"use client";

import { useState } from "react";

import { useLanguage } from "@/components/providers/LanguageProvider";

export function ContactFaq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(0);

  return (
    <div>
      {t.contactPage.faq.items.map((item, i) => (
        <article key={item.q} className="border-b border-brand-100 py-5">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            aria-expanded={open === i}
            className="flex w-full cursor-pointer items-center gap-5 text-left"
          >
            <span className="text-[11px] font-bold text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 text-[13px] font-bold">{item.q}</span>
            <span className="grid size-7 place-items-center rounded-full border border-brand-200/50 text-accent">
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && (
            <p className="mt-5 ml-12 max-w-[720px] text-[12px] leading-6 text-body">
              {item.a}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
