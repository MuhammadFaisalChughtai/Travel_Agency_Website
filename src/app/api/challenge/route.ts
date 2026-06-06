import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  const isAddition = Math.random() > 0.5;
  let num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;

  if (!isAddition && num2 > num1) {
    const temp = num1;
    num1 = num2;
    num2 = temp;
  }

  const operator = isAddition ? "+" : "-";
  const timestamp = Date.now();
  
  // Format: num1|operator|num2|timestamp
  const payload = `${num1}|${operator}|${num2}|${timestamp}`;
  
  const secret = process.env.ENQUIRY_SECRET || "terrific-travel-fallback-secret-2024";
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  return NextResponse.json({
    num1,
    num2,
    operator,
    payload,
    signature,
  });
}
