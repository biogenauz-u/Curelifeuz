"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { generateArticle } from "@/app/admin/ai-article-actions";
import { saveArticle, type ArticleFormState } from "@/app/admin/data-actions";
import { translateArticle } from "@/app/admin/translate-article-actions";
import type { Article, ArticleLocale } from "@/lib/admin/store";

// TipTap DOM'ga bog'liq — serverda render qilinmaydi.
const RichTextEditor = dynamic(
  () => import("@/components/admin/RichTextEditor").then((m) => m.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div className="mt-2 h-[380px] animate-pulse rounded-[12px] border border-[#dce9e8] bg-[#f5fbfa]" />
    ),
  },
);

const ACCEPT = "image/png,image/jpeg,image/webp,image/avif";
const MAX_BYTES = 10 * 1024 * 1024;

const INPUT =
  "mt-2 w-full rounded-[12px] border border-[#dce9e8] bg-white px-3.5 py-2.5 text-[12px] font-normal text-ink-deep outline-none transition-colors focus:border-accent";
const CARD = "rounded-[24px] border border-[#e0eceb] bg-white p-6 sm:p-8";

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  name?: string;
  value: string;
  onChange: (next: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block text-[9px] font-bold tracking-[.08em] text-label uppercase">
      {label}
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
      {hint && (
        <span className="mt-2 block text-[9px] font-normal normal-case tracking-normal text-body">
          {hint}
        </span>
      )}
    </label>
  );
}

function LocaleBlock({
  prefix,
  value,
  onChange,
}: {
  prefix: "ru" | "uz";
  value: ArticleLocale;
  onChange: (next: ArticleLocale) => void;
}) {
  return (
    <div className="grid gap-4">
      <Field
        label="Sarlavha"
        name={`${prefix}_title`}
        value={value.title}
        onChange={(v) => onChange({ ...value, title: v })}
      />
      <div className="block text-[9px] font-bold tracking-[.08em] text-label uppercase">
        Matn
        <RichTextEditor
          name={`${prefix}_body`}
          value={value.body}
          onChange={(html) => onChange({ ...value, body: html })}
          placeholder="Maqola matnini shu yerga yozing..."
        />
      </div>
    </div>
  );
}

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand-gradient h-12 cursor-pointer rounded-[13px] px-8 text-[11px] font-bold text-white disabled:opacity-60"
    >
      {pending ? "Saqlanmoqda..." : isNew ? "Maqolani qo‘shish" : "O‘zgarishlarni saqlash"}
    </button>
  );
}

