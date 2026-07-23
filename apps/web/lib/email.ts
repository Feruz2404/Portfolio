import { Resend } from "resend";
import { getEnv, requireEnv } from "@/lib/env";

let resend: Resend | null = null;

export function getResend() {
  const apiKey = requireEnv("RESEND_API_KEY");
  resend ??= new Resend(apiKey);
  return resend;
}

export function getEmailConfig() {
  const env = getEnv();
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL) return null;

  return { from: env.FROM_EMAIL };
}

/** Return the verified sender address, or null when email is not configured. */
export function getFromEmail(): string | null {
  return getEnv().FROM_EMAIL ?? null;
}
