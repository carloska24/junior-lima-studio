import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { format, startOfWeek, addDays, startOfDay, addHours, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { AppointmentForm } from './AppointmentForm';

export interface WeeklyCalendarRef {
  handleNewAppointment: () => void;
}

export const WeeklyCalendar = forwardRef<WeeklyCalendarRef>((props, ref) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Configuration
  const startHour = 9;
  const endHour = 20;
  const timeSlots = [];

  const handleNewAppointment = () => {
    // Default to today at current hour (or startHour if earlier)
    const now = new Date();
    let defaultTime = startOfDay(currentDate);

    if (isSameDay(currentDate, now)) {
      // If today, try to set to next hour
      const nextHour = now.getHours() + 1;
      const targetHour = nextHour < startHour ? startHour : nextHour;
      defaultTime = addHours(defaultTime, targetHour);
    } else {
      // If future date, set to startHour
      defaultTime = addHours(defaultTime, startHour);
    }

    setSelectedSlot(defaultTime);
    setIsModalOpen(true);
  };

  useImperativeHandle(ref, () => ({
    handleNewAppointment,
  }));

  // Generate Time Slots (Hours)
  for (let i = startHour; i < endHour; i++) {
    timeSlots.push(i);
  }

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const weekDays = [...Array(6)].map((_, i) => addDays(startDate, i)); // Mon-Sat

  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));
  const today = () => setCurrentDate(new Date());

  const handleSlotClick = (date: Date, hour: number) => {
    const slotDate = addHours(startOfDay(date), hour);
    setSelectedSlot(slotDate);
    setIsModalOpen(true);
  };

  /* Appointment fetching logic */
  interface Appointment {
    id: string;
    date: string;
    client: { name: string };
    services: { name: string }[];
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('@JuniorLima:token');
      const response = await fetch('http://localhost:3333/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  React.useEffect(() => {
    fetchAppointments();
  }, [currentDate]); // Reload when week changes (optimizable by date range later)

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-12rem)]">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-serif text-midnight-900 capitalize">
            {format(startDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={prevWeek} className="p-1 hover:bg-gray-100 rounded text-gray-500">
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={today}
              className="px-3 py-1 text-sm font-medium text-gold-600 hover:bg-gold-50 rounded"
            >
              Hoje
            </button>
            <button onClick={nextWeek} className="p-1 hover:bg-gray-100 rounded text-gray-500">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock size={16} />
          <span>Fuso Horário: Brasília (GMT-3)</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-[60px_1fr] sticky top-0 z-10 bg-white border-b border-gray-100">
          <div className="p-4 border-r border-gray-100"></div>
          <div className="grid grid-cols-6">
            {weekDays.map(day => (
              <div
                key={day.toString()}
                className={cn(
                  'p-3 text-center border-r border-gray-100 last:border-r-0',
                  isSameDay(day, new Date()) ? 'bg-gold-50' : ''
                )}
              >
                <p className="text-xs text-gray-400 uppercase font-medium">
                  {format(day, 'EEE', { locale: ptBR })}
                </p>
                <p
                  className={cn(
                    'text-lg font-serif mt-1',
                    isSameDay(day, new Date()) ? 'text-gold-600 font-bold' : 'text-midnight-900'
                  )}
                >
                  {format(day, 'dd')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slots Area */}
        <div className="flex-1 grid grid-cols-[60px_1fr]">
          {/* Time Indicators */}
          <div className="border-r border-gray-100 bg-gray-50/50">
            {timeSlots.map(hour => (
              <div
                key={hour}
                className="h-20 border-b border-gray-100 text-xs text-gray-400 text-center pt-2 relative"
              >
                <span className="-top-3 relative">{hour}:00</span>
              </div>
            ))}
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-6 relative">
            {/* Horizontal Lines (Guides) */}
            {timeSlots.map(hour => (
              <div
                key={`guide-${hour}`}
                className="absolute w-full border-b border-gray-50"
                style={{ top: `${(hour - startHour) * 5}rem`, height: '1px' }}
              />
            ))}

            {weekDays.map(day => (
              <div
                key={day.toString()}
                className="border-r border-gray-100 last:border-r-0 relative"
              >
                {/* Render Appointments Logic is handled inside timeSlots map below */}

                {timeSlots.map(hour => {
                  const isSelected =
                    selectedSlot &&
                    isSameDay(day, selectedSlot) &&
                    selectedSlot.getHours() === hour;

                  const appointmentInSlot = appointments.find(apt => {
                    const aptDate = parseISO(apt.date);
                    return isSameDay(aptDate, day) && aptDate.getHours() === hour;
                  });

                  return (
                    <motion.div
                      key={`${day}-${hour}`}
                      whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
                      onClick={() => !appointmentInSlot && handleSlotClick(day, hour)}
                      className={cn(
                        'h-20 border-b border-gray-100 transition-colors cursor-pointer relative group',
                        isSelected ? 'bg-gold-100/50' : '',
                        appointmentInSlot
                          ? 'bg-gold-100/20 cursor-default border-l-4 border-l-gold-500'
                          : ''
                      )}
                    >
                      {appointmentInSlot ? (
                        <div className="p-2 text-xs">
                          <p className="font-bold text-midnight-900 truncate">
                            {appointmentInSlot.client.name}
                          </p>
                          <p className="text-gray-500 truncate">
                            {appointmentInSlot.services.map(s => s.name).join(', ')}
                          </p>
                        </div>
                      ) : (
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                          <span className="text-xs text-gold-600 font-medium">+ Agendar</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Current Time Indicator (Red Line) - Only if is Today */}
                {isSameDay(day, new Date()) && (
                  <div
                    className="absolute w-full border-t-2 border-red-400 z-10 pointer-events-none"
                    style={{
                      top: `${(((new Date().getHours() - startHour) * 60 + new Date().getMinutes()) / 60) * 5}rem`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-400 -mt-[5px] -ml-[1px]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Novo Agendamento">
        {selectedSlot && (
          <AppointmentForm
            initialDate={selectedSlot}
            onCancel={closeModal}
            onSuccess={() => {
              closeModal();
              fetchAppointments();
            }}
          />
        )}
      </Modal>
    </div>
  );
});
