import { z } from 'zod';

export const updateRolesSchema = z.object({
  roles: z.array(z.string()).min(1, 'Roles list cannot be empty'),
});

export type UpdateRolesInput = z.infer<typeof updateRolesSchema>;