import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";
import { contactUpdateSchema } from "@/lib/adminSchemas";
import { readJsonBody } from "@/lib/request";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("contacts:read");
  if (!gate.authorized) return gate.response;
  const { id } = await params;
  const contact = await prisma.contact.findUnique({ where: { id }, include: { notes: true, emailHistory: true, manager: true } });
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ contact });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("contacts:write");
  if (!gate.authorized) return gate.response;
  const body = await readJsonBody(req, 16 * 1024);
  const parsed = contactUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { id } = await params;
  const contact = await prisma.contact.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ contact });
}
