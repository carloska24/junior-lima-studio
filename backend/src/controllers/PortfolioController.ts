import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class PortfolioController {
  // Lista itens do portfólio (público - para landing page)
  async index(req: Request, res: Response) {
    try {
      const items = await prisma.portfolioItem.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
      });
      return res.json(items);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar portfólio' });
    }
  }

  // Lista todos os itens (admin - inclui inativos)
  async listAll(req: Request, res: Response) {
    try {
      const items = await prisma.portfolioItem.findMany({
        orderBy: { order: 'asc' },
      });
      return res.json(items);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar portfólio' });
    }
  }

  async create(req: Request, res: Response) {
    const { title, category, imageUrl, videoUrl, type, duration, description, order } = req.body;

    if (!title || !category || !imageUrl) {
      return res.status(400).json({ error: 'Título, categoria e URL da imagem são obrigatórios' });
    }

    try {
      // Find or Create Category
      let categoryId = null;
      const existingCategory = await prisma.category.findFirst({
        where: { name: { equals: category, mode: 'insensitive' } },
      });

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const newCategory = await prisma.category.create({
          data: { name: category, order: 99 },
        });
        categoryId = newCategory.id;
      }

      const item = await prisma.portfolioItem.create({
        data: {
          title,
          category, // Legacy
          categoryId, // Relation
          imageUrl,
          videoUrl,
          type,
          duration,
          description,
          order: order || 0,
        },
      });

      return res.status(201).json(item);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar item do portfólio' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, category, imageUrl, videoUrl, type, duration, description, order, active } =
      req.body;

    try {
      let categoryId = undefined;

      // Update category relation if category name changes
      if (category) {
        const existingCategory = await prisma.category.findFirst({
          where: { name: { equals: category, mode: 'insensitive' } },
        });

        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const newCategory = await prisma.category.create({
            data: { name: category, order: 99 },
          });
          categoryId = newCategory.id;
        }
      }

      const item = await prisma.portfolioItem.update({
        where: { id: String(id) },
        data: {
          title,
          category,
          categoryId,
          imageUrl,
          videoUrl,
          type,
          duration,
          description,
          order,
          active,
        },
      });

      return res.json(item);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar item do portfólio' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.portfolioItem.delete({
        where: { id: String(id) },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar item do portfólio' });
    }
  }
}
