export const dynamic = "force-static";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Mail, Phone, Instagram, Linkedin, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MobileNav } from "@/components/shared/MobileNav";
import { getSupabaseStaticClient } from "@/lib/supabase/static";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { getTranslations } from "next-intl/server";

const BRAND = { cream: "#f5f2e1", navy: "#000080", gold: "#e38d1a" };

const locales = ["en", "az", "ru"] as const;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type ProjectRow = { id: string; title: string; summary: string | null; image_url: string | null; slug: string | null; published_at: string | null };
type EventRow = { id: string; title: string; description: string | null; location: string | null; event_date: string | null; image_url: string | null; published_at: string | null };

async function getData() {
  const supabase = getSupabaseStaticClient();
  const [projectsRes, eventsRes] = await Promise.all([
    supabase
      .from("projects")
      .select("id, title, summary, image_url, slug, published_at")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false }),
    supabase
      .from("events")
      .select("id, title, description, location, event_date, image_url, published_at")
      .not("published_at", "is", null)
      .order("event_date", { ascending: true }),
  ]);
  return {
    projects: (projectsRes.data ?? []) as ProjectRow[],
    events: (eventsRes.data ?? []) as EventRow[],
  };
}

export default async function ProjectsEventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { projects, events } = await getData();
  const tHeader = await getTranslations({ locale, namespace: "Header" });
  const tFooter = await getTranslations({ locale, namespace: "Footer" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tPE = await getTranslations({ locale, namespace: "ProjectsEvents" });

  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] text-[var(--color-brand-navy)]">
      {/* Header */}
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

      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="container-max px-6 lg:px-10 py-16">
          <h1 className="text-4xl md:text-6xl font-extrabold">{tPE("heroTitle")}</h1>
          <p className="mt-4 max-w-3xl text-lg text-neutral-700">{tPE("heroDescription")}</p>
        </div>
      </section>

      {/* Projects */}
      <section className="section-padding">
        <div className="container-max px-6 lg:px-10">
          <SectionHeader eyebrow={tPE("projectsEyebrow")} title={tPE("projectsTitle")} />
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((p) => (
              <Card key={p.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={p.image_url ?? "/news/thumb.jpg"} alt={p.title} fill className="object-cover" />
                </div>
                <CardHeader className="pb-0">
                  <CardTitle className="text-xl">{p.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-neutral-700">{p.summary ?? ""}</p>
                  <Button asChild variant="link" className="px-0 text-[var(--color-brand-gold)]"><Link href={`/${locale}/projects-events/${p.slug ?? p.id}`}>{tPE("readMore")}</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="section-padding bg-white">
        <div className="container-max px-6 lg:px-10">
          <SectionHeader eyebrow={tPE("eventsEyebrow")} title={tPE("eventsTitle")} />
          <div className="grid gap-6">
            {events.map((e) => (
              <div key={e.id} className="rounded-xl border border-black/5 bg-[var(--color-brand-cream)] p-5 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-lg bg-white px-3 py-2 text-sm font-semibold flex items-center gap-2 ring-1 ring-black/5">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(e.event_date ?? e.published_at ?? new Date().toISOString()).toLocaleDateString(locale, { month: "short", day: "2-digit", year: "numeric" })}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{e.title}</div>
                    <div className="text-sm text-neutral-600 flex items-center gap-2 mt-1"><MapPin className="w-4 h-4" /> {e.location}</div>
                    <p className="text-sm text-neutral-700 mt-2 max-w-2xl">{e.description}</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button asChild className="rounded-full bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)]/90">
                    <Link href={`/${locale}`}>{tCommon("details")}</Link>
                  </Button>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-sm text-neutral-600">{tCommon("noEvents")}</div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
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
              {tFooter("tagline")}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link href="#" aria-label="Instagram" className="inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="https://www.linkedin.com/in/mechack-team-726b52258/" target="_blank" aria-label="LinkedIn" className="inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20">
                <Linkedin className="w-4 h-4" />
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