import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

export class UserController {
  async me(req: Request, res: Response) {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, active: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(user);
  }

  async updatePassword(req: Request, res: Response) {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    return res.status(204).send();
  }

  async list(req: Request, res: Response) {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, active: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(users);
  }

  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, active: true },
    });

    return res.status(201).json(user);
  }

  async toggleActive(req: Request, res: Response) {
    const { id } = req.params as { id: string };

    if (id === req.userId) {
      return res.status(400).json({ error: 'Não é possível desativar o próprio usuário' });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { active: !user.active },
      select: { id: true, active: true },
    });

    return res.json(updatedUser);
  }
}
