"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe2, Newspaper, Users, Rocket, Sparkles, Menu, Mail, MapPin, Phone, Instagram, Youtube, Github, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { BrandButton } from "@/components/shared/BrandButton";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { Description } from "@radix-ui/react-dialog";

const BRAND = { cream: "#f5f2e1", navy: "#000080", gold: "#e38d1a" };

const missions = [
  { icon: <Rocket className="w-6 h-6" />, title: "Robotics", text: "We build competitive robots and resilient minds." },
  { icon: <Users className="w-6 h-6" />, title: "Teamwork", text: "We coach collaboration, leadership and fair play." },
  { icon: <Globe2 className="w-6 h-6" />, title: "Community", text: "We inspire youth to serve and impact our community." },
  { icon: <Sparkles className="w-6 h-6" />, title: "Innovation", text: "We iterate fast and celebrate creative engineering." },
  { icon: <Newspaper className="w-6 h-6" />, title: "Outreach", text: "We share knowledge via events, talks and media." },
  { icon: <ArrowRight className="w-6 h-6" />, title: "Future", text: "We prepare youth for tomorrow’s challenges." },
];

const programs = [
  { key: "fll", title: "FIRST LEGO League", age: "Ages 4–14", color: "#d32f2f", link: "https://www.firstlegoleague.org/", tag: "FLL", description: "FIRST® LEGO® League introduces STEM to children ages 4-14 through fun, exciting hands-on learning. Participants gain real-world problem-solving experiences through a guided, global robotics program, helping today’s students and teachers build a better future together. The three divisions inspire youth to experiment and grow their critical thinking, coding, and design skills through hands-on STEM learning and robotics."},
  { key: "ftc", title: "FIRST Tech Challenge", age: "Ages 12–18", color: "#ef6c00", link: "https://www.firstinspires.org/robotics/ftc", tag: "FTC", description: "FIRST® Tech Challenge students learn to think like engineers. Teams design, build, and program robots to compete in an alliance format against other teams. Robots are built from a reusable platform, powered by android technology, and can be coded using a variety of levels of Java-based programming." },
  { key: "frc", title: "FIRST Robotics Competition", age: "Grades 9–12", color: "#0288d1", link: "https://www.firstinspires.org/robotics/frc", tag: "FRC", description: "FIRST® Robotics Competition teams design, program, and build a robot starting with a standard kit of parts and common set of rules to play in a themed head-to-head challenge. Teams also build a brand, develop community partnerships for support, and work to promote STEM in their local community." },
];

const newsItems = [
  { id: 1, title: "MecHack wins regional Innovation in Control Award", excerpt: "Our control system impressed the judges with robust autonomous routines and clean wiring.", category: "Competition", date: "2025-03-02", image: "/news/1680441839.jpeg", link: "#" },
  { id: 2, title: "Community workshop: Intro to robotics and coding", excerpt: "We hosted 70+ students for hands-on sessions with sensors, pneumatics and Java basics.", category: "Outreach", date: "2025-02-18", image: "/news/b16e43cbd0e2ef4398f3b52a91934c4e.jpeg", link: "#" },
  { id: 3, title: "New season kickoff: strategy and prototyping day", excerpt: "The team explored rules, mapped objectives and built fast prototypes for key mechanisms.", category: "Update", date: "2025-01-10", image: "/news/thumb.jpg", link: "#" },
];

const sponsors = [
  { id: 1, logo: "/sponsors/BMU-logo.svg.png" },
  { id: 2, logo: "/sponsors/UNEC-logo-yeni-2020-1.png" },
  { id: 3, logo: "/sponsors/1200px-YAŞAT_Fondu_loqosu-removebg-preview.png" },
  { id: 4, logo: "/sponsors/gencleridmanlogo-removebg-preview.png" },
  { id: 5, logo: "/sponsors/Azercell-Logo.wine_-1024x683.png" },
];

