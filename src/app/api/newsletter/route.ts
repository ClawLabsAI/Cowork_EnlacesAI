import { NextRequest, NextResponse } from "next/server";
import { subscribeEmail } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const email = body.get("email") as string;

    if (!email || !email.includes("@")) {
      return NextResponse.redirect(new URL("/?error=invalid-email", req.url));
    }

    const { success, error } = await subscribeEmail(email.trim().toLowerCase());

    if (success) {
      return NextResponse.redirect(new URL("/?subscribed=true", req.url));
    }

    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error ?? "unknown")}`, req.url));
  } catch {
    return NextResponse.redirect(new URL("/?error=server", req.url));
  }
}
