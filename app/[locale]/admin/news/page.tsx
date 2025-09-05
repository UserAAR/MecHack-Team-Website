import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminNewsList({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase
    .from("news")
    .select("id, title, slug, cover_url, image_url, published_at, updated_at, created_by")
    .order("updated_at", { ascending: false });
  const items = data ?? [];

  async function publishAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    const publish = String(formData.get("publish")) === "true";
    const supabase = await getSupabaseServerClient();
    const payload = { published_at: publish ? new Date().toISOString() : null } as any;
    await supabase.from("news").update(payload).eq("id", id);
    revalidatePath(`/${locale}/admin/news`);
  }

  async function deleteAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id"));
    const supabase = await getSupabaseServerClient();
    await supabase.from("news").delete().eq("id", id);
    revalidatePath(`/${locale}/admin/news`);
  }

  return (
    <div className="space-y-4">
      <AdminHeader
        title="News"
        subtitle="Create, publish and manage news posts."
        actions={(
          <Button asChild><Link href={`/${locale}/admin/news/new`}>Create News</Link></Button>
        )}
      />
      <div className="overflow-x-auto border rounded-md bg-white/70">
        <table className="w-full text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="text-left p-2 w-12"></th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Updated</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n: any) => (
              <tr key={n.id} className="border-t">
                <td className="p-2">
                  {n.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.cover_url} alt="" className="w-10 h-10 rounded object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-neutral-200" />
                  )}
                </td>
                <td className="p-2">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-[11px] opacity-60">/{locale}/news/{n.slug}</div>
                </td>
                <td className="p-2">
                  {n.published_at ? (
                    <Badge>Published</Badge>
                  ) : (
                    <Badge variant="outline">Draft</Badge>
                  )}
                </td>
                <td className="p-2">{n.updated_at ? new Date(n.updated_at).toLocaleString() : "-"}</td>
                <td className="p-2 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Link href={`/${locale}/admin/news/${n.id}/edit`} className="underline">Edit</Link>
                    <form action={publishAction}>
                      <input type="hidden" name="id" value={n.id} />
                      <input type="hidden" name="publish" value={n.published_at ? "false" : "true"} />
                      <Button size="sm" variant="outline" type="submit">{n.published_at ? "Unpublish" : "Publish"}</Button>
                    </form>
                    <form action={deleteAction}>
                      <input type="hidden" name="id" value={n.id} />
                      <Button size="sm" variant="destructive" type="submit">Delete</Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td className="p-4 text-center text-neutral-500" colSpan={5}>No items</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 