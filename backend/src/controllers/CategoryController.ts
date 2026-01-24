import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

interface UpdateReqBody {
  name?: string;
  order?: number;
  active?: boolean;
  coverImageUrl?: string;
}

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
    const { name, order, coverImageUrl } = req.body;

    if (!name) return res.status(400).json({ error: 'Nome obrigatório' });

    try {
      const category = await prisma.category.create({
        data: {
          name: String(name),
          order: order ? Number(order) : 99,
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
    // Separate destructuring to avoid implicit any issues
    const props = req.body;

    try {
      const category = await prisma.category.update({
        where: { id },
        data: {
          name: props.name ? String(props.name) : undefined,
          order: props.order !== undefined ? Number(props.order) : undefined,
          active: props.active !== undefined ? Boolean(props.active) : undefined,
          // Explicitly handle null for database
          coverImageUrl: typeof props.coverImageUrl === 'string' ? props.coverImageUrl : null,
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
}
