import { Router } from 'express';
import { createRegistration, getRegistrations } from '../controllers/registration.controller';
import { requireAdminAuth } from '../middleware/auth.middleware';

const router = Router();

// Public endpoint for submitting team applications
router.post('/', createRegistration);

// Protected endpoint to view registrations
router.get('/', requireAdminAuth, getRegistrations);

export default router;
