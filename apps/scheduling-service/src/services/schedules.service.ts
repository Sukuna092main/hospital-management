import type { Prisma } from '../generated/prisma/index.js';
import { prisma } from '../lib/prisma.js';
import { httpError } from '../lib/http-error.js';
import type { CreateScheduleInput, UpdateScheduleInput } from '../schemas/schedules.schema.js';

// Cột @db.Time chỉ giữ giờ-phút → neo vào ngày cố định để so sánh
function toTime(t: string): Date {
  return new Date(`1970-01-01T${t}:00Z`);
}
function toHHMM(d: Date): string {
  return d.toISOString().slice(11, 16);
}
function dayRange(dateStr: string): { start: Date; end: Date } {
  const start = new Date(`${dateStr}T00:00:00Z`);
  return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
}

const withDoctor = { doctor: { select: { id: true, fullName: true, specialty: true } } } as const;

export async function listSchedules(query: { doctorId?: string; date?: string; page?: string; limit?: string }) {
  const page = Math.max(1, Number(query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20)));
  const where: Prisma.ScheduleWhereInput = {};
  if (query.doctorId) where.doctorId = query.doctorId;
  if (query.date) where.date = new Date(query.date);

  const [total, data] = await Promise.all([
    prisma.schedule.count({ where }),
    prisma.schedule.findMany({
      where,
      include: withDoctor,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);
  return { data, total, page, limit };
}

export async function getScheduleById(id: string) {
  const schedule = await prisma.schedule.findUnique({ where: { id }, include: withDoctor });
  if (!schedule) throw httpError(404, 'Schedule not found');
  return schedule;
}

function assertOrder(startTime: string, endTime: string): void {
  if (toTime(endTime).getTime() <= toTime(startTime).getTime())
    throw httpError(422, 'EndTime must be after StartTime.', [
      { field: 'endTime', message: 'EndTime must be after StartTime.' },
    ]);
}

export async function createSchedule(input: CreateScheduleInput) {
  const doctor = await prisma.doctor.findUnique({ where: { id: input.doctorId } });
  if (!doctor) throw httpError(404, 'Doctor not found. Please check the doctorId.');
  assertOrder(input.startTime, input.endTime);
  return prisma.schedule.create({
    data: {
      doctorId: input.doctorId,
      date: new Date(input.date),
      startTime: toTime(input.startTime),
      endTime: toTime(input.endTime),
      slotDuration: input.slotDuration,
    },
  });
}

export async function updateSchedule(id: string, input: UpdateScheduleInput) {
  const existing = await getScheduleById(id);
  if (input.doctorId !== undefined) {
    const doctor = await prisma.doctor.findUnique({ where: { id: input.doctorId } });
    if (!doctor) throw httpError(404, 'Doctor not found. Please check the doctorId.');
  }
  const startTime = input.startTime ?? toHHMM(existing.startTime);
  const endTime = input.endTime ?? toHHMM(existing.endTime);
  if (input.startTime !== undefined || input.endTime !== undefined) assertOrder(startTime, endTime);
  const { date, startTime: _s, endTime: _e, ...rest } = input;
  return prisma.schedule.update({
    where: { id },
    data: {
      ...rest,
      ...(date ? { date: new Date(date) } : {}),
      ...(input.startTime ? { startTime: toTime(input.startTime) } : {}),
      ...(input.endTime ? { endTime: toTime(input.endTime) } : {}),
    },
  });
}

export async function deleteSchedule(id: string) {
  const schedule = await getScheduleById(id);
  const { start, end } = dayRange(schedule.date.toISOString().slice(0, 10));
  const booked = await prisma.appointment.count({
    where: { doctorId: schedule.doctorId, scheduledAt: { gte: start, lt: end } },
  });
  if (booked > 0)
    throw httpError(409, `This time slot already has ${booked} appointments. Please cancel those appointments before deleting.`);
  return prisma.schedule.delete({ where: { id } });
}