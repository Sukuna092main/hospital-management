import { z } from 'zod';

export const createAuditLogSchema = z.object({
  userId: z.string().uuid('userId is not a valid UUID'),
  action: z.string().min(1, 'action is required'),
  resourceType: z.string().min(1, 'resourceType is required'),
  resourceId: z.string().min(1, 'resourceId is required'),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateAuditLogInput = z.infer<typeof createAuditLogSchema>;