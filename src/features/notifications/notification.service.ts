import { prisma } from '../../lib/prisma';
import { AppError } from '@utils/app-error.util';
import { StatusCodes } from 'http-status-codes';

export class NotificationService {
  async getByUser(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    const notification = await prisma.notification.findUnique({ where: { id } });

    if (!notification) {
      throw new AppError('Notification not found', StatusCodes.NOT_FOUND);
    }

    return await prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async send(data: any) {
    return await prisma.notification.create({ data });
  }
}

export const notificationService = new NotificationService();
