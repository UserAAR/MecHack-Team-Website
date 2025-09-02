"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Mail, Phone, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const BRAND = { cream: "#f5f2e1", navy: "#000080", gold: "#e38d1a" };

const projectsFallback: Array<{ id: string; title: string; summary?: string; image?: string; slug?: string; }> = [];

type ProjectRow = {
  id: string;
  title: string;
  summary: string | null;
  image_url: string | null;
  slug: string | null;
  published_at: string | null;
};

type EventItem = { id: string; date: string; title: string; location: string; description: string };

export default function ProjectsEventsPage() {
  const [navSolid, setNavSolid] = useState(false);
  const [rows, setRows] = useState<ProjectRow[]>([]);
  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase
          .from("projects")
          .select("id, title, summary, image_url, slug, published_at")
          .not("published_at", "is", null)
          .order("published_at", { ascending: false })
          .limit(24);
        setRows((data as ProjectRow[]) ?? []);
      } catch {
        setRows([]);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] text-[var(--color-brand-navy)]">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-colors ${navSolid ? "bg-[rgba(245,242,225,0.9)] backdrop-blur" : "bg-transparent"}`}>
        <div className="container-max px-6 lg:px-10 py-3 flex items-center justify-between">
          <Link href={`/${locale}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-transparent overflow-hidden grid place-items-center">
              <Image src="/logo/logo.jpg" alt="Logo" fill className="object-contain p-0.5" />
            </div>
            <span className="font-semibold tracking-wide">MecHack Qarabag</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href={`/${locale}/about`}>About</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href={`/${locale}/projects-events`}>Projects & Events</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href={`/${locale}/news`}>News</NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <select aria-label="Language" className="bg-white/80 border px-3 py-1.5 rounded-full text-sm">
              <option value="en">EN</option>
              <option value="az">AZ</option>
              <option value="ru">RU</option>
            </select>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">☰</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link href={`/${locale}/about`}>About</Link>
                <Link href={`/${locale}/projects-events`}>Projects & Events</Link>
                <Link href={`/${locale}/news`}>News</Link>
                <select aria-label="Language" className="bg-white border px-3 py-1.5 rounded text-sm w-fit">
                  <option value="en">EN</option>
                  <option value="az">AZ</option>
                  <option value="ru">RU</option>
                </select>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="container-max px-6 lg:px-10 py-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-6xl font-extrabold">
            Projects & Events
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="mt-4 max-w-3xl text-lg text-neutral-700">
            Discover our ongoing engineering projects and upcoming community events.
          </motion.p>
          <div className="mt-6">
            <Button asChild className="rounded-full bg-[var(--color-brand-navy)] text-[var(--color-brand-cream)] hover:bg-[var(--color-brand-navy)]/90">
              <Link href={`/${locale}#news`} className="inline-flex items-center gap-2">See latest news <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section-padding">
        <div className="container-max px-6 lg:px-10">
          <SectionHeader eyebrow="What we build" title="Featured Projects" />
          <div className="grid gap-6 md:grid-cols-3">
            {(rows.length ? rows : projectsFallback).map((p) => (
              <Card key={(p as any).id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={(p as any).image || (p as any).image_url || "/news/thumb.jpg"} alt={(p as any).title} fill className="object-cover" />
                </div>
                <CardHeader className="pb-0">
                  <CardTitle className="text-xl">{(p as any).title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-sm text-neutral-700">{(p as any).summary ?? ""}</p>
                  <Button asChild variant="link" className="px-0 text-[var(--color-brand-gold)]"><Link href={`/${locale}/projects-events/${(p as any).slug ?? (p as any).id}`}>Read more</Link></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="section-padding bg-white">
        <div className="container-max px-6 lg:px-10">
          <SectionHeader eyebrow="Get involved" title="Upcoming Events" />
          <div className="grid gap-6">
            {events.map((e: EventItem) => (
              <div key={e.id} className="rounded-xl border border-black/5 bg-[var(--color-brand-cream)] p-5 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-lg bg-white px-3 py-2 text-sm font-semibold flex items-center gap-2 ring-1 ring-black/5">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{e.title}</div>
                    <div className="text-sm text-neutral-600 flex items-center gap-2 mt-1"><MapPin className="w-4 h-4" /> {e.location}</div>
                    <p className="text-sm text-neutral-700 mt-2 max-w-2xl">{e.description}</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button asChild className="rounded-full bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)]/90">
                    <Link href={`/${locale}`}>Details</Link>
                  </Button>
                </div>
              </div>
            ))}
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
              We are a FIRST Robotics team empowering youth in STEM through robotics, innovation and community projects.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link href="https://www.instagram.com/mechackteam" aria-label="Instagram" className="inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" aria-label="YouTube" className="inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20">
                <Youtube className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-3">Quick Links</div>
            <ul className="space-y-2 text-sm/6 opacity-90">
              <li><Link href={`/${locale}/about`} className="hover:underline">About</Link></li>
              <li><Link href={`/${locale}/projects-events`} className="hover:underline">Projects & Events</Link></li>
              <li><Link href={`/${locale}/news`} className="hover:underline">News</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-3">Programs</div>
            <ul className="space-y-2 text-sm/6 opacity-90">
              <li><Link href="https://www.firstlegoleague.org/" target="_blank" className="hover:underline">FIRST LEGO League</Link></li>
              <li><Link href="https://www.firstinspires.org/robotics/ftc" target="_blank" className="hover:underline">FIRST Tech Challenge</Link></li>
              <li><Link href="https://www.firstinspires.org/robotics/frc" target="_blank" className="hover:underline">FIRST Robotics Competition</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-3">Contact</div>
            <ul className="space-y-2 text-sm/6 opacity-95">
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5" /> mechackqarabag@gmail.com</li>
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5" /> +994 70 595 10 30</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /> Baku, Azerbaijan</li>
            </ul>
          </div>
        </div>
        <Separator className="bg-white/10" />
        <div className="container-max px-6 lg:px-10 py-5 text-xs/6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between opacity-80">
          <div>© {new Date().getFullYear()} MecHack Qarabag. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
} 