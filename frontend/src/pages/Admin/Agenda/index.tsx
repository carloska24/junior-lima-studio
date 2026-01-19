import { useRef } from 'react';
import { WeeklyCalendar, type WeeklyCalendarRef } from './WeeklyCalendar';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export function Agenda() {
  const calendarRef = useRef<WeeklyCalendarRef>(null);

  const handleNewAppointment = () => {
    calendarRef.current?.handleNewAppointment();
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-serif text-midnight-900">Agenda</h1>
          <p className="text-gray-500 text-sm">Gerencie os horários e atendimentos.</p>
        </div>
        <Button onClick={handleNewAppointment} className="flex items-center gap-2 px-6">
          <Plus size={18} />
          <span>Novo Agendamento</span>
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <WeeklyCalendar ref={calendarRef} />
      </div>
    </div>
  );
}
