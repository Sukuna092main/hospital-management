import { Router } from 'express';
import { cancel, checkIn, complete, confirm, create, getById, list } from '../controllers/appointments.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { createAppointmentSchema } from '../schemas/appointments.schema.js';

const router = Router();

router.post('/', authMiddleware, validateBody(createAppointmentSchema), create);
router.get('/', authMiddleware, list);
router.get('/:id', authMiddleware, getById);
router.post('/:id/confirm', authMiddleware, confirm);
router.post('/:id/check-in', authMiddleware, checkIn);
router.post('/:id/complete', authMiddleware, complete);
router.post('/:id/cancel', authMiddleware, cancel);

export default router;