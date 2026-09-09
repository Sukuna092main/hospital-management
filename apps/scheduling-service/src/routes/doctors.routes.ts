import { Router } from 'express';
import { create, getById, list, remove, update } from '../controllers/doctors.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createDoctorSchema, updateDoctorSchema } from '../schemas/doctors.schema.js';

const router = Router();

router.get('/', authMiddleware, list);
router.post('/', authMiddleware, requireRoles('ADMIN'), validateBody(createDoctorSchema), create);
router.get('/:id', authMiddleware, getById);
router.put('/:id', authMiddleware, requireRoles('ADMIN'), validateBody(updateDoctorSchema), update);
router.delete('/:id', authMiddleware, requireRoles('ADMIN'), remove);

export default router;