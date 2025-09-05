"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function SystemPage() {
  const [deploying, setDeploying] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace(`/${locale}/auth/sign-in`); return; }
      const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      if (me?.role !== "superadmin") router.replace(`/${locale}/admin`);
    })();
  }, [locale, router, supabase]);

  async function triggerDeploy() {
    setDeploying(true);
    setMsg(null);
    try {
      const url = process.env.NEXT_PUBLIC_DEPLOY_HOOK_URL;
      if (!url) throw new Error("Deploy hook URL not configured");
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) throw new Error("Deploy hook failed");
      setMsg("Deploy triggered");
    } catch (e: any) {
      setMsg(e.message ?? "Deploy failed");
    } finally {
      setDeploying(false);
    }
  }
  return (
    <div className="space-y-4">
      <AdminHeader title="System" subtitle="Administrative utilities for superadmins." />
      <div>
        <Button onClick={triggerDeploy} disabled={deploying}>{deploying ? "Triggering..." : "Trigger Deploy"}</Button>
        {msg ? <div className="text-sm mt-2">{msg}</div> : null}
      </div>
    </div>
  );
} 