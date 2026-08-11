import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FileIcon, MapIcon, PillIcon, ShieldIcon } from "@/components/ui/icons";
import { getProducts, type Product } from "@/lib/admin/store";
import { getServerDictionary, resolveLocale } from "@/lib/i18n/server";
import { resolvePageMeta } from "@/lib/i18n/page-meta";
import { CONTAINER, productName } from "@/lib/utils";

/**
 * Mahsulot pasporti — barcha mahsulotlar uchun bitta shablon.
 *
 * Statik matnlar (bo'lim yorliqlari, sarlavhalar, tugma matnlari) lug'atdan
 * (`t.productPage`), mahsulotga xos hamma narsa admin paneldan keladi.
 * Ma'lumoti yo'q bo'lim umuman chizilmaydi.
 */

/**
 * ⚠️ Maketda "УПАКОВКА" uchun quti, "СЫРЬЁ" uchun globus ikonkasi bor —
 * ular Figma'dan hali eksport qilinmagan, shuning uchun eng yaqin mavjud
 * ikonkalar qo'yilgan (Figma limiti ochilganda almashtirish kerak).
 */
const FACT_ICONS = [PillIcon, FileIcon, MapIcon, ShieldIcon];

/**
 * Kartochkadagi rangli chiziq — davlat bayrog'i.
 * Davlat tanilmasa firma rangidagi oddiy chiziq chiziladi.
 */
const FLAGS: Record<string, [string, string, string]> = {
  germaniya: ["#161616", "#d7262c", "#e9c33d"],
  germany: ["#161616", "#d7262c", "#e9c33d"],
  ozbekiston: ["#4a9fdc", "#ffffff", "#3aa04a"],
  uzbekistan: ["#4a9fdc", "#ffffff", "#3aa04a"],
};

