import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import patientsRoutes from './routes/patients.routes.js';
import departmentsRoutes from './routes/departments.routes.js';
import doctorsRoutes from './routes/doctors.routes.js';
import staffRoutes from './routes/staff.routes.js';
import schedulesRoutes from './routes/schedules.routes.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'scheduling-service' });
  });

  app.use('/api/v1/patients', patientsRoutes);
  app.use('/api/v1/departments', departmentsRoutes);
  app.use('/api/v1/doctors', doctorsRoutes);
  app.use('/api/v1/staff', staffRoutes);
  app.use('/api/v1/schedules', schedulesRoutes);

  app.use(errorHandler);
  return app;
}