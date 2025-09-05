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
  location: z.string().min(1, "Location is required"),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  title_az: z.string().optional(),
  description_az: z.string().optional(),
  location_az: z.string().optional(),
  slug: z.string().optional(),
  cover_url: z.string().url().optional(),
  publish: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminEventEdit() {
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
        .from("events")
        .select("id, title, description, location, title_az, description_az, location_az, starts_at, ends_at, slug, cover_url, published_at")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        setError(error?.message ?? "Not found");
      } else {
        reset({
          title: data.title ?? "",
          description: data.description ?? "",
          location: data.location ?? "",
          title_az: data.title_az ?? "",
          description_az: data.description_az ?? "",
          location_az: data.location_az ?? "",
          starts_at: data.starts_at ? new Date(data.starts_at).toISOString().slice(0,16) : "",
          ends_at: data.ends_at ? new Date(data.ends_at).toISOString().slice(0,16) : "",
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
        location: values.location,
        title_az: values.title_az ?? null,
        description_az: values.description_az ?? null,
        location_az: values.location_az ?? null,
        starts_at: values.starts_at ? new Date(values.starts_at).toISOString() : null,
        ends_at: values.ends_at ? new Date(values.ends_at).toISOString() : null,
        cover_url: values.cover_url ?? null,
        published_at: values.publish ? new Date().toISOString() : null,
      };
      const { error } = await supabase.from("events").update(payload).eq("id", id);
      if (error) throw error;
      router.replace(`/${locale}/admin/events`);
    } catch (e: any) {
      setError(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    router.replace(`/${locale}/admin/events`);
  }

  const coverUrl = watch("cover_url");

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Edit Event"
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
                <Textarea rows={6} {...register("description")} placeholder="Short description" />
                {errors.description ? <div className="text-xs text-red-600 mt-1">{errors.description.message}</div> : null}
              </div>
              <div>
                <label className="block text-sm mb-1">Location</label>
                <Input {...register("location")} placeholder="Location" />
                {errors.location ? <div className="text-xs text-red-600 mt-1">{errors.location.message}</div> : null}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Starts at</label>
                  <Input type="datetime-local" {...register("starts_at")} />
                </div>
                <div>
                  <label className="block text-sm mb-1">Ends at</label>
                  <Input type="datetime-local" {...register("ends_at")} />
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
                <label className="block text-sm mb-1">Description (AZ)</label>
                <Textarea rows={6} {...register("description_az")} placeholder="AZ Description" />
              </div>
              <div>
                <label className="block text-sm mb-1">Location (AZ)</label>
                <Input {...register("location_az")} placeholder="AZ Location" />
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
                <ImageUploader value={coverUrl} onChange={(url) => setValue("cover_url", url, { shouldDirty: true })} folder="events" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 