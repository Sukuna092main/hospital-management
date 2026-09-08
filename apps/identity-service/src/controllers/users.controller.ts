import type { NextFunction, Request, Response } from 'express';
import * as usersService from '../services/users.service.js';

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await usersService.getMe(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function updateRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await usersService.updateRoles(req.user!.id, req.params.id as string, req.body.roles));
  } catch (err) {
    next(err);
  }
}