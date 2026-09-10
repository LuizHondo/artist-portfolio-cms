import { Router } from 'express';
import ArtworkController from './artwork.controller.js';

const router = Router();

// Public routes
router.get('/', ArtworkController.listArtworks);
router.get('/featured', ArtworkController.getFeatured);
router.get('/:slug', ArtworkController.getBySlug);

export default router;
