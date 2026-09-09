import { Router } from 'express';
import { create, getById, list, remove, update } from '../controllers/departments.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createDepartmentSchema, updateDepartmentSchema } from '../schemas/departments.schema.js';

const router = Router();

router.get('/', authMiddleware, list);
router.post('/', authMiddleware, requireRoles('ADMIN'), validateBody(createDepartmentSchema), create);
router.get('/:id', authMiddleware, getById);
router.put('/:id', authMiddleware, requireRoles('ADMIN'), validateBody(updateDepartmentSchema), update);
router.delete('/:id', authMiddleware, requireRoles('ADMIN'), remove);

export default router;