import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/server-auth";
import { hasPermission } from "@/lib/rbac";
import { Role } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10).optional(),
  coverImage: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  publishedAt: z.string().datetime().optional().nullable()
});

async function requireWrite() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const role = (session.user as any).role as Role;
  if (!hasPermission(role, "blog:write") && role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, role };
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const gate = await requireWrite();
  if (gate.error) return gate.error;

  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const gate = await requireWrite();
  if (gate.error) return gate.error;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : parsed.data.publishedAt === null ? null : undefined
    }
  });
  return NextResponse.json({ post });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const gate = await requireWrite();
  if (gate.error) return gate.error;

  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
