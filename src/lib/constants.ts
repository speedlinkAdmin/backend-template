import { ReasonPhrases } from "http-status-codes";

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;

// Queue Names
export const QUEUE_NAMES = {
  EMAIL: 'email',
  NOTIFICATION: 'notification',
  REPORT: 'report',
} as const;

// Cache TTL (seconds)
export const CACHE_TTL = {
  SHORT: 60,           // 1 minute
  MEDIUM: 300,         // 5 minutes
  LONG: 3600,          // 1 hour
  DAY: 86400,          // 24 hours
} as const;

// Error codes
export const ERROR_CODES = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PHONE: 'INVALID_PHONE',
  INVALID_PASSWORD_LENGTH: 'INVALID_PASSWORD_LENGTH',
  INVALID_PASSWORD_FORMAT: 'INVALID_PASSWORD_FORMAT',
  INVALID_PASSWORD_CONFIRMATION: 'INVALID_PASSWORD_CONFIRMATION',
  INVALID_PASSWORD_RESET_TOKEN: 'INVALID_PASSWORD_RESET_TOKEN',
  INVALID_PASSWORD_RESET_TOKEN_EXPIRED: 'INVALID_PASSWORD_RESET_TOKEN_EXPIRED',
  INVALID_PASSWORD_RESET_TOKEN_NOT_FOUND: 'INVALID_PASSWORD_RESET_TOKEN_NOT_FOUND',
} as const;

export const HTTP_STATUS_TEXT = Object.fromEntries(
    Object.keys(ReasonPhrases).map(key => [key, key])
  ) as { readonly [K in keyof typeof ReasonPhrases]: K };