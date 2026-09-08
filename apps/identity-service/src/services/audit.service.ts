import type { Prisma } from '../generated/prisma/index.js';
import { prisma } from '../lib/prisma.js';

interface AuditInput {
  userId: string;
  action: string; // VIEW | CREATE | UPDATE | DELETE | LOGIN | CANCEL | DISPENSE...
  resourceType: string; // USER | APPOINTMENT | MEDICAL_RECORD | INVOICE...
  resourceId: string;
  metadata?: Prisma.InputJsonValue;
}

export async function writeAudit(input: AuditInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      metadata: input.metadata ?? {},
    },
  });
}