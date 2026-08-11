"use client";

import Image from "next/image";
import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";

import {
  addCertificate,
  deleteCertificate,
  type CertificateFormState,
} from "@/app/admin/data-actions";
import type { Certificate } from "@/lib/admin/store";

const ACCEPT = "image/png,image/jpeg,image/webp,image/avif,application/pdf";
const isPdf = (file: string) => file.toLowerCase().endsWith(".pdf");

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand-gradient h-11 cursor-pointer rounded-[12px] px-6 text-[11px] font-bold text-white disabled:opacity-60"
    >
      {pending ? "Yuklanmoqda..." : "Qo‘shish"}
    </button>
  );
}

/** «Biz haqimizda» sahifasidagi sertifikatlar galereyasini boshqarish. */
export function CertificatesView({ certificates }: { certificates: Certificate[] }) {
  const [state, formAction] = useActionState<CertificateFormState, FormData>(
    addCertificate,
    {},
  );
  const [pending, start] = useTransition();
  const [fileName, setFileName] = useState("");

  return (
    <section>
      <div>
        <h1 className="font-display text-[32px] font-bold">Sertifikatlar</h1>
        <p className="mt-2 text-[11px] text-body">
          «Biz haqimizda» sahifasidagi sertifikatlar galereyasi. Foydalanuvchi
          hujjat ustiga bosganda u kattalashib ochiladi.
        </p>
      </div>

      <form
        // Ro'yxat o'zgarganda forma qayta yaratiladi — maydonlar tozalanadi.
        key={certificates.length}
        action={formAction}
        className="mt-7 rounded-[22px] border border-[#dfeae9] bg-white p-6 sm:p-7"
      >
        <h2 className="font-display text-[16px] font-bold">Yangi sertifikat</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-[1.2fr_1fr_auto] sm:items-end">
          <label className="block text-[9px] font-bold tracking-[.08em] text-label uppercase">
            Nomi
            <input
              name="title"
              placeholder="Masalan: NovaLife Plus"
              className="mt-2 w-full rounded-[12px] border border-[#dce9e8] bg-white px-3.5 py-2.5 text-[12px] font-normal text-ink-deep outline-none focus:border-accent"
            />
          </label>

          <div className="text-[9px] font-bold tracking-[.08em] text-label uppercase">
            Fayl
            <input
              type="file"
              name="file"
              accept={ACCEPT}
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              className="sr-only"
              id="certificate-file"
            />
            <label
              htmlFor="certificate-file"
              className="mt-2 flex min-h-11 cursor-pointer items-center rounded-[12px] border border-[#dce9e8] px-3.5 text-[11px] font-normal normal-case text-body"
            >
              {fileName || "PDF yoki rasm tanlash"}
            </label>
          </div>

          <SubmitButton />
        </div>

        {state.error && (
          <p className="mt-4 text-[11px] font-semibold text-[#9d4c4c]">{state.error}</p>
        )}
      </form>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((c) => (
          <article
            key={c.id}
            className="overflow-hidden rounded-[20px] border border-[#dfeae9] bg-white p-4"
          >
            <div className="relative grid h-[220px] place-items-center overflow-hidden rounded-[14px] bg-[#f2fbfa]">
              {isPdf(c.file) ? (
                <span className="text-[34px]">📄</span>
              ) : (
                <Image
                  src={c.file}
                  alt={c.title}
                  fill
                  sizes="280px"
                  className="object-contain p-3"
                />
              )}
            </div>

            <h3 className="mt-4 truncate text-[13px] font-bold">{c.title}</h3>

            <div className="mt-3 flex gap-2">
              <a
                href={c.file}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 flex-1 place-items-center rounded-[10px] border border-[#dfeae9] text-[10px] font-bold"
              >
                Ko‘rish
              </a>
              <button
                disabled={pending}
                onClick={() => {
                  if (confirm(`"${c.title}" sertifikati o‘chirilsinmi?`)) {
                    start(() => void deleteCertificate(c.id));
                  }
                }}
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#f0dede] text-[#9d4c4c] disabled:opacity-50"
                aria-label="O‘chirish"
              >
                ✕
              </button>
            </div>
          </article>
        ))}

        {!certificates.length && (
          <p className="rounded-[20px] border border-dashed border-[#cfe2e0] p-10 text-center text-[12px] text-body sm:col-span-2 lg:col-span-3">
            Hozircha sertifikat yo‘q.
          </p>
        )}
      </div>
    </section>
  );
}
