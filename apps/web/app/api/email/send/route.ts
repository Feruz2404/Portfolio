import { NextResponse } from "next/server";
import { z } from "zod";
import { FROM_EMAIL, getResend } from "@/lib/email";
import { authorize } from "@/lib/adminAuth";
import { readJsonBody } from "@/lib/request";

const schema = z.object({
  to: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(200),
  html: z.string().min(1).max(100_000)
});

export async function POST(req: Request) {
  const gate = await authorize("email:send");
  if (!gate.authorized) return gate.response;

  const body = await readJsonBody(req, 128 * 1024);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const result = await getResend().emails.send({
    from: FROM_EMAIL,
    to: parsed.data.to,
    subject: parsed.data.subject,
    html: parsed.data.html
  });

  return NextResponse.json({ result });
}
