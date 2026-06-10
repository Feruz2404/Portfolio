import { prisma } from "@/lib/db";

export async function GET() {
  const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } });
  return Response.json({ posts });
}
