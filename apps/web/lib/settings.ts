import "server-only";
import { z } from "zod";
import { getEnv } from "@/lib/env";
import { hasDatabase } from "@/lib/content";

/**
 * Admin-managed site settings (Setting key/value model). Nothing here is
 * fabricated: links/emails only appear on the public site once a real value is
 * saved. The one env fallback is the contact email (FROM_EMAIL), so leads have
 * a destination even before the studio fills the admin settings.
 */

export const contactSettingsSchema = z.object({
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  telegram: z.string().url().optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
  github: z.string().url().optional().nullable(),
  location: z.string().optional().nullable(),
});

export type ContactSettings = z.infer<typeof contactSettingsSchema>;

const CONTACT_KEY = "contact";

async function readSetting(key: string): Promise<unknown> {
  if (!hasDatabase()) return null;
  try {
    const { prisma } = await import("@/lib/db");
    const row = await prisma.setting.findUnique({ where: { key } });
    return row?.value ?? null;
  } catch (error) {
    console.error(`[settings] read "${key}" failed:`, error);
    return null;
  }
}

export async function getContactSettings(): Promise<ContactSettings> {
  const raw = await readSetting(CONTACT_KEY);
  const parsed = contactSettingsSchema.safeParse(raw ?? {});
  const settings = parsed.success ? parsed.data : {};
  // Fallback destination for lead notifications only — never rendered unless present.
  const email = settings.email ?? getEnv().FROM_EMAIL ?? null;
  return { ...settings, email };
}

/** The address that receives lead notifications (server-only; never sent to client). */
export async function getLeadNotificationEmail(): Promise<string | null> {
  const { email } = await getContactSettings();
  return email ?? null;
}
