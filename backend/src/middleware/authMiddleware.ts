import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_SECRET } from '../constants/auth';
import { prisma } from '../lib/prisma';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = jwt.verify(token, AUTH_SECRET);
    const { id } = decoded as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário inválido' });
    }

    if (!user.active) {
      return res.status(401).json({ error: 'Usuário desativado' });
    }

    req.userId = id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
