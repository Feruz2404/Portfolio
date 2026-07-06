import { NextResponse } from "next/server";
import { ProjectStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");
  const statusParam = searchParams.get("status");
  const status = statusParam && statusParam in ProjectStatus ? (statusParam as ProjectStatus) : ProjectStatus.COMPLETED;

  const projects = await prisma.project.findMany({
    where: {
      ...(featured ? { featured: featured === "true" } : {}),
      status
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
  });

  return NextResponse.json({ projects });
}
