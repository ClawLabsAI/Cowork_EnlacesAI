import { NextRequest, NextResponse } from "next/server";
import { searchTools } from "@/lib/data";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchTools(q, 20);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}
