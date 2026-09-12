import type { NextFunction, Request, Response } from 'express';
import type { UserRoleName } from '@hospital/shared-types';

export function requireRoles(...allowed: UserRoleName[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const roles = req.user?.roles ?? [];
    if (!allowed.some((r) => roles.includes(r))) {
      res.status(403).json({
        type: 'about:blank',
        title: 'Forbidden',
        status: 403,
        detail: 'Access denied: insufficient permissions',
      });
      return;
    }
    next();
  };
}