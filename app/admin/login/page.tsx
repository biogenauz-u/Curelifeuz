import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/LoginForm";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "CureLife Admin — kirish",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Allaqachon kirgan bo'lsa — to'g'ridan-to'g'ri panelga.
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (await verifySessionToken(token)) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-[#f2f8f7] px-4 py-16">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/curelife-logo.svg"
            alt="CureLife"
            width={182}
            height={41}
            unoptimized
            className="h-[34px] w-auto"
          />
        </div>

        <div className="rounded-[24px] border border-[#dfeae9] bg-white p-8 shadow-[0_20px_60px_rgba(8,126,125,.08)]">
          <h1 className="font-display text-[24px] font-bold tracking-[-.03em] text-ink-deep">
            Boshqaruv paneli
          </h1>
          <p className="mt-2 text-[12px] text-body">
            Davom etish uchun login va parolni kiriting.
          </p>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-[11px] text-body">
          <a href="/" className="transition-colors hover:text-accent">
            ← Saytga qaytish
          </a>
        </p>
      </div>
    </main>
  );
}
