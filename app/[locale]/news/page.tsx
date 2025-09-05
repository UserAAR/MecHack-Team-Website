export const dynamic = "force-static";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Menu, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getSupabaseStaticClient } from "@/lib/supabase/static";
import { MobileNav } from "@/components/shared/MobileNav";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { getTranslations } from "next-intl/server";

const BRAND = { cream: "#f5f2e1", navy: "#000080", gold: "#e38d1a" };

const locales = ["en", "az", "ru"] as const;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type NewsItem = { id: string; title: string; excerpt: string; category: string; date: string; image: string; link: string };

type Row = { id: string; title: string; excerpt: string | null; category: string | null; image_url: string | null; published_at: string | null; slug: string | null };

async function getNews(locale: string): Promise<NewsItem[]> {
  const supabase = getSupabaseStaticClient();
  const table = locale === "az" ? "news_az" : "news";
  const { data } = await supabase
    .from(table)
    .select("id, title, excerpt, category, image_url, published_at, slug")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  const rows = (data ?? []) as Row[];
  return rows.map((n) => ({
    id: n.id,
    title: n.title,
    excerpt: n.excerpt ?? "",
    category: n.category ?? "Update",
    date: n.published_at ?? new Date().toISOString(),
    image: n.image_url ?? "/news/thumb.jpg",
    link: `/${locale}/news/${n.slug ?? n.id}`,
  }));
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = await getNews(locale);
  const tHeader = await getTranslations({ locale, namespace: "Header" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tNews = await getTranslations({ locale, namespace: "News" });

  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] text-[var(--color-brand-navy)]">
      <header className="sticky top-0 z-50 transition-colors bg-[rgba(245,242,225,0.9)] backdrop-blur">
        <div className="container-max px-6 lg:px-10 py-3 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-transparent overflow-hidden grid place-items-center">
              <Image src="/logo/logo.jpg" alt="Logo" fill className="object-contain p-0.5" />
            </div>
            <span className="font-semibold tracking-wide">MecHack Qarabag</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href={`/${locale}/about`}>{tHeader("about")}</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href={`/${locale}/projects-events`}>{tHeader("projectsEvents")}</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href={`/${locale}/news`}>{tHeader("news")}</NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <LocaleSwitcher currentLocale={locale} />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden"><Menu className="w-5 h-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right">
              <MobileNav locale={locale} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

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
                <Image src={n.image} alt={n.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.6),rgba(0,0,0,0.05))]" />
                <Badge className="absolute left-3 top-3 bg-white/90 text-black">{n.category}</Badge>
              </div>
              <div className="p-4">
                <div className="text-xl line-clamp-2 font-semibold">{n.title}</div>
                <p className="mt-2 text-sm text-neutral-700 line-clamp-2">{n.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(n.date).toLocaleDateString(locale, { year: "numeric", month: "short", day: "2-digit" })}</span>
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