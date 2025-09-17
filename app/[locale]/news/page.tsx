export const dynamic = "force-static";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getSupabaseStaticClient } from "@/lib/supabase/static";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { formatDateUTC } from "@/lib/utils";
import { ImageCarousel } from "@/components/shared/ImageCarousel";

const BRAND = { cream: "#f5f2e1", navy: "#000080", gold: "#e38d1a" };

const locales = ["en", "az", "ru"] as const;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type NewsItem = { id: string; title: string; excerpt: string; category: string; date: string; images: string[]; link: string };

type Row = { id: string; title: string; excerpt: string | null; category: string | null; image_url: string | null; images?: string[] | null; published_at: string | null; created_at: string | null; slug: string | null };

async function getNews(locale: string): Promise<NewsItem[]> {
  const supabase = getSupabaseStaticClient();
  const table = locale === "az" ? "news_az" : "news";
  const { data } = await supabase
    .from(table)
    .select("id, title, excerpt, category, image_url, images, published_at, created_at, slug")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  const rows = (data ?? []) as Row[];
  return rows.map((n) => {
    const imgs = (n.images && n.images.length > 0) ? n.images : [n.image_url ?? "/news/thumb.jpg"];
    return {
      id: n.id,
      title: n.title,
      excerpt: n.excerpt ?? "",
      category: n.category ?? "Update",
      date: n.created_at ?? n.published_at ?? "1970-01-01T00:00:00.000Z",
      images: imgs,
      link: `/${locale}/news/${n.slug ?? n.id}`,
    } as NewsItem;
  });
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await getNews(locale);
  const tHeader = await getTranslations({ locale, namespace: "Header" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tNews = await getTranslations({ locale, namespace: "News" });

  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] text-[var(--color-brand-navy)]">
      {/* Header */}
      <SiteHeader locale={locale} />

      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="container-max px-6 lg:px-10 py-16">
          <h1 className="text-4xl md:text-6xl font-extrabold">{tHeader("news")}</h1>
          <p className="mt-4 max-w-3xl text-lg text-neutral-700">{tNews("title")}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max px-6 lg:px-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => (
            <div key={n.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow group rounded-xl bg-white">
              <div className="relative h-56">
                <ImageCarousel images={n.images.slice(0, 6)} alt={n.title} aspectClassName="h-56" controlsOnHover />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.6),rgba(0,0,0,0.05))] pointer-events-none" />
                <Badge className="absolute left-3 top-3 bg-white/90 text-black">{n.category}</Badge>
              </div>
              <div className="p-4">
                <div className="text-xl line-clamp-2 font-semibold">{n.title}</div>
                <p className="mt-2 text-sm text-neutral-700 line-clamp-2">{n.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDateUTC(n.date, locale, { year: "numeric", month: "short", day: "2-digit" })}</span>
                </div>
                <Button asChild variant="link" className="px-0 text-[var(--color-brand-gold)]"><Link href={n.link}>{tNews("readMore")}</Link></Button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center text-neutral-600">{tCommon("noNews")}</div>
          )}
        </div>
      </section>

      <footer className="bg-[var(--color-brand-navy)] text-[var(--color-brand-cream)]">
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${BRAND.gold}, ${BRAND.navy})` }} />
        <div className="container-max px-6 lg:px-10 py-12 grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full bg-white border border-[var(--color-brand-gold)] overflow-hidden grid place-items-center">
                <Image src="/logo/logo.jpg" alt="Logo" fill className="object-contain p-0.5" />
              </div>
              <span className="font-semibold text-lg">MecHack Qarabag</span>
            </div>
            <p className="mt-3 text-sm/6 opacity-85 max-w-xs">
              {/* footer text via i18n */}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link href="https://www.instagram.com/mechackteam" aria-label="Instagram" className="inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="https://www.linkedin.com/in/mechack-team-726b52258/" target="_blank" aria-label="LinkedIn" className="inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20">
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="https://www.youtube.com/@Qaraba%C4%9FMechack" target="_blank" aria-label="YouTube" className="inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.002 3.002 0 0 0-2.113-2.126C19.585 3.5 12 3.5 12 3.5s-7.585 0-9.385.56A3.002 3.002 0 0 0 .502 6.186 31.54 31.54 0 0 0 0 12a31.54 31.54 0 0 0 .502 5.814 3.002 3.002 0 0 0 2.113 2.126C4.415 20.5 12 20.5 12 20.5s7.585 0 9.385-.56a3.002 3.002 0 0 0 2.113-2.126A31.54 31.54 0 0 0 24 12a31.54 31.54 0 0 0-.502-5.814ZM9.75 15.5v-7l6 3.5-6 3.5Z"/></svg>
              </Link>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-3">{tHeader("quickLinks")}</div>
            <ul className="space-y-2 text-sm/6 opacity-90">
              <li><Link href={`/${locale}/about`} className="hover:underline">{tHeader("about")}</Link></li>
              <li><Link href={`/${locale}/projects-events`} className="hover:underline">{tHeader("projectsEvents")}</Link></li>
              <li><Link href={`/${locale}/news`} className="hover:underline">{tHeader("news")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-3">{tHeader("programs")}</div>
            <ul className="space-y-2 text-sm/6 opacity-90">
              <li><Link href="https://www.firstlegoleague.org/" target="_blank" className="hover:underline">FIRST LEGO League</Link></li>
              <li><Link href="https://www.firstinspires.org/robotics/ftc" target="_blank" className="hover:underline">FIRST Tech Challenge</Link></li>
              <li><Link href="https://www.firstinspires.org/robotics/frc" target="_blank" className="hover:underline">FIRST Robotics Competition</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-3">{tHeader("contact")}</div>
            <ul className="space-y-2 text-sm/6 opacity-95">
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5" /> mechackqarabag@gmail.com</li>
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5" /> +994 70 595 10 30</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /> Baku, Azerbaijan</li>
            </ul>
          </div>
        </div>
        <Separator className="bg-white/10" />
        <div className="container-max px-6 lg:px-10 py-5 text-xs/6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between opacity-80">
          <div>© {new Date().getFullYear()} MecHack Qarabag.</div>
        </div>
      </footer>
    </div>
  );
} 