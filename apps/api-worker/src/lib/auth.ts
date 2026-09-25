import { createClient } from "@supabase/supabase-js";
import type { AuthContext, Env } from "./types";

export async function requireAuth(request: Request, env: Env): Promise<AuthContext> {
  const auth = request.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) throw new Error("Unauthorized");
  const token = auth.slice("Bearer ".length);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: ["Bearer", token].join(" ") } },
    auth: { persistSession: false }
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Error("Unauthorized");
  return { userId: data.user.id, email: data.user.email ?? "", token };
}
