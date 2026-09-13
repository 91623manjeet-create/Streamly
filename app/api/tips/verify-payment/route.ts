import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { verifyPaymentSignature } from "@/lib/payments/razorpay";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

    const orderId = String(razorpay_order_id || "").trim();
    const paymentId = String(razorpay_payment_id || "").trim() || `pay_mock_${Date.now()}`;
    const signature = String(razorpay_signature || "").trim();

    if (!orderId) {
      return NextResponse.json({ error: "Missing razorpay_order_id." }, { status: 400 });
    }

    const isValid = verifyPaymentSignature({
      orderId,
      paymentId,
      signature: signature || "demo_signature",
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature verification failed." }, { status: 400 });
    }

    let updatedTip = null;

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createClient();
        await supabase
          .from("tips")
          .update({
            status: "completed",
            razorpay_payment_id: paymentId,
          })
          .eq("razorpay_order_id", orderId);

        const { data } = await supabase
          .from("tips")
          .select("id, creator_id, supporter_name, supporter_email, amount, currency, message, is_anonymous, created_at")
          .eq("razorpay_order_id", orderId)
          .maybeSingle();

        if (data) updatedTip = data;
      } catch (err) {
        console.warn("Non-fatal Supabase tip update warning:", err);
      }
    }

    return NextResponse.json({
      success: true,
      tip: updatedTip || {
        id: `tip_${Date.now()}`,
        status: "completed",
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        created_at: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Error in verify-payment endpoint:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
