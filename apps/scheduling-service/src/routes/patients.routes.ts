import { Router } from 'express';
import { create, getById, list, remove, update } from '../controllers/patients.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createPatientSchema, updatePatientSchema } from '../schemas/patients.schema.js';

const router = Router();

router.get('/', authMiddleware, requireRoles('ADMIN'), list);
router.post('/', authMiddleware, validateBody(createPatientSchema), create);
router.get('/:id', authMiddleware, getById);
router.put('/:id', authMiddleware, validateBody(updatePatientSchema), update);
router.delete('/:id', authMiddleware, requireRoles('ADMIN'), remove);

export default router;