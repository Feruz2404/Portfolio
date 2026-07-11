import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publicAuthorSelect } from "@/lib/publicData";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      status: true,
      publishedAt: true,
      views: true,
      readingTime: true,
      createdAt: true,
      updatedAt: true,
      category: true,
      author: { select: publicAuthorSelect }
    }
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}
