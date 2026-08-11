"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { fillProduct } from "@/app/admin/ai-actions";
import { saveProduct, type ProductFormState } from "@/app/admin/data-actions";
import { translateProduct } from "@/app/admin/translate-actions";
import type {
  CompositionItem,
  Product,
  ProductDetail,
  ProductLocale,
  SafetyItem,
} from "@/lib/admin/store";

const ACCEPT_IMAGE = "image/png,image/jpeg,image/webp,image/avif";
const ACCEPT_DOC = `${ACCEPT_IMAGE},application/pdf`;
const MAX_BYTES = 10 * 1024 * 1024;

/** Server tomondagi `slugify` bilan bir xil qoida. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’'`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const INPUT =
  "mt-2 w-full rounded-[12px] border border-[#dce9e8] bg-white px-3.5 py-2.5 text-[12px] font-normal text-ink-deep outline-none transition-colors focus:border-accent";
const CARD = "rounded-[24px] border border-[#e0eceb] bg-white p-6 sm:p-8";
const GHOST_BUTTON =
  "h-9 cursor-pointer rounded-[11px] border border-[#dce9e8] px-4 text-[10px] font-bold transition-colors hover:border-brand-200 hover:bg-brand-100/40";

function Field({
  label,
  name,
  value,
  onChange,
  textarea,
  hint,
  rows = 4,
}: {
  label: string;
  name?: string;
  value: string;
  onChange: (next: string) => void;
  textarea?: boolean;
  hint?: string;
  rows?: number;
}) {
  return (
    <label className="block text-[9px] font-bold tracking-[.08em] text-label uppercase">
      {label}
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${INPUT} resize-none leading-[1.6]`}
        />
      ) : (
        <input
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={INPUT}
        />
      )}
      {hint && (
        <span className="mt-2 block text-[9px] font-normal normal-case tracking-normal text-body">
          {hint}
        </span>
      )}
    </label>
  );
}

function SectionTitle({ children, note }: { children: string; note?: string }) {
  return (
    <div className="mb-4">
      <p className="text-[10px] font-bold tracking-[.12em] text-brand-700 uppercase">
        {children}
      </p>
      {note && <p className="mt-1.5 text-[10px] text-body">{note}</p>}
    </div>
  );
}

/* ── Ro'yxat tahrirlagichlari ─────────────────────────────────────────── */

function ListEditor({
  items,
  onChange,
  addLabel,
  placeholder,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  addLabel: string;
  placeholder: string;
}) {
  const update = (i: number, v: string) =>
    onChange(items.map((x, j) => (j === i ? v : x)));

  return (
    <div className="grid gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <textarea
            value={item}
            rows={2}
            placeholder={placeholder}
            onChange={(e) => update(i, e.target.value)}
            className={`${INPUT} mt-0 resize-none leading-[1.6]`}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="mt-0.5 grid size-9 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#f0dede] text-[#9d4c4c]"
            aria-label="Qatorni o‘chirish"
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ""])} className={`${GHOST_BUTTON} w-fit`}>
        + {addLabel}
      </button>
    </div>
  );
}

function CompositionEditor({
  items,
  onChange,
}: {
  items: CompositionItem[];
  onChange: (next: CompositionItem[]) => void;
}) {
  const update = (i: number, patch: Partial<CompositionItem>) =>
    onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <div className="grid gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
            {String(i + 1).padStart(2, "0")}
          </span>
          <input
            value={item.name}
            placeholder="Komponent nomi"
            onChange={(e) => update(i, { name: e.target.value })}
            className={`${INPUT} mt-0 flex-1`}
          />
          <input
            value={item.amount}
            placeholder="500 mg"
            onChange={(e) => update(i, { amount: e.target.value })}
            className={`${INPUT} mt-0 w-[110px] shrink-0`}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#f0dede] text-[#9d4c4c]"
            aria-label="Komponentni o‘chirish"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { name: "", amount: "" }])}
        className={`${GHOST_BUTTON} w-fit`}
      >
        + Komponent qo‘shish
      </button>
    </div>
  );
}

