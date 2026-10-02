import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/appError';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // If it's our custom AppError
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Handle Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = (err.meta?.target as string[]) || [];
        const fieldName = Array.isArray(target) ? target.join(', ') : 'unique field';
        sendError(
          res,
          `A record with this ${fieldName} already exists.`,
          409,
          { code: err.code, meta: err.meta }
        );
        return;
      }
      case 'P2025': {
        const customMessage = (err.meta?.cause as string) || 'Record not found.';
        sendError(res, customMessage, 404, { code: err.code });
        return;
      }
      case 'P2003': {
        sendError(
          res,
          'Foreign key constraint violation. Referenced record does not exist.',
          400,
          { code: err.code }
        );
        return;
      }
      default: {
        sendError(res, `Database error: ${err.message}`, 400, { code: err.code });
        return;
      }
    }
  }

  // Handle Prisma Validation Errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError(res, 'Database validation error: Invalid input data.', 400);
    return;
  }

  // SyntaxError (e.g. invalid JSON payload)
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
    sendError(res, 'Malformed JSON payload.', 400);
    return;
  }

  // Fallback for unhandled unexpected errors
  console.error('Unhandled Error:', err);
  const isDev = process.env.NODE_ENV === 'development';
  sendError(
    res,
    isDev ? err.message || 'Internal Server Error' : 'An unexpected error occurred.',
    500,
    isDev ? { stack: err.stack } : null
  );
};
