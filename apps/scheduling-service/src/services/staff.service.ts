import type { Prisma } from '../generated/prisma/index.js';
import { prisma } from '../lib/prisma.js';
import { httpError } from '../lib/http-error.js';
import type { CreateStaffInput, UpdateStaffInput } from '../schemas/staff.schema.js';

const withDept = { department: { select: { id: true, name: true, location: true } } } as const;

export async function listStaff(query: { q?: string; departmentId?: string; role?: string; page?: string; limit?: string }) {
  const page = Math.max(1, Number(query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20)));
  const where: Prisma.StaffWhereInput = {};
  if (query.q) where.fullName = { contains: query.q, mode: 'insensitive' };
  if (query.departmentId) where.departmentId = Number(query.departmentId);
  if (query.role) where.role = query.role;

  const [total, data] = await Promise.all([
    prisma.staff.count({ where }),
    prisma.staff.findMany({ where, include: withDept, orderBy: { fullName: 'asc' }, skip: (page - 1) * limit, take: limit }),
  ]);
  return { data, total, page, limit };
}

export async function getStaffById(id: string) {
  const member = await prisma.staff.findUnique({ where: { id }, include: withDept });
  if (!member) throw httpError(404, 'Staff member not found');
  return member;
}

export async function createStaff(input: CreateStaffInput) {
  const dept = await prisma.department.findUnique({ where: { id: input.departmentId } });
  if (!dept) throw httpError(404, 'Department not found. Please check the departmentId.');
  const existed = await prisma.staff.findFirst({ where: { userId: input.userId } });
  if (existed) throw httpError(409, 'This user already has a staff profile.');
  return prisma.staff.create({ data: input });
}

export async function updateStaff(id: string, input: UpdateStaffInput) {
  await getStaffById(id);
  if (input.departmentId !== undefined) {
    const dept = await prisma.department.findUnique({ where: { id: input.departmentId } });
    if (!dept) throw httpError(404, 'Department not found. Please check the departmentId.');
  }
  return prisma.staff.update({ where: { id }, data: input });
}

export async function deleteStaff(id: string) {
  await getStaffById(id);
  return prisma.staff.delete({ where: { id } });
}