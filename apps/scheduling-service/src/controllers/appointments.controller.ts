import type { NextFunction, Request, Response } from 'express';
import type { AppointmentStatus } from '../generated/prisma/index.js';
import * as appointmentsService from '../services/appointments.service.js';

function actorOf(req: Request) {
  return { id: req.user!.id, roles: req.user!.roles };
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json(await appointmentsService.createAppointment(actorOf(req), req.body));
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { patientId, doctorId, status, date, page, limit } = req.query as Record<string, string>;
    res.status(200).json(await appointmentsService.listAppointments(actorOf(req), { patientId, doctorId, status, date, page, limit }));
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(200).json(await appointmentsService.getAppointmentById(actorOf(req), req.params.id as string));
  } catch (err) {
    next(err);
  }
}

function transition(to: AppointmentStatus) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json(await appointmentsService.transitionStatus(actorOf(req), req.params.id as string, to));
    } catch (err) {
      next(err);
    }
  };
}

export const confirm = transition('CONFIRMED');
export const checkIn = transition('CHECKED_IN');
export const complete = transition('COMPLETED');
export const cancel = transition('CANCELLED');