import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/server-auth";
import { hasPermission } from "@/lib/rbac";
import { Role } from "@prisma/client";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(1),
  industry: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  screenshots: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false)
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role as Role;
  if (!hasPermission(role, "projects:write") && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role as Role;
  if (!hasPermission(role, "projects:write") && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      technologies: parsed.data.technologies,
      screenshots: parsed.data.screenshots
    }
  });

  return NextResponse.json({ project }, { status: 201 });
}
