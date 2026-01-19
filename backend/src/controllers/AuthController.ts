import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AUTH_SECRET } from '../constants/auth';
import { prisma } from '../lib/prisma';

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      if (!user.active) {
        return res.status(401).json({ error: 'Usuário desativado' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, AUTH_SECRET, {
        expiresIn: '1d',
      });

      const { password: _, ...userWithoutPassword } = user;

      return res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
