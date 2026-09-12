import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_SHAPES = ["rectangle", "square", "capsule"];

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

    const { shape } = await req.json();

    if (!shape || !VALID_SHAPES.includes(shape)) {
      return NextResponse.json({ error: "Invalid shape" }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("creators")
      .update({ widget_shape: shape, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, shape });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
