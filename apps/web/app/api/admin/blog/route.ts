import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/server-auth";
import { hasPermission } from "@/lib/rbac";
import { Role } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  title:       z.string().min(2),
  slug:        z.string().min(2),
  excerpt:     z.string().optional().nullable(),
  content:     z.string().min(10),
  coverImage:  z.string().optional().nullable(),
  status:      z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().datetime().optional().nullable(),
});

async function requireWrite() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const role = (session.user as any).role as Role;
  if (!hasPermission(role, "blog:write")) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, role };
}

// ≈ 200 words per minute
function calcReadingTime(text: string) {
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));
}

export async function GET() {
  const gate = await requireWrite();
  if (gate.error) return gate.error;
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: true, category: true },
  });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const gate = await requireWrite();
  if (gate.error) return gate.error;

  const body   = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  // FIX: auto-calculate reading time on creation
  const readingTime = calcReadingTime(parsed.data.content);

  const post = await prisma.blogPost.create({
    data: {
      ...parsed.data,
      readingTime,
      authorId:    (gate.session!.user as any).id,
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
