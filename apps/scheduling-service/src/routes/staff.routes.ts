import { Router } from 'express';
import { create, getById, list, remove, update } from '../controllers/staff.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createStaffSchema, updateStaffSchema } from '../schemas/staff.schema.js';

const router = Router();

router.get('/', authMiddleware, list);
router.post('/', authMiddleware, requireRoles('ADMIN'), validateBody(createStaffSchema), create);
router.get('/:id', authMiddleware, getById);
router.put('/:id', authMiddleware, requireRoles('ADMIN'), validateBody(updateStaffSchema), update);
router.delete('/:id', authMiddleware, requireRoles('ADMIN'), remove);

export default router;