import React, { useState, useMemo, useEffect } from 'react';
import { format, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, User, Scissors, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiFetch } from '@/services/api';

interface Client {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  durationMin: number;
  price: number;
}

interface AppointmentFormProps {
  initialDate: Date;
  onCancel: () => void;
  onSuccess: () => void;
}

export function AppointmentForm({ initialDate, onCancel, onSuccess }: AppointmentFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientsRes, servicesRes] = await Promise.all([
          apiFetch('/clients'),
          apiFetch('/services'),
        ]);

        const clientsData = await clientsRes.json();
        const servicesData = await servicesRes.json();

        setClients(clientsData);
        setServices(servicesData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        alert('Erro ao carregar dados do agendamento.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Computed values
  const totalDuration = useMemo(() => {
    return selectedServices.reduce((acc, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return acc + (service?.durationMin || 0);
    }, 0);
  }, [selectedServices, services]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((acc, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return acc + (Number(service?.price) || 0);
    }, 0);
  }, [selectedServices, services]);

  const endTime = addMinutes(initialDate, totalDuration);

  const toggleService = (id: string) => {
    setSelectedServices(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await apiFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          date: initialDate.toISOString(),
          clientId: selectedClientId,
          serviceIds: selectedServices,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar agendamento');
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Falha ao agendar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin text-gold-500" size={32} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Time Info */}
      <div className="flex items-center gap-4 p-4 bg-gold-500/10 rounded-sm border border-gold-500/20">
        <div className="flex items-center gap-2 text-midnight-900">
          <CalendarIcon size={18} />
          <span className="font-medium capitalize">
            {format(initialDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </span>
        </div>
        <div className="h-4 w-px bg-gold-500/30" />
        <div className="flex items-center gap-2 text-midnight-900">
          <Clock size={18} />
          <span className="font-medium">
            {format(initialDate, 'HH:mm')} - {format(endTime, 'HH:mm')}
          </span>
          <span className="text-xs text-midnight-700">({totalDuration} min)</span>
        </div>
      </div>

      {/* Client Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <User size={16} /> Cliente
        </label>
        <select
          className="w-full p-3 bg-white border border-gray-200 rounded-sm focus:border-gold-500 focus:outline-none text-midnight-900"
          value={selectedClientId}
          onChange={e => setSelectedClientId(e.target.value)}
          required
        >
          <option value="">Selecione um cliente...</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* Services Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Scissors size={16} /> Serviços
        </label>
        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto scrollbar-light">
          {services.map(service => {
            const isSelected = selectedServices.includes(service.id);
            return (
              <div
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={`
                            flex items-center justify-between p-3 rounded-sm border cursor-pointer transition-all
                            ${
                              isSelected
                                ? 'bg-gold-50 border-gold-500 text-midnight-900 shadow-xs'
                                : 'bg-white border-gray-200 text-midnight-900 hover:border-gold-500/50 hover:bg-gold-50/30'
                            }
                        `}
              >
                <div>
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className={`text-xs ${isSelected ? 'text-gold-700' : 'text-gray-500'}`}>
                    {service.durationMin} min
                  </p>
                </div>
                <p className={`font-medium ${isSelected ? 'text-gold-600' : 'text-midnight-900'}`}>
                  R$ {service.price}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex-1 text-gray-500 hover:text-red-500 hover:bg-red-50"
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gold-500 text-midnight-900 hover:bg-gold-400"
          disabled={!selectedClientId || selectedServices.length === 0 || submitting}
        >
          {submitting ? 'Agendando...' : `Confirmar (R$ ${totalPrice.toFixed(2)})`}
        </Button>
      </div>
    </form>
  );
}
