"use client";

import { useMemo } from "react";

import type { Article, Message, Product, VisitStats } from "@/lib/admin/store";

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

function countBy<T>(items: T[], keyFn: (item: T) => string | null): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

function topN(map: Map<string, number>, n: number): [string, number][] {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

function BarRow({ label, count, max }: { label: string; count: number; max: number }) {
  const pct = max ? (count / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-[11px]">
        <span className="truncate font-semibold">{label}</span>
        <span className="shrink-0 font-bold text-brand-700">{count}</span>
      </div>
      <div className="mt-1.5 h-[6px] overflow-hidden rounded-pill bg-[#eef5f4]">
        <div
          className="h-full rounded-pill bg-[linear-gradient(90deg,#32c8c4,#087e7d)]"
          style={{ width: `${Math.max(pct, count ? 3 : 0)}%` }}
        />
      </div>
    </div>
  );
}

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Mobil",
  tablet: "Planshet",
  desktop: "Kompyuter",
};

const PATH_LABELS: Record<string, string> = {
  "/": "Bosh sahifa",
  "/products": "Mahsulotlar katalogi",
  "/about": "Biz haqimizda",
  "/contact": "Aloqa",
  "/articles": "Maqolalar",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("uz-UZ", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StatisticsView({
  visits,
  articles,
  products,
  messages,
}: {
  visits: VisitStats;
  articles: Article[];
  products: Product[];
  messages: Message[];
}) {
  const pathLabel = useMemo(() => {
    const productTitle = new Map(
      products.map((p) => [`/products/${p.slug}`, p.ru.name || p.name]),
    );
    const articleTitle = new Map(
      articles.map((a) => [`/articles/${a.slug}`, a.ru.title || a.uz.title]),
    );
    return (path: string) =>
      PATH_LABELS[path] ?? productTitle.get(path) ?? articleTitle.get(path) ?? path;
  }, [products, articles]);

  const stats = useMemo(() => {
    const events = visits.events;
    const now = Date.now();
    const DAY = 86_400_000;

    const startOfDay = (d: Date) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x.getTime();
    };
    const todayStart = startOfDay(new Date());

    const today = events.filter((e) => new Date(e.createdAt).getTime() >= todayStart).length;
    const last7 = events.filter((e) => now - new Date(e.createdAt).getTime() <= 7 * DAY).length;
    const last30 = events.filter((e) => now - new Date(e.createdAt).getTime() <= 30 * DAY).length;

    const trend = Array.from({ length: 14 }, (_, i) => {
      const dayStart = todayStart - (13 - i) * DAY;
      const dayEnd = dayStart + DAY;
      const count = events.filter((e) => {
        const t = new Date(e.createdAt).getTime();
        return t >= dayStart && t < dayEnd;
      }).length;
      const label = new Date(dayStart).toLocaleDateString("uz-UZ", {
        day: "numeric",
        month: "short",
      });
      return { count, label };
    });

    const byPath = topN(countBy(events, (e) => e.path), 8);
    const byLocale = countBy(events, (e) => e.locale);
    const byDevice = countBy(events, (e) => e.device);
    const byBrowser = topN(countBy(events, (e) => e.browser), 6);
    const byCountry = topN(countBy(events, (e) => e.country), 6);
    const byReferrer = topN(
      countBy(events, (e) => e.referrerHost ?? "To‘g‘ridan-to‘g‘ri"),
      8,
    );
    const recent = [...events].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 20);

    return { today, last7, last30, trend, byPath, byLocale, byDevice, byBrowser, byCountry, byReferrer, recent };
  }, [visits]);

  const topArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5);

  const trendMax = Math.max(1, ...stats.trend.map((d) => d.count));
  const localeMax = Math.max(1, ...stats.byLocale.values());
  const deviceMax = Math.max(1, ...stats.byDevice.values());
  const pathMax = Math.max(1, ...stats.byPath.map(([, c]) => c));
  const browserMax = Math.max(1, ...stats.byBrowser.map(([, c]) => c));
  const referrerMax = Math.max(1, ...stats.byReferrer.map(([, c]) => c));

  return (
    <section>
      <h1 className="font-display text-[32px] font-bold">Statistika</h1>
      <p className="mt-2 text-[11px] text-body">
        Sayt tashriflari va boshqa ochiq ma’lumotlar — barchasi bitta joyda.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jami tashriflar" value={String(visits.total)} note="Butun vaqt davomida" tone="dark" />
        <StatCard label="Bugun" value={String(stats.today)} note="Hozirgi kun" />
        <StatCard label="So‘nggi 7 kun" value={String(stats.last7)} note="Haftalik" />
        <StatCard label="So‘nggi 30 kun" value={String(stats.last30)} note="Oylik" />
      </div>

      {!visits.events.length ? (
        <div className="mt-7 grid place-items-center rounded-[22px] border border-dashed border-[#cfe2e0] bg-white p-16 text-center">
          <p className="text-[13px] font-bold">Hozircha ma’lumot yo‘q</p>
          <p className="mt-2 max-w-[420px] text-[11px] text-body">
            Saytga tashrif buyurilishi bilan bu yerda avtomatik statistika paydo bo‘ladi.
          </p>
        </div>
      ) : (
        <>
          <article className="mt-6 rounded-[24px] border border-[#e0eceb] bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-[18px] font-bold">Tashriflar oqimi</h2>
                <p className="mt-1 text-[10px] text-body">So‘nggi 14 kun</p>
              </div>
              <span className="rounded-pill bg-brand-100 px-3 py-2 text-[9px] font-bold text-brand-700">
                Kunlik
              </span>
            </div>
            <div className="mt-9 flex h-[190px] items-stretch gap-2 border-b border-l border-[#e5eeee] px-4">
              {stats.trend.map((d, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-[9px] font-bold text-brand-700">{d.count || ""}</span>
                  <div
                    className="w-full rounded-t-[6px] bg-[linear-gradient(180deg,#32c8c4,#087e7d)]"
                    style={{ height: `${Math.max(2, (d.count / trendMax) * 100)}%` }}
                  />
                  <span className="text-[8px] text-body">{d.label}</span>
                </div>
              ))}
            </div>
          </article>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[24px] border border-[#e0eceb] bg-white p-6">
              <h2 className="font-display text-[16px] font-bold">Eng ko‘p ko‘rilgan sahifalar</h2>
              <div className="mt-5 space-y-4">
                {stats.byPath.map(([path, count]) => (
                  <BarRow key={path} label={pathLabel(path)} count={count} max={pathMax} />
                ))}
              </div>
            </article>

            <article className="rounded-[24px] border border-[#e0eceb] bg-white p-6">
              <h2 className="font-display text-[16px] font-bold">Til bo‘yicha</h2>
              <div className="mt-5 space-y-4">
                <BarRow label="Ruscha (RU)" count={stats.byLocale.get("ru") ?? 0} max={localeMax} />
                <BarRow label="O‘zbekcha (UZ)" count={stats.byLocale.get("uz") ?? 0} max={localeMax} />
              </div>

              <h2 className="mt-8 font-display text-[16px] font-bold">Qurilmalar</h2>
              <div className="mt-5 space-y-4">
                {(["mobile", "desktop", "tablet"] as const).map((d) => (
                  <BarRow key={d} label={DEVICE_LABELS[d]} count={stats.byDevice.get(d) ?? 0} max={deviceMax} />
                ))}
              </div>
            </article>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[24px] border border-[#e0eceb] bg-white p-6">
              <h2 className="font-display text-[16px] font-bold">Brauzerlar</h2>
              <div className="mt-5 space-y-4">
                {stats.byBrowser.map(([b, count]) => (
                  <BarRow key={b} label={b} count={count} max={browserMax} />
                ))}
              </div>
            </article>

            <article className="rounded-[24px] border border-[#e0eceb] bg-white p-6">
              <h2 className="font-display text-[16px] font-bold">Qayerdan kelishmoqda</h2>
              <div className="mt-5 space-y-4">
                {stats.byReferrer.map(([host, count]) => (
                  <BarRow key={host} label={host} count={count} max={referrerMax} />
                ))}
              </div>
            </article>
          </div>

          {Boolean(stats.byCountry.length) && (
            <article className="mt-5 rounded-[24px] border border-[#e0eceb] bg-white p-6">
              <h2 className="font-display text-[16px] font-bold">Geografiya</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.byCountry.map(([country, count]) => (
                  <div
                    key={country}
                    className="flex items-center justify-between rounded-[14px] border border-[#e4eeee] px-4 py-3"
                  >
                    <span className="text-[11px] font-semibold">{country}</span>
                    <span className="text-[11px] font-bold text-brand-700">{count}</span>
                  </div>
                ))}
              </div>
            </article>
          )}

          <article className="mt-5 rounded-[24px] border border-[#e0eceb] bg-white p-6">
            <h2 className="font-display text-[16px] font-bold">Oxirgi tashriflar</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[11px]">
                <thead>
                  <tr className="text-[9px] font-bold tracking-[.08em] text-label uppercase">
                    <th className="pb-3">Vaqt</th>
                    <th className="pb-3">Sahifa</th>
                    <th className="pb-3">Til</th>
                    <th className="pb-3">Qurilma</th>
                    <th className="pb-3">Brauzer</th>
                    <th className="pb-3">Manba</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((e, i) => (
                    <tr key={i} className="border-t border-[#edf2f1]">
                      <td className="py-3 whitespace-nowrap text-body">{formatDate(e.createdAt)}</td>
                      <td className="max-w-[220px] truncate py-3 font-semibold">{pathLabel(e.path)}</td>
                      <td className="py-3 text-body uppercase">{e.locale}</td>
                      <td className="py-3 text-body">{DEVICE_LABELS[e.device] ?? e.device}</td>
                      <td className="py-3 text-body">{e.browser}</td>
                      <td className="py-3 text-body">{e.referrerHost ?? "To‘g‘ridan-to‘g‘ri"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <article className="rounded-[24px] border border-[#e0eceb] bg-white p-6">
          <h2 className="font-display text-[16px] font-bold">Eng ko‘p o‘qilgan maqolalar</h2>
          <div className="mt-5 space-y-3">
            {topArticles.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-[14px] border border-[#e4eeee] p-3"
              >
                <span className="min-w-0 truncate text-[11px] font-semibold">
                  {a.ru.title || a.uz.title}
                </span>
                <span className="shrink-0 text-[11px] font-bold text-brand-700">{a.views}</span>
              </div>
            ))}
            {!topArticles.length && <p className="text-[11px] text-body">Hozircha maqola yo‘q</p>}
          </div>
        </article>

        <article className="rounded-[24px] border border-[#e0eceb] bg-white p-6">
          <h2 className="font-display text-[16px] font-bold">Kontent va murojaatlar</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[14px] bg-[#f5faf9] p-4">
              <p className="text-[9px] font-bold tracking-[.08em] text-label uppercase">Mahsulotlar</p>
              <p className="mt-2 font-display text-[22px] font-bold">{products.length}</p>
              <p className="mt-1 text-[9px] text-body">{products.filter((p) => p.visible).length} tasi faol</p>
            </div>
            <div className="rounded-[14px] bg-[#f5faf9] p-4">
              <p className="text-[9px] font-bold tracking-[.08em] text-label uppercase">Maqolalar</p>
              <p className="mt-2 font-display text-[22px] font-bold">{articles.length}</p>
              <p className="mt-1 text-[9px] text-body">
                {articles.reduce((s, a) => s + a.views, 0)} ko‘rish
              </p>
            </div>
            <div className="rounded-[14px] bg-[#f5faf9] p-4">
              <p className="text-[9px] font-bold tracking-[.08em] text-label uppercase">Murojaatlar</p>
              <p className="mt-2 font-display text-[22px] font-bold">{messages.length}</p>
              <p className="mt-1 text-[9px] text-body">
                {messages.filter((m) => !m.read).length} o‘qilmagan
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
