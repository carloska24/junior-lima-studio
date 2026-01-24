import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authMiddleware } from '../middleware/authMiddleware';

const categoryController = new CategoryController();
export const categoryRoutes = Router();

// Public
categoryRoutes.get('/', categoryController.index);

// Admin
categoryRoutes.get('/admin', authMiddleware, categoryController.listAll);
categoryRoutes.post('/', authMiddleware, categoryController.create);
categoryRoutes.put('/reorder', authMiddleware, categoryController.reorder); // Reorder must be before :id to avoid conflict if not strict regex, but here put is safe
categoryRoutes.put('/:id', authMiddleware, categoryController.update);
categoryRoutes.delete('/:id', authMiddleware, categoryController.delete);
