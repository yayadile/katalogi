import { NextResponse } from "next/server";
import { sendOTP } from "@/lib/actions/otp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email wajib diisi." },
        { status: 400 },
      );
    }

    const result = await sendOTP(email);

    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan sistem." },
      { status: 500 },
    );
  }
}
