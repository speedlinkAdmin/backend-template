import { Request, Response } from 'express';
import { catchAsync } from '@utils/catch-async.util';
import * as authService from './auth.service';
import ResponseUtil from '@utils/response.util';

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.register(req.body);
  return ResponseUtil.created(res, user, 'User registered successfully');
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return ResponseUtil.success(res, result, 'User logged in successfully');
});

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getProfile((req as any).user.id);
  return ResponseUtil.success(res, user, 'User profile fetched successfully');
});
