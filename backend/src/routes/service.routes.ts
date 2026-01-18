import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';

const serviceRoutes = Router();
const serviceController = new ServiceController();

serviceRoutes.get('/', serviceController.index);
serviceRoutes.post('/', serviceController.create);
serviceRoutes.put('/:id', serviceController.update);
serviceRoutes.delete('/:id', serviceController.delete);

export { serviceRoutes };
