import { Response } from 'express';
import { 
  ApiResponse, 
  ErrorDetails, 
  PaginationMetadata,
  ResponseMetadata 
} from '@type/response.type';

class ResponseUtil {
  /**
   * Send success response
   */
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Operation successful',
    statusCode: number = 200,
    metadata?: ResponseMetadata
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      metadata,
      timestamp: new Date().toISOString()
    };
    
    return res.status(statusCode).json(response);
  }
  
  /**
   * Send success with pagination
   */
  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationMetadata,
    message: string = 'Data retrieved successfully',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T[]> = {
      success: true,
      message,
      data,
      metadata: { pagination },
      timestamp: new Date().toISOString()
    };
    
    return res.status(statusCode).json(response);
  }
  
  /**
   * Send created response (201)
   */
  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully',
    metadata?: ResponseMetadata
  ): Response {
    return this.success(res, data, message, 201, metadata);
  }
  
  /**
   * Send no content response (204)
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }
  
  /**
   * Send error response
   */
  static error(
    res: Response,
    error: Error | string,
    statusCode: number = 500,
    errorCode: string = 'INTERNAL_ERROR',
    details?: any
  ): Response {
    const errorMessage = error instanceof Error ? error.message : error;
    
    const errorDetails: ErrorDetails = {
      code: errorCode,
      message: errorMessage,
      details
    };
    
    // Add stack trace only in development
    if (process.env.NODE_ENV === 'development' && error instanceof Error) {
      errorDetails.stack = error.stack;
    }
    
    const response: ApiResponse = {
      success: false,
      message: errorMessage,
      error: errorDetails,
      timestamp: new Date().toISOString()
    };
    
    return res.status(statusCode).json(response);
  }
  
  /**
   * Bad Request (400)
   */
  static badRequest(
    res: Response,
    message: string = 'Bad request',
    details?: any
  ): Response {
    return this.error(res, message, 400, 'BAD_REQUEST', details);
  }
  
  /**
   * Unauthorized (401)
   */
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized access',
    details?: any
  ): Response {
    return this.error(res, message, 401, 'UNAUTHORIZED', details);
  }
  
  /**
   * Forbidden (403)
   */
  static forbidden(
    res: Response,
    message: string = 'Access forbidden',
    details?: any
  ): Response {
    return this.error(res, message, 403, 'FORBIDDEN', details);
  }
  
  /**
   * Not Found (404)
   */
  static notFound(
    res: Response,
    message: string = 'Resource not found',
    details?: any
  ): Response {
    return this.error(res, message, 404, 'NOT_FOUND', details);
  }
  
  /**
   * Conflict (409)
   */
  static conflict(
    res: Response,
    message: string = 'Resource conflict',
    details?: any
  ): Response {
    return this.error(res, message, 409, 'CONFLICT', details);
  }
  
  /**
   * Validation Error (422)
   */
  static validation(
    res: Response,
    message: string = 'Validation failed',
    details?: any
  ): Response {
    return this.error(res, message, 422, 'VALIDATION_ERROR', details);
  }
  
  /**
   * Too Many Requests (429)
   */
  static tooManyRequests(
    res: Response,
    message: string = 'Too many requests',
    details?: any
  ): Response {
    return this.error(res, message, 429, 'RATE_LIMIT_EXCEEDED', details);
  }
  
  /**
   * Internal Server Error (500)
   */
  static internal(
    res: Response,
    message: string = 'Internal server error',
    details?: any
  ): Response {
    return this.error(res, message, 500, 'INTERNAL_ERROR', details);
  }
}

export default ResponseUtil;