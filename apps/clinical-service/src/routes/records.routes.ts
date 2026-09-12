import { Router } from 'express';
import { create, getById, list } from '../controllers/records.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createRecordSchema } from '../schemas/records.schema.js';

const router = Router();

router.post('/', authMiddleware, requireRoles('DOCTOR', 'ADMIN'), validateBody(createRecordSchema), create);
router.get('/', authMiddleware, list);
router.get('/:id', authMiddleware, getById);

export default router;