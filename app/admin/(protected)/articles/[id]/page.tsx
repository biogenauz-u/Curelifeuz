import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleFormPage } from "@/components/admin/ArticleFormPage";
import { getArticles } from "@/lib/admin/store";

export const metadata: Metadata = {
  title: "Maqolani tahrirlash · CureLife Admin",
  robots: { index: false, follow: false },
};

export default async function EditArticlePage({
  params,
}: PageProps<"/admin/articles/[id]">) {
  const { id } = await params;
  const article = (await getArticles()).find((a) => a.id === id);
  if (!article) notFound();

  return <ArticleFormPage article={article} isNew={false} />;
}
