import { Router } from 'express';
import { login, refresh, register } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { loginSchema, refreshSchema, registerSchema } from '../schemas/auth.schemas.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', validateBody(refreshSchema), refresh);

export default router;