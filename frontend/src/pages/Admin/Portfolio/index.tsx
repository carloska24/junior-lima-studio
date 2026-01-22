import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Image as ImageIcon,
  GripVertical,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { PortfolioForm } from './PortfolioForm';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string | null;
  order: number;
  active: boolean;
}

const categories = ['Corte', 'Barba', 'Coloração', 'Tratamento', 'Visagismo'];

export function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const fetchItems = async () => {
    try {
      const response = await apiFetch('/portfolio/admin');
      if (!response.ok) {
        console.error('Erro ao buscar portfólio: Status', response.status);
        setItems([]);
        return;
      }
      const data = await response.json();
      // Garante que data seja um array
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao buscar portfólio:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (data: Partial<PortfolioItem>) => {
    setIsSaving(true);
    try {
      const url = editingItem ? `/portfolio/${editingItem.id}` : '/portfolio';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erro ao salvar');

      await fetchItems();
      setIsModalOpen(false);
      setEditingItem(undefined);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar item do portfólio.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir este item do portfólio?')) return;

    try {
      await apiFetch(`/portfolio/${id}`, {
        method: 'DELETE',
      });
      await fetchItems();
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir item.');
    }
  };

  const handleToggleActive = async (item: PortfolioItem) => {
    try {
      await apiFetch(`/portfolio/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ active: !item.active }),
      });
      await fetchItems();
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar status.');
    }
  };

  const openNewModal = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-midnight-900">Portfólio</h1>
          <p className="text-gray-500">Gerencie as fotos exibidas na landing page.</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-white rounded-md hover:bg-gold-700 transition"
        >
          <Plus size={20} />
          Novo Item
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por título..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-gray-700"
        >
          <option value="">Todas as categorias</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin text-gold-600" size={32} />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Ordem</TableHead>
              <TableHead className="w-[80px]">Imagem</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map(item => (
              <TableRow key={item.id}>
                <TableCell className="text-gray-400">
                  <GripVertical size={16} className="inline mr-1" />
                  {item.order}
                </TableCell>
                <TableCell>
                  {item.imageUrl ? (
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={e => {
                          (e.target as HTMLImageElement).src = '';
                          (e.target as HTMLImageElement).parentElement?.classList.add(
                            'flex',
                            'items-center',
                            'justify-center'
                          );
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                      <ImageIcon size={20} className="text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 text-xs rounded-full bg-gold-100 text-gold-700">
                    {item.category}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleToggleActive(item)}
                    className={`px-2 py-1 text-xs rounded-full transition ${
                      item.active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {item.active ? 'Ativo' : 'Inativo'}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 hover:bg-gray-100 rounded text-blue-600"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-gray-100 rounded text-red-600"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Nenhum item encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Editar Item' : 'Novo Item'}
      >
        <PortfolioForm
          initialData={editingItem}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSaving}
        />
      </Modal>
    </div>
  );
}
