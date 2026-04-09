import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '@utils/app-error.util';
import passport from '@lib/passport';
import { User } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: User;
}

/**
 * Authentication middleware using Passport JWT strategy
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate('jwt', { session: false }, (err: any, user: User | false, info: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      if (info?.name === 'TokenExpiredError') {
        return next(new UnauthorizedError('Token expired'));
      }
      if (info?.name === 'JsonWebTokenError') {
        return next(new UnauthorizedError('Invalid token'));
      }
      return next(new UnauthorizedError('Authentication required'));
    }

    req.user = user;
    next();
  })(req, res, next);
};

/**
 * RBAC middleware
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to perform this action'));
    }

    next();
  };
};
