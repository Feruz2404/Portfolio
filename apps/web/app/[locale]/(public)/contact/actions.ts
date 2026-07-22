"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { hasDatabase } from "@/lib/content";
import { getEnv } from "@/lib/env";
import { getLeadNotificationEmail } from "@/lib/settings";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  company: z.string().max(200).optional(),
  phone: z.string().max(60).optional(),
  budget: z.string().max(60).optional(),
  projectType: z.string().max(60).optional(),
  message: z.string().min(10).max(5000),
  // Honeypot — real users never fill this; validated leniently so we can drop
  // bot submissions silently rather than reveal the check.
  website: z.string().optional(),
});

export type ContactResult =
  | { ok: true }
  | { ok: false; error: "validation" | "rate_limited" | "server" | "unavailable" };

export async function submitContact(input: unknown): Promise<ContactResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation" };
  const data = parsed.data;

  // Honeypot: silently accept-and-drop bot submissions.
  if (data.website && data.website.trim().length > 0) return { ok: true };

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";

  const rl = checkRateLimit({ key: `contact:${ip}`, limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.allowed) return { ok: false, error: "rate_limited" };

  // No DB configured → do not fake success. Tell the client to use direct channels.
  if (!hasDatabase()) return { ok: false, error: "unavailable" };

  let leadId: string;
  try {
    const { prisma } = await import("@/lib/db");
    const lead = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company || null,
        phone: data.phone || null,
        message: data.message,
        budget: data.budget || null,
        projectType: data.projectType || null,
        source: "website",
        ipAddress: ip,
        userAgent: h.get("user-agent") ?? null,
      },
    });
    leadId = lead.id;
  } catch (error) {
    console.error("[contact] failed to persist lead:", error);
    return { ok: false, error: "server" };
  }

  // Best-effort notification. The lead is already saved, so an email failure
  // must NOT turn a real success into a failure.
  try {
    if (getEnv().RESEND_API_KEY) {
      const to = await getLeadNotificationEmail();
      const { getResend, getFromEmail } = await import("@/lib/email");
      const from = getFromEmail();
      if (to && from) {
        await getResend().emails.send({
          from,
          to,
          replyTo: data.email,
          subject: `New inquiry — ${data.name}`,
          text:
            `New project inquiry (#${leadId})\n\n` +
            `Name: ${data.name}\nEmail: ${data.email}\n` +
            `${data.company ? `Company: ${data.company}\n` : ""}` +
            `${data.phone ? `Phone: ${data.phone}\n` : ""}` +
            `${data.budget ? `Budget: ${data.budget}\n` : ""}` +
            `${data.projectType ? `Type: ${data.projectType}\n` : ""}` +
            `\nMessage:\n${data.message}\n`,
        });
      }
    }
  } catch (error) {
    console.error("[contact] notification email failed (lead still saved):", error);
  }

  return { ok: true };
}
