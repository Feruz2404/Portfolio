import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";
import { readJsonBody } from "@/lib/request";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: z.string().trim().max(1000).optional().nullable(),
  content: z.string().trim().min(10).max(100_000).optional(),
  coverImage: z.string().url().max(2048).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  publishedAt: z.string().datetime().optional().nullable()
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("blog:read");
  if (!gate.authorized) return gate.response;

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("blog:write");
  if (!gate.authorized) return gate.response;

  const body = await readJsonBody(req, 128 * 1024);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id } = await params;
  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...parsed.data,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : parsed.data.publishedAt === null ? null : undefined
    }
  });
  return NextResponse.json({ post });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("blog:write");
  if (!gate.authorized) return gate.response;

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
