import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  message: z.string().min(1),
  budget: z.string().optional().nullable(),
  projectType: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await req.json()
    : Object.fromEntries((await req.formData()).entries());

  const data = schema.parse(body);

  const contact = await prisma.contact.create({
    data: {
      name: data.name,
      email: data.email,
      company: data.company ?? null,
      phone: data.phone ?? null,
      message: data.message,
      budget: data.budget ?? null,
      projectType: data.projectType ?? null,
      source: "website",
    },
  });

  return Response.json({ contact }, { status: 201 });
}
