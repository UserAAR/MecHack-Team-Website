import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { InlineEditTitle } from "@/components/admin/InlineEditTitle";

export default async function AdminNewsList({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams?: Promise<{ status?: string; sort?: string }> }) {
  const { locale } = await params;
  const sp = (await searchParams) || {};
  const status = sp.status ?? "all"; // all | published | draft
  const sort = sp.sort ?? "updated"; // updated | created
  const supabase = await getSupabaseServerClient();
  let query = supabase
    .from("news")
    .select("id, title, slug, cover_url, image_url, published_at, updated_at, created_by")
    .order(sort === "created" ? "created_at" : "updated_at", { ascending: false });
  if (status === "published") query = query.not("published_at", "is", null);
  if (status === "draft") query = query.is("published_at", null);
  const { data } = await query;
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

  async function bulkDeleteAction(formData: FormData) {
    "use server";
    const ids = formData.getAll("ids").map(String);
    if (ids.length === 0) return;
    const supabase = await getSupabaseServerClient();
    await supabase.from("news").delete().in("id", ids);
    revalidatePath(`/${locale}/admin/news`);
  }

  const linkBase = `/${locale}/admin/news`;
  const makeLink = (next: { status?: string; sort?: string }) => {
    const s = next.status ?? status;
    const so = next.sort ?? sort;
    const qs = new URLSearchParams({ status: s, sort: so });
    return `${linkBase}?${qs.toString()}`;
  };

  return (
    <div className="space-y-4">
      <AdminHeader
        title="News"
        subtitle="Create, publish and manage news posts."
        actions={(
          <div className="flex items-center gap-2">
            <Button asChild variant="outline"><Link href={`/${locale}/admin/news/new`}>Create</Link></Button>
            <form action={bulkDeleteAction}><Button type="submit" variant="destructive">Delete selected</Button></form>
          </div>
        )}
      />

      <div className="flex items-center gap-2 flex-wrap justify-between">
        <div className="text-sm text-muted-foreground">{items.length} items</div>
        <div className="flex items-center gap-2">
          <Link href={makeLink({ status: "all" })}><Button size="sm" variant={status === "all" ? "default" : "outline"}>All</Button></Link>
          <Link href={makeLink({ status: "published" })}><Button size="sm" variant={status === "published" ? "default" : "outline"}>Published</Button></Link>
          <Link href={makeLink({ status: "draft" })}><Button size="sm" variant={status === "draft" ? "default" : "outline"}>Drafts</Button></Link>
          <Link href={makeLink({ sort: sort === "updated" ? "created" : "updated" })}><Button size="sm" variant="outline">Sort: {sort === "updated" ? "Updated" : "Created"}</Button></Link>
        </div>
      </div>

      <form action={bulkDeleteAction}>
        <div className="overflow-x-auto border rounded-md bg-white/80">
          <table className="w-full text-sm" role="grid" aria-label="News table">
            <thead className="bg-black/5">
              <tr>
                <th className="text-left p-2 w-10" aria-label="Select all"><input type="checkbox" aria-label="Select all" onChange={(e) => {
                  const checked = (e.target as HTMLInputElement).checked;
                  document.querySelectorAll<HTMLInputElement>('input[name="ids"]').forEach(cb => { cb.checked = checked; });
                }} /></th>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Updated</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((n: any) => (
                <tr key={n.id} className="border-t hover:bg-black/2">
                  <td className="p-2 align-top"><input type="checkbox" name="ids" value={n.id} aria-label={`Select ${n.title}`} /></td>
                  <td className="p-2 align-top">
                    <div className="flex items-start gap-3">
                      {n.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={n.cover_url} alt="" className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-neutral-200" />
                      )}
                      <div>
                        <InlineEditTitle table="news" id={n.id} initialTitle={n.title} className="font-medium" />
                        <div className="text-[11px] opacity-60">/{locale}/news/{n.slug}</div>
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
                      <Link href={`/${locale}/admin/news/${n.id}/edit`} className="underline">Edit</Link>
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
      </form>
    </div>
  );
} 