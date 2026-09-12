import { NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/payments/razorpay";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

    const orderId = String(razorpay_order_id || "").trim();
    const paymentId = String(razorpay_payment_id || "").trim();
    const signature = String(razorpay_signature || "").trim();

    if (!orderId) {
      return NextResponse.json({ error: "Missing razorpay_order_id." }, { status: 400 });
    }

    const isValid = verifyPaymentSignature({
      orderId,
      paymentId: paymentId || `pay_mock_${Date.now()}`,
      signature,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature verification failed." }, { status: 400 });
    }

    const supabase = await createClient();

    // Update tip record to completed
    const { error: updateError } = await supabase
      .from("tips")
      .update({
        status: "completed",
        razorpay_payment_id: paymentId || `pay_mock_${Date.now()}`,
      })
      .eq("razorpay_order_id", orderId);

    if (updateError) {
      console.error("Error updating tip status:", updateError);
      return NextResponse.json({ error: "Failed to update tip payment status." }, { status: 500 });
    }

    // Retrieve updated tip record
    const { data: updatedTip, error: selectError } = await supabase
      .from("tips")
      .select("id, creator_id, supporter_name, supporter_email, amount, currency, message, is_anonymous, created_at")
      .eq("razorpay_order_id", orderId)
      .maybeSingle();

    if (selectError) {
      console.error("Error retrieving updated tip:", selectError);
    }

    return NextResponse.json({
      success: true,
      tip: updatedTip,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Error in verify-payment endpoint:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
