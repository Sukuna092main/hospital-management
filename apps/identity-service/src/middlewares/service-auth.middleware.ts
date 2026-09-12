import type { NextFunction, Request, Response } from 'express';

export function serviceAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers['x-service-key'];
  const expected = process.env.INTERNAL_API_KEY;
  // Fail-closed: chưa cấu hình key thì từ chối hết, không mở cửa giữa chừng
  if (!expected || key !== expected) {
    res.status(401).json({
      type: 'about:blank',
      title: 'Unauthorized',
      status: 401,
      detail: 'Missing or invalid service key. Please provide a valid x-service-key header.',
    });
    return;
  }
  next();
}