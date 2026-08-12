"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { logout } from "@/app/admin/actions";
import { ContentView } from "@/components/admin/views/Content";
import { MessagesView } from "@/components/admin/views/Messages";
import { ArticlesView } from "@/components/admin/views/Articles";
import { CertificatesView } from "@/components/admin/views/Certificates";
import { ProductsView } from "@/components/admin/views/Products";
import { SettingsViewPanel } from "@/components/admin/views/SettingsView";
import { StatisticsView } from "@/components/admin/views/Statistics";
import type {
  Article,
  Certificate,
  Message,
  PagesMeta,
  Product,
  Settings,
  VisitStats,
} from "@/lib/admin/store";
import type { View } from "@/lib/admin/views";

const NAV: Array<{ id: View; label: string; icon: string }> = [
  { id: "dashboard", label: "Boshqaruv paneli", icon: "⌂" },
  { id: "statistics", label: "Statistika", icon: "▥" },
  { id: "products", label: "Mahsulotlar", icon: "◇" },
  { id: "articles", label: "Maqolalar", icon: "✎" },
  { id: "certificates", label: "Sertifikatlar", icon: "✓" },
  { id: "content", label: "Sayt kontenti", icon: "▤" },
  { id: "messages", label: "Murojaatlar", icon: "✉" },
  { id: "settings", label: "Sozlamalar", icon: "⚙" },
];

function StatCard({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone?: "dark";
}) {
  const dark = tone === "dark";
  return (
    <article
      className={
        dark
          ? "rounded-[22px] bg-ink-deep p-6 text-white"
          : "rounded-[22px] border border-[#e2eeed] bg-white p-6"
      }
    >
      <p className={dark ? "text-[11px] text-white/55" : "text-[11px] text-body"}>
        {label}
      </p>
      <p className="mt-4 font-display text-[34px] font-bold tracking-[-.04em]">
        {value}
      </p>
      <p className={dark ? "mt-3 text-[10px] text-brand-200" : "mt-3 text-[10px] text-brand-700"}>
        {note}
      </p>
    </article>
  );
}

