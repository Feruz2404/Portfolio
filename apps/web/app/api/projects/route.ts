import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ProjectStatus } from "@prisma/client";
import { PUBLIC_PROJECT_STATUSES, publicProjectSelect } from "@/lib/publicData";
import { z } from "zod";

const statusSchema = z.enum([ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");
  const requestedStatus = searchParams.get("status");
  const parsedStatus = requestedStatus ? statusSchema.safeParse(requestedStatus) : null;
  if (parsedStatus && !parsedStatus.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const projects = await prisma.project.findMany({
    where: {
      ...(featured ? { featured: featured === "true" } : {}),
      status: parsedStatus?.success ? parsedStatus.data : { in: PUBLIC_PROJECT_STATUSES }
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: publicProjectSelect
  });

  return NextResponse.json({ projects });
}
