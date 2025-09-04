"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Languages, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const SUPPORTED_LOCALES = [
  { code: "en", label: "EN" },
  { code: "az", label: "AZ" },
  { code: "ru", label: "RU" },
] as const;

type Props = { currentLocale: string };

export function LocaleSwitcher({ currentLocale }: Props) {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const router = useRouter();

  function onSelect(next: string) {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${next}`);
      return;
    }
    segments[0] = next;
    const newPath = `/${segments.join("/")}`;
    const query = searchParams.toString();
    router.push(query ? `${newPath}?${query}` : newPath);
  }

  const current = SUPPORTED_LOCALES.find((l) => l.code === currentLocale)?.label ?? currentLocale.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full bg-white/80 backdrop-blur border inline-flex items-center gap-2">
          <Languages className="w-4 h-4" />
          <span className="font-medium tracking-wide">{current}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SUPPORTED_LOCALES.map((l) => (
          <DropdownMenuItem key={l.code} onClick={() => onSelect(l.code)} className="flex items-center justify-between">
            <span>{l.label}</span>
            {l.code === currentLocale ? <Check className="w-4 h-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 