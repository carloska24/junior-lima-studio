import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import { Plus, Search, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { ServiceForm } from './ServiceForm';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  active: boolean;
}

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await apiFetch('/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      // Ensure number conversion
      const payload = {
        ...data,
        price: Number(data.price),
        durationMin: Number(data.durationMin),
      };

      const url = editingService ? `/services/${editingService.id}` : '/services';

      const method = editingService ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erro ao salvar');

      await fetchServices();
      setIsModalOpen(false);
      setEditingService(undefined);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar serviço.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este serviço? Ele será apenas desativado.')) return;

    try {
      await apiFetch(`/services/${id}`, {
        method: 'DELETE',
      });
      await fetchServices();
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir serviço.');
    }
  };

  const openNewModal = () => {
    setEditingService(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-midnight-900">Serviços</h1>
          <p className="text-gray-500">Gerencie seu catálogo de serviços.</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-white rounded-md hover:bg-gold-700 transition"
        >
          <Plus size={20} />
          Novo Serviço
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar serviço..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin text-gold-600" size={32} />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map(service => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    Number(service.price)
                  )}
                </TableCell>
                <TableCell>{service.durationMin} min</TableCell>
                <TableCell className="text-gray-500 text-sm truncate max-w-[200px]">
                  {service.description || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-2 hover:bg-gray-100 rounded text-blue-600"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 hover:bg-gray-100 rounded text-red-600"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredServices.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Nenhum serviço encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Editar Serviço' : 'Novo Serviço'}
      >
        <ServiceForm
          initialData={
            editingService
              ? {
                  ...editingService,
                  description: editingService.description || '',
                  price: Number(editingService.price),
                  durationMin: Number(editingService.durationMin),
                }
              : undefined
          }
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSaving}
        />
      </Modal>
    </div>
  );
}
