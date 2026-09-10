import { Router } from 'express';
import TagController from './tag.controller.js';

const router = Router();

router.get('/', TagController.getAllTags);
router.get('/:slug', TagController.getBySlug);

export default router;
