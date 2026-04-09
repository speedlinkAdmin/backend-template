import { HTTP_STATUS_TEXT } from '@lib/constants';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

/**
 * Custom Application Error with status code
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details?: any;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    errorCode: string = ReasonPhrases.INTERNAL_SERVER_ERROR,
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 - Bad Request
 */
export class BadRequestError extends AppError {
  constructor(message: string = ReasonPhrases.BAD_REQUEST, details?: any) {
    super(message, StatusCodes.BAD_REQUEST, HTTP_STATUS_TEXT.BAD_REQUEST, details);
  }
}

/**
 * 401 - Unauthorized
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = ReasonPhrases.UNAUTHORIZED, details?: any) {
    super(message, StatusCodes.UNAUTHORIZED, HTTP_STATUS_TEXT.UNAUTHORIZED, details);
  }
}

/**
 * 403 - Forbidden
 */
export class ForbiddenError extends AppError {
  constructor(message: string = ReasonPhrases.FORBIDDEN, details?: any) {
    super(message, StatusCodes.FORBIDDEN, HTTP_STATUS_TEXT.FORBIDDEN, details);
  }
}

/**
 * 404 - Not Found
 */
export class NotFoundError extends AppError {
  constructor(message: string = ReasonPhrases.NOT_FOUND, details?: any) {
    super(message, StatusCodes.NOT_FOUND, HTTP_STATUS_TEXT.NOT_FOUND, details);
  }
}

/**
 * 409 - Conflict
 */
export class ConflictError extends AppError {
  constructor(message: string = ReasonPhrases.CONFLICT, details?: any) {
    super(message, StatusCodes.CONFLICT, HTTP_STATUS_TEXT.CONFLICT, details);
  }
}

/**
 * 422 - Validation Error
 */
export class ValidationError extends AppError {
  constructor(message: string = ReasonPhrases.UNPROCESSABLE_ENTITY, details?: any) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY, HTTP_STATUS_TEXT.UNPROCESSABLE_ENTITY, details);
  }
}

/**
 * 429 - Too Many Requests
 */
export class TooManyRequestsError extends AppError {
  constructor(message: string = ReasonPhrases.TOO_MANY_REQUESTS, details?: any) {
    super(message, StatusCodes.TOO_MANY_REQUESTS, HTTP_STATUS_TEXT.TOO_MANY_REQUESTS, details);
  }
}

/**
 * 500 - Internal Server Error
 */
export class InternalServerError extends AppError {
  constructor(message: string = ReasonPhrases.INTERNAL_SERVER_ERROR, details?: any) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, HTTP_STATUS_TEXT.INTERNAL_SERVER_ERROR, details);
  }
}



 