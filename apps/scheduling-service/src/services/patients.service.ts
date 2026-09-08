import type { UserRoleName } from '@hospital/shared-types';
import type { Prisma } from '../generated/prisma/index.js';
import { prisma } from '../lib/prisma.js';
import { httpError } from '../lib/http-error.js';
import type { CreatePatientInput, UpdatePatientInput } from '../schemas/patients.schema.js';

interface Actor {
  id: string;
  roles: UserRoleName[];
}

const isAdmin = (actor: Actor) => actor.roles.includes('ADMIN');

export async function listPatients(actor: Actor, query: { page?: string; limit?: string; q?: string }) {
  if (!isAdmin(actor)) throw httpError(403, 'Only staff members can view the list of patients.');

  const page = Math.max(1, Number(query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20)));
  const where: Prisma.PatientWhereInput = { deletedAt: null };
  if (query.q) {
    where.OR = [
      { fullName: { contains: query.q, mode: 'insensitive' } },
      { phone: { contains: query.q } },
      { insuranceNumber: { contains: query.q } },
    ];
  }
  const [total, data] = await Promise.all([
    prisma.patient.count({ where }),
    prisma.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);
  return { data, total, page, limit };
}

export async function createPatient(actor: Actor, input: CreatePatientInput) {
  // PATIENT chỉ được tạo hồ sơ cho chính mình; ADMIN tạo hộ ai cũng được
  const userId = isAdmin(actor) ? input.userId : actor.id;
  const existed = await prisma.patient.findFirst({ where: { userId, deletedAt: null } });
  if (existed) throw httpError(409, 'This user already has a patient record. Only one record per user is allowed.');
  return prisma.patient.create({ data: { ...input, userId, dob: new Date(input.dob) } });
}

export async function getPatientById(actor: Actor, id: string) {
  const patient = await prisma.patient.findFirst({ where: { id, deletedAt: null } });
  if (!patient) throw httpError(404, 'Patient record not found.');
  if (!isAdmin(actor) && patient.userId !== actor.id)
    throw httpError(403, 'You are only allowed to view your own patient record.');
  return patient;
}

export async function updatePatient(actor: Actor, id: string, input: UpdatePatientInput) {
  await getPatientById(actor, id); // tái dùng luôn check 404 + quyền sở hữu
  const { dob, ...rest } = input;
  return prisma.patient.update({
    where: { id },
    data: { ...rest, ...(dob ? { dob: new Date(dob) } : {}) },
  });
}

export async function deletePatient(actor: Actor, id: string) {
  if (!isAdmin(actor)) throw httpError(403, 'Only administrators are allowed to delete patient records.');
  const patient = await prisma.patient.findFirst({ where: { id, deletedAt: null } });
  if (!patient) throw httpError(404, 'Patient record not found.');
  return prisma.patient.update({ where: { id }, data: { deletedAt: new Date() } });
}