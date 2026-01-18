import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { startOfDay, endOfDay, parseISO, addMinutes } from 'date-fns';

export class AppointmentController {
  async index(req: Request, res: Response) {
    const { date, startDate, endDate } = req.query;

    try {
      let where = {};

      if (startDate && endDate) {
        where = {
          date: {
            gte: parseISO(String(startDate)),
            lte: parseISO(String(endDate)),
          },
        };
      } else if (date) {
        const parsedDate = parseISO(String(date));
        where = {
          date: {
            gte: startOfDay(parsedDate),
            lte: endOfDay(parsedDate),
          },
        };
      }

      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          client: true,
          services: true,
        },
        orderBy: { date: 'asc' },
      });

      return res.json(appointments);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  }

  async create(req: Request, res: Response) {
    const { date, clientId, serviceIds, notes } = req.body;

    // Basic Validation
    if (
      !date ||
      !clientId ||
      !serviceIds ||
      !Array.isArray(serviceIds) ||
      serviceIds.length === 0
    ) {
      return res.status(400).json({ error: 'Dados inválidos. Informe data, cliente e serviços.' });
    }

    try {
      // 1. Fetch Services to calculate total duration and price
      const services = await prisma.service.findMany({
        where: {
          id: { in: serviceIds },
        },
      });

      if (services.length !== serviceIds.length) {
        return res.status(400).json({ error: 'Um ou mais serviços não foram encontrados.' });
      }

      // 2. Calculate totals
      const totalDurationMin = services.reduce((acc, s) => acc + s.durationMin, 0);
      const totalPrice = services.reduce((acc, s) => acc + Number(s.price), 0);

      const startTime = parseISO(date);
      const endTime = addMinutes(startTime, totalDurationMin);

      // 3. Create Appointment
      const appointment = await prisma.appointment.create({
        data: {
          date: startTime,
          endDate: endTime,
          totalPrice,
          notes,
          clientId,
          services: {
            connect: serviceIds.map((id: string) => ({ id })),
          },
        },
        include: {
          client: true,
          services: true,
        },
      });

      return res.status(201).json(appointment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar agendamento' });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { status, notes } = req.body; // Allow simple status updates for now

    try {
      const appointment = await prisma.appointment.update({
        where: { id: String(id) },
        data: {
          status,
          notes,
        },
        include: {
          client: true,
          services: true,
        },
      });

      return res.json(appointment);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar agendamento' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await prisma.appointment.delete({
        where: { id: String(id) },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar agendamento' });
    }
  }
}
