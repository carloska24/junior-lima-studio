import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class CategoryController {
  // Public - List ordered active categories
  async index(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
      });
      return res.json(categories);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
  }

  // Admin - List all
  async listAll(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { order: 'asc' },
      });
      return res.json(categories);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar categorias' });
    }
  }

  async create(req: Request, res: Response) {
    const { name, order, coverImageUrl } = req.body as any;

    if (!name) return res.status(400).json({ error: 'Nome obrigatório' });

    try {
      const category = await prisma.category.create({
        data: {
          name: String(name),
          order: order ? Number(order) : 5,
          // Force undefined if not a string to match Prisma optional input
          coverImageUrl: typeof coverImageUrl === 'string' ? coverImageUrl : undefined,
        },
      });
      return res.status(201).json(category);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar categoria' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, order, active, coverImageUrl } = req.body as any;

    try {
      const category = await prisma.category.update({
        where: { id: String(id) },
        data: {
          name: typeof name === 'string' ? name : undefined,
          order: order !== undefined ? Number(order) : undefined,
          active: active !== undefined ? Boolean(active) : undefined,
          // Explicitly handle null for database
          coverImageUrl: typeof coverImageUrl === 'string' ? coverImageUrl : null,
        },
      });
      return res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      return res.status(500).json({ error: 'Erro ao atualizar categoria' });
    }
  }

  // Bulk Reorder
  async reorder(req: Request, res: Response) {
    const { items } = req.body; // Expects [{ id: string, order: number }]
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Lista inválida' });

    try {
      // Transaction for safety
      await prisma.$transaction(
        items.map((item: { id: string; order: number }) =>
          prisma.category.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      );
      return res.status(200).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao reordenar' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      // Check if category has items
      const itemsCount = await prisma.portfolioItem.count({
        where: { categoryId: String(id) },
      });

      if (itemsCount > 0) {
        return res.status(400).json({
          error: 'Não é possível deletar esta categoria pois existem itens associados a ela.',
        });
      }

      await prisma.category.delete({
        where: { id: String(id) },
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting category:', error);
      return res.status(500).json({ error: 'Erro ao deletar categoria' });
    }
  }
}
