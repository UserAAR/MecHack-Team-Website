"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/navigation";

export function CommandPalette({ locale }: { locale: string }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  useHotkeys("ctrl+k, meta+k", (e) => { e.preventDefault(); setOpen((s) => !s); }, { enableOnFormTags: ["INPUT", "TEXTAREA"] });

  return (
    <div>
      {open ? (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh]">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <Command label="Command Menu" className="relative z-[61] w-[90vw] max-w-xl rounded-lg border bg-background shadow-xl">
            <Command.Input placeholder="Type a command or search…" className="w-full h-12 px-3 border-b outline-none" autoFocus />
            <Command.List className="max-h-[50vh] overflow-y-auto">
              <Command.Empty className="p-4 text-sm text-muted-foreground">No results.</Command.Empty>
              <Command.Group heading="Create">
                <Command.Item onSelect={() => router.push(`/${locale}/admin/news/new`)}>New News</Command.Item>
                <Command.Item onSelect={() => router.push(`/${locale}/admin/projects/new`)}>New Project</Command.Item>
                <Command.Item onSelect={() => router.push(`/${locale}/admin/events/new`)}>New Event</Command.Item>
              </Command.Group>
              <Command.Group heading="Navigate">
                <Command.Item onSelect={() => router.push(`/${locale}/admin/news`)}>Go to News</Command.Item>
                <Command.Item onSelect={() => router.push(`/${locale}/admin/projects`)}>Go to Projects</Command.Item>
                <Command.Item onSelect={() => router.push(`/${locale}/admin/events`)}>Go to Events</Command.Item>
                <Command.Item onSelect={() => router.push(`/${locale}`)}>View site</Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      ) : null}
    </div>
  );
} 