export function ArticleForm({
  article,
  isNew,
}: {
  article: Article;
  isNew: boolean;
}) {
  const [state, formAction] = useActionState<ArticleFormState, FormData>(
    saveArticle,
    {},
  );

  const [ru, setRu] = useState<ArticleLocale>(article.ru);
  const [uz, setUz] = useState<ArticleLocale>(article.uz);
  const [views, setViews] = useState(String(article.views));
  const [publishedAt, setPublishedAt] = useState(article.publishedAt);

  const [sourceUrl, setSourceUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  const generateFromUrl = async () => {
    setGenerating(true);
    setGenerateError("");
    const result = await generateArticle(sourceUrl);
    setGenerating(false);
    if (!result.ok) return setGenerateError(result.error);
    setUz(result.data);
  };

  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [imageError, setImageError] = useState("");
  const shown = preview ?? (removed ? null : article.image);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const pick = (file: File | null) => {
    setImageError("");
    if (!file) return setPreview(null);
    const reject = (message: string) => {
      if (fileRef.current) fileRef.current.value = "";
      setPreview(null);
      setImageError(message);
    };
    if (!ACCEPT.split(",").includes(file.type)) {
      return reject("Faqat PNG, JPG, WEBP yoki AVIF rasm bo‘lishi mumkin.");
    }
    if (file.size > MAX_BYTES) return reject("Rasm hajmi 10 MB dan oshmasin.");
    setPreview(URL.createObjectURL(file));
    setRemoved(false);
  };

  const [translating, setTranslating] = useState<"ru" | "uz" | null>(null);
  const [translateError, setTranslateError] = useState("");

  const translate = async (from: "ru" | "uz") => {
    setTranslating(from);
    setTranslateError("");
    const result = await translateArticle({ from, fields: from === "ru" ? ru : uz });
    setTranslating(null);
    if (!result.ok) return setTranslateError(result.error);
    if (from === "ru") setUz(result.data);
    else setRu(result.data);
  };

  return (
    <form action={formAction} className="grid gap-5 xl:grid-cols-[1.55fr_.85fr] xl:items-start">
      <input type="hidden" name="id" value={article.id} />
      {removed && !preview && <input type="hidden" name="remove_image" value="on" />}

      <div className="grid gap-5">
        <section className={CARD}>
          <h2 className="font-display text-[18px] font-bold">AI orqali maqola tayyorlash</h2>
          <p className="mt-1 text-[10px] text-body">
            Manba maqola havolasini joylang — sahifa o‘qib olinadi va shu asosda
            CureLife blogi uchun original o‘zbekcha maqola (sarlavha + matn) yoziladi.
            So‘zma-so‘z ko‘chirilmaydi. Natijani tekshirib, kerak bo‘lsa tahrirlang,
            so‘ng pastdagi «⇄ Ruschaga tarjima qilish» bilan ruschaga o‘tkazing.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://..."
              className={`${INPUT} mt-0 flex-1`}
            />
            <button
              type="button"
              onClick={() => void generateFromUrl()}
              disabled={generating || !sourceUrl.trim()}
              className="bg-brand-gradient h-[42px] cursor-pointer rounded-[12px] px-5 text-[10px] font-bold text-white disabled:opacity-50"
            >
              {generating ? "Tayyorlanmoqda..." : "AI orqali tayyorlash"}
            </button>
          </div>
          {generateError && (
            <p className="mt-3 text-[10px] font-semibold text-[#9d4c4c]">{generateError}</p>
          )}
        </section>

        <section className={CARD}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eaf1f0] pb-5">
            <h2 className="font-display text-[18px] font-bold">Ruscha</h2>
            <button
              type="button"
              onClick={() => void translate("ru")}
              disabled={translating !== null}
              className="h-10 cursor-pointer rounded-[12px] border border-brand-200 bg-brand-100/50 px-4 text-[10px] font-bold text-brand-700 transition-colors hover:bg-brand-100 disabled:opacity-50"
            >
              {translating === "ru" ? "Tarjima qilinmoqda..." : "⇄ O‘zbekchaga tarjima qilish"}
            </button>
          </div>
          <div className="mt-6">
            <LocaleBlock prefix="ru" value={ru} onChange={setRu} />
          </div>
        </section>

        <section className={CARD}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eaf1f0] pb-5">
            <h2 className="font-display text-[18px] font-bold">O‘zbekcha</h2>
            <button
              type="button"
              onClick={() => void translate("uz")}
              disabled={translating !== null}
              className="h-10 cursor-pointer rounded-[12px] border border-brand-200 bg-brand-100/50 px-4 text-[10px] font-bold text-brand-700 transition-colors hover:bg-brand-100 disabled:opacity-50"
            >
              {translating === "uz" ? "Tarjima qilinmoqda..." : "⇄ Ruschaga tarjima qilish"}
            </button>
          </div>
          <div className="mt-6">
            <LocaleBlock prefix="uz" value={uz} onChange={setUz} />
          </div>
        </section>

        {translateError && (
          <p className="rounded-[14px] border border-[#f0dede] bg-[#fdf6f6] px-5 py-4 text-[11px] text-[#9d4c4c]">
            {translateError}
          </p>
        )}
      </div>

      <div className="grid gap-4 xl:sticky xl:top-[102px]">
        <section className={CARD}>
          <h2 className="font-display text-[16px] font-bold">Rasm</h2>
          <p className="mt-1 text-[10px] text-body">PNG, JPG, WEBP yoki AVIF.</p>

          <div className="mt-4 grid h-[160px] place-items-center overflow-hidden rounded-[16px] border border-dashed border-[#cfe2e0] bg-[#f5fbfa]">
            {shown ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shown} alt="" className="max-h-full max-w-full object-contain p-3" />
            ) : (
              <span className="text-[10px] text-body">Rasm tanlanmagan</span>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            name="image"
            accept={ACCEPT}
            onChange={(e) => pick(e.target.files?.[0] ?? null)}
            className="sr-only"
            id="article-image"
          />
          <div className="mt-3 flex gap-2">
            <label
              htmlFor="article-image"
              className="h-9 flex-1 cursor-pointer rounded-[11px] border border-[#dce9e8] text-center text-[10px] font-bold leading-9"
            >
              {shown ? "Almashtirish" : "Tanlash"}
            </label>
            {shown && (
              <button
                type="button"
                onClick={() => {
                  if (fileRef.current) fileRef.current.value = "";
                  setImageError("");
                  setPreview(null);
                  setRemoved(true);
                }}
                className="h-9 cursor-pointer rounded-[11px] border border-[#f0dede] px-4 text-[10px] font-bold text-[#9d4c4c]"
              >
                O‘chirish
              </button>
            )}
          </div>
          {imageError && (
            <p className="mt-3 text-[10px] font-semibold text-[#9d4c4c]">{imageError}</p>
          )}
        </section>

        <section className={CARD}>
          <h2 className="font-display text-[16px] font-bold">Ma’lumot</h2>
          <div className="mt-4 grid gap-4">
            <Field
              label="Chop etilgan sana"
              name="publishedAt"
              type="date"
              value={publishedAt}
              onChange={setPublishedAt}
            />
            <Field
              label="Ko‘rilganlar soni"
              name="views"
              type="number"
              value={views}
              onChange={setViews}
              hint="Maqola ochilganda avtomatik oshadi."
            />
          </div>
        </section>

        {state.error && (
          <p className="rounded-[14px] border border-[#f0dede] bg-[#fdf6f6] px-5 py-4 text-[11px] text-[#9d4c4c]">
            {state.error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <SubmitButton isNew={isNew} />
          <Link
            href="/admin?view=articles"
            className="grid h-12 cursor-pointer place-items-center rounded-[13px] border border-[#dce9e8] bg-white px-6 text-[11px] font-bold"
          >
            Bekor qilish
          </Link>
        </div>
      </div>
    </form>
  );
}
