import type { NextFunction, Request, Response } from 'express';
import * as doctorsService from '../services/doctors.service.js';

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { q, specialty, departmentId, status, page, limit } = req.query as Record<string, string>;
    res.status(200).json(await doctorsService.listDoctors({ q, specialty, departmentId, status, page, limit }));
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await doctorsService.getDoctorById(req.params.id as string));
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await doctorsService.createDoctor(req.body));
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await doctorsService.updateDoctor(req.params.id as string, req.body));
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await doctorsService.deleteDoctor(req.params.id as string));
  } catch (err) {
    next(err);
  }
}