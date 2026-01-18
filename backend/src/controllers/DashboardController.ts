import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      // 1. Total Appointments (All time)
      const totalAppointments = await prisma.appointment.count();

      // 2. Total Clients
      const totalClients = await prisma.client.count();

      // 3. Total Revenue (Only COMPLETED appointments)
      const revenueAggregate = await prisma.appointment.aggregate({
        _sum: {
          totalPrice: true,
        },
        where: {
          status: 'COMPLETED',
        },
      });
      const totalRevenue = Number(revenueAggregate._sum.totalPrice || 0);

      // 4. Appointments Today
      const today = new Date();
      const appointmentsToday = await prisma.appointment.count({
        where: {
          date: {
            gte: startOfDay(today),
            lte: endOfDay(today),
          },
        },
      });

      return res.json({
        totalAppointments,
        totalClients,
        totalRevenue,
        appointmentsToday,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar estatísticas do dashboard' });
    }
  }
}
