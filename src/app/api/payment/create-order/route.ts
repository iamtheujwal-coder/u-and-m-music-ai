import { NextResponse } from "next/server";
import { generateId } from "@/lib/utils";

// POST /api/payment/create-order — Create Razorpay order
export async function POST(request: Request) {
  const body = await request.json();
  
  const planPrices: Record<string, number> = {
    creator: 29900,     // ₹299 in paise
    pro_artist: 99900,  // ₹999 in paise
    studio: 299900,     // ₹2999 in paise
  };

  const amount = planPrices[body.plan];
  if (!amount) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  // In production: create Razorpay order using razorpay SDK
  // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  // const order = await razorpay.orders.create({ amount, currency: "INR", receipt: generateId() });

  const mockOrder = {
    id: `order_${generateId()}`,
    amount,
    currency: "INR",
    receipt: generateId(),
    status: "created",
  };

  return NextResponse.json({ order: mockOrder });
}
