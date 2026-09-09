import type { Prisma } from '../generated/prisma/index.js';
import { prisma } from '../lib/prisma.js';
import { httpError } from '../lib/http-error.js';
import type { CreateDoctorInput, UpdateDoctorInput } from '../schemas/doctors.schema.js';

export async function listDoctors(query: {
  q?: string;
  specialty?: string;
  departmentId?: string;
  status?: string;
  page?: string;
  limit?: string;
}) {
  const page = Math.max(1, Number(query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20)));
  const where: Prisma.DoctorWhereInput = {};
  if (query.q) {
    where.OR = [
      { fullName: { contains: query.q, mode: 'insensitive' } },
      { specialty: { contains: query.q, mode: 'insensitive' } },
      { licenseNumber: { contains: query.q } },
    ];
  }
  if (query.specialty) where.specialty = query.specialty;
  if (query.departmentId) where.departmentId = Number(query.departmentId);
  if (query.status) where.status = query.status;

  const [total, data] = await Promise.all([
    prisma.doctor.count({ where }),
    prisma.doctor.findMany({
      where,
      include: { department: { select: { id: true, name: true, location: true } } },
      orderBy: { fullName: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);
  return { data, total, page, limit };
}

export async function getDoctorById(id: string) {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: { department: { select: { id: true, name: true, location: true } } },
  });
  if (!doctor) throw httpError(404, 'Doctor not found');
  return doctor;
}

export async function createDoctor(input: CreateDoctorInput) {
  const dept = await prisma.department.findUnique({ where: { id: input.departmentId } });
  if (!dept) throw httpError(404, 'Department not found. Please check the departmentId.');
  const existed = await prisma.doctor.findFirst({ where: { userId: input.userId } });
  if (existed) throw httpError(409, 'This user already has a doctor profile.');
  return prisma.doctor.create({ data: input });
}

export async function updateDoctor(id: string, input: UpdateDoctorInput) {
  await getDoctorById(id);
  if (input.departmentId !== undefined) {
    const dept = await prisma.department.findUnique({ where: { id: input.departmentId } });
    if (!dept) throw httpError(404, 'Department not found. Please check the departmentId.');
  }
  return prisma.doctor.update({ where: { id }, data: input });
}

export async function deleteDoctor(id: string) {
  await getDoctorById(id);
  const [scheduleCount, appointmentCount] = await Promise.all([
    prisma.schedule.count({ where: { doctorId: id } }),
    prisma.appointment.count({ where: { doctorId: id } }),
  ]);
  if (scheduleCount + appointmentCount > 0)
    throw httpError(409, 'Doctor still has schedules/appointments. Please cancel them before deleting the doctor.');
  return prisma.doctor.delete({ where: { id } });
}