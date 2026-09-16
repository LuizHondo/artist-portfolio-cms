import { Request, Response } from 'express';
import ArtworkService from './artwork.service.js';
import { CreateArtworkSchema, UpdateArtworkSchema, ArtworkEntrySchema, UpdateArtworkEntrySchema, ArtworkEntryImageSchema } from '../../shared/schemas.js';
import { z } from 'zod';

const PositionParamSchema = z.coerce.number().int().min(1).max(5);

function handlePrismaError(error: unknown, res: Response, fallbackMessage: string) {
  const code = (error as { code?: string })?.code;
  if (code === 'P2025') {
    return res.status(404).json({ error: 'Not found' });
  }
  if (code === 'P2002') {
    return res.status(409).json({ error: 'Conflict' });
  }
  if (error instanceof Error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: fallbackMessage });
}

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
      const validated = UpdateArtworkEntrySchema.parse(req.body);
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
  // GET /api/admin/entries/:entryId/images - List an entry's images (admin only)
  async listImages(req: Request, res: Response) {
    try {
      const { entryId } = req.params;
      const images = await ArtworkService.listImages(entryId);
      res.json({ success: true, data: images });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  }

  // GET /api/admin/entries/:entryId/images/:position - Get one image (admin only)
  async getImage(req: Request, res: Response) {
    try {
      const { entryId } = req.params;
      const position = PositionParamSchema.parse(req.params.position);
      const image = await ArtworkService.getImage(entryId, position);
      res.json({ success: true, data: image });
    } catch (error) {
      handlePrismaError(error, res, 'Failed to fetch image');
    }
  }

  // POST /api/admin/entries/:entryId/images - Add an image (admin only)
  async createImage(req: Request, res: Response) {
    try {
      const { entryId } = req.params;
      const validated = ArtworkEntryImageSchema.parse(req.body);
      const image = await ArtworkService.createImage(entryId, validated);
      res.status(201).json({ success: true, data: image });
    } catch (error) {
      handlePrismaError(error, res, 'Failed to create image');
    }
  }

  // PATCH /api/admin/entries/:entryId/images/:position - Update an image (admin only)
  async updateImage(req: Request, res: Response) {
    try {
      const { entryId } = req.params;
      const position = PositionParamSchema.parse(req.params.position);
      const validated = ArtworkEntryImageSchema.partial().parse(req.body);
      const image = await ArtworkService.updateImage(entryId, position, validated);
      res.json({ success: true, data: image });
    } catch (error) {
      handlePrismaError(error, res, 'Failed to update image');
    }
  }

  // DELETE /api/admin/entries/:entryId/images/:position - Delete an image, renumbering the rest (admin only)
  async deleteImage(req: Request, res: Response) {
    try {
      const { entryId } = req.params;
      const position = PositionParamSchema.parse(req.params.position);
      await ArtworkService.deleteImage(entryId, position);
      res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
      handlePrismaError(error, res, 'Failed to delete image');
    }
  }
}

export default new ArtworkController();
