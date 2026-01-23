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
import { portfolioRoutes } from './routes/portfolio.routes';

const app = express();
const PORT = process.env.PORT || 3333;

// Configuração de CORS mais segura
const allowedOrigins = [
  'http://localhost:5173', // Dev frontend
  'http://localhost:3000',
  'https://junior-lima-studio-app-1da7b.web.app', // Produção
  'https://junior-lima-studio-app-1da7b.firebaseapp.com',
  'https://juniorlimastudio.com.br', // Domínio personalizado
  'https://www.juniorlimastudio.com.br', // Domínio personalizado com www
];

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requests sem origin (mobile apps, Postman, etc)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/clients', clientRoutes);
app.use('/services', serviceRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/studio', studioRoutes);
app.use('/portfolio', portfolioRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
