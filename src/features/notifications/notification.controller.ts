import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '@utils/catch-async.util';
import { notificationService } from './notification.service';

export const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const notifications = await notificationService.getByUser((req as any).user.id);
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: notifications,
  });
});

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const notification = await notificationService.markAsRead(req.params.id);
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: notification,
  });
});

export const sendNotification = catchAsync(async (req: Request, res: Response) => {
  const notification = await notificationService.send(req.body);
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: notification,
  });
});
