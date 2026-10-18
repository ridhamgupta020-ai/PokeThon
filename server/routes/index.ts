import { Router } from 'express';
import registrationRoutes from './registration.routes';
import contactRoutes from './contact.routes';
import adminRoutes from './admin.routes';
import { config } from '../config';

const router = Router();

// Healthcheck
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    event: config.event.name,
    timestamp: new Date().toISOString(),
    institution: config.event.institution,
  });
});

// Mount modules
router.use('/registrations', registrationRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);

export default router;
