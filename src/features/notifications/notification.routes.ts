import { Router } from 'express';
import { authMiddleware } from 'middlewares/auth.middleware';
import * as notificationController from './notification.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.post('/', notificationController.sendNotification);

export default router;
