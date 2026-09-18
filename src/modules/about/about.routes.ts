import { Router } from 'express';
import AboutController from './about.controller.js';

const router = Router();

// Public route
router.get('/', AboutController.getAbout);

export default router;
