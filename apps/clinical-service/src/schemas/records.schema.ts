import { z } from 'zod';

const uuidMsg = 'Invalid UUID format';

const vitalsSchema = z
  .object({
    bloodPressure: z.string().optional(),
    heartRate: z.number().optional(),
    temperature: z.number().optional(),
    heightCm: z.number().positive('Height must be a positive number').optional(),
    weightKg: z.number().positive('Weight must be a positive number').optional(),
  })
  .optional();

const prescriptionSchema = z.object({
  medicationId: z.string().uuid(`medicationId ${uuidMsg}`),
  name: z.string().min(1, 'Name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  quantity: z.number().int().min(1, 'Quantity must be a positive integer'),
  unitPrice: z.number().min(0, 'Unit price must be a positive number'),
  instructions: z.string().optional(),
});

export const createRecordSchema = z.object({
  appointmentId: z.string().uuid(`appointmentId ${uuidMsg}`),
  patientId: z.string().uuid(`patientId ${uuidMsg}`),
  doctorId: z.string().uuid(`doctorId ${uuidMsg}`),
  visitDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Visit date must be in YYYY-MM-DD format'),
  diagnosisIcd10: z.string().optional(),
  diagnosisDescription: z.string().optional(),
  vitals: vitalsSchema,
  prescriptions: z.array(prescriptionSchema).optional(),
  notes: z.string().optional(),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;