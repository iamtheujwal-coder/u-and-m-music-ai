import { NextResponse } from "next/server";

// POST /api/payment/verify — Verify Razorpay payment
export async function POST(request: Request) {
  const body = await request.json();
  
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  // In production: verify signature using crypto
  // const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  //   .digest("hex");
  // if (expectedSignature !== razorpay_signature) return error;

  // Mock: always succeed
  return NextResponse.json({
    verified: true,
    payment: {
      id: razorpay_payment_id,
      order_id: razorpay_order_id,
      status: "completed",
    },
    message: "Payment verified successfully. Plan upgraded!",
  });
}
