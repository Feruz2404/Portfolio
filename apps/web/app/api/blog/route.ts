import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: { category: true, author: true }
  });
  return NextResponse.json({ posts });
}
