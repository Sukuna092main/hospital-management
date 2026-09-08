import { z } from 'zod';

export const createPatientSchema = z.object({
  userId: z.string().uuid('userId is invalid UUID format'),
  fullName: z.string().min(1, 'Full name cannot be empty'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format'),
  gender: z.string().min(1, 'Gender cannot be empty'),
  phone: z.string().trim().regex(/^0\d{9}$/, 'Phone number must be 10 digits, starting with 0'),
  address: z.string().min(1, 'Address cannot be empty'),
  nationalId: z.string().optional(),
  insuranceNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

// Sửa: bỏ userId (không cho đổi liên kết identity) + toàn bộ optional
export const updatePatientSchema = createPatientSchema.omit({ userId: true }).partial();

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;