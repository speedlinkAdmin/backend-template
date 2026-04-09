import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError, z } from 'zod';
import ResponseUtil from '../utils/response.util';

/**
 * Middleware factory for validating request body, query, or params
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate against schema
      const validatedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as any;
      
      // Attach validated data to request
      req.validated = validatedData;
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors for consistent API response
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        
        return ResponseUtil.validation(res, 'Validation failed', formattedErrors);
      }
      next(error);
    }
  };
};

/**
 * Validate only request body
 */
export const validateBody = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedBody = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validation(res, 'Validation failed', error.errors);
      }
      next(error);
    }
  };
};

/**
 * Validate only query parameters
 */
export const validateQuery = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedQuery = await schema.parseAsync(req.query);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validation(res, 'Invalid query parameters', error.errors);
      }
      next(error);
    }
  };
};

/**
 * Validate only URL parameters
 */
export const validateParams = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedParams = await schema.parseAsync(req.params);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return ResponseUtil.validation(res, 'Invalid URL parameters', error.errors);
      }
      next(error);
    }
  };
}