import { Router } from 'express';
import { create, getById, list, remove, update } from '../controllers/schedules.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createScheduleSchema, updateScheduleSchema } from '../schemas/schedules.schema.js';

const router = Router();

router.get('/', authMiddleware, list);
router.post('/', authMiddleware, requireRoles('ADMIN'), validateBody(createScheduleSchema), create);
router.get('/:id', authMiddleware, getById);
router.put('/:id', authMiddleware, requireRoles('ADMIN'), validateBody(updateScheduleSchema), update);
router.delete('/:id', authMiddleware, requireRoles('ADMIN'), remove);

export default router;