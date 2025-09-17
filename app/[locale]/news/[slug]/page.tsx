export const dynamic = "force-static";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Instagram, Linkedin, Mail, MapPin, Phone, ArrowLeft } from "lucide-react";
import { getSupabaseStaticClient } from "@/lib/supabase/static";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { formatDateUTC } from "@/lib/utils";
import { ImageCarousel } from "@/components/shared/ImageCarousel";

const locales = ["en", "az", "ru"] as const;

type NewsRow = { id: string; slug: string | null; published_at: string | null; created_at: string | null; title: string; excerpt: string | null; category: string | null; image_url: string | null; images?: string[] | null; content: string | null };

export async function generateStaticParams() {
  const supabase = getSupabaseStaticClient();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const table = locale === "az" ? "news_az" : "news";
    const { data } = await supabase
      .from(table)
      .select("slug")
      .not("published_at", "is", null);
    const slugs = (data ?? []).map((r: any) => r.slug).filter(Boolean) as string[];
    params.push(...slugs.map((slug) => ({ locale, slug })));
  }
  return params;
}

export default async function NewsDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const tHeader = await getTranslations({ locale, namespace: "Header" });
  const tFooter = await getTranslations({ locale, namespace: "Footer" });
  const tNewsDetail = await getTranslations({ locale, namespace: "NewsDetail" });
  const supabase = getSupabaseStaticClient();
  const table = locale === "az" ? "news_az" : "news";
  const { data, error } = await supabase
    .from(table)
    .select("id, title, excerpt, content, category, image_url, images, published_at, created_at, slug")
    .eq("slug", slug)
    .maybeSingle<NewsRow>();
  if (error || !data || !data.published_at) return notFound();

  const displayDate = data.created_at ?? data.published_at ?? "1970-01-01T00:00:00.000Z";
  const images = (data.images && data.images.length > 0) ? data.images : [data.image_url ?? "/news/thumb.jpg"]; 

  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] text-[var(--color-brand-navy)]">
      {/* Header */}
      <SiteHeader locale={locale} />

      <article>
        <div className="container-max px-6 lg:px-10 py-10">
          <div className="mb-6">
            <Button asChild className="rounded-full bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)]/90">
              <Link href={`/${locale}/news`} className="inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> {tNewsDetail("backToNews")}</Link>
            </Button>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold">{data.title}</h1>
          <div className="mt-2 text-sm text-neutral-600 flex items-center gap-4">
            <span>{formatDateUTC(displayDate, locale, { year: "numeric", month: "long", day: "2-digit" })}</span>
            {data.category ? <span className="inline-flex items-center rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium">{data.category}</span> : null}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-5 lg:col-span-6">
              <ImageCarousel images={images} alt={data.title} aspectClassName="h-64 md:h-80" />
            </div>
            <div className="md:col-span-7 lg:col-span-6">
              {data.excerpt ? (
                <p className="text-base md:text-lg text-neutral-800">{data.excerpt}</p>
              ) : null}
            </div>
          </div>

          <Separator className="my-8" />

          <div className="prose max-w-none prose-p:my-4 prose-headings:mt-8 prose-img:rounded-xl">
            {data.content ? (
              <div dangerouslySetInnerHTML={{ __html: data.content }} />
            ) : (
              <p>{tNewsDetail("contentComing")}</p>
            )}
          </div>
        </div>
      </article>

      {/* Footer same as other pages */}
      <footer className="bg-[var(--color-brand-navy)] text-[var(--color-brand-cream)]">
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, var(--color-brand-gold), var(--color-brand-navy))` }} />
        <div className="container-max px-6 lg:px-10 py-12 grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full bg-white border border-[var(--color-brand-gold)] overflow-hidden grid place-items-center">
                <Image src="/logo/logo.jpg" alt="Logo" fill className="object-contain p-0.5" />
              </div>
              <span className="font-semibold text-lg">MecHack Qarabag</span>
            </div>
            <p className="mt-3 text-sm/6 opacity-85 max-w-xs">
              {tFooter("tagline")}
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
            <div className="font-semibold mb-3">{tFooter("quickLinks")}</div>
            <ul className="space-y-2 text-sm/6 opacity-90">
              <li><Link href={`/${locale}/about`} className="hover:underline">{tHeader("about")}</Link></li>
              <li><Link href={`/${locale}/projects-events`} className="hover:underline">{tHeader("projectsEvents")}</Link></li>
              <li><Link href={`/${locale}/news`} className="hover:underline">{tHeader("news")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-3">{tFooter("programs")}</div>
            <ul className="space-y-2 text-sm/6 opacity-90">
              <li><Link href="https://www.firstlegoleague.org/" target="_blank" className="hover:underline">FIRST LEGO League</Link></li>
              <li><Link href="https://www.firstinspires.org/robotics/ftc" target="_blank" className="hover:underline">FIRST Tech Challenge</Link></li>
              <li><Link href="https://www.firstinspires.org/robotics/frc" target="_blank" className="hover:underline">FIRST Robotics Competition</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-3">{tFooter("contact")}</div>
            <ul className="space-y-2 text-sm/6 opacity-95">
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5" /> mechackqarabag@gmail.com</li>
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5" /> +994 70 595 10 30</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /> Baku, Azerbaijan</li>
            </ul>
          </div>
        </div>
        <Separator className="bg-white/10" />
        <div className="container-max px-6 lg:px-10 py-5 text-xs/6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between opacity-80">
          <div>© {new Date().getFullYear()} MecHack Qarabag. {tFooter("copyright")}</div>
        </div>
      </footer>
    </div>
  );
} 