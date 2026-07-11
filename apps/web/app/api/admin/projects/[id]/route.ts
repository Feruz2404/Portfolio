import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";
import { readJsonBody } from "@/lib/request";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  description: z.string().trim().min(10).max(10000).optional(),
  category: z.string().trim().min(1).max(160).optional(),
  industry: z.string().trim().max(160).optional().nullable(),
  technologies: z.array(z.string().trim().max(100)).max(50).optional(),
  screenshots: z.array(z.string().url().max(2048)).max(50).optional(),
  videoUrl: z.string().url().max(2048).optional().nullable(),
  liveUrl: z.string().url().max(2048).optional().nullable(),
  vercelUrl: z.string().url().max(2048).optional().nullable(),
  githubUrl: z.string().url().max(2048).optional().nullable(),
  challenge: z.string().trim().max(10000).optional().nullable(),
  solution: z.string().trim().max(10000).optional().nullable(),
  architecture: z.string().trim().max(10000).optional().nullable(),
  results: z.string().trim().max(10000).optional().nullable(),
  status: z.enum(["DRAFT", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
  featured: z.boolean().optional()
});

async function proxyToPortfolioApi(path: string, init: RequestInit) {
  const baseUrl = process.env.PORTFOLIO_API_URL?.replace(/\/$/, "");
  const token = process.env.API_INTERNAL_TOKEN;
  if (!baseUrl || !token) return null;

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { "content-type": "application/json", "x-internal-api-key": token, ...(init.headers ?? {}) },
      cache: "no-store"
    });
    return new NextResponse(await response.text(), { status: response.status, headers: { "content-type": "application/json" } });
  } catch {
    return null;
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("projects:read");
  if (!gate.authorized) return gate.response;

  const { id } = await params;
  const apiResponse = await proxyToPortfolioApi(`/api/v1/admin/projects/${id}`, { method: "GET" });
  if (apiResponse) return apiResponse;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { teamMembers: { include: { member: true } } }
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("projects:write");
  if (!gate.authorized) return gate.response;

  const body = await readJsonBody(req, 128 * 1024);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id } = await params;
  const apiResponse = await proxyToPortfolioApi(`/api/v1/admin/projects/${id}`, { method: "PATCH", body: JSON.stringify(parsed.data) });
  if (apiResponse) return apiResponse;
  const project = await prisma.project.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ project });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("projects:write");
  if (!gate.authorized) return gate.response;

  const { id } = await params;
  const apiResponse = await proxyToPortfolioApi(`/api/v1/admin/projects/${id}`, { method: "DELETE" });
  if (apiResponse) return apiResponse;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
