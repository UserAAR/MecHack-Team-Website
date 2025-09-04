import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Separator } from "@/components/ui/separator";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Instagram, Youtube, Mail, MapPin, Phone, ArrowLeft, Calendar, MapPin as Pin } from "lucide-react";
import { MobileNav } from "@/components/shared/MobileNav";

export default async function EventDetail({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, location, event_date, image_url, published_at")
    .eq("id", id)
    .maybeSingle();
  if (error || !data || !data.published_at) return notFound();

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
              <Button variant="outline" size="icon" className="md:hidden"><Menu className="w-5 h-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right">
              <MobileNav locale={locale} />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <article>
        <div className="container-max px-6 lg:px-10 py-10">
          <div className="mb-6">
            <Button asChild className="rounded-full bg-[var(--color-brand-gold)] text-black hover:bg-[var(--color-brand-gold)]/90">
              <Link href={`/${locale}/projects-events`} className="inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Projects & Events</Link>
            </Button>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold">{data.title}</h1>

          <div className="mt-8 grid gap-6 md:grid-cols-12 items-start">
            <div className="relative md:col-span-5 lg:col-span-6 rounded-xl overflow-hidden ring-1 ring-black/5 bg-black min-h-64">
              <Image src={data.image_url ?? "/news/thumb.jpg"} alt={data.title} fill className="object-cover opacity-95" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.25),rgba(0,0,0,0))]" />
            </div>
            <div className="md:col-span-7 lg:col-span-6">
              <div className="flex items-center gap-3 text-sm text-neutral-700">
                <Calendar className="w-4 h-4" />
                <span>{new Date(data.event_date ?? data.published_at ?? new Date().toISOString()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" })}</span>
                <Pin className="w-4 h-4" />
                <span>{data.location}</span>
              </div>
              {data.description ? (
                <p className="mt-3 text-base md:text-lg text-neutral-800">{data.description}</p>
              ) : null}
            </div>
          </div>

          <Separator className="my-8" />
          <p className="text-neutral-700">More details will be announced soon.</p>
        </div>
      </article>

      {/* Footer */}
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