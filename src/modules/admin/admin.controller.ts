import { Request, Response } from 'express';
import AdminService from './admin.service.js';
import { LoginSchema, ChangePasswordSchema } from '../../shared/schemas.js';
import ArtworkController from '../artworks/artwork.controller.js';

export class AdminController {
  // POST /api/admin/login - Admin login
  async login(req: Request, res: Response) {
    try {
      const validated = LoginSchema.parse(req.body);
      const result = await AdminService.login(validated.email, validated.password);

      res.json({
        success: true,
        token: result.token,
        admin: result.admin,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to login' });
    }
  }

  // POST /api/admin/artworks - Create artwork
  async createArtwork(req: Request, res: Response) {
    return ArtworkController.create(req, res);
  }

  // PUT /api/admin/artworks/:id - Update artwork
  async updateArtwork(req: Request, res: Response) {
    return ArtworkController.update(req, res);
  }

  // DELETE /api/admin/artworks/:id - Delete artwork
  async deleteArtwork(req: Request, res: Response) {
    return ArtworkController.delete(req, res);
  }

  // POST /api/admin/artworks/:id/entries - Create entry
  async createEntry(req: Request, res: Response) {
    return ArtworkController.createEntry(req, res);
  }

  // PUT /api/admin/entries/:id - Update entry
  async updateEntry(req: Request, res: Response) {
    return ArtworkController.updateEntry(req, res);
  }

  // DELETE /api/admin/entries/:id - Delete entry
  async deleteEntry(req: Request, res: Response) {
    return ArtworkController.deleteEntry(req, res);
  }

  // GET /api/admin/entries/:entryId/images - List entry images
  async listImages(req: Request, res: Response) {
    return ArtworkController.listImages(req, res);
  }

  // GET /api/admin/entries/:entryId/images/:position - Get one entry image
  async getImage(req: Request, res: Response) {
    return ArtworkController.getImage(req, res);
  }

  // POST /api/admin/entries/:entryId/images - Add an entry image
  async createImage(req: Request, res: Response) {
    return ArtworkController.createImage(req, res);
  }

  // PATCH /api/admin/entries/:entryId/images/:position - Update an entry image
  async updateImage(req: Request, res: Response) {
    return ArtworkController.updateImage(req, res);
  }

  // DELETE /api/admin/entries/:entryId/images/:position - Delete an entry image
  async deleteImage(req: Request, res: Response) {
    return ArtworkController.deleteImage(req, res);
  }

  // POST /api/admin/change-password - Change password
  async changePassword(req: Request, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const validated = ChangePasswordSchema.parse(req.body);
      const result = await AdminService.changePassword(req.admin.id, validated);

      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to change password' });
    }
  }

  // GET /api/admin/profile - Get admin profile
  async getProfile(req: Request, res: Response) {
    try {
      if (!req.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const profile = await AdminService.getAdminProfile(req.admin.id);

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }
}

export default new AdminController();
