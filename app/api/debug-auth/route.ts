import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr) {
      return NextResponse.json({ ok: false, stage: "auth.getUser", error: userErr.message }, { status: 200 });
    }
    if (!user) {
      return NextResponse.json({ ok: false, stage: "no-user" }, { status: 200 });
    }
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("id", user.id)
      .maybeSingle();
    return NextResponse.json({ ok: true, user, profile, profErr }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "unknown" }, { status: 500 });
  }
} 