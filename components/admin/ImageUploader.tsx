"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  folder?: string; // e.g., "news"
};

export function ImageUploader({ value, onChange, folder = "misc" }: Props) {
  const supabase = getSupabaseBrowserClient();
  const [uploading, setUploading] = useState(false);

  async function handleFile(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 8 * 1024 * 1024) {
      alert("Max file size is 8MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="rounded border p-2 bg-white/70">
          <div className="relative w-full max-h-48">
            <Image src={value} alt="Cover" width={800} height={400} className="rounded object-cover w-full h-auto max-h-48" />
          </div>
        </div>
      ) : null}
      <div className="flex items-center gap-3">
        <input id="image-input" type="file" accept="image/*" onChange={(e) => handleFile(e.target.files)} />
        <Button type="button" disabled className="hidden">{uploading ? "Uploading..." : "Upload"}</Button>
      </div>
    </div>
  );
} 