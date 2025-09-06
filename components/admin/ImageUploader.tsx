"use client";

import { useState, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import { toast } from "sonner";

type Props = {
  value?: string;
  onChange: (url: string) => void;
  folder?: string; // e.g., "news"
};

export function ImageUploader({ value, onChange, folder = "misc" }: Props) {
  const supabase = getSupabaseBrowserClient();
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState("");
  const [cropMode, setCropMode] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Max file size is 8MB");
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
      toast.success("Image uploaded", {
        action: {
          label: "Undo",
          onClick: () => onChange("")
        }
      });
    } catch (e) {
      console.error(e);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }, [folder, onChange, supabase]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } });

  return (
    <div className="space-y-3">
      {value ? (
        <div className="rounded border p-2 bg-white/70">
          <div className="relative w-full max-h-56">
            <Image src={value} alt={altText || "Uploaded image"} width={800} height={400} className="rounded object-cover w-full h-auto max-h-56" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input
              className="h-9 px-2 text-sm border rounded-md flex-1"
              placeholder="Alt text for accessibility"
              aria-label="Alt text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => setCropMode((s) => !s)} aria-pressed={cropMode} aria-label="Toggle crop mode">
              {cropMode ? "Finish Crop" : "Crop"}
            </Button>
          </div>
          {cropMode ? (
            <div className="relative w-full h-64 mt-2 rounded overflow-hidden border">
              <Cropper
                image={value}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop as any}
                onZoomChange={setZoom}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        {...getRootProps()}
        className={`rounded border border-dashed p-4 text-center cursor-pointer transition-colors ${isDragActive ? "bg-accent" : "bg-white/70"}`}
        aria-label="Upload image"
      >
        <input {...getInputProps()} />
        <div className="text-sm">{uploading ? "Uploading…" : isDragActive ? "Drop the file here…" : "Drag & drop an image, or click to select"}</div>
        <div className="text-[11px] opacity-70">Max 8MB • PNG/JPG/WebP</div>
      </div>
    </div>
  );
} 