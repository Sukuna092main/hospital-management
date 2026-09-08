import type { NextFunction, Request, Response } from 'express';
import * as authService from '../services/auth.service.js';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await authService.register(req.body));
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await authService.login(req.body));
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await authService.refresh(req.body));
  } catch (err) {
    next(err);
  }
}