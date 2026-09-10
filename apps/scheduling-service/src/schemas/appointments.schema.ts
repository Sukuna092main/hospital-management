import { z } from 'zod';

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid('patientId is not a valid UUID'),
  doctorId: z.string().uuid('doctorId is not a valid UUID'),
  scheduledAt: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format, expected ISO string'),
  reason: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;