/** "O‘zbekiston" / "Узбекистан" → "ozbekiston" / "uzbekistan". */
function flagKey(country: string): string {
  return country
    .toLowerCase()
    .replace(/[ʻʼ'‘’`´\s.]/g, "")
    .replace(/[а-яё]/g, (ch) => {
      const map: Record<string, string> = {
        а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "j",
        з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
        п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "s",
        ч: "ch", ш: "sh", щ: "sh", ъ: "", ы: "i", ь: "", э: "e", ю: "yu",
        я: "ya",
      };
      return map[ch] ?? ch;
    });
}

function OriginCard({
  label,
  country,
  className = "",
}: {
  label: string;
  country: string;
  className?: string;
}) {
  return (
    <article
      className={`rounded-[18px] bg-white p-5 shadow-[0_18px_45px_rgba(8,126,125,.13)] ${className}`}
    >
      <p className="text-[9px] font-bold tracking-[.12em] text-label">{label}</p>
      <p className="mt-2 font-display text-[19px] font-bold">{country}</p>
      <FlagBar country={country} />
    </article>
  );
}

function FlagBar({ country }: { country: string }) {
  const stripes = FLAGS[flagKey(country)];

  if (!stripes) {
    return <span className="mt-4 block h-3 w-28 rounded-[3px] bg-accent" />;
  }
  return (
    <span aria-hidden className="mt-4 flex h-3 w-28 overflow-hidden rounded-[3px]">
      {stripes.map((color) => (
        <span key={color} className="flex-1" style={{ background: color }} />
      ))}
    </span>
  );
}

/** "NovaLife Plus" → ["NovaLife", "Plus"]: oxirgi so'z urg'u rangida. */
function splitAccent(value: string): [string, string] {
  const words = value.trim().split(/\s+/);
  if (words.length < 2) return [value, ""];
  return [words.slice(0, -1).join(" "), words.at(-1) ?? ""];
}

function isPdf(url: string): boolean {
  return url.toLowerCase().endsWith(".pdf");
}

async function findProduct(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug && p.visible);
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [product, locale] = await Promise.all([findProduct(slug), resolveLocale()]);
  if (!product) return {};

  const text = product[locale];
  return resolvePageMeta(`/products/${slug}`, {
    title: `${productName(product, locale)} — CureLife`,
    description: text.description,
  });
}

export default async function ProductPassportPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [product, dict, locale] = await Promise.all([
    findProduct(slug),
    getServerDictionary(),
    resolveLocale(),
  ]);
  if (!product) notFound();

  const t = dict.productPage;
  const text = product[locale];
  const d = text.detail;

  const title = productName(product, locale);
  const [name, nameAccent] = splitAccent(title);
  const [usageTitle, usageAccent] = splitAccent(d.usageTitle);
  const heroImage = product.detailImage ?? product.image;

  // "Xomashyo (fakt)"/"Ishlab chiqaruvchi (fakt)" bo'sh qoldirilsa, "Kelib
  // chiqishi" bo'limidagi ma'lumotdan (mahalliy yoki import turiga qarab)
  // avtomatik olinadi — admin bir xil ma'lumotni ikki joyga yozmasin.
  const rawFact =
    d.raw ||
    (d.origin.type === "imported"
      ? d.origin.importedCountry
      : d.origin.rawFull || d.origin.rawCountry);
  const manufacturerFact =
    d.manufacturer ||
    (d.origin.type === "imported"
      ? d.origin.importedFull || d.origin.importedCountry
      : d.origin.manufacturerFull || d.origin.makeCountry);

  const facts = [
    [t.factLabels[0], text.stats[2]],
    [t.factLabels[1], text.stats[1]],
    [t.factLabels[2], rawFact],
    [t.factLabels[3], manufacturerFact],
  ].filter(([, value]) => value);

  const isImported = d.origin.type === "imported";
  const originRows = isImported
    ? [
        [t.origin.rowLabels[1], d.origin.importedFull],
        [t.origin.rowLabels[2], d.origin.role],
      ].filter(([, value]) => value)
    : [
        [t.origin.rowLabels[0], d.origin.rawFull],
        [t.origin.rowLabels[1], d.origin.manufacturerFull],
        [t.origin.rowLabels[2], d.origin.role],
      ].filter(([, value]) => value);
  const hasOrigin = isImported
    ? Boolean(d.origin.importedCountry || originRows.length)
    : Boolean(originRows.length);

  const related = (await getProducts())
    .filter((p) => p.visible && p.id !== product.id)
    .slice(0, 3);

  const hasDocuments = Boolean(product.certificate || product.instruction);
  const hasUsage = Boolean(d.usageTitle || d.usageBody);
  // Mahsulotda "Qabuldan oldin" to'ldirilmagan bo'lsa — barcha BAD'lar uchun
  // umumiy bo'lgan standart ogohlantirishlar ko'rsatiladi (lug'atdan).
  const beforeItems = d.before.length ? d.before : t.before.defaultItems;

  return (
    <>
      <main className="overflow-hidden bg-[#f8ffff] text-ink-deep">
        <section
          id="hero"
          className="relative min-h-[930px] bg-[radial-gradient(circle_at_84%_28%,rgba(101,224,216,.26),transparent_23%),radial-gradient(circle_at_7%_78%,rgba(101,224,216,.17),transparent_26%),linear-gradient(180deg,#fff_0%,#f5fffe_100%)] pb-20"
        >
          <Header />

          <div className={`${CONTAINER} relative z-10 pt-8`}>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-[12px] font-semibold text-body transition-colors hover:text-accent"
            >
              <span aria-hidden>&larr;</span> {t.back}
            </Link>
          </div>

          <div
            className={`${CONTAINER} relative z-10 grid gap-12 pt-6 lg:grid-cols-[minmax(0,540px)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pt-10`}
          >
            <div>
              <SectionLabel>
                {text.category.toUpperCase()} · {product.number}
              </SectionLabel>
              <h1 className="mt-8 font-display text-[56px] leading-[.92] font-bold tracking-[-.055em] sm:text-[72px] lg:text-[96px]">
                {name}
                {nameAccent && (
                  <>
                    <br />
                    <span className="text-accent">{nameAccent}</span>
                  </>
                )}
              </h1>
              <p className="mt-8 max-w-[510px] text-[16px] leading-[1.75] text-body">
                {text.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {Boolean(d.composition.length) && (
                  <a
                    href="#composition"
                    className="bg-brand-gradient inline-flex h-11 items-center gap-4 rounded-pill px-5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    {t.hero.primary}
                    <ArrowRightIcon className="size-4" />
                  </a>
                )}
                {Boolean(d.safety.length) && (
                  <a
                    href="#safety"
                    className="inline-flex h-11 items-center gap-3 rounded-pill border border-brand-200 bg-white px-5 text-[13px] font-semibold text-ink-deep"
                  >
                    {t.hero.secondary}
                    <ShieldIcon className="size-4 text-accent" />
                  </a>
                )}
              </div>
              {d.warning && (
                <div className="mt-6 flex max-w-[500px] items-start gap-4 rounded-[14px] border border-brand-100 bg-white/80 px-5 py-4">
                  <span
                    aria-hidden
                    className="grid size-[26px] shrink-0 place-items-center rounded-[9px] bg-brand-100/70 text-[13px] font-bold text-accent"
                  >
                    !
                  </span>
                  <p className="text-[11px] leading-5 text-body">{d.warning}</p>
                </div>
              )}
            </div>

            <div>
              <div className="relative mx-auto grid aspect-[1.18] max-w-[640px] place-items-center overflow-hidden rounded-[38px] bg-white shadow-[0_32px_90px_rgba(8,126,125,.12)]">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={title}
                    fill
                    priority
                    sizes="(max-width:1024px) 90vw,640px"
                    className="object-cover object-center"
                  />
                ) : (
                  <p className="font-display text-[42px] font-bold tracking-[-.05em] text-ink-deep/12">
                    {title}
                  </p>
                )}
              </div>
              {Boolean(facts.length) && (
                <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {facts.map(([label, value], i) => {
                    const Icon = FACT_ICONS[i] ?? PillIcon;
                    return (
                      <div
                        key={label}
                        className="min-h-[150px] rounded-[20px] bg-white p-5 shadow-[0_16px_45px_rgba(8,126,125,.07)]"
                      >
                        <span className="grid size-[38px] place-items-center rounded-[12px] bg-brand-100/70 text-accent">
                          <Icon className="size-[18px]" />
                        </span>
                        <dt className="mt-[26px] text-[9px] font-bold tracking-[.12em] text-label">
                          {label}
                        </dt>
                        <dd className="mt-3 text-[12px] leading-5 font-semibold">
                          {value}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              )}
            </div>
          </div>
        </section>

        {Boolean(d.composition.length) && (
          <section id="composition" className="py-24 lg:py-32">
            <div className={CONTAINER}>
              <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
                <div>
                  <SectionLabel>{t.composition.label}</SectionLabel>
                  <h2 className="mt-8 max-w-[700px] font-display text-[44px] leading-[.98] font-bold tracking-[-.05em] sm:text-[66px]">
                    {t.composition.title}{" "}
                    <span className="text-accent">
                      {t.composition.titleAccent}
                    </span>
                  </h2>
                </div>
                <p className="max-w-[470px] pb-2 text-[14px] leading-6 text-body">
                  {t.composition.intro}
                </p>
              </div>
              <ul className="mt-14 grid gap-3 sm:grid-cols-2">
                {d.composition.map((item, i) => (
                  <li
                    key={`${item.name}-${i}`}
                    className="flex min-h-[104px] items-center gap-4 rounded-[20px] bg-white px-6 shadow-[0_18px_48px_rgba(8,126,125,.08)]"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-display text-[17px] font-bold">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[10px] text-body">
                        {t.composition.perCapsule}
                      </p>
                    </div>
                    <strong className="ml-auto font-display text-[18px] text-accent">
                      {item.amount}
                    </strong>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {hasUsage && (
          <section className="bg-[#ecfbf9] py-24">
            <div
              className={`${CONTAINER} overflow-hidden rounded-[30px] bg-white shadow-[0_24px_70px_rgba(8,126,125,.08)] lg:grid lg:grid-cols-[1.05fr_.95fr]`}
            >
              <div className="flex flex-col justify-center p-7 sm:p-12">
                <SectionLabel>{t.usage.label}</SectionLabel>
                <h2 className="mt-7 font-display text-[42px] font-bold tracking-[-.05em] sm:text-[60px]">
                  {usageTitle} <span className="text-accent">{usageAccent}</span>
                </h2>
                <p className="mt-5 max-w-[550px] text-[13px] leading-6 text-body">
                  {d.usageBody}
                </p>
                <div className="mt-7 flex items-center justify-between rounded-[16px] bg-[#effbf9] px-6 py-5">
                  <b className="text-accent">{d.dailyDose || "1"}×</b>
                  <span className="text-[11px] text-body">{t.usage.daily}</span>
                  <PillIcon className="size-6 text-accent" />
                </div>
              </div>

              <div className="flex flex-col justify-center bg-[linear-gradient(135deg,#102021,#096f6e)] p-7 text-white sm:p-12">
                <SectionLabel tone="dark">{t.before.label}</SectionLabel>
                <ul className="mt-7 space-y-5 text-[12px] leading-5 text-white/70">
                  {beforeItems.map((x) => (
                    <li key={x} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-1 grid size-5 shrink-0 place-items-center rounded-full border border-white/20 text-[9px] text-brand-200"
                      >
                        ✓
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {Boolean(d.safety.length) && (
          <section id="safety" className="py-24 lg:py-32">
            <div
              className={`${CONTAINER} rounded-[34px] bg-[linear-gradient(145deg,#102021,#123f3f)] p-7 text-white shadow-[0_30px_80px_rgba(16,32,33,.18)] sm:p-12`}
            >
              <SectionLabel tone="dark">{t.safety.label}</SectionLabel>
              <div className="mt-7 grid gap-8 lg:grid-cols-2 lg:items-end">
                <h2 className="font-display text-[43px] leading-[1.02] font-bold tracking-[-.05em] sm:text-[62px]">
                  {t.safety.title}
                </h2>
                <p className="text-[13px] leading-6 text-white/60">
                  {t.safety.body}
                </p>
              </div>
              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {d.safety.map((item, i) => (
                  <li
                    key={`${item.title}-${i}`}
                    className="rounded-[20px] border border-white/8 bg-white/[.07] p-6"
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-white/8 text-[10px] text-brand-200">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 font-display text-[16px] font-bold">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[11px] leading-5 text-white/55">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {hasOrigin && (
          <section className="bg-[#e9faf8] py-24">
            <div className={`${CONTAINER} grid gap-4 lg:grid-cols-[.85fr_1.15fr]`}>
              <div className="grid place-items-center rounded-[30px] bg-[linear-gradient(160deg,#fff,#f4fdfc)] p-8 shadow-[0_18px_55px_rgba(8,126,125,.07)]">
                {isImported ? (
                  // Chet eldan to'liq import qilinadigan mahsulot — bitta karta,
                  // ikkinchi ishlab chiqarish bosqichi yo'q.
                  <div className="flex w-full max-w-[280px] flex-col items-center gap-5 rounded-[22px] bg-white p-8 text-center shadow-[0_18px_45px_rgba(8,126,125,.13)]">
                    {product.originLogo ? (
                      <div className="relative h-16 w-full">
                        <Image
                          src={product.originLogo}
                          alt={d.origin.importedCountry}
                          fill
                          sizes="280px"
                          className="object-contain"
                        />
                      </div>
                    ) : null}
                    <div>
                      <p className="text-[9px] font-bold tracking-[.12em] text-label">
                        {t.origin.importedCardLabel}
                      </p>
                      <p className="mt-2 font-display text-[22px] font-bold">
                        {d.origin.importedCountry}
                      </p>
                      <FlagBar country={d.origin.importedCountry} />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Kichik ekranda kartochkalar oddiy ustunga tushadi. */}
                    <div className="grid w-full gap-4 sm:hidden">
                      <OriginCard label={t.origin.cardRaw} country={d.origin.rawCountry} />
                      <OriginCard label={t.origin.cardMake} country={d.origin.makeCountry} />
                    </div>

                    <div className="relative hidden aspect-[1.05] w-full max-w-[520px] sm:block">
                      {/* Ikki kartochkani bog'lovchi punktir yo'l. */}
                      <svg
                        aria-hidden
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="absolute inset-0 size-full"
                      >
                        <path
                          d="M49 40 C 58 43, 64 48, 70 56"
                          fill="none"
                          stroke="#b6e2de"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>

                      <OriginCard
                        label={t.origin.cardRaw}
                        country={d.origin.rawCountry}
                        className="absolute top-[10%] left-[6%] w-[45%]"
                      />

                      <span className="absolute top-[56%] left-[70%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_7px_rgba(11,167,166,.14)]" />

                      <OriginCard
                        label={t.origin.cardMake}
                        country={d.origin.makeCountry}
                        className="absolute top-[60%] left-[49%] w-[46%]"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-[30px] bg-white p-8 shadow-[0_18px_55px_rgba(8,126,125,.07)] sm:p-12">
                <SectionLabel>{t.origin.label}</SectionLabel>
                <h2 className="mt-7 font-display text-[43px] leading-[1.02] tracking-[-.05em] sm:text-[58px]">
                  {isImported ? (
                    <>
                      {t.origin.importedTitle}{" "}
                      <span className="text-accent">{d.origin.importedCountry}.</span>
                    </>
                  ) : (
                    <>
                      {t.origin.title}
                      <br />
                      <span className="text-accent">{t.origin.titleAccent}</span>
                    </>
                  )}
                </h2>
                <dl
                  className={`mt-9 grid overflow-hidden rounded-[16px] border border-[#e3efee] ${
                    isImported ? "sm:grid-cols-2" : "sm:grid-cols-3"
                  }`}
                >
                  {originRows.map(([label, value]) => (
                    <div
                      key={label}
                      className="border-b border-[#e3efee] p-5 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
                    >
                      <dt className="text-[9px] font-bold tracking-[.12em] text-label">
                        {label}
                      </dt>
                      <dd className="mt-3 text-[12px] leading-5 font-bold">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-[11px] leading-5 text-body">
                  {t.origin.note}
                </p>
              </div>
            </div>
          </section>
        )}

        {hasDocuments && (
          <section id="documents" className="py-24 lg:py-32">
            <div
              className={`${CONTAINER} grid overflow-hidden rounded-[32px] bg-white shadow-[0_24px_70px_rgba(8,126,125,.09)] lg:grid-cols-[.9fr_1.1fr]`}
            >
              <div className="relative grid min-h-[430px] place-items-center bg-[#effbf9]">
                {product.certificate && !isPdf(product.certificate) ? (
                  <Image
                    src={product.certificate}
                    alt={`${t.documents.certificateAlt} — ${title}`}
                    fill
                    sizes="(max-width:1024px) 100vw,520px"
                    className="object-contain p-10"
                  />
                ) : (
                  <span className="grid size-24 place-items-center rounded-[26px] bg-white text-accent shadow-[0_18px_45px_rgba(8,126,125,.1)]">
                    <FileIcon className="size-10" />
                  </span>
                )}
              </div>
              <div className="p-8 sm:p-12 lg:self-center">
                <SectionLabel>{t.documents.label}</SectionLabel>
                <h2 className="mt-7 font-display text-[48px] leading-none font-bold tracking-[-.05em] sm:text-[64px]">
                  {t.documents.title}
                  <br />
                  <span className="text-accent">{t.documents.titleAccent}</span>
                </h2>
                <p className="mt-6 text-[13px] leading-6 text-body">
                  {t.documents.body}
                </p>
                <div className="mt-7 grid gap-2 sm:grid-cols-2">
                  <span className="rounded-[14px] bg-[#eefaf8] p-4">
                    <span className="block text-[9px] font-bold tracking-[.12em] text-label">
                      {t.documents.typeLabel}
                    </span>
                    <span className="mt-2 block text-[11px] font-semibold">
                      {t.documents.typeValue}
                    </span>
                  </span>
                  <span className="rounded-[14px] bg-[#eefaf8] p-4">
                    <span className="block text-[9px] font-bold tracking-[.12em] text-label">
                      {t.documents.formatLabel}
                    </span>
                    <span className="mt-2 block text-[11px] font-semibold">
                      {t.documents.formatValue}
                    </span>
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {product.certificate && (
                    <a
                      href={product.certificate}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-brand-gradient inline-flex h-11 items-center gap-4 rounded-pill px-5 text-[12px] font-semibold text-white"
                    >
                      {t.documents.certificateCta} <FileIcon className="size-4" />
                    </a>
                  )}
                  {product.instruction && (
                    <a
                      href={product.instruction}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 items-center gap-4 rounded-pill border border-brand-200 bg-white px-5 text-[12px] font-semibold text-brand-700"
                    >
                      {t.documents.instructionCta} <FileIcon className="size-4" />
                    </a>
                  )}
                </div>
                {!product.instruction && (
                  <p className="mt-4 text-[10px] text-body">
                    {t.documents.instructionEmpty}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {Boolean(related.length) && (
          <section className="bg-[#eafaf8] py-24">
            <div className={CONTAINER}>
              <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
                <div>
                  <SectionLabel>{t.related.label}</SectionLabel>
                  <h2 className="mt-7 font-display text-[45px] leading-none font-bold tracking-[-.05em] sm:text-[64px]">
                    {t.related.title}
                    <br />
                    <span className="text-accent">{t.related.titleAccent}</span>
                  </h2>
                </div>
                <p className="text-[13px] leading-6 text-body">
                  {t.related.intro}
                </p>
              </div>
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                {related.map((r) => {
                  const rt = r[locale];
                  return (
                    <article
                      key={r.id}
                      className="rounded-[24px] bg-white p-5 shadow-[0_16px_50px_rgba(8,126,125,.07)]"
                    >
                      <div className="relative grid h-52 place-items-center overflow-hidden rounded-[17px] bg-[#effbf9]">
                        {r.image ? (
                          <Image
                            src={r.image}
                            alt={productName(r, locale)}
                            fill
                            sizes="(max-width:640px) 90vw, 340px"
                            className="object-contain p-4"
                          />
                        ) : (
                          <span className="font-display text-2xl font-bold text-ink-deep/20">
                            {productName(r, locale)}
                          </span>
                        )}
                      </div>
                      <p className="mt-5 text-[9px] font-bold tracking-[.12em] text-accent">
                        {r.number} · {rt.category.toUpperCase()}
                      </p>
                      <h3 className="mt-3 font-display text-xl font-bold">
                        {productName(r, locale)}
                      </h3>
                      <p className="mt-2 text-[11px] text-body">
                        {[rt.stats[0], rt.stats[1]].filter(Boolean).join(" · ")}
                      </p>
                      <Link
                        href={`/products/${r.slug}`}
                        className="mt-5 flex items-center justify-between rounded-pill border border-brand-200 px-4 py-3 text-[11px] font-semibold text-brand-700 transition-colors hover:bg-brand-100/50"
                      >
                        {t.related.cta} <ArrowRightIcon className="size-4" />
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
