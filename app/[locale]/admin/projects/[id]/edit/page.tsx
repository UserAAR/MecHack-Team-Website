"use client";

import { useEffect, useState } from "react";
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

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().optional(),
  title_az: z.string().optional(),
  description_az: z.string().optional(),
  content_az: z.string().optional(),
  slug: z.string().optional(),
  cover_url: z.string().url().optional(),
  publish: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminProjectEdit() {
  const params = useParams<{ locale: string; id: string }>();
  const { locale, id } = params ?? { locale: "en", id: "" };
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, content, title_az, description_az, content_az, slug, cover_url, published_at")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        setError(error?.message ?? "Not found");
      } else {
        reset({
          title: data.title ?? "",
          description: data.description ?? "",
          content: data.content ?? "",
          title_az: data.title_az ?? "",
          description_az: data.description_az ?? "",
          content_az: data.content_az ?? "",
          slug: data.slug ?? "",
          cover_url: data.cover_url ?? "",
          publish: !!data.published_at,
        });
      }
      setLoading(false);
    })();
  }, [id, reset, supabase]);

  async function onSubmit(values: FormValues) {
    setSaving(true);
    setError(null);
    try {
      const payload: any = {
        title: values.title,
        description: values.description,
        content: values.content ?? null,
        title_az: values.title_az ?? null,
        description_az: values.description_az ?? null,
        content_az: values.content_az ?? null,
        cover_url: values.cover_url ?? null,
        published_at: values.publish ? new Date().toISOString() : null,
      };
      const { error } = await supabase.from("projects").update(payload).eq("id", id);
      if (error) throw error;
      router.replace(`/${locale}/admin/projects`);
    } catch (e: any) {
      setError(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    router.replace(`/${locale}/admin/projects`);
  }

  const coverUrl = watch("cover_url");

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Edit Project"
        actions={(
          <div className="flex gap-2">
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
                <label className="block text-sm mb-1">Description</label>
                <Textarea rows={4} {...register("description")} placeholder="Short description" />
                {errors.description ? <div className="text-xs text-red-600 mt-1">{errors.description.message}</div> : null}
              </div>
              <div>
                <label className="block text-sm mb-1">Content (HTML allowed)</label>
                <Textarea rows={10} {...register("content")} placeholder="Content" />
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
                <label className="block text-sm mb-1">Description (AZ)</label>
                <Textarea rows={4} {...register("description_az")} placeholder="AZ Description" />
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
                <ImageUploader value={coverUrl} onChange={(url) => setValue("cover_url", url, { shouldDirty: true })} folder="projects" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 