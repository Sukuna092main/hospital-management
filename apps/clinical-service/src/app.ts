import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import recordsRoutes from './routes/records.routes.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'clinical-service' });
  });

  app.use('/api/v1/records', recordsRoutes);

  app.use(errorHandler);
  return app;
}