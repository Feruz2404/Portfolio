import { NextResponse } from "next/server";
import { z } from "zod";
import { getEmailConfig, getResend } from "@/lib/email";
import { getAdminApiContext } from "@/lib/adminAuth";
import { parseJsonBody, serviceUnavailableResponse } from "@/lib/api-errors";

const schema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
});

export async function POST(req: Request) {
  const gate = await getAdminApiContext("contacts:write");
  if (!gate.ok) return gate.response;

  const parsed = await parseJsonBody(req, schema);
  if (!parsed.ok) return parsed.response;

  const emailConfig = getEmailConfig();
  if (!emailConfig)
    return serviceUnavailableResponse(
      "Email is not configured (set RESEND_API_KEY and FROM_EMAIL)",
    );

  await getResend().emails.send({
    from: emailConfig.from,
    to: parsed.data.to,
    subject: parsed.data.subject,
    html: parsed.data.html,
  });

  return NextResponse.json({ ok: true });
}
