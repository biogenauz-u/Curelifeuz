import type { Metadata } from "next";

import { ArticleFormPage } from "@/components/admin/ArticleFormPage";
import type { Article } from "@/lib/admin/store";

export const metadata: Metadata = {
  title: "Yangi maqola · CureLife Admin",
  robots: { index: false, follow: false },
};

export default function NewArticlePage() {
  const empty: Article = {
    id: "",
    slug: "",
    image: null,
    views: 0,
    publishedAt: new Date().toISOString().slice(0, 10),
    ru: { title: "", body: "" },
    uz: { title: "", body: "" },
  };

  return <ArticleFormPage article={empty} isNew />;
}
