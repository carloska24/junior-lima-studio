import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import { UserController } from '../controllers/UserController';
import { AuthController } from '../controllers/AuthController';
import { UploadController } from '../controllers/UploadController';

import { authMiddleware } from '../middleware/authMiddleware';

const upload = multer(uploadConfig);

const userController = new UserController();
const authController = new AuthController();
const uploadController = new UploadController();

export const userRoutes = Router();

// Auth
userRoutes.post('/login', authController.login);

// Uploads
userRoutes.post('/uploads', authMiddleware, upload.single('image'), uploadController.store);

// User Profile
userRoutes.get('/me', authMiddleware, userController.me);
userRoutes.put('/me/profile', authMiddleware, userController.updateProfile); // To be implemented
userRoutes.put('/me/password', authMiddleware, userController.updatePassword);
userRoutes.put('/:id/active', authMiddleware, userController.toggleActive);
userRoutes.post('/', authMiddleware, userController.create);
userRoutes.get('/', authMiddleware, userController.list);
