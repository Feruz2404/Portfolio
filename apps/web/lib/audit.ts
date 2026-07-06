import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

type AuditInput = {
  action: string;
  entity: string;
  entityId?: string;
  userId: string;
  changes?: Prisma.InputJsonValue;
};

export async function writeAuditLog({ action, entity, entityId, userId, changes }: AuditInput) {
  await prisma.auditLog
    .create({
      data: {
        action,
        entity,
        entityId,
        userId,
        changes
      }
    })
    .catch(() => undefined);
}