export default function Home() {
  const [navSolid, setNavSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-brand-cream)] text-[var(--color-brand-navy)]">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-colors ${navSolid ? "bg-[rgba(245,242,225,0.9)] backdrop-blur" : "bg-transparent"}`}>
        <div className="container-max px-6 lg:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-transparent overflow-hidden grid place-items-center">
              <Image src="/logo/logo.jpg" alt="Logo" fill className="object-contain p-0.5" />
            </div>
            <span className="font-semibold tracking-wide">Qarabag MecHack</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#about">About</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#programs">Programs</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#news">News</NavigationMenuLink>
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
              <Button variant="outline" size="icon" className="md:hidden"><Menu className="w-5 h-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link href="#about">About</Link>
                <Link href="#programs">Programs</Link>
                <Link href="#news">News</Link>
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
            <section className="relative h-[92vh] w-full overflow-hidden">
        {/* Desktop: Video göster */}
        <video 
          className="absolute inset-0 h-full w-full object-cover hidden md:block" 
          src="/intro/intro.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          crossOrigin="anonymous" 
        />
        {/* Mobile: Sadece resim göster */}
        <div className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat md:hidden" 
             style={{backgroundImage: 'url("/bg/mobile-bg.png")'}} />
        <div className="absolute inset-0 brand-gradient opacity-60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.6),rgba(0,0,0,.15))]" />
        <div className="relative z-10 h-full w-full flex items-center">
          <div className="container-max px-6 lg:px-10">
            <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-5xl text-5xl md:text-7xl font-extrabold leading-tight text-[var(--color-brand-cream)]">
              Global robotics and STEM community preparing youth for tomorrow's challenges
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-6 flex flex-wrap items-center gap-3">
              <BrandButton asChild><Link href="#about" className="inline-flex items-center gap-2">Learn more <ArrowRight className="w-4 h-4" /></Link></BrandButton>
              <Button asChild variant="secondary" className="rounded-full bg-white/90 text-black hover:bg-white"><Link href="#programs">Explore programs</Link></Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section id="about" className="section-padding">
        <div className="container-max px-6 lg:px-10">
          <SectionHeader eyebrow="Who we are" title="Our Mission" />
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
          <SectionHeader eyebrow="What we do" title="Programs" />
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
                  <Button asChild size="sm" className="mt-4 bg-white/95 text-black hover:bg-white rounded-full"><Link href={p.link} target="_blank">Learn more</Link></Button>
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
          <SectionHeader eyebrow="Updates" title="Latest News" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((n, idx) => (
              <motion.div key={n.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: idx * 0.05 }}>
                <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow group">
                  <div className="relative h-56">
                    <Image src={n.image} alt={n.title} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.6),rgba(0,0,0,0.05))]" />
                    <Badge className="absolute left-3 top-3 bg-white/90 text-black">{n.category}</Badge>
                  </div>
                  <CardHeader className="pb-0"><CardTitle className="text-xl line-clamp-2">{n.title}</CardTitle></CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-neutral-700 line-clamp-2">{n.excerpt}</p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(n.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" })}</span>
                    </div>
                    <Button asChild variant="link" className="px-0 text-[var(--color-brand-gold)]"><Link href={n.link}>Read more</Link></Button>
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
          <SectionHeader eyebrow="Supporters" title="Sponsors & Partners" />
        </div>
        <div className="relative overflow-hidden w-full">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="flex items-center gap-14 animate-marquee will-change-transform px-6 lg:px-10" style={{ animationDuration: "22s" }}>
            {Array(4).fill(sponsors).flat().map((s, i) => (
              <div
                key={`sponsor-${s.id}-${i}`}
                className="shrink-0 transition-transform duration-300 hover:scale-105"
                aria-label="Sponsor logo"
              >
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
              <span className="font-semibold text-lg">Qarabag MecHack</span>
            </div>
            <p className="mt-3 text-sm/6 opacity-85 max-w-xs">
              We are a FIRST Robotics team empowering youth in STEM through robotics, innovation and community projects.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Link href="#" aria-label="Instagram" className="inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" aria-label="YouTube" className="inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20">
                <Youtube className="w-4 h-4" />
              </Link>
              <Link href="#" aria-label="GitHub" className="inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-3">Quick Links</div>
            <ul className="space-y-2 text-sm/6 opacity-90">
              <li><Link href="#about" className="hover:underline">About</Link></li>
              <li><Link href="#programs" className="hover:underline">Programs</Link></li>
              <li><Link href="#news" className="hover:underline">News</Link></li>
              <li><Link href="#" className="hover:underline">Events</Link></li>
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
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5" /> info@mechack.team</li>
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5" /> +994 00 000 00 00</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /> Baku, Azerbaijan</li>
            </ul>
          </div>
        </div>
        <Separator className="bg-white/10" />
        <div className="container-max px-6 lg:px-10 py-5 text-xs/6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between opacity-80">
          <div>© {new Date().getFullYear()} Qarabag MecHack. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Terms</Link>
            <Link href="#" className="hover:underline">Brand Assets</Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { width: max-content; animation-name: marquee; animation-timing-function: linear; animation-iteration-count: infinite; }
      `}</style>
    </div>
  );
} 