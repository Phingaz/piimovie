export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  userId?: string;
  requestId?: string;
  userAgent?: string;
  ip?: string;
  url?: string;
  [key: string]: unknown;
}

interface SerializedError {
  name: string;
  message: string;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private sanitizeError(error: unknown): SerializedError | unknown {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      };
    }
    return error;
  }

  private sanitizeContext(context: LogContext): LogContext {
    const sanitized = { ...context };

    // Remove sensitive data
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization'];
    sensitiveKeys.forEach((key) => {
      if (key in sanitized) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: unknown) {
    const timestamp = new Date().toISOString();
    const sanitizedContext = context ? this.sanitizeContext(context) : {};
    const sanitizedError = error ? this.sanitizeError(error) : undefined;

    const logEntry = {
      timestamp,
      level,
      message,
      context: sanitizedContext,
      error: sanitizedError,
      environment: process.env.NODE_ENV || 'development',
    };

    if (this.isDevelopment) {
      const logArgs: unknown[] = [`[${timestamp}] ${level.toUpperCase()}: ${message}`, sanitizedContext];
      if (sanitizedError !== undefined) {
        logArgs.push(sanitizedError);
      }
      console[level === LogLevel.ERROR ? 'error' : 'log'](...logArgs);
    } else {
      // In production, you would send this to your logging service
      console[level === LogLevel.ERROR ? 'error' : 'log'](JSON.stringify(logEntry));
    }

    // Send to external logging service (e.g., Sentry) in production
    if (level === LogLevel.ERROR && !this.isDevelopment && process.env.SENTRY_DSN) {
      this.sendToSentry(logEntry);
    }
  }

  private sendToSentry(logEntry: Record<string, unknown>) {
    // Sentry integration would go here
    // This is a placeholder for Sentry error reporting
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = logEntry;
  }

  debug(message: string, context?: LogContext, error?: unknown) {
    this.log(LogLevel.DEBUG, message, context, error);
  }

  info(message: string, context?: LogContext, error?: unknown) {
    this.log(LogLevel.INFO, message, context, error);
  }

  warn(message: string, context?: LogContext, error?: unknown) {
    this.log(LogLevel.WARN, message, context, error);
  }

  error(message: string, context?: LogContext, error?: unknown) {
    this.log(LogLevel.ERROR, message, context, error);
  }
}

export const logger = new Logger();

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: LogContext;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, context?: LogContext) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: LogContext) {
    super(message, 400, true, context);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', context?: LogContext) {
    super(message, 404, true, context);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', context?: LogContext) {
    super(message, 401, true, context);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', context?: LogContext) {
    super(message, 403, true, context);
  }
}

export function createSafeErrorMessage(error: unknown): string {
  if (process.env.NODE_ENV === 'development') {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  // In production, return generic messages for security
  if (error instanceof AppError && error.isOperational) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again later.';
}

export function handleAsyncErrors<T extends unknown[], R>(fn: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      logger.error('Async function error', { functionName: fn.name }, error);
      throw error;
    }
  };
}
