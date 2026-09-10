import { Request, Response } from 'express';
import TagService from './tag.service.js';

export class TagController {
  async getAllTags(req: Request, res: Response) {
    try {
      const tags = await TagService.getAllTags();

      res.json({
        success: true,
        count: tags.length,
        data: tags,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tags' });
    }
  }

  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const tag = await TagService.getTagBySlug(slug);

      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      res.json({
        success: true,
        data: tag,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tag' });
    }
  }
}

export default new TagController();
