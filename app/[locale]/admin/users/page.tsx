import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminUsers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/sign-in`);
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (me?.role !== "superadmin") redirect(`/${locale}/admin`);

  const { data } = await supabase.from("profiles").select("id, email, role, created_at").order("created_at", { ascending: false });
  const rows = data ?? [];

  async function updateRole(formData: FormData) {
    "use server";
    const supabase = await getSupabaseServerClient();
    const id = String(formData.get("id"));
    const role = String(formData.get("role"));
    await supabase.from("profiles").update({ role }).eq("id", id);
    revalidatePath(`/${locale}/admin/users`);
  }

  return (
    <div className="space-y-4">
      <AdminHeader title="Users" subtitle="Manage user roles and access." />
      <div className="overflow-x-auto border rounded-md bg-white/60">
        <table className="w-full text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Created</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.created_at ? new Date(u.created_at).toLocaleString() : "-"}</td>
                <td className="p-2 text-right">
                  <form action={updateRole} className="inline-flex items-center gap-2">
                    <input type="hidden" name="id" value={u.id} />
                    <select name="role" defaultValue={u.role} className="border rounded px-2 py-1">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="superadmin">superadmin</option>
                    </select>
                    <button type="submit" className="underline">Save</button>
                  </form>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td className="p-4 text-center text-neutral-500" colSpan={4}>No users</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 