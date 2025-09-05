import { getSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChartArea } from "@/components/admin/ChartArea";
import { BarChart3, Newspaper, FolderKanban, CalendarDays } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await getSupabaseServerClient();
  const [newsDraft, newsPub, projDraft, projPub, evDraft, evPub] = await Promise.all([
    supabase.from("news").select("id", { count: "exact", head: true }).is("published_at", null),
    supabase.from("news").select("id", { count: "exact", head: true }).not("published_at", "is", null),
    supabase.from("projects").select("id", { count: "exact", head: true }).is("published_at", null),
    supabase.from("projects").select("id", { count: "exact", head: true }).not("published_at", "is", null),
    supabase.from("events").select("id", { count: "exact", head: true }).is("published_at", null),
    supabase.from("events").select("id", { count: "exact", head: true }).not("published_at", "is", null),
  ]);
  const counts = {
    news: { draft: newsDraft.count ?? 0, published: newsPub.count ?? 0 },
    projects: { draft: projDraft.count ?? 0, published: projPub.count ?? 0 },
    events: { draft: evDraft.count ?? 0, published: evPub.count ?? 0 },
  };

  const chartData = [
    { name: "Jan", value: counts.news.published + 2 },
    { name: "Feb", value: counts.projects.published + 4 },
    { name: "Mar", value: counts.events.published + 3 },
    { name: "Apr", value: counts.news.published + 5 },
    { name: "May", value: counts.projects.published + 1 },
    { name: "Jun", value: counts.events.published + 2 },
  ];

  return (
    <div className="grid gap-6">
      <AdminHeader title="Dashboard" subtitle="Overview of your content and activity in the system." actions={(
        <div className="hidden md:flex gap-2">
          <Button asChild variant="outline"><Link href={`/${locale}/admin/news/new`}>New News</Link></Button>
          <Button asChild variant="outline"><Link href={`/${locale}/admin/projects/new`}>New Project</Link></Button>
          <Button asChild variant="outline"><Link href={`/${locale}/admin/events/new`}>New Event</Link></Button>
        </div>
      )} />

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md bg-white/80">
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle>News</CardTitle><Newspaper className="w-5 h-5 text-[var(--color-brand-gold)]" /></CardHeader>
          <CardContent className="flex items-end gap-6">
            <div>
              <div className="text-xs text-neutral-600">Published</div>
              <div className="text-3xl font-semibold">{counts.news.published}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-600">Drafts</div>
              <div className="text-2xl font-semibold">{counts.news.draft}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-white/80">
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Projects</CardTitle><FolderKanban className="w-5 h-5 text-[var(--color-brand-gold)]" /></CardHeader>
          <CardContent className="flex items-end gap-6">
            <div>
              <div className="text-xs text-neutral-600">Published</div>
              <div className="text-3xl font-semibold">{counts.projects.published}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-600">Drafts</div>
              <div className="text-2xl font-semibold">{counts.projects.draft}</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-white/80">
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Events</CardTitle><CalendarDays className="w-5 h-5 text-[var(--color-brand-gold)]" /></CardHeader>
          <CardContent className="flex items-end gap-6">
            <div>
              <div className="text-xs text-neutral-600">Published</div>
              <div className="text-3xl font-semibold">{counts.events.published}</div>
            </div>
            <div>
              <div className="text-xs text-neutral-600">Drafts</div>
              <div className="text-2xl font-semibold">{counts.events.draft}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-semibold"><BarChart3 className="w-4 h-4" /> Content trend</div>
            <div className="text-xs text-neutral-600">last 6 months</div>
          </div>
          <ChartArea data={chartData} />
        </div>
        <Card className="border-0 shadow-md bg-white/80">
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="flex gap-2 flex-wrap">
              <Button asChild variant="outline"><Link href={`/${locale}/admin/news/new`}>Create News</Link></Button>
              <Button asChild variant="outline"><Link href={`/${locale}/admin/projects/new`}>Create Project</Link></Button>
              <Button asChild variant="outline"><Link href={`/${locale}/admin/events/new`}>Create Event</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 