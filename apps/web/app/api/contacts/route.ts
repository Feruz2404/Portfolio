import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  parseJsonBody,
  prismaErrorResponse,
  tooManyRequestsResponse,
} from "@/lib/api-errors";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10),
  budget: z.string().optional(),
  projectType: z.string().optional(),
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = checkRateLimit({
    key: `contact:${ip}`,
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!limited.allowed) return tooManyRequestsResponse();

  const parsed = await parseJsonBody(req, schema);
  if (!parsed.ok) return parsed.response;

  try {
    const lead = await prisma.contact.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company,
        phone: parsed.data.phone,
        message: parsed.data.message,
        budget: parsed.data.budget,
        projectType: parsed.data.projectType,
        source: "website",
        ipAddress: ip,
        userAgent: req.headers.get("user-agent"),
      },
    });

    return NextResponse.json({ id: lead.id }, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}
