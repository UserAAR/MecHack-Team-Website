"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Newspaper, FolderKanban, CalendarDays, Images, Users2, Settings, ChevronDown } from "lucide-react";

export type AdminRole = "user" | "admin" | "superadmin";

export type AdminNavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>, children?: AdminNavItem[] };

export function getAdminNavItems(locale: string) {
  const base = `/${locale}/admin`;
  const items: AdminNavItem[] = [
    { href: base, label: "Dashboard", icon: LayoutDashboard },
    { href: `${base}/news`, label: "News", icon: Newspaper },
    { href: `${base}/projects`, label: "Projects", icon: FolderKanban },
    { href: `${base}/events`, label: "Events", icon: CalendarDays },
    { href: `${base}/media`, label: "Media Library", icon: Images },
  ];
  const superItems: AdminNavItem[] = [
    { href: `${base}/users`, label: "Users", icon: Users2 },
    { href: `${base}/system`, label: "System", icon: Settings },
  ];
  return { items, superItems };
}

export function AdminSidebar({ locale, role }: { locale: string; role: AdminRole }) {
  const pathname = usePathname();
  const { items, superItems } = getAdminNavItems(locale);
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside className={`hidden lg:flex h-full ${collapsed ? "w-20" : "w-72"} transition-all duration-300 shrink-0 border-r border-[var(--color-sidebar-border)] bg-[var(--color-brand-navy)] text-white`}> 
      <div className="flex flex-col w-full">
        <div className="px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold tracking-wide">Qarabag Admin</div>
          </div>
          <button
            className="text-white/70 hover:text-white inline-flex items-center justify-center w-7 h-7 rounded-md"
            onClick={() => setCollapsed((s) => !s)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${collapsed ? "-rotate-90" : "rotate-0"}`} />
          </button>
        </div>
        <nav className="px-2 pb-6 text-[13px]">
          <div className={`px-3 py-2 text-[10px] uppercase tracking-wider/3 opacity-70 ${collapsed ? "sr-only" : ""}`}>Overview</div>
          <ul className="space-y-1">
            {items.map((it) => {
              const Icon = it.icon;
              const active = pathname === it.href || pathname?.startsWith(it.href + "/");
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={`group relative flex items-center gap-3 ${collapsed ? "justify-center" : "px-3"} py-2 rounded-md transition-colors ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full transition-all ${active ? "bg-[var(--color-brand-gold)] opacity-100" : "opacity-0 group-hover:opacity-50 bg-white/40"}`} />
                    <Icon className="w-4 h-4" />
                    <span className={`${collapsed ? "sr-only" : ""}`}>{it.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {role === "superadmin" ? (
            <div className="mt-5">
              <div className={`px-3 py-2 text-[10px] uppercase tracking-wider/3 opacity-70 ${collapsed ? "sr-only" : ""}`}>Administration</div>
              <ul className="space-y-1">
                {superItems.map((it) => {
                  const Icon = it.icon;
                  const active = pathname === it.href || pathname?.startsWith(it.href + "/");
                  return (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        className={`group relative flex items-center gap-3 ${collapsed ? "justify-center" : "px-3"} py-2 rounded-md transition-colors ${
                          active
                            ? "bg-white/10 text-white"
                            : "text-white/80 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full transition-all ${active ? "bg-[var(--color-brand-gold)] opacity-100" : "opacity-0 group-hover:opacity-50 bg-white/40"}`} />
                        <Icon className="w-4 h-4" />
                        <span className={`${collapsed ? "sr-only" : ""}`}>{it.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </nav>
      </div>
    </aside>
  );
} 