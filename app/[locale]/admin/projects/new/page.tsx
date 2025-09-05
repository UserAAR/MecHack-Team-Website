"use client";

import { useState } from "react";
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

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().optional(),
  slug: z.string().optional(),
  image_url: z.string().url().optional(),
  publish: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminProjectCreate() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { publish: false },
  });

  async function onSubmit(values: FormValues) {
    setSaving(true);
    setError(null);
    try {
      const slug = values.slug && values.slug.trim().length > 0 ? values.slug : slugify(values.title);
      const table = locale === "az" ? "projects_az" : "projects";
      const { data: { user } } = await supabase.auth.getUser();
      const payload: any = {
        title: values.title,
        summary: values.summary,
        content: values.content ?? null,
        image_url: values.image_url ?? null,
        slug,
        published_at: values.publish ? new Date().toISOString() : null,
        created_by: user?.id ?? null,
      };
      const { error } = await supabase.from(table).insert(payload).single();
      if (error) throw error;
      router.replace(`/${locale}/admin/projects`);
    } catch (e: any) {
      setError(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const imageUrl = watch("image_url");

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Create Project"
        actions={(
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSubmit((v) => onSubmit({ ...v, publish: false }))} disabled={saving}>Save draft</Button>
            <Button onClick={handleSubmit((v) => onSubmit({ ...v, publish: true }))} disabled={saving}>Publish</Button>
          </div>
        )}
      />

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Title</label>
                <Input {...register("title")} placeholder="Title" />
                {errors.title ? <div className="text-xs text-red-600 mt-1">{errors.title.message}</div> : null}
              </div>
              <div>
                <label className="block text-sm mb-1">Summary</label>
                <Textarea rows={4} {...register("summary")} placeholder="Short summary" />
                {errors.summary ? <div className="text-xs text-red-600 mt-1">{errors.summary.message}</div> : null}
              </div>
              <div>
                <label className="block text-sm mb-1">Content (HTML allowed)</label>
                <Textarea rows={10} {...register("content")} placeholder="Content" />
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
                <ImageUploader value={imageUrl} onChange={(url) => setValue("image_url", url, { shouldDirty: true })} folder="projects" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 