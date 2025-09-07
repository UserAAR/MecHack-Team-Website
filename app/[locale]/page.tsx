export const dynamic = "force-static";

import HomeClient, { LatestNewsItem } from "./HomeClient";
import { getSupabaseStaticClient } from "@/lib/supabase/static";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = getSupabaseStaticClient();
  const table = locale === "az" ? "news_az" : "news";
  const { data } = await supabase
    .from(table)
    .select("id, title, excerpt, category, image_url, published_at, created_at, slug")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(3);
  const latestNews: LatestNewsItem[] = (data ?? []).map((n: any) => ({
    id: n.id,
    title: n.title,
    excerpt: n.excerpt ?? "",
    category: n.category ?? "Update",
    date: n.created_at ?? new Date().toISOString(),
    image: n.image_url ?? "/news/thumb.jpg",
    link: `/${locale}/news/${n.slug ?? n.id}`,
  }));
  return <HomeClient locale={locale} latestNews={latestNews} />;
} 