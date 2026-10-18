import express from 'express';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error.middleware';

export const createExpressApp = () => {
  const app = express();

  // Parse JSON payloads
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount API endpoints under /api
  app.use('/api', apiRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
