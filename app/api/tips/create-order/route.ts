import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/payments/razorpay";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, amount, supporter_name, supporter_email, message, is_anonymous } = body || {};

    const cleanUsername = String(username || "").trim().toLowerCase();
    const cleanEmail = String(supporter_email || "").trim().toLowerCase();
    const parsedAmount = Number(amount);

    if (!cleanUsername) {
      return NextResponse.json({ error: "Creator username is required." }, { status: 400 });
    }

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required for payment receipt." }, { status: 400 });
    }

    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount < 1) {
      return NextResponse.json({ error: "Tip amount must be at least ₹1." }, { status: 400 });
    }

    const supabase = await createClient();

    // Look up creator
    const { data: creator, error: creatorError } = await supabase
      .from("creators")
      .select("id, display_name, is_active")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (creatorError || !creator) {
      return NextResponse.json({ error: "Creator not found." }, { status: 404 });
    }

    if (!creator.is_active) {
      return NextResponse.json({ error: "This creator is not accepting tips right now." }, { status: 400 });
    }

    // Create Razorpay order
    const order = await createRazorpayOrder({
      amount: parsedAmount,
      currency: "INR",
      notes: {
        creator_id: creator.id,
        creator_username: cleanUsername,
        supporter_email: cleanEmail,
      },
    });

    const displayName = is_anonymous
      ? "Anonymous Supporter"
      : String(supporter_name || "").trim() || "Anonymous Supporter";

    // Check if supporter is banned by creator
    if (displayName !== "Anonymous Supporter") {
      const { data: isBanned } = await supabase
        .from("banned_supporters")
        .select("id")
        .eq("creator_id", creator.id)
        .ilike("supporter_name", displayName)
        .maybeSingle();

      if (isBanned) {
        return NextResponse.json(
          { error: "You have been restricted from tipping this creator." },
          { status: 403 }
        );
      }
    }

    // Insert pending tip record into Supabase
    const { error: tipInsertError } = await supabase.from("tips").insert({
      creator_id: creator.id,
      supporter_name: displayName,
      supporter_email: cleanEmail,
      amount: parsedAmount,
      currency: "INR",
      message: String(message || "").trim() || null,
      is_anonymous: Boolean(is_anonymous),
      status: "pending",
      razorpay_order_id: order.id,
    });

    if (tipInsertError) {
      console.error("Error creating pending tip record:", tipInsertError);
      return NextResponse.json({ error: "Failed to initialize tip transaction." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: order.keyId,
      isMock: order.isMock,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Error in create-order endpoint:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
