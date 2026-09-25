import { requireAuth } from "../../lib/auth";
import { grantEnrollmentIdempotent } from "../../lib/enrollment";
import { fetchRazorpayPayment } from "../../lib/razorpay";
import { constantTimeEqual, hmacSha256Hex, json } from "../../lib/security";
import { createSupabaseAdmin } from "../../lib/supabase-admin";
import type { Env } from "../../lib/types";

export async function verifyHandler(request: Request, env: Env) {
  try {
    const auth = await requireAuth(request, env);
    const body = (await request.json()) as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    const supabase = createSupabaseAdmin(env);
    const { data: payment } = await supabase
      .from("payments")
      .select("id,user_id,course_id,amount_paise,currency,razorpay_order_id,status")
      .eq("razorpay_order_id", body.razorpay_order_id)
      .single();

    if (!payment || payment.user_id !== auth.userId) return json({ error: "Order ownership mismatch" }, 403);

    const expectedSig = await hmacSha256Hex(
      env.RAZORPAY_KEY_SECRET,
      `${body.razorpay_order_id}|${body.razorpay_payment_id}`
    );
    if (!constantTimeEqual(expectedSig, body.razorpay_signature)) return json({ error: "Invalid signature" }, 400);

    const remotePayment = await fetchRazorpayPayment(env, body.razorpay_payment_id);
    if (
      remotePayment.status !== "captured" ||
      remotePayment.amount !== payment.amount_paise ||
      remotePayment.currency !== "INR" ||
      remotePayment.order_id !== payment.razorpay_order_id
    ) {
      return json({ error: "Payment verification failed" }, 400);
    }

    await supabase
      .from("payments")
      .update({
        status: "captured",
        verified_at: new Date().toISOString(),
        razorpay_payment_id: body.razorpay_payment_id
      })
      .eq("id", payment.id);

    await grantEnrollmentIdempotent(supabase, auth.userId, payment.course_id, payment.id);

    return json({ ok: true });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}
