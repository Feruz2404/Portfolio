import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";
import { publicAuthorSelect } from "@/lib/publicData";
import { readJsonBody } from "@/lib/request";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().trim().max(1000).optional().nullable(),
  content: z.string().trim().min(10).max(100_000),
  coverImage: z.string().url().max(2048).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().datetime().optional().nullable()
});

export async function GET() {
  const gate = await authorize("blog:read");
  if (!gate.authorized) return gate.response;

  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true, title: true, slug: true, excerpt: true, content: true, coverImage: true,
      status: true, publishedAt: true, views: true, readingTime: true, createdAt: true, updatedAt: true,
      author: { select: publicAuthorSelect }, category: true
    }
  });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const gate = await authorize("blog:write");
  if (!gate.authorized) return gate.response;

  const body = await readJsonBody(req, 128 * 1024);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const post = await prisma.blogPost.create({
    data: {
      ...parsed.data,
      authorId: gate.session.user.id,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null
    }
  });

  return NextResponse.json({ post }, { status: 201 });
}
