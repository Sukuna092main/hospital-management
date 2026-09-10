import type { AppointmentStatus, Prisma } from '../generated/prisma/index.js';
import type { UserRoleName } from '@hospital/shared-types';
import { prisma } from '../lib/prisma.js';
import { httpError } from '../lib/http-error.js';
import type { CreateAppointmentInput } from '../schemas/appointments.schema.js';

interface Actor {
  id: string; // Identity users.id từ token
  roles: UserRoleName[];
}

const isAdmin = (a: Actor) => a.roles.includes('ADMIN');
const isStaff = (a: Actor) => a.roles.includes('ADMIN') || a.roles.includes('NURSE');

// PENDING → CONFIRMED → CHECKED_IN → COMPLETED, CANCELLED từ 3 trạng thái đầu. COMPLETED/CANCELLED là chốt.
const TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['CHECKED_IN', 'CANCELLED'],
  CHECKED_IN: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

const withDetails = {
  patient: { select: { id: true, fullName: true, phone: true, userId: true } },
  doctor: { select: { id: true, fullName: true, specialty: true, userId: true } },
  history: { orderBy: { changedAt: 'asc' as const } },
} as const;

function dayRange(dateStr: string): { start: Date; end: Date } {
  const start = new Date(`${dateStr}T00:00:00Z`);
  return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
}

async function getOrThrow(id: string) {
  const appt = await prisma.appointment.findUnique({ where: { id }, include: withDetails });
  if (!appt) throw httpError(404, 'Examination schedule not found.');
  return appt;
}

export async function createAppointment(actor: Actor, input: CreateAppointmentInput) {
  // JOIN nội bộ cùng DB: check bệnh nhân + bác sĩ tồn tại (không cần REST vì cùng service)
  const patient = await prisma.patient.findFirst({ where: { id: input.patientId, deletedAt: null } });
  if (!patient) throw httpError(404, 'Patient profile not found (may have been deleted).');
  const doctor = await prisma.doctor.findUnique({ where: { id: input.doctorId } });
  if (!doctor) throw httpError(404, 'Doctor not found.');

  // Quyền: ADMIN/NURSE đặt hộ ai cũng được; PATIENT chỉ đặt cho chính mình; DOCTOR không đặt lịch
  if (!isStaff(actor)) {
    if (!actor.roles.includes('PATIENT') || patient.userId !== actor.id)
      throw httpError(403, 'You are only allowed to create appointments for yourself.');
  }

  if (doctor.status !== 'ON_DUTY') throw httpError(422, 'The doctor is currently OFF. Please choose another doctor.');

  const at = new Date(input.scheduledAt);
  if (Number.isNaN(at.getTime())) throw httpError(422, 'scheduledAt is not in the correct ISO format, e.g., 2026-09-15T08:00:00Z.');
  if (at.getTime() <= Date.now()) throw httpError(422, 'The appointment time must be in the future.');

  // The appointment time must be within the doctor's working hours for that day
  const day = at.toISOString().slice(0, 10);
  const daySchedules = await prisma.schedule.findMany({ where: { doctorId: doctor.id, date: new Date(day) } });
  const minutes = at.getUTCHours() * 60 + at.getUTCMinutes();
  const inside = daySchedules.some((s) => {
    const from = s.startTime.getUTCHours() * 60 + s.startTime.getUTCMinutes();
    const to = s.endTime.getUTCHours() * 60 + s.endTime.getUTCMinutes();
    return minutes >= from && minutes < to;
  });
  if (!inside) throw httpError(422, "The appointment time is outside the doctor's working hours for that day.");

  // Chống double-book: cùng bác sĩ + cùng giờ + chưa hủy
  const clash = await prisma.appointment.findFirst({
    where: { doctorId: doctor.id, scheduledAt: at, status: { not: 'CANCELLED' } },
  });
  if (clash) throw httpError(409, 'The time slot is already booked. Please choose a different time.');

  const created = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      doctorId: doctor.id,
      scheduledAt: at,
      reason: input.reason,
      status: 'PENDING',
      history: { create: [{ oldStatus: null, newStatus: 'PENDING', changedBy: actor.id }] },
    },
  });
  return getOrThrow(created.id);
}

function assertTransitionPermission(actor: Actor, appt: { patient: { userId: string }; doctor: { userId: string } }, to: AppointmentStatus): void {
  switch (to) {
    case 'CONFIRMED':
    case 'CHECKED_IN':
      if (!isStaff(actor)) throw httpError(403, 'Only receptionists are allowed to confirm/check-in appointments.');
      return;
    case 'COMPLETED':
      if (!isAdmin(actor) && appt.doctor.userId !== actor.id)
        throw httpError(403, 'Only the responsible doctor is allowed to mark an appointment as completed.');
      return;
    case 'CANCELLED':
      if (isStaff(actor) || appt.patient.userId === actor.id || appt.doctor.userId === actor.id) return;
      throw httpError(403, 'You do not have permission to cancel this appointment.');
  }
}

export async function transitionStatus(actor: Actor, id: string, to: AppointmentStatus) {
  const appt = await getOrThrow(id);
  assertTransitionPermission(actor, appt, to);

  const allowed = TRANSITIONS[appt.status];
  if (!allowed.includes(to))
    throw httpError(422, `Cannot transition from ${appt.status} to ${to}.`, [
      {
        field: 'status',
        message:
          allowed.length === 0
            ? `The appointment is already ${appt.status}, and cannot be transitioned further.`
            : `From ${appt.status} only can be transitioned to: ${allowed.join(', ')}.`,
      },
    ]);

  await prisma.$transaction([
    prisma.appointment.update({ where: { id }, data: { status: to } }),
    prisma.appointmentStatusHistory.create({
      data: { appointmentId: id, oldStatus: appt.status, newStatus: to, changedBy: actor.id },
    }),
  ]);
  return getOrThrow(id);
}

export async function listAppointments(
  actor: Actor,
  query: { patientId?: string; doctorId?: string; status?: string; date?: string; page?: string; limit?: string },
) {
  const page = Math.max(1, Number(query.page ?? 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 20)));
  const where: Prisma.AppointmentWhereInput = {};

  if (isStaff(actor)) {
    // Lễ tân/admin: lọc tự do theo query
    if (query.patientId) where.patientId = query.patientId;
    if (query.doctorId) where.doctorId = query.doctorId;
  } else if (actor.roles.includes('PATIENT')) {
    const me = await prisma.patient.findFirst({ where: { userId: actor.id, deletedAt: null } });
    if (!me) return { data: [], total: 0, page, limit }; // chưa có hồ sơ → list rỗng, không 403
    where.patientId = me.id;
  } else if (actor.roles.includes('DOCTOR')) {
    const me = await prisma.doctor.findFirst({ where: { userId: actor.id } });
    if (!me) return { data: [], total: 0, page, limit };
    where.doctorId = me.id;
  } else {
    throw httpError(403, 'The account does not have permission to view appointments.');
  }

  if (query.status) where.status = query.status as AppointmentStatus;
  if (query.date) {
    const { start, end } = dayRange(query.date);
    where.scheduledAt = { gte: start, lt: end };
  }

  const [total, data] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.findMany({
      where,
      include: withDetails,
      orderBy: { scheduledAt: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);
  return { data, total, page, limit };
}

export async function getAppointmentById(actor: Actor, id: string) {
  const appt = await getOrThrow(id);
  if (isStaff(actor) || appt.patient.userId === actor.id || appt.doctor.userId === actor.id) return appt;
  throw httpError(403, 'You do not have permission to view this appointment.');
}