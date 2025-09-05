"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { AdminHeader } from "@/components/admin/AdminHeader";
import Image from "next/image";

export default function MediaLibrary() {
  const supabase = getSupabaseBrowserClient();
  const [items, setItems] = useState<{ name: string; url: string }[]>([]);
  const [lastUpload, setLastUpload] = useState<string | undefined>(undefined);

  const load = useCallback(async () => {
    const { data } = await supabase.storage.from("media").list("", { limit: 50, sortBy: { column: "created_at", order: "desc" } as any });
    const rows = (data ?? []).filter((x: any) => !x.name.startsWith("."));
    const mapped = rows.map((r: any) => {
      const { data } = supabase.storage.from("media").getPublicUrl(r.name);
      return { name: r.name, url: data.publicUrl };
    });
    setItems(mapped);
  }, [supabase]);

  useEffect(() => { load(); }, [lastUpload, load]);

  return (
    <div className="space-y-6">
      <AdminHeader title="Media Library" subtitle="Upload and browse media assets." />
      <div>
        <ImageUploader folder="uploads" onChange={(url) => setLastUpload(url)} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it) => (
          <a key={it.name} href={it.url} target="_blank" className="block rounded border overflow-hidden">
            <div className="w-full h-40 relative">
              <Image src={it.url} alt={it.name} fill className="object-cover" />
            </div>
            <div className="p-2 text-xs truncate">{it.name}</div>
          </a>
        ))}
      </div>
    </div>
  );
} 