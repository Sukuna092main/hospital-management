import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({
        type: 'https://example.com/problems/validation-error',
        title: 'Validation Failed',
        status: 422,
        detail: 'Data validation failed for the request body',
        errors: parsed.error.issues.map((i) => ({
          field: i.path.join('.') || 'body',
          message: i.message,
        })),
      });
      return;
    }
    req.body = parsed.data;
    next();
  };
}