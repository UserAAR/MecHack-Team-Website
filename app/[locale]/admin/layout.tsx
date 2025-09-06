import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminProviders } from "@/components/admin/AdminProviders";

export default async function AdminLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/auth/sign-in`);
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const role = profile?.role ?? "user";
  if (role !== "admin" && role !== "superadmin") redirect(`/${locale}`);

  return (
    <AdminProviders>
      <div className="admin-theme min-h-screen bg-[var(--color-brand-cream)] text-[var(--color-brand-navy)] dark:bg-background dark:text-foreground">
        <AdminTopbar locale={locale} role={role} />
        <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr] min-h-[calc(100vh-56px)]">
          <AdminSidebar locale={locale} role={role as any} />
          <main className="p-4 lg:p-8 overflow-auto bg-[linear-gradient(180deg,#f5f2e1,#ffffff)] dark:bg-background">
            <div className="max-w-[1200px] mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProviders>
  );
} 