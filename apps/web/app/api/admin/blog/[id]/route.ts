import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { parseJsonBody, prismaErrorResponse } from "@/lib/api-errors";
import { calculateReadingTime } from "@/lib/reading-time";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10).optional(),
  coverImage: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await getAdminApiContext("blog:write");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ post });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await getAdminApiContext("blog:write");
  if (!gate.ok) return gate.response;

  const parsed = await parseJsonBody(req, schema);
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...parsed.data,
        ...(parsed.data.content
          ? { readingTime: calculateReadingTime(parsed.data.content) }
          : {}),
        publishedAt:
          parsed.data.publishedAt !== undefined
            ? parsed.data.publishedAt
              ? new Date(parsed.data.publishedAt)
              : null
            : undefined,
      },
    });
    await writeAuditLog({
      action: "update",
      entity: "BlogPost",
      entityId: post.id,
      userId: gate.context.userId,
      changes: parsed.data,
    });
    return NextResponse.json({ post });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await getAdminApiContext("blog:write");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  try {
    await prisma.blogPost.delete({ where: { id } });
    await writeAuditLog({
      action: "delete",
      entity: "BlogPost",
      entityId: id,
      userId: gate.context.userId,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}
