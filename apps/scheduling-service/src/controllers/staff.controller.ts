import type { NextFunction, Request, Response } from 'express';
import * as staffService from '../services/staff.service.js';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { q, departmentId, role, page, limit } = req.query as Record<string, string>;
    res.status(200).json(await staffService.listStaff({ q, departmentId, role, page, limit }));
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await staffService.getStaffById(req.params.id as string));
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await staffService.createStaff(req.body));
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await staffService.updateStaff(req.params.id as string, req.body));
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await staffService.deleteStaff(req.params.id as string));
  } catch (err) {
    next(err);
  }
}