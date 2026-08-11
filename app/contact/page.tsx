import Image from "next/image";
import type { Metadata } from "next";

import { ContactFaq } from "@/components/contact/ContactFaq";
import { ContactForm } from "@/components/contact/ContactForm";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getSettings } from "@/lib/admin/store";
import { getServerDictionary } from "@/lib/i18n/server";
import { resolvePageMeta } from "@/lib/i18n/page-meta";
import { MAP_EMBED, MAP_LINK } from "@/lib/site-config";
import { CONTAINER, CONTAINER_WIDE } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = (await getServerDictionary()).contactPage;
  return resolvePageMeta("/contact", meta);
}

export default async function ContactPage() {
  const [dict, settings] = await Promise.all([
    getServerDictionary(),
    getSettings(),
  ]);
  const c = dict.contactPage;

  // Qiymatlar admin paneldan, yorliq va izohlar lug'atdan.
  const channels = c.message.channels.map(([label, , note], i) => {
    const value = [settings.phone, settings.email, settings.hours][i] ?? "";
    return [label, value, note] as const;
  });
  const officeRows = c.office.rows.map(([label], i) => {
    const value = [settings.address, settings.hours][i] ?? "";
    return [label, value] as const;
  });

  return (
    <>
      <main className="overflow-hidden bg-[#f7ffff] text-ink-deep">
        <section id="hero" className="relative pb-24">
          <div className="pointer-events-none absolute top-28 -right-52 size-[430px] rounded-full bg-brand-100/45 lg:-right-40 lg:bg-brand-100/75" />
          <Header />
          <div
            className={`${CONTAINER_WIDE} relative z-10 grid gap-12 pt-20 lg:grid-cols-[.86fr_1.14fr] lg:items-center lg:pt-28`}
          >
            <div className="lg:pl-20">
              <SectionLabel>{c.hero.label}</SectionLabel>
              <h1 className="mt-8 max-w-[620px] font-display text-[57px] leading-[.95] font-bold tracking-[-.06em] sm:text-[78px] lg:text-[92px]">
                {c.hero.title}{" "}
                <span className="text-accent">{c.hero.titleAccent}</span>
              </h1>
              <p className="mt-7 max-w-[570px] text-[16px] leading-[1.75] text-body">
                {c.hero.body}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#message"
                  className="bg-brand-gradient inline-flex h-12 items-center gap-4 rounded-[14px] px-5 text-[12px] font-bold text-white"
                >
                  {c.hero.primary} <ArrowRightIcon className="size-4" />
                </a>
                <a
                  href="#office"
                  className="inline-flex h-12 items-center rounded-[14px] border border-brand-200/50 bg-white px-5 text-[12px] font-bold"
                >
                  {c.hero.secondary}
                </a>
              </div>
            </div>
            <div className="relative aspect-[1.08] overflow-hidden rounded-[36px] shadow-[0_30px_85px_rgba(8,126,125,.1)]">
              <Image
                src="/images/contact-support.png"
                alt={c.hero.imageAlt}
                fill
                priority
                sizes="(max-width:1024px) 100vw,700px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section id="message" className="bg-[#eafaf8] py-24 lg:py-32">
          <div className={CONTAINER}>
            <div className="grid gap-8 lg:grid-cols-[1.08fr_.92fr] lg:items-end">
              <div>
                <SectionLabel>{c.message.label}</SectionLabel>
                <h2 className="mt-8 max-w-[650px] font-display text-[48px] leading-[.98] font-bold tracking-[-.055em] sm:text-[68px]">
                  {c.message.title}{" "}
                  <span className="text-accent">{c.message.titleAccent}</span>
                </h2>
              </div>
              <p className="pb-2 text-[13px] leading-6 text-body">
                {c.message.intro}
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
              <div className="grid gap-4">
                {channels.map(([label, value, note]) => (
                  <article key={label} className="rounded-[24px] bg-white p-7">
                    <p className="text-[9px] font-bold tracking-[.1em] text-label">
                      {label}
                    </p>
                    <p className="mt-3 font-display text-lg font-bold text-brand-700">
                      {value}
                    </p>
                    <p className="mt-3 text-[11px] text-body">{note}</p>
                  </article>
                ))}
              </div>
              <ContactForm />
            </div>
          </div>
        </section>

        <section id="office" className="relative py-24 lg:py-32">
          <div className="pointer-events-none absolute -right-40 bottom-12 size-[350px] rounded-full bg-brand-100/70" />
          <div className={`${CONTAINER} grid gap-5 lg:grid-cols-[1.08fr_.92fr]`}>
            {/* Haqiqiy Yandex xaritasi. Iframe tashqi resurs bo'lgani uchun
                `lazy` bilan yuklanadi — birinchi ekran tezligiga ta'sir qilmaydi. */}
            <div className="relative min-h-[500px] overflow-hidden rounded-[30px] bg-[#e9f8f6]">
              <iframe
                src={MAP_EMBED}
                title={c.office.mapTitle}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0"
              />
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noreferrer"
                className="absolute top-4 left-4 z-10 inline-flex min-h-11 items-center gap-2 rounded-pill bg-white px-5 text-[12px] font-bold text-brand-700 shadow-[0_10px_30px_rgba(8,126,125,.18)]"
              >
                {c.office.mapCta} <span aria-hidden>↗</span>
              </a>
            </div>

            <div className="rounded-[30px] bg-[linear-gradient(145deg,#087e7d,#2abdb8)] p-8 text-white sm:p-12">
              <SectionLabel tone="dark">{c.office.label}</SectionLabel>
              <h2 className="mt-10 font-display text-[44px] leading-[1.02] font-bold tracking-[-.05em] sm:text-[58px]">
                {c.office.title}
              </h2>
              <p className="mt-6 text-[13px] leading-6 text-white/70">
                {c.office.body}
              </p>
              <dl className="mt-8 divide-y divide-white/15">
                {officeRows.map(([label, value]) => (
                  <div key={label} className="py-5">
                    <dt className="text-[9px] tracking-[.12em] text-white/55">
                      {label}
                    </dt>
                    <dd className="mt-2 text-[13px] font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
              <a
                href="#message"
                className="mt-6 inline-flex h-12 items-center gap-4 rounded-[14px] bg-white px-5 text-[12px] font-bold text-brand-700"
              >
                {c.office.cta} <ArrowRightIcon className="size-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="pb-24 lg:pb-32">
          <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[.72fr_1.28fr]`}>
            <div>
              <SectionLabel>{c.faq.label}</SectionLabel>
              <h2 className="mt-8 font-display text-[48px] leading-none font-bold tracking-[-.055em] sm:text-[66px]">
                {c.faq.title}
              </h2>
              <p className="mt-6 text-[13px] leading-6 text-body">
                {c.faq.intro}
              </p>
            </div>
            <ContactFaq />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
