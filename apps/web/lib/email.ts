import { Resend } from "resend";
import { getEnv, requireEnv } from "@/lib/env";

let resend: Resend | null = null;

export function getResend() {
  const apiKey = requireEnv("RESEND_API_KEY");
  resend ??= new Resend(apiKey);
  return resend;
}

/** The verified sender address. Returns null when unset — callers must skip
 *  sending rather than fall back to a placeholder. */
export function getFromEmail(): string | null {
  return getEnv().FROM_EMAIL ?? null;
}
