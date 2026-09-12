import type { Prisma } from '../generated/prisma/index.js';
import { prisma } from '../lib/prisma.js';

interface AuditInput {
  userId: string;
  action: string; // VIEW | CREATE | UPDATE | DELETE | LOGIN | CANCEL | DISPENSE...
  resourceType: string; // USER | APPOINTMENT | MEDICAL_RECORD | INVOICE...
  resourceId: string;
  metadata?: Record<string, unknown>; // optional additional info, e.g., { ip: '
}

export async function writeAudit(input: AuditInput): Promise<void> {
  await prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      metadata: (input.metadata ?? {}) as Prisma.InputJsonValue,
    },
  });
}

export async function listAudits(query: { page?: string; limit?: string; action: string; userId: string }) {
  const page = Math.max(1, Number(query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20)));
  const where: Prisma.AuditLogWhereInput = {};
  if (query.action) where.action = query.action;
  if (query.userId) where.userId = query.userId;

  const [total, data] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return { data, total, page, limit };
}