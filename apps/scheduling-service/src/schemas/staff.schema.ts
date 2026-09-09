import { z } from 'zod';

export const createStaffSchema = z.object({
  userId: z.string().uuid('userId is not a valid UUID'),
  fullName: z.string().min(1, 'FullName is required'),
  role: z.enum(['NURSE', 'TECHNICIAN']),
  departmentId: z.number().int('departmentId must be an integer'),
});

export const updateStaffSchema = createStaffSchema.omit({ userId: true }).partial();

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;