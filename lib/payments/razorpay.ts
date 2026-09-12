import crypto from "node:crypto";

export function getRazorpayKeyId(): string | undefined {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || undefined;
}

export function getRazorpayKeySecret(): string | undefined {
  return process.env.RAZORPAY_KEY_SECRET?.trim() || undefined;
}

export function getRazorpayWebhookSecret(): string | undefined {
  return process.env.RAZORPAY_WEBHOOK_SECRET?.trim() || undefined;
}

export function isRazorpayConfigured(): boolean {
  return Boolean(getRazorpayKeyId() && getRazorpayKeySecret());
}

export interface CreateOrderParams {
  amount: number; // in INR
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number; // in paise
  currency: string;
  keyId: string;
  isMock: boolean;
}

export async function createRazorpayOrder(params: CreateOrderParams): Promise<RazorpayOrderResult> {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();

  // Amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(params.amount * 100);
  const currency = params.currency || "INR";

  if (!keyId || !keySecret) {
    // Return mock order details if API keys are not provided
    const mockId = `order_demo_${crypto.randomBytes(8).toString("hex")}`;
    return {
      id: mockId,
      amount: amountInPaise,
      currency,
      keyId: "rzp_test_demo_key",
      isMock: true,
    };
  }

  const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency,
      receipt: params.receipt || `rcpt_${Date.now()}`,
      notes: params.notes || {},
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Razorpay API Error: ${res.status} ${errorText}`);
  }

  const data = (await res.json()) as { id: string; amount: number; currency: string };
  return {
    id: data.id,
    amount: data.amount,
    currency: data.currency,
    keyId,
    isMock: false,
  };
}

export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = getRazorpayKeySecret();

  // If mock mode (no secret set or demo order_id)
  if (!keySecret || params.orderId.startsWith("order_demo_")) {
    return true;
  }

  const body = `${params.orderId}|${params.paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  return expectedSignature === params.signature;
}

export function verifyWebhookSignature(params: {
  rawBody: string;
  signature: string;
  webhookSecret?: string;
}): boolean {
  const secret = params.webhookSecret || getRazorpayWebhookSecret();
  if (!secret) return true; // Allow for testing if webhook secret not set

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(params.rawBody)
    .digest("hex");

  return expectedSignature === params.signature;
}
