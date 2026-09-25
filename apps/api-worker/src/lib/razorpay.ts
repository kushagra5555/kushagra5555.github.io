import { hmacSha256Hex } from "./security";
import type { Env } from "./types";

export async function createRazorpayOrder(env: Env, amount: number, notes: Record<string, string>) {
  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { authorization: `Basic ${auth}`, "content-type": "application/json" },
    body: JSON.stringify({ amount, currency: "INR", notes })
  });
  if (!response.ok) throw new Error("Razorpay order failed");
  return response.json();
}

export async function fetchRazorpayPayment(env: Env, paymentId: string) {
  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: { authorization: `Basic ${auth}` }
  });
  if (!response.ok) throw new Error("Razorpay payment fetch failed");
  return response.json();
}

export async function verifyPaymentSignature(secret: string, orderId: string, paymentId: string, signature: string) {
  const expected = await hmacSha256Hex(secret, `${orderId}|${paymentId}`);
  return { expected, valid: expected === signature };
}
