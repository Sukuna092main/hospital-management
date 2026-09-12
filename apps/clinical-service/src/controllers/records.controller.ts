import type { NextFunction, Request, Response } from 'express';
import * as recordsService from '../services/records.service.js';

function actorOf(req: Request) {
  return { id: req.user!.id, roles: req.user!.roles };
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await recordsService.createRecord(actorOf(req), req.body, req.headers.authorization));
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { patientId } = req.query as { patientId?: string };
    res.status(200).json(await recordsService.listRecords(actorOf(req), patientId, req.headers.authorization));
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await recordsService.getRecordById(actorOf(req), req.params.id as string, req.headers.authorization));
  } catch (err) {
    next(err);
  }
}