import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class ClientController {
  async index(req: Request, res: Response) {
    try {
      const clients = await prisma.client.findMany({
        orderBy: { name: 'asc' },
      });
      return res.json(clients);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
  }

  async create(req: Request, res: Response) {
    const { name, phone, email, notes } = req.body;

    try {
      const existingClient = await prisma.client.findUnique({
        where: { phone },
      });

      if (existingClient) {
        return res.status(400).json({ error: 'Cliente já cadastrado com este telefone' });
      }

      const client = await prisma.client.create({
        data: {
          name,
          phone,
          email,
          notes,
        },
      });

      return res.status(201).json(client);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar cliente' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, phone, email, notes } = req.body;

    try {
      const client = await prisma.client.update({
        where: { id: String(id) },
        data: {
          name,
          phone,
          email,
          notes,
        },
      });

      return res.json(client);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.client.delete({
        where: { id: String(id) },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
  }
}
