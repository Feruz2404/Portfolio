import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publicAuthorSelect } from "@/lib/publicData";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
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
  return NextResponse.json({ posts });
}
