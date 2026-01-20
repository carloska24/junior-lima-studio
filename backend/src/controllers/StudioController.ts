import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class StudioController {
  async getSettings(req: Request, res: Response) {
    try {
      // Assuming singleton settings
      const settings = await prisma.studioSettings.findFirst();

      if (!settings) {
        return res.status(404).json({ error: 'Settings not found' });
      }

      return res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateSettings(req: Request, res: Response) {
    try {
      const { name, email, phone, whatsapp, address, city, openingHours, instagramUrl } = req.body;

      // Find first to get ID
      const existing = await prisma.studioSettings.findFirst();

      if (!existing) {
        // Fallback: create if missing (though seed should handle this)
        const newSettings = await prisma.studioSettings.create({
          data: {
            name,
            email,
            phone,
            whatsapp,
            address,
            city,
            openingHours,
            instagramUrl,
          },
        });
        return res.json(newSettings);
      }

      const updated = await prisma.studioSettings.update({
        where: { id: existing.id },
        data: {
          name,
          email,
          phone,
          whatsapp,
          address,
          city,
          openingHours,
          instagramUrl,
        },
      });

      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update settings' });
    }
  }
}
