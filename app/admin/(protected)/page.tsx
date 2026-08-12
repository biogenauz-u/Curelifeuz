import type { Metadata } from "next";

import { AdminPanel } from "@/components/admin/AdminPanel";
import {
  getArticles,
  getCertificates,
  getMessages,
  getPagesMeta,
  getProducts,
  getSettings,
  getVisitStats,
} from "@/lib/admin/store";
import { parseView } from "@/lib/admin/views";

export const metadata: Metadata = {
  title: "CureLife Admin",
  description: "CureLife sayti boshqaruv paneli",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: PageProps<"/admin">) {
  const [{ view }, products, articles, certificates, messages, settings, pages, visits] =
    await Promise.all([
      searchParams,
      getProducts(),
      getArticles(),
      getCertificates(),
      getMessages(),
      getSettings(),
      getPagesMeta(),
      getVisitStats(),
    ]);

  return (
    <AdminPanel
      products={products}
      articles={articles}
      certificates={certificates}
      messages={messages}
      settings={settings}
      pages={pages}
      visits={visits}
      initialView={parseView(view)}
    />
  );
}
