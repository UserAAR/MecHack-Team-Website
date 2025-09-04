"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, Rocket, Sparkles, Mail, MapPin, Phone, Instagram, Youtube, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { useParams } from "next/navigation";
import { MobileNav } from "@/components/shared/MobileNav";
import { useTranslations } from "next-intl";

const BRAND = { cream: "#f5f2e1", navy: "#000080", gold: "#e38d1a" };

export default function AboutPage() {
  const [navSolid, setNavSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  const tHeader = useTranslations("Header");
  const tFooter = useTranslations("Footer");
  const tAbout = useTranslations("About");

  const values = [
    { icon: <Rocket className="w-6 h-6" />, title: tAbout("values.purpose.title"), text: tAbout("values.purpose.text") },
    { icon: <Users className="w-6 h-6" />, title: tAbout("values.collaboration.title"), text: tAbout("values.collaboration.text") },
    { icon: <Sparkles className="w-6 h-6" />, title: tAbout("values.innovation.title"), text: tAbout("values.innovation.text") },
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
            <div className="inline-flex items-center gap-1 bg-white/80 border px-1.5 py-1 rounded-full text-sm">
              <Link href={`/en`} className={`px-2 py-0.5 rounded-full ${locale === "en" ? "bg-black text-white" : "hover:bg-black/10"}`}>EN</Link>
              <Link href={`/az`} className={`px-2 py-0.5 rounded-full ${locale === "az" ? "bg-black text-white" : "hover:bg-black/10"}`}>AZ</Link>
            </div>
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

      {/* About Hero */}
      <section className="relative w-full overflow-hidden bg-white">
        <div className="container-max px-6 lg:px-10 py-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-6xl font-extrabold">
            {tAbout("heroTitle")}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }} className="mt-4 max-w-3xl text-lg text-neutral-700">
            {tAbout("heroDescription")}
          </motion.p>
          <div className="mt-6">
            <Button asChild className="rounded-full bg-[var(--color-brand-navy)] text-[var(--color-brand-cream)] hover:bg-[var(--color-brand-navy)]/90">
              <Link href={`/${locale}#programs`} className="inline-flex items-center gap-2">{tAbout("ctaExplorePrograms")} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-max px-6 lg:px-10">
          <SectionHeader eyebrow={tAbout("valuesEyebrow")} title={tAbout("valuesTitle")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, idx) => (
              <FeatureCard key={idx} icon={v.icon} title={v.title} text={v.text} />
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-max px-6 lg:px-10 grid gap-8 md:grid-cols-2 items-center">
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden ring-1 ring-black/5 bg-[var(--color-brand-cream)]">
            <Image src="/logo/logo2.jpg" alt="Team" fill className="object-cover" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{tAbout("storyTitle")}</h2>
            <p className="mt-3 text-neutral-700">
              {tAbout("storyP1")}
            </p>
            <p className="mt-3 text-neutral-700">
              {tAbout("storyP2")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding">
        <div className="container-max px-6 lg:px-10">
          <div className="rounded-2xl bg-[var(--color-brand-navy)] text-[var(--color-brand-cream)] p-6 md:p-10 grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">{tAbout("partnerTitle")}</h3>
              <p className="mt-2 opacity-90">{tAbout("partnerText")}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Button asChild variant="secondary" className="rounded-full bg-white text-black hover:bg-white/90">
                <Link href={`mailto:mechackqarabag@gmail.com`}>{tAbout("emailUs")}</Link>
              </Button>
              <Button asChild className="rounded-full bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)]/90">
                <Link href={`/${locale}/news`}>{tAbout("seeLatestNews")}</Link>
              </Button>
            </div>
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
              <Link href="https://www.instagram.com/mechackteam" aria-label="Instagram" className="inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" aria-label="YouTube" className="inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20">
                <Youtube className="w-4 h-4" />
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