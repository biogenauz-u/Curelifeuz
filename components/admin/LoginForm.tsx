"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { login, type LoginState } from "@/app/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand-gradient mt-6 h-12 w-full cursor-pointer rounded-[13px] text-[12px] font-bold text-white transition-opacity disabled:opacity-60"
    >
      {pending ? "Tekshirilmoqda…" : "Kirish"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="mt-7">
      <label className="block text-[10px] font-bold text-label">
        Login
        <input
          name="username"
          autoComplete="username"
          required
          autoFocus
          className="mt-2 h-12 w-full rounded-[13px] border border-[#dce9e8] px-4 text-[13px] font-normal text-ink-deep outline-none focus:border-accent"
        />
      </label>

      <label className="mt-4 block text-[10px] font-bold text-label">
        Parol
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 h-12 w-full rounded-[13px] border border-[#dce9e8] px-4 text-[13px] font-normal text-ink-deep outline-none focus:border-accent"
        />
      </label>

      {state.error && (
        <p
          role="alert"
          className="mt-4 rounded-[12px] bg-[#fdeceb] p-3 text-[11px] font-semibold text-[#a23b33]"
        >
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
