import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/authMiddleware';

const userRoutes = Router();
const userController = new UserController();

userRoutes.use(authMiddleware);

userRoutes.get('/me', userController.me);
userRoutes.put('/me/password', userController.updatePassword);
userRoutes.get('/', userController.list);
userRoutes.post('/', userController.create);
userRoutes.put('/:id/toggle-active', userController.toggleActive);

export { userRoutes };
