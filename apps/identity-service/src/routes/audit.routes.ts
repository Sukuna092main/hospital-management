import { Router } from 'express';
import { create, list } from '../controllers/audit.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { serviceAuthMiddleware } from '../middlewares/service-auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createAuditLogSchema } from '../schemas/audit.schema.js';

const router = Router();

// Service khác gọi (kẹp service-key) — không cần JWT user
router.post('/', serviceAuthMiddleware, validateBody(createAuditLogSchema), create);
// Admin xem nhật ký (JWT + ADMIN) — phục vụ màn audit Week 7
router.get('/', authMiddleware, requireRoles('ADMIN'), list);

export default router;