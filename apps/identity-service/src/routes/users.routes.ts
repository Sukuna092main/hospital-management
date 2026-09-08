import { Router } from 'express';
import { me, updateRoles } from '../controllers/users.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { updateRolesSchema } from '../schemas/users.schema.js';

const router = Router();

router.get('/me', authMiddleware, me);
router.patch('/:id/roles', authMiddleware, requireRoles('ADMIN'), validateBody(updateRolesSchema), updateRoles);

export default router;