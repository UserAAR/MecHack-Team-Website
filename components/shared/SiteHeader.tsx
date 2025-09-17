"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { MobileNav } from "@/components/shared/MobileNav";
import { useTranslations } from "next-intl";

type Props = {
  locale: string;
  transparentOnTop?: boolean;
};

export function SiteHeader({ locale, transparentOnTop = false }: Props) {
  const tHeader = useTranslations("Header");
  const [navSolid, setNavSolid] = useState(!transparentOnTop);

  useEffect(() => {
    if (!transparentOnTop) return;
    const onScroll = () => setNavSolid(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnTop]);

  return (
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
            <Button variant="outline" size="icon" className="md:hidden border text-black bg-white/80">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle className="sr-only">Mobile navigation</SheetTitle>
            <MobileNav locale={locale} />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
} 