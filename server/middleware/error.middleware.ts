import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[Server Error]:', err);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Sprint Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
  });
};