function SafetyEditor({
  items,
  onChange,
}: {
  items: SafetyItem[];
  onChange: (next: SafetyItem[]) => void;
}) {
  const update = (i: number, patch: Partial<SafetyItem>) =>
    onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <div className="grid gap-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-[16px] border border-[#e6efee] p-4">
          <div className="flex items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
              {String(i + 1).padStart(2, "0")}
            </span>
            <input
              value={item.title}
              placeholder="Sarlavha"
              onChange={(e) => update(i, { title: e.target.value })}
              className={`${INPUT} mt-0 flex-1 font-semibold`}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#f0dede] text-[#9d4c4c]"
              aria-label="Kartochkani o‘chirish"
            >
              ✕
            </button>
          </div>
          <textarea
            value={item.body}
            rows={3}
            placeholder="Izoh"
            onChange={(e) => update(i, { body: e.target.value })}
            className={`${INPUT} resize-none leading-[1.6]`}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { title: "", body: "" }])}
        className={`${GHOST_BUTTON} w-fit`}
      >
        + Kartochka qo‘shish
      </button>
    </div>
  );
}

/* ── Fayl maydoni ─────────────────────────────────────────────────────── */

function FileField({
  label,
  note,
  name,
  current,
  document: isDocument,
}: {
  label: string;
  note: string;
  name: string;
  current: string | null;
  document?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pickedName, setPickedName] = useState("");
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState("");

  const accept = isDocument ? ACCEPT_DOC : ACCEPT_IMAGE;
  const shown = preview ?? (removed ? null : current);
  const shownName = preview ? pickedName : (current ?? "");
  const isPdf = shownName.toLowerCase().endsWith(".pdf");

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const pick = (file: File | null) => {
    setError("");
    if (!file) return setPreview(null);

    const reject = (message: string) => {
      if (ref.current) ref.current.value = "";
      setPreview(null);
      setError(message);
    };
    if (!accept.split(",").includes(file.type)) {
      return reject(
        isDocument
          ? "Faqat PDF, PNG, JPG, WEBP yoki AVIF fayl bo‘lishi mumkin."
          : "Faqat PNG, JPG, WEBP yoki AVIF rasm bo‘lishi mumkin.",
      );
    }
    if (file.size > MAX_BYTES) return reject("Fayl hajmi 10 MB dan oshmasligi kerak.");

    setPickedName(file.name);
    setPreview(URL.createObjectURL(file));
    setRemoved(false);
  };

  const clear = () => {
    if (ref.current) ref.current.value = "";
    setError("");
    setPreview(null);
    setRemoved(true);
  };

  return (
    <section className={CARD}>
      <h2 className="font-display text-[16px] font-bold">{label}</h2>
      <p className="mt-1 text-[10px] text-body">{note}</p>

      {removed && !preview && <input type="hidden" name={`remove_${name}`} value="on" />}

      <div className="mt-4 grid h-[160px] place-items-center overflow-hidden rounded-[16px] border border-dashed border-[#cfe2e0] bg-[#f5fbfa]">
        {shown ? (
          isPdf ? (
            <span className="px-4 text-center">
              <span className="block text-[26px]">📄</span>
              <span className="mt-2 block text-[10px] font-semibold break-all">
                {shownName.split("/").pop()}
              </span>
            </span>
          ) : (
            // Blob preview — optimizatsiyasiz ko'rsatiladi.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt={label} className="max-h-full max-w-full object-contain p-3" />
          )
        ) : (
          <span className="text-[10px] text-body">Fayl tanlanmagan</span>
        )}
      </div>

      <input
        ref={ref}
        type="file"
        name={name}
        accept={accept}
        onChange={(e) => pick(e.target.files?.[0] ?? null)}
        className="sr-only"
        id={`file-${name}`}
      />
      <div className="mt-3 flex gap-2">
        <label
          htmlFor={`file-${name}`}
          className="h-9 flex-1 cursor-pointer rounded-[11px] border border-[#dce9e8] text-center text-[10px] font-bold leading-9"
        >
          {shown ? "Almashtirish" : "Tanlash"}
        </label>
        {shown && !preview && current && (
          <a
            href={current}
            target="_blank"
            rel="noreferrer"
            className="grid h-9 cursor-pointer place-items-center rounded-[11px] border border-brand-200 px-4 text-[10px] font-bold text-brand-700"
          >
            Ko‘rish
          </a>
        )}
        {shown && (
          <button
            type="button"
            onClick={clear}
            className="h-9 cursor-pointer rounded-[11px] border border-[#f0dede] px-4 text-[10px] font-bold text-[#9d4c4c]"
          >
            O‘chirish
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-[10px] font-semibold text-[#9d4c4c]">{error}</p>}
    </section>
  );
}

/* ── Bitta tilning barcha maydonlari ──────────────────────────────────── */

function LocaleBlock({
  prefix,
  value,
  onChange,
}: {
  prefix: "ru" | "uz";
  value: ProductLocale;
  onChange: (next: ProductLocale) => void;
}) {
  const d = value.detail;
  const setDetail = (patch: Partial<ProductDetail>) =>
    onChange({ ...value, detail: { ...d, ...patch } });
  const setStat = (i: number, v: string) => {
    const stats = [...value.stats] as [string, string, string];
    stats[i] = v;
    onChange({ ...value, stats });
  };

  return (
    <div className="grid gap-8">
      <div>
        <SectionTitle note="Katalog kartochkasi va pasport hero qismida ko‘rinadi.">
          Katalog
        </SectionTitle>
        <div className="grid gap-4">
          <Field
            label="Mahsulot nomi"
            name={`${prefix}_name`}
            value={value.name}
            onChange={(v) => onChange({ ...value, name: v })}
            hint={
              prefix === "ru"
                ? "Ruscha sahifada shu nom chiqadi (masalan «Фимбриолок Плюс»)."
                : "O‘zbekcha sahifada shu nom chiqadi (masalan «Fimbriolok Plus»)."
            }
          />
          <Field
            label="Yo‘nalish"
            name={`${prefix}_category`}
            value={value.category}
            onChange={(v) => onChange({ ...value, category: v })}
          />
          <Field
            label="Tavsif"
            name={`${prefix}_description`}
            value={value.description}
            onChange={(v) => onChange({ ...value, description: v })}
            textarea
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Shakli" name={`${prefix}_s1`} value={value.stats[0]} onChange={(v) => setStat(0, v)} />
            <Field label="Qadoq" name={`${prefix}_s2`} value={value.stats[1]} onChange={(v) => setStat(1, v)} />
            <Field label="Qabul" name={`${prefix}_s3`} value={value.stats[2]} onChange={(v) => setStat(2, v)} />
          </div>
        </div>
      </div>

      <div>
        <SectionTitle note="Hero ostidagi ogohlantirish va 4 ta faktdan ikkitasi.">
          Pasport — yuqori qism
        </SectionTitle>
        <div className="grid gap-4">
          <Field
            label="Ogohlantirish"
            value={d.warning}
            onChange={(v) => setDetail({ warning: v })}
            textarea
            rows={3}
            hint="Bo‘sh qoldirilsa, ogohlantirish qutisi ko‘rinmaydi."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Xomashyo (fakt)" value={d.raw} onChange={(v) => setDetail({ raw: v })} />
            <Field
              label="Ishlab chiqaruvchi (fakt)"
              value={d.manufacturer}
              onChange={(v) => setDetail({ manufacturer: v })}
            />
          </div>
        </div>
      </div>

      <div>
        <SectionTitle note="Bo‘sh qolsa «Tarkib» bo‘limi sahifada ko‘rinmaydi.">
          Tarkib
        </SectionTitle>
        <CompositionEditor items={d.composition} onChange={(v) => setDetail({ composition: v })} />
      </div>

      <div>
        <SectionTitle note="Sarlavhaning oxirgi so‘zi avtomatik urg‘u rangida chiqadi.">
          Qo‘llash usuli
        </SectionTitle>
        <div className="grid gap-4">
          <Field
            label="Sarlavha"
            value={d.usageTitle}
            onChange={(v) => setDetail({ usageTitle: v })}
            hint="Masalan: «Kuniga 1 kapsula»"
          />
          <Field
            label="Matn"
            value={d.usageBody}
            onChange={(v) => setDetail({ usageBody: v })}
            textarea
          />
          <div className="sm:w-[160px]">
            <Field
              label="Kuniga necha marta"
              value={d.dailyDose}
              onChange={(v) => setDetail({ dailyDose: v })}
              hint="Faqat raqam, masalan «1». Sahifadagi katta belgida shu son chiqadi."
            />
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>Qabuldan oldin</SectionTitle>
        <ListEditor
          items={d.before}
          onChange={(v) => setDetail({ before: v })}
          addLabel="Qator qo‘shish"
          placeholder="Masalan: Qadoqning butunligini tekshiring."
        />
      </div>

      <div>
        <SectionTitle note="Bo‘sh qolsa «Xavfsizlik» bo‘limi ko‘rinmaydi.">
          Xavfsizlik
        </SectionTitle>
        <SafetyEditor items={d.safety} onChange={(v) => setDetail({ safety: v })} />
      </div>

      <div>
        <SectionTitle note="Bo‘sh qolsa «Kelib chiqishi» bo‘limi ko‘rinmaydi.">
          Kelib chiqishi
        </SectionTitle>
        <div className="grid gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDetail({ origin: { ...d.origin, type: "local" } })}
              className={`h-10 flex-1 cursor-pointer rounded-[11px] border px-4 text-[10px] font-bold transition-colors ${
                d.origin.type === "imported"
                  ? "border-[#dce9e8] text-body"
                  : "border-accent bg-brand-100/50 text-brand-700"
              }`}
            >
              Mahalliy ishlab chiqarilgan
            </button>
            <button
              type="button"
              onClick={() => setDetail({ origin: { ...d.origin, type: "imported" } })}
              className={`h-10 flex-1 cursor-pointer rounded-[11px] border px-4 text-[10px] font-bold transition-colors ${
                d.origin.type === "imported"
                  ? "border-accent bg-brand-100/50 text-brand-700"
                  : "border-[#dce9e8] text-body"
              }`}
            >
              Chet eldan import qilingan
            </button>
          </div>

          {d.origin.type === "imported" ? (
            <>
              <Field
                label="Davlat"
                value={d.origin.importedCountry}
                onChange={(v) => setDetail({ origin: { ...d.origin, importedCountry: v } })}
                hint="Masalan: «Germaniya». Sahifadagi bayroq shu nomdan aniqlanadi."
              />
              <Field
                label="Ishlab chiqaruvchi (to‘liq)"
                value={d.origin.importedFull}
                onChange={(v) => setDetail({ origin: { ...d.origin, importedFull: v } })}
                hint="Masalan: «EVERT Pharma AG · Germaniya»"
              />
            </>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Xomashyo davlati"
                  value={d.origin.rawCountry}
                  onChange={(v) => setDetail({ origin: { ...d.origin, rawCountry: v } })}
                />
                <Field
                  label="Ishlab chiqarish davlati"
                  value={d.origin.makeCountry}
                  onChange={(v) => setDetail({ origin: { ...d.origin, makeCountry: v } })}
                />
              </div>
              <Field
                label="Xomashyo (to‘liq)"
                value={d.origin.rawFull}
                onChange={(v) => setDetail({ origin: { ...d.origin, rawFull: v } })}
              />
              <Field
                label="Ishlab chiqaruvchi (to‘liq)"
                value={d.origin.manufacturerFull}
                onChange={(v) => setDetail({ origin: { ...d.origin, manufacturerFull: v } })}
              />
            </>
          )}
          <Field
            label="CureLife roli"
            value={d.origin.role}
            onChange={(v) => setDetail({ origin: { ...d.origin, role: v } })}
          />
        </div>
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
      {pending ? "Saqlanmoqda..." : isNew ? "Mahsulotni qo‘shish" : "O‘zgarishlarni saqlash"}
    </button>
  );
}

/* ── Forma ────────────────────────────────────────────────────────────── */

export function ProductForm({
  product,
  isNew,
}: {
  product: Product;
  isNew: boolean;
}) {
  const [state, formAction] = useActionState<ProductFormState, FormData>(saveProduct, {});

  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [number, setNumber] = useState(product.number);
  const [visible, setVisible] = useState(product.visible);
  const [ru, setRu] = useState<ProductLocale>(product.ru);
  const [uz, setUz] = useState<ProductLocale>(product.uz);

  const [translating, setTranslating] = useState<"ru" | "uz" | null>(null);
  const [translateError, setTranslateError] = useState("");

  const [aiText, setAiText] = useState("");
  const [aiFilling, setAiFilling] = useState(false);
  const [aiError, setAiError] = useState("");

  const fillWithAi = async () => {
    setAiFilling(true);
    setAiError("");
    const result = await fillProduct(aiText);
    setAiFilling(false);
    if (!result.ok) return setAiError(result.error);

    setUz(result.data);
    // Bosh "Nomi"/slug faqat bo'sh bo'lsa to'ldiriladi — mavjud qiymatga tegilmaydi.
    if (!name.trim() && result.data.name) {
      setName(result.data.name);
      if (!slugEdited) setSlug(slugify(result.data.name));
    }
  };

  const translate = async (from: "ru" | "uz") => {
    setTranslating(from);
    setTranslateError("");
    const result = await translateProduct({
      from,
      name,
      fields: from === "ru" ? ru : uz,
    });
    setTranslating(null);
    if (!result.ok) return setTranslateError(result.error);
    if (from === "ru") setUz(result.data);
    else setRu(result.data);
  };

  return (
    <form action={formAction} className="grid gap-5 xl:grid-cols-[1.55fr_.85fr] xl:items-start">
      <input type="hidden" name="id" value={product.id} />
      {/* Ro'yxatlar (tarkib, xavfsizlik...) JSON bo'lib yuboriladi. */}
      <input type="hidden" name="ru_detail" value={JSON.stringify(ru.detail)} />
      <input type="hidden" name="uz_detail" value={JSON.stringify(uz.detail)} />

      <div className="grid gap-5">
        <section className={CARD}>
          <h2 className="font-display text-[18px] font-bold">AI yordamida to‘ldirish</h2>
          <p className="mt-1 text-[10px] text-body">
            Mahsulot haqidagi to‘liq ma’lumotni (qadoqdagi yozuv, tavsif, tarkib va h.k.)
            shu joyga joylang — «To‘ldirish» bosilganda o‘zbekcha maydonlar avtomatik
            to‘ldiriladi. Keyin ma’lumotni tekshirib, «⇄ Tarjima qilish» bilan ruschaga o‘tkazasiz.
          </p>
          <textarea
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            rows={8}
            placeholder="Masalan: mahsulot nomi, tarkibi, qo‘llash usuli, ogohlantirishlar, ishlab chiqaruvchi va boshqa ma’lumotlarni shu yerga joylang..."
            className={`${INPUT} mt-4 resize-none leading-[1.6]`}
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => void fillWithAi()}
              disabled={aiFilling || !aiText.trim()}
              className="bg-brand-gradient h-10 cursor-pointer rounded-[12px] px-5 text-[10px] font-bold text-white disabled:opacity-50"
            >
              {aiFilling ? "To‘ldirilmoqda..." : "To‘ldirish"}
            </button>
            {aiError && (
              <p className="text-[10px] font-semibold text-[#9d4c4c]">{aiError}</p>
            )}
          </div>
        </section>

        <section className={CARD}>
          <h2 className="font-display text-[18px] font-bold">Asosiy ma’lumot</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-[1.4fr_1fr_.6fr]">
            <Field
              label="Nomi"
              name="name"
              value={name}
              onChange={(v) => {
                setName(v);
                if (!slugEdited) setSlug(slugify(v));
              }}
              hint="Zaxira nom: til uchun alohida nom kiritilmagan bo‘lsa ishlatiladi."
            />
            <Field
              label="Havola (slug)"
              name="slug"
              value={slug}
              onChange={(v) => {
                setSlugEdited(true);
                setSlug(v);
              }}
              hint={`/products/${slug || "…"}`}
            />
            <Field label="Tartib №" name="number" value={number} onChange={setNumber} />
          </div>
        </section>

        <section className={CARD}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eaf1f0] pb-5">
            <div>
              <h2 className="font-display text-[18px] font-bold">Ruscha matn</h2>
              <p className="mt-1 text-[10px] text-body">Saytning «Русский» versiyasi uchun.</p>
            </div>
            <button
              type="button"
              onClick={() => void translate("ru")}
              disabled={translating !== null}
              className="h-10 cursor-pointer rounded-[12px] border border-brand-200 bg-brand-100/50 px-4 text-[10px] font-bold text-brand-700 transition-colors hover:bg-brand-100 disabled:opacity-50"
            >
              {translating === "ru" ? "Tarjima qilinmoqda..." : "⇄ Hammasini o‘zbekchaga tarjima qilish"}
            </button>
          </div>
          <div className="mt-7">
            <LocaleBlock prefix="ru" value={ru} onChange={setRu} />
          </div>
        </section>

        <section className={CARD}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eaf1f0] pb-5">
            <div>
              <h2 className="font-display text-[18px] font-bold">O‘zbekcha matn</h2>
              <p className="mt-1 text-[10px] text-body">Saytning «O‘zbekcha» versiyasi uchun.</p>
            </div>
            <button
              type="button"
              onClick={() => void translate("uz")}
              disabled={translating !== null}
              className="h-10 cursor-pointer rounded-[12px] border border-brand-200 bg-brand-100/50 px-4 text-[10px] font-bold text-brand-700 transition-colors hover:bg-brand-100 disabled:opacity-50"
            >
              {translating === "uz" ? "Tarjima qilinmoqda..." : "⇄ Hammasini ruschaga tarjima qilish"}
            </button>
          </div>
          <div className="mt-7">
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
        <FileField
          label="Katalog rasmi"
          note="Katalogdagi kartochkada ko‘rinadi."
          name="image"
          current={product.image}
        />
        <FileField
          label="Pasport rasmi"
          note="Mahsulot sahifasidagi katta rasm. Bo‘lmasa katalog rasmi ishlatiladi."
          name="detailImage"
          current={product.detailImage}
        />
        <FileField
          label="Sertifikat"
          note="PDF yoki rasm. Sahifada «Hujjatlar» bo‘limida ochiladi."
          name="certificate"
          current={product.certificate}
          document
        />
        <FileField
          label="Yo‘riqnoma (instruksiya)"
          note="PDF yoki rasm. Saytda alohida tugma bilan ochiladi."
          name="instruction"
          current={product.instruction}
          document
        />
        <FileField
          label="Ishlab chiqaruvchi logotipi"
          note="Faqat «Kelib chiqishi» bo‘limida «Chet eldan import qilingan» tanlanganda ko‘rinadi. Bo‘lmasa davlat bayrog‘i chiziladi."
          name="originLogo"
          current={product.originLogo}
        />

        <section className={CARD}>
          <h2 className="font-display text-[16px] font-bold">Holat</h2>
          <label className="mt-4 flex cursor-pointer items-center gap-3 text-[11px] font-bold">
            <input
              type="checkbox"
              name="visible"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="size-4 accent-[#0ba7a6]"
            />
            Saytda ko‘rinsin
          </label>
          <p className="mt-3 text-[10px] leading-5 text-body">
            Yashirilgan mahsulot katalogda ham, pasport sahifasida ham ochilmaydi.
          </p>
        </section>

        {state.error && (
          <p className="rounded-[14px] border border-[#f0dede] bg-[#fdf6f6] px-5 py-4 text-[11px] text-[#9d4c4c]">
            {state.error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <SubmitButton isNew={isNew} />
          <Link
            href="/admin?view=products"
            className="grid h-12 cursor-pointer place-items-center rounded-[13px] border border-[#dce9e8] bg-white px-6 text-[11px] font-bold"
          >
            Bekor qilish
          </Link>
        </div>
      </div>
    </form>
  );
}
