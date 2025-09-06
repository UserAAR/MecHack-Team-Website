"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, LogOut, Sun, Moon, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { CommandPalette } from "@/components/admin/CommandPalette";
import * as React from "react";

export function AdminTopbar({ locale, role }: { locale: string; role: string }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const crumbs = pathname?.split("/").filter(Boolean).slice(1) ?? [];
  const [openCmd, setOpenCmd] = React.useState(false);

  return (
    <header className="h-14 border-b bg-white/70 backdrop-blur sticky top-0 z-40">
      <div className="h-full px-3 lg:px-6 flex items-center gap-3">
        <div className="lg:hidden">
          <MobileNav locale={locale} role={role} />
        </div>
        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Admin</span>
          {crumbs.map((c, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <span className="opacity-40">/</span>
              <span className={idx === crumbs.length - 1 ? "text-foreground" : "hover:underline"}>{decodeURIComponent(c)}</span>
            </span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <button
              className="relative w-[260px] h-9 rounded-md border text-left pl-8 pr-3 text-sm text-muted-foreground hover:bg-accent"
              onClick={() => setOpenCmd(true)}
              aria-label="Open command palette"
              title="Open command palette (Ctrl/Cmd+K)"
            >
              <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              Search or type a command…
            </button>
            <Link href={`/${locale}`} className="text-sm underline opacity-80 hover:opacity-100">Preview site</Link>
          </div>
          <ThemeSwitch theme={theme} setTheme={setTheme} />
          <button className="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-black/5" aria-label="Notifications">
            <Bell className="w-4 h-4" />
          </button>
          <UserMenu locale={locale} role={role} />
        </div>
      </div>
      {openCmd ? <CommandPalette locale={locale} /> : null}
    </header>
  );
}

function ThemeSwitch({ theme, setTheme }: { theme?: string; setTheme: (t: string) => void }) {
  const isDark = theme === "dark";
  return (
    <Button variant="outline" size="icon" aria-label="Toggle theme" onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}

function UserMenu({ locale, role }: { locale: string; role: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full px-3">{role}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/admin`}>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={`/${locale}/auth/sign-out`} method="post" className="w-full">
            <button className="w-full inline-flex items-center gap-2 text-left" aria-label="Sign out">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNav({ locale, role }: { locale: string; role: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Open menu"><Menu className="w-5 h-5" /></Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[300px]">
        {/* Reuse AdminSidebar through a lightweight importless slot to avoid circular deps */}
        <div className="p-4 border-b">
          <div className="font-semibold">Qarabag Admin</div>
          <div className="text-xs opacity-70">Content Console</div>
        </div>
        <div className="p-2">
          <Link href={`/${locale}/admin`} className="block px-3 py-2 rounded-md hover:bg-accent">Dashboard</Link>
          <Link href={`/${locale}/admin/news`} className="block px-3 py-2 rounded-md hover:bg-accent">News</Link>
          <Link href={`/${locale}/admin/projects`} className="block px-3 py-2 rounded-md hover:bg-accent">Projects</Link>
          <Link href={`/${locale}/admin/events`} className="block px-3 py-2 rounded-md hover:bg-accent">Events</Link>
          <Link href={`/${locale}/admin/media`} className="block px-3 py-2 rounded-md hover:bg-accent">Media</Link>
          {role === "superadmin" ? (
            <>
              <div className="px-3 py-2 text-[11px] uppercase opacity-60 mt-3">Administration</div>
              <Link href={`/${locale}/admin/users`} className="block px-3 py-2 rounded-md hover:bg-accent">Users</Link>
              <Link href={`/${locale}/admin/system`} className="block px-3 py-2 rounded-md hover:bg-accent">System</Link>
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
} 