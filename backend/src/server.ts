import 'dotenv/config'; // Load env vars before anything else
import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import { clientRoutes } from './routes/client.routes';
import { serviceRoutes } from './routes/service.routes';
import { appointmentRoutes } from './routes/appointment.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { studioRoutes } from './routes/studio.routes';

const app = express();
const PORT = process.env.PORT || 3333; // Changed back to 3333 to match .env

app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/clients', clientRoutes);
app.use('/services', serviceRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/studio', studioRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  // Force restart trigger
});
