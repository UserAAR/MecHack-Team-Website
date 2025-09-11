"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe2, Newspaper, Users, Rocket, Sparkles, Menu, Mail, MapPin, Phone, Instagram, Linkedin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { BrandButton } from "@/components/shared/BrandButton";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { MobileNav } from "@/components/shared/MobileNav";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { useTranslations } from "next-intl";

export type LatestNewsItem = { id: string; title: string; excerpt: string; category: string; date: string; image: string; link: string };

type Props = { locale: string; latestNews: LatestNewsItem[] };

const BRAND = { cream: "#f5f2e1", navy: "#000080", gold: "#e38d1a" } as const;

const sponsors = [
  { id: 1, logo: "/sponsors/sp1.png" },
  { id: 2, logo: "/sponsors/sp2.png" },
  { id: 3, logo: "/sponsors/sp3.png" },
  { id: 4, logo: "/sponsors/sp4.png" },
  { id: 5, logo: "/sponsors/sp5.png" },
  { id: 6, logo: "/sponsors/sp6.png" },
  { id: 7, logo: "/sponsors/sp7.png" },
  { id: 8, logo: "/sponsors/sp8.png" },
  { id: 9, logo: "/sponsors/sp9.png" },
  { id: 10, logo: "/sponsors/sp10.png" },
  { id: 11, logo: "/sponsors/sp11.png" }
];

