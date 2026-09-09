import { z } from 'zod';

const timeMsg = 'Time must be in HH:mm format, e.g., 08:00';

export const createScheduleSchema = z.object({
  doctorId: z.string().uuid('doctorId is not a valid UUID'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, timeMsg),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, timeMsg),
  slotDuration: z.number().int().min(5, 'Minimum slot duration is 5 minutes').max(480, 'Maximum slot duration is 8 hours'),
});

export const updateScheduleSchema = createScheduleSchema.partial();

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;