import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured");
  const status = searchParams.get("status") ?? "PUBLISHED";

  const projects = await prisma.project.findMany({
    where: {
      ...(featured ? { featured: featured === "true" } : {}),
      ...(status ? { status: status as any } : {})
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
  });

  return NextResponse.json({ projects });
}
