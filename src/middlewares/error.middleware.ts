import { Request, Response } from 'express';
import ResponseUtil from '../utils/response.util';
import { AppError } from '../utils/app-error.util';
import { logger } from '../lib/logger';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
) {
  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  // Handle known AppError
  if (err instanceof AppError) {
    return ResponseUtil.error(
      res,
      err.message,
      err.statusCode,
      err.errorCode,
      err.details
    );
  }
  
  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    return ResponseUtil.validation(
      res,
      'Validation failed',
      (err as any).errors
    );
  }
  
  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    switch (prismaError.code) {
      case 'P2002':
        return ResponseUtil.conflict(
          res,
          'Unique constraint violation',
          { field: prismaError.meta?.target }
        );
      case 'P2025':
        return ResponseUtil.notFound(res, 'Record not found');
      default:
        return ResponseUtil.internal(res, 'Database error');
    }
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ResponseUtil.unauthorized(res, 'Invalid token');
  }
  
  if (err.name === 'TokenExpiredError') {
    return ResponseUtil.unauthorized(res, 'Token expired');
  }
  
  // Default internal server error
  return ResponseUtil.internal(res, 'Something went wrong');
}