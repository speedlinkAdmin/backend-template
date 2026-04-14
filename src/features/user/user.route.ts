import { Router } from 'express';
import { authMiddleware, authorize } from '@middlewares/auth.middleware';
import * as adminController from '@features/user/user.controller';

const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.use(authorize('ADMIN'));

/**
 * @openapi
 * /api/user/stats:
 *   get:
 *     summary: Get dashboard stats
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
userRouter.get('/stats', adminController.getDashboardStats);

/**
 * @openapi
 * /api/user/activities:
 *   get:
 *     summary: Get recent activities
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent activities
 */
userRouter.get('/activities', adminController.getRecentActivities);

export default userRouter;
