import { Request, Response } from 'express';
import { catchAsync } from '@utils/catch-async.util';
import * as UserService from './user.service';
import ResponseUtil from '@utils/response.util';


export const getDashboardStats = catchAsync(async (_: Request, res: Response) => {
  const stats = await UserService.getDashboardStats();
  
  ResponseUtil.success(res, stats);
});

export const getRecentActivities = catchAsync(async (_: Request, res: Response) => {
  const recentUsers = await UserService.getRecentActivities();
  
  ResponseUtil.success(res, recentUsers);
});

