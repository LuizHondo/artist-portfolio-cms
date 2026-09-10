import { Router } from 'express';
import AdminController from './admin.controller.js';
import { authMiddleware } from '../../shared/auth.js';

const router = Router();

// Public admin routes
router.post('/login', AdminController.login);

// Protected admin routes
router.get('/profile', authMiddleware, AdminController.getProfile);
router.post('/change-password', authMiddleware, AdminController.changePassword);

// Artwork management (admin only)
router.post('/artworks', authMiddleware, AdminController.createArtwork);
router.put('/artworks/:id', authMiddleware, AdminController.updateArtwork);
router.delete('/artworks/:id', authMiddleware, AdminController.deleteArtwork);

// Process entries management (admin only)
router.post('/artworks/:id/entries', authMiddleware, AdminController.createEntry);
router.put('/entries/:id', authMiddleware, AdminController.updateEntry);
router.delete('/entries/:id', authMiddleware, AdminController.deleteEntry);

export default router;
