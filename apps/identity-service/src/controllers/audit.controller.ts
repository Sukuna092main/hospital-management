import type { NextFunction, Request, Response } from 'express';
import * as auditService from '../services/audit.service.js';

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await auditService.writeAudit(req.body);
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, action, userId } = req.query as Record<string, string>;
    res.status(200).json(await auditService.listAudits({ page, limit, action, userId }));
  } catch (err) {
    next(err);
  }
}