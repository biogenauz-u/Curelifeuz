"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { sendMessage, type ContactState } from "@/app/contact/actions";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand-gradient mt-6 inline-flex h-12 cursor-pointer items-center gap-4 rounded-[14px] px-5 text-[12px] font-bold text-white transition-opacity disabled:opacity-60"
    >
      {pending ? "Yuborilmoqda…" : label} <ArrowRightIcon className="size-4" />
    </button>
  );
}

export function ContactForm() {
  const { t } = useLanguage();
  const f = t.contactPage.form;
  const [state, formAction] = useActionState<ContactState, FormData>(
    sendMessage,
    {},
  );

  const fields = [
    { label: f.name, name: "name", placeholder: f.namePlaceholder, type: "text" },
    { label: f.phone, name: "phone", placeholder: "+998 90 123 45 67", type: "tel" },
    { label: f.email, name: "email", placeholder: "name@example.com", type: "email" },
  ];

  return (
    <form
      action={formAction}
      className="rounded-[30px] bg-white p-7 shadow-[0_20px_65px_rgba(8,126,125,.07)] sm:p-10"
    >
      <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <SectionLabel>{f.label}</SectionLabel>
          <h2 className="mt-5 font-display text-[36px] leading-none font-bold tracking-[-.05em]">
            {f.title}
          </h2>
        </div>
        <p className="text-[12px] leading-5 text-body">{f.intro}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className="text-[10px] font-bold text-label">
            {field.label}
            <input
              required
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              className="mt-2 h-12 w-full rounded-[14px] border border-brand-200/40 px-4 text-[13px] font-normal text-ink-deep outline-none focus:border-accent"
            />
          </label>
        ))}

        <label className="text-[10px] font-bold text-label">
          {f.topic}
          <select
            name="topic"
            className="mt-2 h-12 w-full rounded-[14px] border border-brand-200/40 bg-white px-4 text-[13px] font-normal text-ink-deep outline-none"
          >
            {f.topics.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block text-[10px] font-bold text-label">
        {f.message}
        <textarea
          required
          name="message"
          placeholder={f.messagePlaceholder}
          rows={5}
          className="mt-2 w-full resize-none rounded-[14px] border border-brand-200/40 p-4 text-[13px] font-normal text-ink-deep outline-none focus:border-accent"
        />
      </label>

      <label className="mt-4 flex items-start gap-3 text-[9px] leading-4 text-body">
        <input required type="checkbox" className="mt-0.5 accent-[#0ba7a6]" />
        {f.consent}
      </label>

      <SubmitButton label={f.submit} />

      {state.ok && (
        <p
          role="status"
          className="mt-5 rounded-[14px] bg-brand-100 p-4 text-[12px] font-semibold text-brand-700"
        >
          {f.sent}
        </p>
      )}

      {state.error && (
        <p
          role="alert"
          className="mt-5 rounded-[14px] bg-[#fdeceb] p-4 text-[12px] font-semibold text-[#a23b33]"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}
