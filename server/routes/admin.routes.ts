import { Router } from 'express';
import { getAdminMetrics, updateRegistrationStatus } from '../controllers/admin.controller';
import { requireAdminAuth } from '../middleware/auth.middleware';

const router = Router();

// Protect all admin endpoints
router.use(requireAdminAuth);

router.get('/metrics', getAdminMetrics);
router.patch('/registrations/:id/status', updateRegistrationStatus);

export default router;
