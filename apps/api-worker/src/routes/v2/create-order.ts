import { requireAuth } from "../../lib/auth";
import { createRazorpayOrder } from "../../lib/razorpay";
import { json } from "../../lib/security";
import { createSupabaseAdmin } from "../../lib/supabase-admin";
import type { Env } from "../../lib/types";

export async function createOrderHandler(request: Request, env: Env) {
  try {
    const auth = await requireAuth(request, env);
    const body = (await request.json()) as { courseId?: string; courseSlug?: string };
    const supabase = createSupabaseAdmin(env);

    const query = supabase
      .from("courses")
      .select("id,slug,price_paise,currency,enquiry_only")
      .eq("published", true)
      .eq("active", true)
      .limit(1);

    const { data: course, error: courseError } = body.courseId
      ? await query.eq("id", body.courseId).single()
      : await query.eq("slug", body.courseSlug ?? "").single();

    if (courseError || !course) return json({ error: "Course unavailable" }, 404);
    if (course.enquiry_only) return json({ error: "Enquiry-only course" }, 400);

    const razorpayOrder = await createRazorpayOrder(env, course.price_paise, {
      user_id: auth.userId,
      course_id: course.id
    });

    await supabase.from("payments").insert({
      user_id: auth.userId,
      course_id: course.id,
      verified_email: auth.email,
      amount_paise: course.price_paise,
      currency: course.currency,
      status: "pending",
      razorpay_order_id: razorpayOrder.id
    });

    return json({
      orderId: razorpayOrder.id,
      amount: course.price_paise,
      currency: course.currency,
      razorpayKeyId: env.RAZORPAY_KEY_ID
    });
  } catch {
    return json({ error: "Unauthorized" }, 401);
  }
}
