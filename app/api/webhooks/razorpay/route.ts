import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";

    const isValid = verifyWebhookSignature({ rawBody, signature });
    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
    }

    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const event = String(payload.event || "");

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = (payload.payload as Record<string, unknown>)?.payment as Record<string, unknown> | undefined;
      const entity = paymentEntity?.entity as Record<string, unknown> | undefined;

      const orderId = String(entity?.order_id || "");
      const paymentId = String(entity?.id || "");

      if (orderId) {
        const supabase = await createClient();
        await supabase
          .from("tips")
          .update({
            status: "completed",
            razorpay_payment_id: paymentId,
          })
          .eq("razorpay_order_id", orderId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Error processing Razorpay webhook:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
