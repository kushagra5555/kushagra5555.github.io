import { createOrderHandler } from "./routes/v2/create-order";
import { verifyHandler } from "./routes/v2/verify";
import { razorpayWebhookHandler } from "./routes/webhooks/razorpay";
import { json } from "./lib/security";
import type { Env } from "./lib/types";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/v2/create-order") return createOrderHandler(request, env);
    if (request.method === "POST" && url.pathname === "/v2/verify") return verifyHandler(request, env);
    if (request.method === "POST" && url.pathname === "/webhooks/razorpay") return razorpayWebhookHandler(request, env);
    return json({ error: "Not Found" }, 404);
  }
};
