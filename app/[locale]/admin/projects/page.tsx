import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { InlineEditTitle } from "@/components/admin/InlineEditTitle";

export default async function AdminProjectsList({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("projects")
    .select("id, title, slug, cover_url, image_url, published_at, updated_at, created_by")
    .order("updated_at", { ascending: false });
  const items = data ?? [];

  async function publishAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    const publish = String(formData.get("publish")) === "true";
    const supabase = await getSupabaseServerClient();
    const payload = { published_at: publish ? new Date().toISOString() : null } as any;
    await supabase.from("projects").update(payload).eq("id", id);
    revalidatePath(`/${locale}/admin/projects`);
  }

  async function deleteAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    const supabase = await getSupabaseServerClient();
    await supabase.from("projects").delete().eq("id", id);
    revalidatePath(`/${locale}/admin/projects`);
  }

  return (
    <div className="space-y-4">
      <AdminHeader
        title="Projects"
        subtitle="Manage projects and their publication status."
        actions={(
          <div className="flex items-center gap-2">
            <Button asChild variant="outline"><Link href={`/${locale}/admin/projects/new`}>Create</Link></Button>
            <Button variant="outline">Bulk actions</Button>
          </div>
        )}
      />
      <div className="flex items-center gap-2 flex-wrap justify-between">
        <div className="text-sm text-muted-foreground">{items.length} items</div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">All</Button>
          <Button size="sm" variant="outline">Published</Button>
          <Button size="sm" variant="outline">Drafts</Button>
          <Button size="sm" variant="outline">Sort: Updated</Button>
        </div>
      </div>
      <div className="overflow-x-auto border rounded-md bg-white/80">
        <table className="w-full text-sm" role="grid" aria-label="Projects table">
          <thead className="bg-black/5">
            <tr>
              <th className="text-left p-2 w-10" aria-label="Select all"><input type="checkbox" aria-label="Select all" /></th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Updated</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n: any) => (
              <tr key={n.id} className="border-t hover:bg-black/2">
                <td className="p-2 align-top"><input type="checkbox" aria-label={`Select ${n.title}`} /></td>
                <td className="p-2 align-top">
                  <div className="flex items-start gap-3">
                    {n.cover_url || n.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={n.cover_url || n.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-neutral-200" />
                    )}
                    <div>
                      <InlineEditTitle table="projects" id={n.id} initialTitle={n.title} className="font-medium" />
                      <div className="text-[11px] opacity-60">/{locale}/projects/{n.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="p-2 align-top">
                  {n.published_at ? (
                    <Badge>Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </td>
                <td className="p-2 align-top">{n.updated_at ? new Date(n.updated_at).toLocaleString() : "-"}</td>
                <td className="p-2 text-right align-top">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/${locale}/admin/projects/${n.id}/edit`} className="underline">Edit</Link>
                    <form action={publishAction} className="inline-block">
                      <input type="hidden" name="id" value={n.id} />
                      <input type="hidden" name="publish" value={n.published_at ? "false" : "true"} />
                      <Button size="sm" variant="outline" type="submit">{n.published_at ? "Unpublish" : "Publish"}</Button>
                    </form>
                    <form action={deleteAction} className="inline-block">
                      <input type="hidden" name="id" value={n.id} />
                      <Button size="sm" variant="destructive" type="submit">Delete</Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td className="p-6 text-center text-neutral-500" colSpan={5}>No items</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 