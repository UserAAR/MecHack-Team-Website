"use client";

import Link from "next/link";
import { Menu, Bell, LogOut } from "lucide-react";

export function AdminTopbar({ locale, role }: { locale: string; role: string }) {
  return (
    <header className="h-14 border-b bg-white/70 backdrop-blur sticky top-0 z-40">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 lg:hidden">
          <button className="inline-flex items-center justify-center w-9 h-9 rounded-md border hover:bg-black/5" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-semibold">Admin</div>
        </div>
        <div className="hidden lg:block font-semibold">Admin</div>
        <div className="flex items-center gap-3">
          <Link href={`/${locale}`} className="text-sm underline opacity-80 hover:opacity-100">Preview site</Link>
          <button className="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-black/5" aria-label="Notifications">
            <Bell className="w-4 h-4" />
          </button>
          <div className="px-2 py-1 rounded-full text-xs bg-black/5">{role}</div>
          <form action={`/${locale}/auth/sign-out`} method="post">
            <button className="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-black/5" aria-label="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
} 