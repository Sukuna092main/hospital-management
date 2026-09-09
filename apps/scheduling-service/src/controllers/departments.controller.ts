import type { NextFunction, Request, Response } from 'express';
import * as departmentsService from '../services/departments.service.js';

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await departmentsService.listDepartments());
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await departmentsService.getDepartmentById(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await departmentsService.createDepartment(req.body));
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await departmentsService.updateDepartment(Number(req.params.id), req.body));
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await departmentsService.deleteDepartment(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}