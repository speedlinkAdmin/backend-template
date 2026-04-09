import { Router } from 'express';
import { authMiddleware, authorize } from '@middlewares/auth.middleware';
import * as adminController from '@features/user/user.controller';

const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.use(authorize('ADMIN'));

userRouter.get('/stats', adminController.getDashboardStats);
userRouter.get('/activities', adminController.getRecentActivities);

export default userRouter;
