"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { toast } from "sonner";
import { format } from "date-fns";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  title_az: z.string().optional(),
  content_az: z.string().optional(),
  slug: z.string().optional(),
  cover_url: z.string().url().optional(),
  publish: z.boolean().optional(),
  scheduled_at: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminNewsEdit() {
  const params = useParams<{ locale: string; id: string }>();
  const { locale, id } = params ?? { locale: "en", id: "" };
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const { register, handleSubmit, setValue, reset, watch, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "",
    editorProps: { attributes: { class: "prose prose-sm max-w-none focus:outline-none min-h-[220px]" } },
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML(), { shouldDirty: true });
    },
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("id, title, content, title_az, content_az, slug, cover_url, published_at, scheduled_at")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        setError(error?.message ?? "Not found");
      } else {
        reset({
          title: data.title ?? "",
          content: data.content ?? "",
          title_az: data.title_az ?? "",
          content_az: data.content_az ?? "",
          slug: data.slug ?? "",
          cover_url: data.cover_url ?? "",
          publish: !!data.published_at,
          scheduled_at: (data as any).scheduled_at ?? null,
        });
        editor?.commands.setContent(data.content ?? "");
        setPreviewURL(`${location.origin}/${locale}/news/${data.slug}?preview=${id}`);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reset, supabase]);

  const coverUrl = watch("cover_url");

  // Autosave (debounced)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valuesForAutosave = watch();
  useEffect(() => {
    if (!isDirty) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const payload: any = {
          title: valuesForAutosave.title,
          content: valuesForAutosave.content ?? null,
          title_az: valuesForAutosave.title_az ?? null,
          content_az: valuesForAutosave.content_az ?? null,
          cover_url: valuesForAutosave.cover_url ?? null,
          slug: valuesForAutosave.slug && valuesForAutosave.slug.trim().length > 0 ? valuesForAutosave.slug : slugify(valuesForAutosave.title ?? ""),
          scheduled_at: valuesForAutosave.scheduled_at ?? null,
        };
        await supabase.from("news").update(payload).eq("id", id);
        toast.message("Saved", { description: "Autosaved", duration: 2000 });
      } catch (e) {
        // ignore
      }
    }, 1200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [id, isDirty, supabase, valuesForAutosave]);

  async function onSubmit(values: FormValues) {
    setSaving(true);
    setError(null);
    try {
      const slug = values.slug && values.slug.trim().length > 0 ? values.slug : slugify(values.title);
      const payload: any = {
        title: values.title,
        content: values.content ?? null,
        title_az: values.title_az ?? null,
        content_az: values.content_az ?? null,
        cover_url: values.cover_url ?? null,
        slug,
        published_at: values.publish ? new Date().toISOString() : null,
        scheduled_at: values.scheduled_at ?? null,
      };
      const { error } = await supabase.from("news").update(payload).eq("id", id);
      if (error) throw error;
      toast.success("Saved");
      router.replace(`/${locale}/admin/news`);
    } catch (e: any) {
      setError(e.message ?? "Save failed");
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    const confirmed = window.confirm("Delete this item?");
    if (!confirmed) return;
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast("Deleted", { action: { label: "Undo", onClick: async () => {/* could restore with RLS */} } });
    router.replace(`/${locale}/admin/news`);
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Edit News"
        subtitle={previewURL ? `Preview URL: ${previewURL}` : undefined}
        actions={(
          <div className="flex gap-2">
            <Button variant="outline" asChild><a href={previewURL ?? "#"} target="_blank" rel="noreferrer">Preview</a></Button>
            <Button variant="outline" onClick={() => setValue("publish", false)}>Save draft</Button>
            <Button variant="destructive" onClick={onDelete} disabled={saving || loading}>Delete</Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={saving || loading}>Save</Button>
          </div>
        )}
      />

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Content (EN)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <Input {...register("title")} placeholder="Title" />
                {errors.title ? <div className="text-xs text-red-600 mt-1">{errors.title.message}</div> : null}
              </div>
              <div>
                <label className="block text-sm mb-1">Content</label>
                <div className="rounded-md border bg-background p-2">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Content (AZ - optional)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title (AZ)</label>
                <Input {...register("title_az")} placeholder="AZ Title" />
              </div>
              <div>
                <label className="block text-sm mb-1">Content (AZ)</label>
                <Textarea rows={10} {...register("content_az")} placeholder="AZ Content" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Meta</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Slug</label>
                <Input {...register("slug")} placeholder="auto from title if empty" />
              </div>
              <div>
                <label className="block text-sm mb-1">Cover image</label>
                <ImageUploader value={watch("cover_url")} onChange={(url) => setValue("cover_url", url, { shouldDirty: true })} folder="news" />
              </div>
              <div>
                <label className="block text-sm mb-1">Schedule publication</label>
                <Input type="datetime-local" {...register("scheduled_at")} />
                <div className="text-xs text-muted-foreground mt-1">Optional. If set, post will be published at scheduled time.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 