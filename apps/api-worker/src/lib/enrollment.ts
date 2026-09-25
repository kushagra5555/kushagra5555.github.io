import type { SupabaseClient } from "@supabase/supabase-js";

export async function grantEnrollmentIdempotent(
  supabase: SupabaseClient,
  userId: string,
  courseId: string,
  paymentId: string
) {
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id,status")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("status", "active")
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from("enrollments")
    .insert({ user_id: userId, course_id: courseId, status: "active", source_payment_id: paymentId })
    .select("id,status")
    .single();

  if (error) throw error;
  return data;
}
