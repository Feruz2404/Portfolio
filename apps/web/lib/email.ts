import { Resend } from "resend";
import { getEnv, requireEnv } from "@/lib/env";

let resend: Resend | null = null;

export function getResend() {
  const apiKey = requireEnv("RESEND_API_KEY");
  resend ??= new Resend(apiKey);
  return resend;
}

export function getFromEmail() {
  return getEnv().FROM_EMAIL ?? "hello@example.com";
}
