import type { NextFunction, Request, Response } from 'express';
import * as patientsService from '../services/patients.service.js';

function actorOf(req: Request) {
  return { id: req.user!.id, roles: req.user!.roles };
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit, q } = req.query as { page?: string; limit?: string; q?: string };
    res.status(200).json(await patientsService.listPatients(actorOf(req), { page, limit, q }));
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await patientsService.createPatient(actorOf(req), req.body));
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await patientsService.getPatientById(actorOf(req), req.params.id as string));
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await patientsService.updatePatient(actorOf(req), req.params.id as string, req.body));
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await patientsService.deletePatient(actorOf(req), req.params.id as string));
  } catch (err) {
    next(err);
  }
}