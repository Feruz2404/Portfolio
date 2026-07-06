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

  await getResend().emails.send({
    from: getFromEmail(),
    to: parsed.data.to,
    subject: parsed.data.subject,
    html: parsed.data.html
  });

  return NextResponse.json({ ok: true });
}
