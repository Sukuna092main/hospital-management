import type { NextFunction, Request, Response } from 'express';
import * as schedulesService from '../services/schedules.service.js';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { doctorId, date, page, limit } = req.query as Record<string, string>;
    res.status(200).json(await schedulesService.listSchedules({ doctorId, date, page, limit }));
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await schedulesService.getScheduleById(req.params.id as string));
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await schedulesService.createSchedule(req.body));
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await schedulesService.updateSchedule(req.params.id as string, req.body));
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await schedulesService.deleteSchedule(req.params.id as string));
  } catch (err) {
    next(err);
  }
}