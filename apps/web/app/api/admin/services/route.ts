import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";
import { serviceSchema } from "@/lib/adminSchemas";
import { readJsonBody } from "@/lib/request";

export async function GET() {
  const gate = await authorize("services:read");
  if (!gate.authorized) return gate.response;
  const services = await prisma.service.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] });
  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  const gate = await authorize("services:write");
  if (!gate.authorized) return gate.response;
  const parsed = serviceSchema.safeParse(await readJsonBody(req));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const service = await prisma.service.create({ data: parsed.data });
  return NextResponse.json({ service }, { status: 201 });
}
