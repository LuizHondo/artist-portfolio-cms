import { Request, Response } from 'express';
import AboutService from './about.service.js';
import { UpdateAboutSchema } from '../../shared/schemas.js';

export class AboutController {
  // GET /api/about - Public read of the About page content
  async getAbout(req: Request, res: Response) {
    try {
      const about = await AboutService.getAbout();
      res.json({ success: true, data: about });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch about content' });
    }
  }

  // PUT /api/admin/about - Update the About page content
  async updateAbout(req: Request, res: Response) {
    try {
      const validated = UpdateAboutSchema.parse(req.body);
      const about = await AboutService.updateAbout(validated);
      res.json({ success: true, data: about });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to update about content' });
    }
  }
}

export default new AboutController();
