import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class ServiceController {
  async index(req: Request, res: Response) {
    try {
      const services = await prisma.service.findMany({
        where: { active: true },
        orderBy: { name: 'asc' },
      });
      return res.json(services);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar serviços' });
    }
  }

  async create(req: Request, res: Response) {
    const { name, description, price, durationMin, imageUrl } = req.body;

    try {
      const service = await prisma.service.create({
        data: {
          name,
          description,
          price,
          durationMin,
          imageUrl,
        },
      });

      return res.status(201).json(service);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar serviço' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, price, durationMin, active, imageUrl } = req.body;

    try {
      const service = await prisma.service.update({
        where: { id: String(id) },
        data: {
          name,
          description,
          price,
          durationMin,
          active,
          imageUrl,
        },
      });

      return res.json(service);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar serviço' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      // Soft delete (set active to false) is safer for integrity, but physically deleting if unused is ok.
      // For now, let's just set active = false to preserve history if needed,
      // OR allow delete if no appointments.
      // A safe approach for this MVP:
      await prisma.service.update({
        where: { id: String(id) },
        data: { active: false },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao desativar serviço' });
    }
  }
}
