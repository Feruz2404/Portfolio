import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";
import { readJsonBody } from "@/lib/request";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(10).max(10000),
  category: z.string().trim().min(1).max(160),
  industry: z.string().trim().max(160).optional(),
  technologies: z.array(z.string().trim().max(100)).max(50).default([]),
  screenshots: z.array(z.string().url().max(2048)).max(50).default([]),
  videoUrl: z.string().url().max(2048).optional(),
  liveUrl: z.string().url().max(2048).optional(),
  vercelUrl: z.string().url().max(2048).optional(),
  githubUrl: z.string().url().max(2048).optional(),
  challenge: z.string().trim().max(10000).optional(),
  solution: z.string().trim().max(10000).optional(),
  architecture: z.string().trim().max(10000).optional(),
  results: z.string().trim().max(10000).optional(),
  status: z.enum(["DRAFT", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false)
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

export async function GET() {
  const gate = await authorize("projects:read");
  if (!gate.authorized) return gate.response;

  const apiResponse = await proxyToPortfolioApi("/api/v1/admin/projects", { method: "GET" });
  if (apiResponse) return apiResponse;

  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const gate = await authorize("projects:write");
  if (!gate.authorized) return gate.response;

  const body = await readJsonBody(req, 128 * 1024);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const apiResponse = await proxyToPortfolioApi("/api/v1/admin/projects", { method: "POST", body: JSON.stringify(parsed.data) });
  if (apiResponse) return apiResponse;

  const project = await prisma.project.create({
    data: {
      ...parsed.data
    }
  });

  return NextResponse.json({ project }, { status: 201 });
}
