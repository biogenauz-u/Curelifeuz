"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  verifyPassword,
} from "@/lib/admin/auth";

export type LoginState = { error?: string };

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  // Parolni ketma-ket terib ko'rishni sekinlashtirish uchun kichik kechikish.
  await new Promise((r) => setTimeout(r, 400));

  const expectedUser = process.env.ADMIN_USERNAME ?? "admin";
  const ok = username === expectedUser && (await verifyPassword(password));

  if (!ok) {
    // Qaysi maydon xato ekanini aytmaymiz — bu ma'lumot sizib chiqishi.
    return { error: "Login yoki parol noto‘g‘ri." };
  }

  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
