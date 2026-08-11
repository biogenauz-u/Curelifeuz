"use client";

import { useEffect, useState, useTransition } from "react";

import { deleteMessage, markMessageRead } from "@/app/admin/data-actions";
import type { Message } from "@/lib/admin/store";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("uz-UZ", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessagesView({ messages }: { messages: Message[] }) {
  const [selectedId, setSelectedId] = useState(messages[0]?.id ?? "");
  const [pending, start] = useTransition();

  const selected =
    messages.find((m) => m.id === selectedId) ?? messages[0] ?? null;

  // Ochilgan murojaat avtomatik "o'qilgan" bo'ladi.
  useEffect(() => {
    if (selected && !selected.read) {
      start(() => void markMessageRead(selected.id, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  if (!messages.length) {
    return (
      <section>
        <h1 className="font-display text-[32px] font-bold">Murojaatlar</h1>
        <p className="mt-2 text-[11px] text-body">
          Kontakt formasi orqali kelgan savollar.
        </p>
        <div className="mt-7 grid place-items-center rounded-[22px] border border-dashed border-[#cfe2e0] bg-white p-16 text-center">
          <p className="text-[13px] font-bold">Hozircha murojaat yo‘q</p>
          <p className="mt-2 max-w-[380px] text-[11px] text-body">
            Saytdagi «Aloqa» sahifasidagi forma to‘ldirilganda murojaat shu
            yerda paydo bo‘ladi.
          </p>
          <a
            href="/contact"
            target="_blank"
            rel="noreferrer"
            className="mt-5 rounded-[12px] border border-[#dce9e8] px-5 py-3 text-[10px] font-bold"
          >
            Formani ochish ↗
          </a>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="font-display text-[32px] font-bold">Murojaatlar</h1>
      <p className="mt-2 text-[11px] text-body">
        Jami {messages.length} ta · o‘qilmagan{" "}
        {messages.filter((m) => !m.read).length} ta
      </p>

      <div className="mt-7 grid overflow-hidden rounded-[22px] border border-[#dfeae9] bg-white lg:grid-cols-[.85fr_1.15fr]">
        <div className="max-h-[560px] overflow-y-auto border-b border-[#e2eceb] lg:border-r lg:border-b-0">
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`flex w-full cursor-pointer gap-4 border-b border-[#edf2f1] p-5 text-left ${
                selected?.id === m.id ? "bg-brand-100/45" : "hover:bg-[#f8fbfb]"
              }`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink-deep text-[10px] font-bold text-white">
                {initials(m.name)}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[11px] font-bold">{m.name}</p>
                  {!m.read && <span className="size-2 shrink-0 rounded-full bg-accent" />}
                </div>
                <p className="mt-1 truncate text-[10px] text-body">{m.topic || "—"}</p>
                <p className="mt-2 text-[8px] text-body/70">{formatDate(m.createdAt)}</p>
              </div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="p-6 sm:p-8">
            <p className="text-[9px] font-bold tracking-[.1em] text-brand-700">
              MUROJAAT
            </p>
            <h2 className="mt-4 font-display text-[24px] font-bold">
              {selected.topic || "Mavzusiz"}
            </h2>

            <div className="mt-5 flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-brand-100 text-[10px] font-bold">
                {initials(selected.name)}
              </span>
              <div>
                <p className="text-[11px] font-bold">{selected.name}</p>
                <p className="mt-1 text-[9px] text-body">
                  {selected.email}
                  {selected.phone ? ` · ${selected.phone}` : ""} ·{" "}
                  {formatDate(selected.createdAt)}
                </p>
              </div>
            </div>

            <p className="mt-8 rounded-[16px] bg-[#f5faf9] p-5 text-[12px] leading-6 whitespace-pre-wrap text-body">
              {selected.text}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(
                  "Re: " + (selected.topic || "CureLife"),
                )}`}
                className="bg-brand-gradient rounded-[12px] px-5 py-3 text-[10px] font-bold text-white"
              >
                Javob yozish
              </a>
              <button
                disabled={pending}
                onClick={() =>
                  start(() => void markMessageRead(selected.id, !selected.read))
                }
                className="cursor-pointer rounded-[12px] border border-[#dce9e8] px-5 py-3 text-[10px] font-bold disabled:opacity-50"
              >
                {selected.read ? "O‘qilmagan deb belgilash" : "O‘qilgan deb belgilash"}
              </button>
              <button
                disabled={pending}
                onClick={() => {
                  if (confirm("Murojaat o‘chirilsinmi?")) {
                    start(() => void deleteMessage(selected.id));
                    setSelectedId("");
                  }
                }}
                className="cursor-pointer rounded-[12px] border border-[#f0dede] px-5 py-3 text-[10px] font-bold text-[#9d4c4c] disabled:opacity-50"
              >
                O‘chirish
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
