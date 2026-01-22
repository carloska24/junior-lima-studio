import { Router } from 'express';
import { PortfolioController } from '../controllers/PortfolioController';
import { authMiddleware } from '../middleware/authMiddleware';

const portfolioController = new PortfolioController();
export const portfolioRoutes = Router();

// Rota pública - lista itens ativos para a landing page
portfolioRoutes.get('/', portfolioController.index);

// Rotas protegidas - CRUD completo para admin
portfolioRoutes.get('/admin', authMiddleware, portfolioController.listAll);
portfolioRoutes.post('/', authMiddleware, portfolioController.create);
portfolioRoutes.put('/:id', authMiddleware, portfolioController.update);
portfolioRoutes.delete('/:id', authMiddleware, portfolioController.delete);