export default function HomeClient({ locale, latestNews }: Props) {
  const tHeader = useTranslations("Header");
  const tHero = useTranslations("Hero");
  const tMission = useTranslations("Mission");
  const tPrograms = useTranslations("Programs");
  const tNews = useTranslations("News");
  const tSponsors = useTranslations("Sponsors");
  const tFooter = useTranslations("Footer");
  const tCommon = useTranslations("Common");
  const [navSolid, setNavSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const missions = [
    { icon: <Rocket className="w-6 h-6" />, title: tMission("items.robotics.title"), text: tMission("items.robotics.text") },
    { icon: <Users className="w-6 h-6" />, title: tMission("items.teamwork.title"), text: tMission("items.teamwork.text") },
    { icon: <Globe2 className="w-6 h-6" />, title: tMission("items.community.title"), text: tMission("items.community.text") },
    { icon: <Sparkles className="w-6 h-6" />, title: tMission("items.innovation.title"), text: tMission("items.innovation.text") },
    { icon: <Newspaper className="w-6 h-6" />, title: tMission("items.outreach.title"), text: tMission("items.outreach.text") },
    { icon: <ArrowRight className="w-6 h-6" />, title: tMission("items.future.title"), text: tMission("items.future.text") },
  ];

  const programs = [
    { key: "fll", title: tPrograms("items.fll.title"), age: tPrograms("items.fll.age"), color: "#d32f2f", link: "https://www.firstlegoleague.org/", tag: "FLL", description: tPrograms("items.fll.description") },
    { key: "ftc", title: tPrograms("items.ftc.title"), age: tPrograms("items.ftc.age"), color: "#ef6c00", link: "https://www.firstinspires.org/robotics/ftc", tag: "FTC", description: tPrograms("items.ftc.description") },
    { key: "frc", title: tPrograms("items.frc.title"), age: tPrograms("items.frc.age"), color: "#0288d1", link: "https://www.firstinspires.org/robotics/frc", tag: "FRC", description: tPrograms("items.frc.description") },
  ];

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
      <section className="relative h-[92vh] w-full overflow-hidden">
        <video className="absolute inset-0 h-full w-full object-cover hidden md:block" src="/intro/intro.mp4" autoPlay loop muted playsInline crossOrigin="anonymous" />
        <div className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat md:hidden" style={{ backgroundImage: 'url("/bg/mobile-bg.png")' }} />
        <div className="absolute inset-0 brand-gradient opacity-60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.6),rgba(0,0,0,.15))]" />
        <div className="relative z-10 h-full w-full flex items-center">
          <div className="container-max px-6 lg:px-10">
            <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-5xl text-5xl md:text-7xl font-extrabold leading-tight text-[var(--color-brand-cream)]">
              {tHero("title")}
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-6 flex flex-wrap items-center gap-3">
              <BrandButton asChild><Link href={`/${locale}/about`} className="inline-flex items-center gap-2">{tHero("ctaLearnMore")} <ArrowRight className="w-4 h-4" /></Link></BrandButton>
              <Button asChild variant="secondary" className="rounded-full bg-white/90 text-black hover:bg-white"><Link href="#programs">{tHero("ctaExplorePrograms")}</Link></Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="about" className="section-padding">
        <div className="container-max px-6 lg:px-10">
          <SectionHeader eyebrow={tMission("eyebrow")} title={tMission("title")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {missions.map((m, idx) => (
              <FeatureCard key={idx} icon={m.icon} title={m.title} text={m.text} />
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="section-padding bg-white">
        <div className="container-max px-6 lg:px-10">
          <SectionHeader eyebrow={tPrograms("eyebrow")} title={tPrograms("title")} />
          <div className="grid gap-6 md:grid-cols-3">
            {programs.map((p) => (
              <motion.div key={p.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
                <Card className="card card-hover text-white relative overflow-hidden min-h-[418px]" style={{ backgroundColor: p.color }}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{p.title}</CardTitle>
                      <Badge variant="secondary" className="bg-black/30 backdrop-blur text-white">{p.tag}</Badge>
                    </div>
                    <p className="opacity-90 mt-1">{p.age}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[15px] max-w-sm">{p.description}</p>
                    <Button asChild size="sm" className="mt-4 bg-white/95 text-black hover:bg-white rounded-full"><Link href={p.link} target="_blank">{tPrograms("learnMore")}</Link></Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="section-padding">
        <div className="container-max px-6 lg:px-10">
          <SectionHeader eyebrow={tNews("eyebrow")} title={tNews("title")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((n, idx) => (
              <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: idx * 0.05 }} className="h-full">
                <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow group flex flex-col">
                  <div className="relative h-56">
                    <Image src={n.image} alt={n.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.6),rgba(0,0,0,0.05))]" />
                    <Badge className="absolute left-3 top-3 bg-white/90 text-black">{n.category}</Badge>
                  </div>
                  <CardHeader className="pb-0"><CardTitle className="text-xl line-clamp-2">{n.title}</CardTitle></CardHeader>
                  <CardContent className="pt-2 flex flex-col flex-grow">
                    <p className="text-sm text-neutral-700 line-clamp-2">{n.excerpt}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(n.date).toLocaleDateString(locale, { year: "numeric", month: "short", day: "2-digit" })}</span>
                    </div>
                    <div className="mt-auto">
                      <Button asChild variant="link" className="px-0 text-[var(--color-brand-gold)]"><Link href={n.link}>{tCommon("readMore")}</Link></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors (full-bleed) */}
      <section className="section-padding bg-white px-0">
        <div className="container-max px-6 lg:px-10">
          <SectionHeader eyebrow={tSponsors("eyebrow")} title={tSponsors("title")} />
        </div>
        <div className="relative overflow-hidden w-full">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="flex items-center gap-14 animate-marquee will-change-transform px-6 lg:px-10" style={{ animationDuration: "22s" }}>
            {Array(4).fill(sponsors).flat().map((s, i) => (
              <div key={`sponsor-${s.id}-${i}`} className="shrink-0 transition-transform duration-300 hover:scale-105" aria-label="Sponsor logo">
                <Image src={s.logo} alt="Sponsor" width={200} height={96} className="object-contain drop-shadow-sm" />
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
              <li><Link href="https://www.firstlegoleague.org/" target="_blank" className="hover:underline">{tPrograms("items.fll.title")}</Link></li>
              <li><Link href="https://www.firstinspires.org/robotics/ftc" target="_blank" className="hover:underline">{tPrograms("items.ftc.title")}</Link></li>
              <li><Link href="https://www.firstinspires.org/robotics/frc" target="_blank" className="hover:underline">{tPrograms("items.frc.title")}</Link></li>
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

      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { width: max-content; animation-name: marquee; animation-timing-function: linear; animation-iteration-count: infinite; }
      `}</style>
    </div>
  );
} 