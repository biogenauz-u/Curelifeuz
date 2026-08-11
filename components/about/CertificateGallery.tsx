"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Certificate } from "@/lib/admin/store";

const isPdf = (file: string) => file.toLowerCase().endsWith(".pdf");

/**
 * Sertifikatlar galereyasi. Kartochkaga bosilganda hujjat modal oynada
 * kattalashib ochiladi; PDF esa yangi oynada.
 *
 * Modal uchun brauzerning `<dialog>` elementi ishlatiladi — fokus tuzog'i va
 * Escape bilan yopish tayyor holda keladi, qo'shimcha kutubxona kerak emas.
 */
export function CertificateGallery({
  items,
  labels,
}: {
  items: Certificate[];
  labels: {
    productLabel: string;
    note: string;
    alt: string;
    open: string;
    close: string;
  };
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState<Certificate | null>(null);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Yopilganda fokus ochgan kartochkaga qaytadi.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setActive(null);
      triggerRef.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const open = (certificate: Certificate, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActive(certificate);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((certificate) => {
          const card = (
            <>
              <div className="relative h-[360px] overflow-hidden rounded-[16px] bg-[#effaf9]">
                {isPdf(certificate.file) ? (
                  <span className="absolute inset-0 grid place-items-center text-[44px] text-brand-200">
                    📄
                  </span>
                ) : (
                  <Image
                    src={certificate.file}
                    alt={`${labels.alt} — ${certificate.title}`}
                    fill
                    sizes="(max-width:640px) 90vw,340px"
                    className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <p className="mt-5 text-[9px] font-bold tracking-[.12em] text-accent">
                {labels.productLabel}
              </p>
              <h3 className="mt-3 font-display text-[17px] font-bold">
                {certificate.title}
              </h3>
              <p className="mt-2 text-[12px] leading-5 text-body">{labels.note}</p>
              <span className="mt-4 inline-flex min-h-11 items-center gap-2 text-[13px] font-bold text-accent">
                {labels.open} <span aria-hidden>↗</span>
              </span>
            </>
          );

          const shell =
            "group block w-full rounded-[24px] bg-white p-5 text-left shadow-[0_18px_55px_rgba(8,126,125,.07)] transition-shadow hover:shadow-[0_22px_60px_rgba(8,126,125,.14)]";

          // PDF brauzerning o'z ko'ruvchisida ochilgani qulayroq.
          return isPdf(certificate.file) ? (
            <a
              key={certificate.id}
              href={certificate.file}
              target="_blank"
              rel="noreferrer"
              className={shell}
            >
              {card}
            </a>
          ) : (
            <button
              key={certificate.id}
              type="button"
              onClick={(e) => open(certificate, e.currentTarget)}
              className={`${shell} cursor-pointer`}
            >
              {card}
            </button>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={active ? `${labels.alt} — ${active.title}` : labels.alt}
        onClick={(e) => {
          // Fon (backdrop) bosilganda yopiladi.
          if (e.target === dialogRef.current) close();
        }}
        className="m-auto w-[min(92vw,760px)] rounded-[24px] bg-white p-4 backdrop:bg-ink-deep/70 sm:p-6"
      >
        {active && (
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-[18px] font-bold text-ink-deep">
                {active.title}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label={labels.close}
                className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-pill border border-[#dce9e8] text-[18px] text-body"
              >
                ✕
              </button>
            </div>

            <div className="relative mt-4 h-[min(72vh,760px)] overflow-hidden rounded-[16px] bg-[#f3fbfa]">
              <Image
                src={active.file}
                alt={`${labels.alt} — ${active.title}`}
                fill
                sizes="(max-width:768px) 92vw, 760px"
                className="object-contain p-2 sm:p-4"
              />
            </div>

            <a
              href={active.file}
              target="_blank"
              rel="noreferrer"
              className="bg-brand-gradient mt-4 inline-flex h-11 items-center gap-3 rounded-pill px-5 text-[13px] font-bold text-white"
            >
              {labels.open} <span aria-hidden>↗</span>
            </a>
          </div>
        )}
      </dialog>
    </>
  );
}
