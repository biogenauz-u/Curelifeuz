"use server";

import { revalidatePath } from "next/cache";

import { addMessage } from "@/lib/admin/store";

export type ContactState = { ok?: boolean; error?: string };

const MAX = { name: 120, email: 160, phone: 40, topic: 120, text: 4000 };

function clean(value: FormDataEntryValue | null, max: number): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export async function sendMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = clean(formData.get("name"), MAX.name);
  const email = clean(formData.get("email"), MAX.email);
  const phone = clean(formData.get("phone"), MAX.phone);
  const topic = clean(formData.get("topic"), MAX.topic);
  const text = String(formData.get("message") ?? "").trim().slice(0, MAX.text);

  if (!name || !email || !text) {
    return { error: "Ism, e-mail va xabar maydonlarini to‘ldiring." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "E-mail manzil noto‘g‘ri ko‘rinishda." };
  }

  try {
    await addMessage({ name, email, phone, topic, text });
  } catch {
    return { error: "Xabarni saqlab bo‘lmadi. Keyinroq urinib ko‘ring." };
  }

  revalidatePath("/admin");
  return { ok: true };
}
