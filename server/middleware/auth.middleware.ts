import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

/**
 * Middleware to verify organizer/admin authorization key
 */
export const requireAdminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const adminKey = req.headers['x-admin-key'] as string;

  if (
    adminKey === config.admin.accessKey ||
    authHeader === `Bearer ${config.admin.accessKey}`
  ) {
    next();
    return;
  }

  res.status(401).json({
    success: false,
    error: 'Unauthorized: Valid organizer access key required',
  });
};
