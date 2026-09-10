import { Request, Response } from 'express';
import ArtworkService from './artwork.service.js';
import { CreateArtworkSchema, UpdateArtworkSchema, ArtworkEntrySchema } from '../../shared/schemas.js';

export class ArtworkController {
  // GET /api/artworks - List all artworks (with optional tag filter)
  async listArtworks(req: Request, res: Response) {
    try {
      const { tag } = req.query;
      const artworks = await ArtworkService.getAllArtworks(tag as string | undefined);

      res.json({
        success: true,
        count: artworks.length,
        data: artworks,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch artworks' });
    }
  }

  // GET /api/artworks/featured - List featured artworks
  async getFeatured(req: Request, res: Response) {
    try {
      const artworks = await ArtworkService.getFeaturedArtworks();

      res.json({
        success: true,
        count: artworks.length,
        data: artworks,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch featured artworks' });
    }
  }

  // GET /api/artworks/:slug - Get single artwork by slug
  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const artwork = await ArtworkService.getArtworkBySlug(slug);

      if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' });
      }

      res.json({
        success: true,
        data: artwork,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch artwork' });
    }
  }

  // POST /api/admin/artworks - Create artwork (admin only)
  async create(req: Request, res: Response) {
    try {
      const validated = CreateArtworkSchema.parse(req.body);
      const artwork = await ArtworkService.createArtwork(validated);

      res.status(201).json({
        success: true,
        data: artwork,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create artwork' });
    }
  }

  // PUT /api/admin/artworks/:id - Update artwork (admin only)
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validated = UpdateArtworkSchema.parse(req.body);
      const artwork = await ArtworkService.updateArtwork(id, validated);

      res.json({
        success: true,
        data: artwork,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to update artwork' });
    }
  }

  // DELETE /api/admin/artworks/:id - Delete artwork (admin only)
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ArtworkService.deleteArtwork(id);

      res.json({
        success: true,
        message: 'Artwork deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to delete artwork' });
    }
  }

  // POST /api/admin/artworks/:id/entries - Create process entry (admin only)
  async createEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validated = ArtworkEntrySchema.parse(req.body);
      const entry = await ArtworkService.createEntry(id, validated);

      res.status(201).json({
        success: true,
        data: entry,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create entry' });
    }
  }

  // PUT /api/admin/entries/:id - Update process entry (admin only)
  async updateEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validated = ArtworkEntrySchema.partial().parse(req.body);
      const entry = await ArtworkService.updateEntry(id, validated);

      res.json({
        success: true,
        data: entry,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to update entry' });
    }
  }

  // DELETE /api/admin/entries/:id - Delete process entry (admin only)
  async deleteEntry(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ArtworkService.deleteEntry(id);

      res.json({
        success: true,
        message: 'Entry deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to delete entry' });
    }
  }
}

export default new ArtworkController();
