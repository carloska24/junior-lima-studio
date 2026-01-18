import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController';

const appointmentRoutes = Router();
const appointmentController = new AppointmentController();

appointmentRoutes.get('/', appointmentController.index);
appointmentRoutes.post('/', appointmentController.create);
appointmentRoutes.put('/:id', appointmentController.update);
appointmentRoutes.delete('/:id', appointmentController.delete);

export { appointmentRoutes };
