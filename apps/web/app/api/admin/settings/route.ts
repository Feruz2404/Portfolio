import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { parseJsonBody, prismaErrorResponse } from "@/lib/api-errors";
import { contactSettingsSchema } from "@/lib/settings";

const CONTACT_KEY = "contact";

function normalizeContactSettings(raw: unknown) {
  if (!raw || typeof raw !== "object") return raw;

  // Treat empty strings as "unset" so url()/email() validation passes.
  return Object.fromEntries(
    Object.entries(raw as Record<string, unknown>).map(([key, value]) => [
      key,
      value === "" ? undefined : value,
    ]),
  );
}

export async function GET() {
  const gate = await getAdminApiContext("users:write");
  if (!gate.ok) return gate.response;

  const row = await prisma.setting.findUnique({ where: { key: CONTACT_KEY } });
  return NextResponse.json({ contact: row?.value ?? {} });
}

export async function PUT(req: Request) {
  const gate = await getAdminApiContext("users:write");
  if (!gate.ok) return gate.response;

  const parsed = await parseJsonBody(
    req,
    contactSettingsSchema,
    normalizeContactSettings,
  );
  if (!parsed.ok) return parsed.response;

  const value = Object.fromEntries(
    Object.entries(parsed.data).map(([k, v]) => [k, v ?? null]),
  );

  try {
    const row = await prisma.setting.upsert({
      where: { key: CONTACT_KEY },
      update: { value },
      create: { key: CONTACT_KEY, value },
    });
    await writeAuditLog({
      action: "update",
      entity: "Setting",
      entityId: row.id,
      userId: gate.context.userId,
      changes: { key: CONTACT_KEY },
    });
    // Contact settings render in the footer (every page) and on /contact —
    // revalidate so the change is visible immediately, not after the ISR window.
    revalidatePath("/", "layout");
    return NextResponse.json({ contact: row.value });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}
