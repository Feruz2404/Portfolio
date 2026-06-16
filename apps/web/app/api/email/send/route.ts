import { NextResponse } from "next/server";
import { z } from "zod";
import { FROM_EMAIL, getResend } from "@/lib/email";
import { auth } from "@/lib/server-auth";

const schema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1)
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
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
