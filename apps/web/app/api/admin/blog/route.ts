import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10),
  coverImage: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().datetime().optional().nullable()
});

function calcReadingTime(text: string) {
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));
}

export async function GET() {
  const gate = await getAdminApiContext("blog:write");
  if (!gate.ok) return gate.response;

  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: true, category: true }
  });

  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const gate = await getAdminApiContext("blog:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const post = await prisma.blogPost.create({
    data: {
      ...parsed.data,
      readingTime: calcReadingTime(parsed.data.content),
      authorId: gate.context.userId,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null
    }
  });

  await writeAuditLog({
    action: "create",
    entity: "BlogPost",
    entityId: post.id,
    userId: gate.context.userId,
    changes: { title: post.title, status: post.status }
  });

  return NextResponse.json({ post }, { status: 201 });
}
