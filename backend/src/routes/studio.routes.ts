import { Router } from 'express';
import { StudioController } from '../controllers/StudioController';
import { authMiddleware } from '../middleware/authMiddleware';

const studioRoutes = Router();
const studioController = new StudioController();

// Public route for landing page
studioRoutes.get('/', studioController.getSettings);

// Protected route for admin updates
studioRoutes.put('/', authMiddleware, studioController.updateSettings);

export { studioRoutes };
