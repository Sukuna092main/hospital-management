import { z } from 'zod';

export const createDoctorSchema = z.object({
  userId: z.string().uuid('userId is not a valid UUID'),
  fullName: z.string().min(1, 'FullName is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  licenseNumber: z.string().min(1, 'License number is required'),
  departmentId: z.number().int('departmentId must be an integer'),
  status: z.enum(['ON_DUTY', 'OFF']).optional(),
});

export const updateDoctorSchema = createDoctorSchema.omit({ userId: true }).partial();

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;