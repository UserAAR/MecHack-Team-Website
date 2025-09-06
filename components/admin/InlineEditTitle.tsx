"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Check, Loader2, Pencil } from "lucide-react";

export function InlineEditTitle({
  table,
  id,
  initialTitle,
  className,
}: {
  table: "news" | "projects" | "events";
  id: string | number;
  initialTitle: string;
  className?: string;
}) {
  const supabase = getSupabaseBrowserClient();
  const [value, setValue] = useState(initialTitle);
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function save(next: string) {
    if (!next || next.trim() === "" || next === initialTitle) {
      setEditing(false);
      setValue(initialTitle);
      return;
    }
    startTransition(async () => {
      const old = value;
      setValue(next);
      try {
        const { error } = await supabase.from(table).update({ title: next }).eq("id", id);
        if (error) throw error;
        toast.success("Updated title");
      } catch (e: any) {
        setValue(old);
        toast.error(e?.message ?? "Update failed");
      } finally {
        setEditing(false);
      }
    });
  }

  if (!editing) {
    return (
      <div className={className}>
        <button
          className="inline-flex items-center gap-1 hover:underline"
          onClick={() => setEditing(true)}
          aria-label="Edit title"
        >
          <Pencil className="w-3.5 h-3.5 opacity-60" /> {value}
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          className="h-8 px-2 border rounded-md text-sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => save(value.trim())}
          onKeyDown={(e) => {
            if (e.key === "Enter") save(value.trim());
            if (e.key === "Escape") { setEditing(false); setValue(initialTitle); }
          }}
          aria-label="Title"
        />
        <button className="inline-flex items-center justify-center w-7 h-7 rounded-md border" onMouseDown={(e) => e.preventDefault()} onClick={() => save(value.trim())} aria-label="Save">
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
} 