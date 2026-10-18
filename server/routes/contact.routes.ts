import { Router } from 'express';
import { handleContactInquiry } from '../controllers/contact.controller';

const router = Router();

router.post('/', handleContactInquiry);

export default router;
