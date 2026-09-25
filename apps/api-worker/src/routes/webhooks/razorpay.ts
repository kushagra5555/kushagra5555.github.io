import { grantEnrollmentIdempotent } from "../../lib/enrollment";
import { constantTimeEqual, hmacSha256Hex, json } from "../../lib/security";
import { createSupabaseAdmin } from "../../lib/supabase-admin";
import type { Env } from "../../lib/types";

export async function razorpayWebhookHandler(request: Request, env: Env) {
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  const rawBody = await request.text();
  const computed = await hmacSha256Hex(env.RAZORPAY_WEBHOOK_SECRET, rawBody);
  if (!constantTimeEqual(signature, computed)) return json({ error: "Invalid signature" }, 400);

  const payload = JSON.parse(rawBody) as {
    event: "payment.captured" | "payment.failed";
    payload: { payment: { entity: { id: string; order_id: string; amount: number; currency: string; status: string } } };
  };

  const paymentEntity = payload.payload.payment.entity;
  const supabase = createSupabaseAdmin(env);
  const { data: payment } = await supabase
    .from("payments")
    .select("id,user_id,course_id,amount_paise,currency,razorpay_order_id")
    .eq("razorpay_order_id", paymentEntity.order_id)
    .maybeSingle();

  if (!payment) return json({ ok: true });

  if (payload.event === "payment.captured") {
    if (
      paymentEntity.amount === payment.amount_paise &&
      paymentEntity.currency === payment.currency &&
      paymentEntity.status === "captured"
    ) {
      await supabase
        .from("payments")
        .update({ status: "captured", razorpay_payment_id: paymentEntity.id, verified_at: new Date().toISOString() })
        .eq("id", payment.id);
      await grantEnrollmentIdempotent(supabase, payment.user_id, payment.course_id, payment.id);
    }
  }

  if (payload.event === "payment.failed") {
    await supabase
      .from("payments")
      .update({ status: "failed", razorpay_payment_id: paymentEntity.id })
      .eq("id", payment.id);
  }

  return json({ ok: true });
}
