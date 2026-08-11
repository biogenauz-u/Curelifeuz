import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { CertificateGallery } from "@/components/about/CertificateGallery";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getCertificates } from "@/lib/admin/store";
import { getServerDictionary } from "@/lib/i18n/server";
import { resolvePageMeta } from "@/lib/i18n/page-meta";
import { CONTAINER, CONTAINER_WIDE } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = (await getServerDictionary()).aboutPage;
  return resolvePageMeta("/about", meta);
}

export default async function AboutPage() {
  const [dict, certificates] = await Promise.all([
    getServerDictionary(),
    getCertificates(),
  ]);
  const a = dict.aboutPage;

  return (
    <>
      <main className="overflow-hidden bg-[#f7ffff] text-ink-deep">
        <section id="hero" className="relative pb-24">
          <div className="pointer-events-none absolute top-28 -right-52 size-[430px] rounded-full bg-brand-100/45 lg:-right-36 lg:bg-brand-100/75" />
          <Header />
          <div
            className={`${CONTAINER_WIDE} relative z-10 grid gap-12 pt-20 lg:grid-cols-[.86fr_1.14fr] lg:items-center lg:pt-28`}
          >
            <div className="lg:pl-20">
              <SectionLabel>{a.hero.label}</SectionLabel>
              <h1 className="mt-8 max-w-[650px] font-display text-[55px] leading-[.94] font-bold tracking-[-.06em] sm:text-[76px] lg:text-[92px]">
                {a.hero.title}{" "}
                <span className="text-accent">{a.hero.titleAccent}</span>
              </h1>
              <p className="mt-7 max-w-[570px] text-[15px] leading-[1.75] text-body">
                {a.hero.body}
              </p>
              <a
                href="#certificates"
                className="mt-7 inline-flex h-12 items-center gap-4 rounded-[14px] border border-brand-200/50 bg-white px-5 text-[12px] font-bold"
              >
                {a.hero.cta} <ArrowRightIcon className="size-4 text-accent" />
              </a>
              <div className="mt-8 flex flex-wrap gap-6 text-[10px] font-semibold text-label">
                {a.hero.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            {/* Kapsula sekin tebranib, suzib turadi — animatsiya
                globals.css dagi `capsule-float` / `capsule-glow` da. */}
            <div className="relative aspect-[1.18] overflow-hidden rounded-[36px] shadow-[0_30px_85px_rgba(8,126,125,.1)]">
              <Image
                src="/images/about-hero.png"
                alt={a.hero.imageAlt}
                fill
                priority
                sizes="(max-width:1024px) 100vw,700px"
                className="capsule-float object-cover"
              />
            </div>
          </div>
          <dl
            className={`${CONTAINER} mt-20 grid grid-cols-2 overflow-hidden rounded-[22px] bg-white shadow-[0_18px_60px_rgba(8,126,125,.06)] lg:grid-cols-4`}
          >
            {a.stats.map(([value, label]) => (
              <div
                key={value}
                className="border-r border-b border-brand-100 p-6 lg:p-8"
              >
                <dt className="font-display text-[32px] font-bold tracking-[-.04em]">
                  {value}
                </dt>
                <dd className="mt-2 text-[10px] text-body">{label}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="relative py-24 lg:py-32">
          <div className="pointer-events-none absolute top-32 -left-40 size-[360px] rounded-full bg-brand-100/70" />
          <div className={`${CONTAINER} grid gap-5 lg:grid-cols-[1.08fr_.92fr]`}>
            <article className="rounded-[30px] bg-white p-8 shadow-[0_20px_65px_rgba(8,126,125,.06)] sm:p-12">
              <SectionLabel>{a.story.label}</SectionLabel>
              <h2 className="mt-8 max-w-[650px] font-display text-[46px] leading-[.98] font-bold tracking-[-.05em] sm:text-[64px]">
                {a.story.title}
              </h2>
              <p className="mt-7 text-[14px] leading-6 text-body">
                {a.story.body}
              </p>
              <blockquote className="mt-12 border-t border-brand-100 pt-8 font-display text-[25px] leading-tight text-[#527370]">
                {a.story.quote}
              </blockquote>
            </article>
            <article className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(145deg,#087e7d,#28bdb8)] p-8 text-white sm:p-12">
              <div className="absolute -top-16 -right-16 size-52 rounded-full bg-white/10" />
              <SectionLabel tone="dark">{a.mission.label}</SectionLabel>
              <h2 className="relative mt-16 max-w-[500px] font-display text-[43px] leading-[1.02] font-bold tracking-[-.04em] sm:text-[58px]">
                {a.mission.title}
              </h2>
              <p className="relative mt-20 text-[13px] leading-6 text-white/70">
                {a.mission.body}
              </p>
            </article>
          </div>
        </section>

        <section className="bg-[#eafaf8] py-24 lg:py-32">
          <div className={CONTAINER}>
            <div className="grid gap-7 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
              <div>
                <SectionLabel>{a.approach.label}</SectionLabel>
                <h2 className="mt-8 max-w-[700px] font-display text-[47px] leading-[.98] font-bold tracking-[-.05em] sm:text-[64px]">
                  {a.approach.title}
                </h2>
              </div>
              <p className="pb-2 text-[13px] leading-6 text-body">
                {a.approach.intro}
              </p>
            </div>
            <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {a.approach.principles.map((pr) => (
                <li
                  key={pr.title}
                  className="rounded-[22px] bg-white p-6 shadow-[0_14px_45px_rgba(8,126,125,.05)]"
                >
                  <span className="grid size-10 place-items-center rounded-[13px] bg-brand-100 text-lg text-accent">
                    {pr.icon}
                  </span>
                  <h3 className="mt-6 font-display text-[18px] font-bold">
                    {pr.title}
                  </h3>
                  <p className="mt-4 text-[11px] leading-5 text-body">
                    {pr.body}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-16 overflow-hidden rounded-[32px] bg-[linear-gradient(145deg,#102021,#123e3e)] p-8 text-white sm:p-12">
              <SectionLabel tone="dark">{a.chain.label}</SectionLabel>
              <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
                <h2 className="font-display text-[45px] leading-[1.02] font-bold tracking-[-.05em] sm:text-[64px]">
                  {a.chain.title}
                </h2>
                <p className="text-[13px] leading-6 text-white/60">
                  {a.chain.body}
                </p>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {a.chain.steps.map(([tag, title, body]) => (
                  <article
                    key={title}
                    className="rounded-[18px] bg-white p-6 text-ink-deep"
                  >
                    <p className="text-[8px] font-bold tracking-[.12em] text-accent">
                      {tag}
                    </p>
                    <h3 className="mt-6 font-display text-lg font-bold">
                      {title}
                    </h3>
                    <p className="mt-4 text-[10px] leading-5 text-body">
                      {body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="certificates" className="py-24 lg:py-32">
          <div className={CONTAINER}>
            <SectionLabel>{a.certificates.label}</SectionLabel>
            <h2 className="mt-8 max-w-[1000px] font-display text-[47px] leading-[1.02] font-bold tracking-[-.05em] sm:text-[64px]">
              {a.certificates.title}
            </h2>
            <p className="mt-6 max-w-[720px] text-[13px] leading-6 text-body">
              {a.certificates.intro}
            </p>
            <CertificateGallery
              items={certificates}
              labels={{
                productLabel: a.certificates.productLabel,
                note: a.certificates.note,
                alt: a.certificates.alt,
                open: a.certificates.open,
                close: dict.common.close,
              }}
            />
          </div>
        </section>

        <section className="bg-[#eefbf9] py-24">
          <div
            className={`${CONTAINER} grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center`}
          >
            <div>
              <SectionLabel>{a.responsibility.label}</SectionLabel>
              <h2 className="mt-8 font-display text-[46px] leading-[1.02] font-bold tracking-[-.05em] sm:text-[62px]">
                {a.responsibility.title}
              </h2>
              <p className="mt-6 text-[13px] leading-6 text-body">
                {a.responsibility.body}
              </p>
              <ul className="mt-7 space-y-4">
                {a.responsibility.points.map((x) => (
                  <li key={x} className="flex items-center gap-3 text-[12px] font-bold">
                    <span className="grid size-6 place-items-center rounded-full bg-brand-100 text-accent">
                      ✓
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative min-h-[520px] overflow-hidden rounded-[30px]">
              <Image
                src="/images/about-transparency.png"
                alt={a.responsibility.imageAlt}
                fill
                sizes="(max-width:1024px) 100vw,650px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32">
          <div
            className={`${CONTAINER} grid overflow-hidden rounded-[32px] bg-white shadow-[0_24px_75px_rgba(8,126,125,.08)] lg:grid-cols-[1.05fr_.95fr]`}
          >
            <div className="p-8 sm:p-12 lg:p-16">
              <SectionLabel>{a.contact.label}</SectionLabel>
              <h2 className="mt-8 font-display text-[45px] leading-[1.02] font-bold tracking-[-.05em] sm:text-[62px]">
                {a.contact.title}
              </h2>
              <p className="mt-6 text-[13px] leading-6 text-body">
                {a.contact.body}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/contact"
                  className="bg-brand-gradient inline-flex h-12 items-center gap-4 rounded-[14px] px-5 text-[12px] font-bold text-white"
                >
                  {a.contact.primary} <ArrowRightIcon className="size-4" />
                </a>
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center rounded-[14px] border border-brand-200/50 px-5 text-[12px] font-bold"
                >
                  {a.contact.secondary}
                </Link>
              </div>
            </div>
            <div className="relative min-h-[380px]">
              <Image
                src="/images/about-contact.png"
                alt={a.contact.imageAlt}
                fill
                sizes="(max-width:1024px) 100vw,520px"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
