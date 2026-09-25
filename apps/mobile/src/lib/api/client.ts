export const paymentsApiBase = process.env.NEXT_PUBLIC_PAYMENTS_URL ?? "";

export async function createOrder(token: string, courseId: string) {
  const response = await fetch(`${paymentsApiBase}/v2/create-order`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: ["Bearer", token].join(" ")
    },
    body: JSON.stringify({ courseId })
  });
  if (!response.ok) throw new Error("Unable to create order");
  return response.json();
}
