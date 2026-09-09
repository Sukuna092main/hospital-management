import { prisma } from '../lib/prisma.js';
import { httpError } from '../lib/http-error.js';
import type { CreateDepartmentInput, UpdateDepartmentInput } from '../schemas/departments.schema.js';

export async function listDepartments() {
  return prisma.department.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { doctors: true, staff: true } } },
  });
}

export async function getDepartmentById(id: number) {
  const dept = await prisma.department.findUnique({
    where: { id },
    include: { _count: { select: { doctors: true, staff: true } } },
  });
  if (!dept) throw httpError(404, 'Unit/Department not found');
  return dept;
}

export async function createDepartment(input: CreateDepartmentInput) {
  return prisma.department.create({ data: input });
}

export async function updateDepartment(id: number, input: UpdateDepartmentInput) {
  await getDepartmentById(id);
  return prisma.department.update({ where: { id }, data: input });
}

export async function deleteDepartment(id: number) {
  await getDepartmentById(id);
  const [doctorCount, staffCount] = await Promise.all([
    prisma.doctor.count({ where: { departmentId: id } }),
    prisma.staff.count({ where: { departmentId: id } }),
  ]);
  if (doctorCount + staffCount > 0)
    throw httpError(409, 'Department still has doctors/staff. Please transfer them to another department before deleting.');
  return prisma.department.delete({ where: { id } });
}