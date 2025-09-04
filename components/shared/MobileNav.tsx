"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Home, Info, FolderGit2, Newspaper, Instagram, Youtube, Languages } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = { locale: string };

export function MobileNav({ locale }: Props) {
  const t = useTranslations("Header");
  const tc = useTranslations("Common");
  return (
    <div className="h-full w-full flex flex-col">
      <div className="relative px-6 pt-8 pb-6 bg-[linear-gradient(135deg,var(--color-brand-navy),var(--color-brand-gold))] text-white">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/40">
            <Image src="/logo/logo.jpg" alt="Logo" fill className="object-contain" />
          </div>
          <div className="font-semibold">MecHack Qarabag</div>
        </div>
        <div className="mt-3 text-sm/6 opacity-90 max-w-sm">
          {tc("tagline")}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2 bg-white">
        <Link href={`/${locale}`} className="flex items-center justify-between rounded-xl border border-black/5 px-4 py-3 hover:bg-black/[0.02]">
          <span className="inline-flex items-center gap-3"><Home className="w-4 h-4" /> {t("home")}</span>
          <ArrowRight className="w-4 h-4 opacity-70" />
        </Link>
        <Link href={`/${locale}/about`} className="flex items-center justify-between rounded-xl border border-black/5 px-4 py-3 hover:bg-black/[0.02]">
          <span className="inline-flex items-center gap-3"><Info className="w-4 h-4" /> {t("about")}</span>
          <ArrowRight className="w-4 h-4 opacity-70" />
        </Link>
        <Link href={`/${locale}/projects-events`} className="flex items-center justify-between rounded-xl border border-black/5 px-4 py-3 hover:bg-black/[0.02]">
          <span className="inline-flex items-center gap-3"><FolderGit2 className="w-4 h-4" /> {t("projectsEvents")}</span>
          <ArrowRight className="w-4 h-4 opacity-70" />
        </Link>
        <Link href={`/${locale}/news`} className="flex items-center justify-between rounded-xl border border-black/5 px-4 py-3 hover:bg-black/[0.02]">
          <span className="inline-flex items-center gap-3"><Newspaper className="w-4 h-4" /> {t("news")}</span>
          <ArrowRight className="w-4 h-4 opacity-70" />
        </Link>

        <div className="mt-5">
          <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2 inline-flex items-center gap-2"><Languages className="w-3.5 h-3.5" /> {t("language")}</div>
          <div className="flex gap-2">
            <Link href={`/${"en"}`} className="px-3 py-1.5 rounded-full border text-sm hover:bg-black/[0.02]">EN</Link>
            <Link href={`/${"az"}`} className="px-3 py-1.5 rounded-full border text-sm hover:bg-black/[0.02]">AZ</Link>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-white border-t">
        <div className="flex items-center gap-3">
          <Link href="https://www.instagram.com/mechackteam" aria-label="Instagram" className="inline-flex p-2 rounded-full border hover:bg-black/[0.02]"><Instagram className="w-4 h-4" /></Link>
          <Link href="#" aria-label="YouTube" className="inline-flex p-2 rounded-full border hover:bg-black/[0.02]"><Youtube className="w-4 h-4" /></Link>
        </div>
        <div className="mt-3 text-xs text-neutral-500">© {new Date().getFullYear()} MecHack Qarabag</div>
      </div>
    </div>
  );
} 