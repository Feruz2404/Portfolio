import { NextResponse } from "next/server";
import { z } from "zod";
import { getFromEmail, getResend } from "@/lib/email";
import { getAdminApiContext } from "@/lib/adminAuth";

const schema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1)
});

export async function POST(req: Request) {
  const gate = await getAdminApiContext("contacts:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const from = getFromEmail();
  if (!from || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email is not configured (set RESEND_API_KEY and FROM_EMAIL)" }, { status: 503 });
  }

  await getResend().emails.send({
    from,
    to: parsed.data.to,
    subject: parsed.data.subject,
    html: parsed.data.html
  });

  return NextResponse.json({ ok: true });
}
