import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: creator } = await supabase
      .from("creators")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!creator) {
      return NextResponse.json({ error: "Creator profile not found" }, { status: 404 });
    }

    const { action, tipId, supporterName, reason } = await req.json();

    if (action === "hide_tip") {
      if (!tipId) {
        return NextResponse.json({ error: "Tip ID is required" }, { status: 400 });
      }

      const { error: hideErr } = await supabase
        .from("tips")
        .update({ status: "hidden" })
        .eq("id", tipId)
        .eq("creator_id", creator.id);

      if (hideErr) {
        return NextResponse.json({ error: hideErr.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, action: "hide_tip" });
    }

    if (action === "ban_supporter") {
      if (!supporterName) {
        return NextResponse.json({ error: "Supporter name is required" }, { status: 400 });
      }

      // Add to banned_supporters
      const { error: banErr } = await supabase.from("banned_supporters").insert({
        creator_id: creator.id,
        supporter_name: supporterName,
        reason: reason || "Banned by moderator",
      });

      if (banErr && !banErr.message.includes("unique")) {
        return NextResponse.json({ error: banErr.message }, { status: 500 });
      }

      // Hide all past tips from this supporter
      await supabase
        .from("tips")
        .update({ status: "hidden" })
        .eq("creator_id", creator.id)
        .ilike("supporter_name", supporterName);

      return NextResponse.json({ success: true, action: "ban_supporter" });
    }

    if (action === "unban_supporter") {
      if (!supporterName) {
        return NextResponse.json({ error: "Supporter name is required" }, { status: 400 });
      }

      const { error: unbanErr } = await supabase
        .from("banned_supporters")
        .delete()
        .eq("creator_id", creator.id)
        .ilike("supporter_name", supporterName);

      if (unbanErr) {
        return NextResponse.json({ error: unbanErr.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, action: "unban_supporter" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
