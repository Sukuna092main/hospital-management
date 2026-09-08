import type { UserRoleName } from '@hospital/shared-types';
import { prisma } from '../lib/prisma.js';
import { httpError } from '../lib/http-error.js';
import { writeAudit } from './audit.service.js';

const VALID_ROLES: UserRoleName[] = ['PATIENT', 'DOCTOR', 'NURSE', 'PHARMACIST', 'ADMIN'];

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { role: true } } },
  });
  if (!user || user.status !== 'ACTIVE')
    throw httpError(401, 'Account is expired, please login again');
  return {
    id: user.id,
    email: user.email,
    status: user.status,
    roles: user.roles.map((ur) => ur.role.name as UserRoleName),
    createdAt: user.createdAt,
  };
}

export async function updateRoles(actorId: string, targetUserId: string, roles: string[]) {
  const invalid = roles.filter((r) => !VALID_ROLES.includes(r as UserRoleName));
  if (invalid.length > 0)
    throw httpError(422, `Invalid roles: ${invalid.join(', ')}`, [
      { field: 'roles', message: `Only these roles are allowed: ${VALID_ROLES.join(', ')}` },
    ]);

  const target = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!target) throw httpError(404, 'User not found.');

  const roleRows = await prisma.role.findMany({ where: { name: { in: roles } } });
  await prisma.userRole.deleteMany({ where: { userId: targetUserId } });
  await prisma.userRole.createMany({
    data: roleRows.map((r) => ({ userId: targetUserId, roleId: r.id })),
  });

  await writeAudit({
    userId: actorId,
    action: 'UPDATE',
    resourceType: 'USER',
    resourceId: targetUserId,
    metadata: { roles },
  });

  const updated = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: { roles: { include: { role: true } } },
  });
  return {
    id: updated!.id,
    email: updated!.email,
    status: updated!.status,
    roles: updated!.roles.map((ur) => ur.role.name as UserRoleName),
  };
}