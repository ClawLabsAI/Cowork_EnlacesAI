import { NextRequest, NextResponse } from "next/server";
import { getToolBySlug } from "@/lib/data";

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const tool = await getToolBySlug(params.slug);
  if (!tool) return NextResponse.json({ tool: null }, { status: 404 });
  return NextResponse.json({ tool });
}
