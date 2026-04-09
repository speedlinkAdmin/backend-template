import { Router } from 'express';
import { validateBody } from '@middlewares/validate.middleware';
import * as authController from './auth.controller';
import { loginSchema } from './auth.schema';

const router = Router();

router.post('/login', validateBody(loginSchema), authController.login);

export default router;
