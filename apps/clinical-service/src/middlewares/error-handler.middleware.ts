import type { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  const status = typeof err?.status === 'number' ? err.status : 500;
  res.status(status).json({
    type: 'about:blank',
    title: err?.message ?? 'Internal Server Error',
    status,
    ...(err?.errors ? { errors: err.errors } : {}),
  });
}