export function AdminPanel({
  products,
  articles,
  certificates,
  messages,
  settings,
  pages,
  visits,
  initialView = "dashboard",
}: {
  products: Product[];
  articles: Article[];
  certificates: Certificate[];
  messages: Message[];
  settings: Settings;
  pages: PagesMeta;
  visits: VisitStats;
  initialView?: View;
}) {
  const [view, setView] = useState<View>(initialView);
  const [menuOpen, setMenuOpen] = useState(false);

  const unread = messages.filter((m) => !m.read).length;
  const visibleProducts = products.filter((p) => p.visible).length;

  const weekCounts = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - (6 - i));
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    return messages.filter((m) => {
      const t = new Date(m.createdAt).getTime();
      return t >= day.getTime() && t < next.getTime();
    }).length;
  });
  const weekMax = Math.max(1, ...weekCounts);
  const weekLabels = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
  const today = new Date().getDay();
  const orderedLabels = Array.from({ length: 7 }, (_, i) => {
    const d = (today - 6 + i + 7) % 7;
    return weekLabels[(d + 6) % 7];
  });

  const changeView = (next: View) => {
    setView(next);
    setMenuOpen(false);
  };

  return (
    <div className="admin-root min-h-screen bg-[#f2f8f7] text-ink-deep">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[270px] border-r border-white/10 bg-ink-deep p-5 text-white transition-transform lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[66px] items-center rounded-[18px] bg-white px-5">
          <Image
            src="/images/curelife-logo.svg"
            alt="CureLife"
            width={160}
            height={36}
            unoptimized
            className="h-8 w-auto"
          />
        </div>

        <p className="mt-8 px-3 text-[9px] font-bold tracking-[.16em] text-white/35">
          BOSHQARUV
        </p>
        <nav className="mt-3 space-y-2">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => changeView(item.id)}
              className={`flex w-full cursor-pointer items-center gap-4 rounded-[14px] px-4 py-3.5 text-left text-[13px] font-semibold transition ${
                view === item.id
                  ? "bg-white text-ink-deep"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span
                className={`grid size-8 place-items-center rounded-[10px] ${
                  view === item.id ? "bg-brand-100 text-brand-700" : "bg-white/8"
                }`}
              >
                {item.icon}
              </span>
              {item.label}
              {item.id === "messages" && unread > 0 && (
                <span className="ml-auto grid size-5 place-items-center rounded-full bg-accent text-[9px] text-white">
                  {unread}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute inset-x-5 bottom-5 rounded-[18px] bg-white/7 p-4">
          <div className="flex items-center gap-3">
            <span className="bg-brand-gradient grid size-10 place-items-center rounded-full font-bold">
              AD
            </span>
            <div>
              <p className="text-[12px] font-bold">Administrator</p>
              <p className="mt-1 text-[9px] text-white/40">{settings.email}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="rounded-[12px] border border-white/10 py-2.5 text-center text-[10px] text-white/60 hover:text-white"
            >
              Saytni ko‘rish ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="w-full cursor-pointer rounded-[12px] border border-white/10 py-2.5 text-center text-[10px] text-white/60 transition-colors hover:border-white/25 hover:text-white"
              >
                Chiqish
              </button>
            </form>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <button
          aria-label="Menyuni yopish"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/25 lg:hidden"
        />
      )}

      <div className="lg:pl-[270px]">
        <header className="sticky top-0 z-20 flex h-[82px] items-center border-b border-[#dfebea] bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <button
            onClick={() => setMenuOpen(true)}
            className="mr-4 grid size-10 cursor-pointer place-items-center rounded-[12px] bg-brand-100 lg:hidden"
          >
            ☰
          </button>
          <div>
            <p className="font-display text-[18px] font-bold">
              {NAV.find((n) => n.id === view)?.label}
            </p>
            <p className="mt-1 text-[10px] text-body">CureLife boshqaruv markazi</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => changeView("messages")}
              className="relative grid size-10 cursor-pointer place-items-center rounded-full border border-[#dce9e8] bg-white"
              aria-label="Murojaatlar"
            >
              ✉
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent" />
              )}
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-7 lg:p-10">
          {view === "dashboard" && (
            <section>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold tracking-[.12em] text-brand-700">
                    UMUMIY KO‘RINISH
                  </p>
                  <h1 className="mt-3 font-display text-[34px] font-bold tracking-[-.04em] sm:text-[44px]">
                    Xayrli kun, Administrator
                  </h1>
                  <p className="mt-2 text-[12px] text-body">
                    Saytdagi eng muhim ko‘rsatkichlar va oxirgi faollik.
                  </p>
                </div>
                <button
                  onClick={() => changeView("products")}
                  className="bg-brand-gradient h-11 cursor-pointer rounded-[13px] px-5 text-[11px] font-bold text-white"
                >
                  Mahsulotlarni boshqarish
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Jami mahsulotlar"
                  value={String(products.length)}
                  note={`${visibleProducts} tasi saytda faol`}
                  tone="dark"
                />
                <StatCard
                  label="Yangi murojaatlar"
                  value={String(unread)}
                  note={`Jami ${messages.length} ta`}
                />
                <StatCard
                  label="Oxirgi 7 kun"
                  value={String(weekCounts.reduce((a, b) => a + b, 0))}
                  note="Kelgan murojaatlar"
                />
                <StatCard
                  label="Sahifalar"
                  value="5"
                  note={`${Object.keys(pages).length} tasi tahrirlangan`}
                />
              </div>

              <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
                <article className="rounded-[24px] border border-[#e0eceb] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-[18px] font-bold">
                        Murojaatlar oqimi
                      </h2>
                      <p className="mt-1 text-[10px] text-body">So‘nggi 7 kun</p>
                    </div>
                    <span className="rounded-pill bg-brand-100 px-3 py-2 text-[9px] font-bold text-brand-700">
                      Kunlik
                    </span>
                  </div>
                  <div className="mt-9 flex h-[210px] items-stretch gap-3 border-b border-l border-[#e5eeee] px-4">
                    {weekCounts.map((count, i) => (
                      <div
                        key={i}
                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                      >
                        <span className="text-[9px] font-bold text-brand-700">
                          {count || ""}
                        </span>
                        <div
                          className="w-full rounded-t-[8px] bg-[linear-gradient(180deg,#32c8c4,#087e7d)]"
                          style={{ height: `${Math.max(2, (count / weekMax) * 100)}%` }}
                        />
                        <span className="text-[8px] text-body">{orderedLabels[i]}</span>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-[24px] border border-[#e0eceb] bg-white p-6">
                  <h2 className="font-display text-[18px] font-bold">Oxirgi murojaatlar</h2>
                  <div className="mt-5 space-y-3">
                    {messages.slice(0, 4).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => changeView("messages")}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-[14px] border border-[#e4eeee] p-3 text-left hover:border-brand-200 hover:bg-brand-100/30"
                      >
                        <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-brand-100 text-[10px] font-bold text-brand-700">
                          {m.name.slice(0, 2).toUpperCase()}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[11px] font-semibold">
                            {m.name}
                          </span>
                          <span className="block truncate text-[9px] text-body">
                            {m.topic || "—"}
                          </span>
                        </span>
                        {!m.read && (
                          <span className="ml-auto size-2 shrink-0 rounded-full bg-accent" />
                        )}
                      </button>
                    ))}
                    {!messages.length && (
                      <p className="rounded-[14px] border border-dashed border-[#cfe2e0] p-6 text-center text-[10px] text-body">
                        Hozircha murojaat yo‘q
                      </p>
                    )}
                  </div>
                </article>
              </div>
            </section>
          )}

          {view === "statistics" && (
            <StatisticsView
              visits={visits}
              articles={articles}
              products={products}
              messages={messages}
            />
          )}
          {view === "products" && <ProductsView products={products} />}
          {view === "articles" && <ArticlesView articles={articles} />}
          {view === "certificates" && (
            <CertificatesView certificates={certificates} />
          )}
          {view === "content" && <ContentView pages={pages} />}
          {view === "messages" && <MessagesView messages={messages} />}
          {view === "settings" && <SettingsViewPanel settings={settings} />}
        </main>
      </div>
    </div>
  );
}
