import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true, author: { select: { name: true } } }
  });
  if (!post || post.status !== "PUBLISHED") return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}
