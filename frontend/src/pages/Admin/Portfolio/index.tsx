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

import type { PortfolioItem } from '@/types/studio';

const Portfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  // Computar categorias únicas baseadas nos itens existentes
  const uniqueCategories = Array.from(new Set(items.map(i => i.category))).sort();

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

      // Inferência de tipo básica no frontend (o backend pode validar melhor)
      const payload = {
        ...data,
        type: data.videoUrl && data.videoUrl.trim() !== '' ? 'VIDEO' : 'IMAGE',
      };

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
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
          <p className="text-gray-500">Gerencie as fotos e vídeos exibidos na landing page.</p>
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
          {uniqueCategories.map(cat => (
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
              <TableHead className="w-[80px]">Mídia</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
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
                  {item.type === 'VIDEO' && item.videoUrl ? (
                    <div className="w-12 h-12 rounded overflow-hidden bg-black relative group border">
                      <video
                        src={item.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        onMouseOver={e => (e.target as HTMLVideoElement).play()}
                        onMouseOut={e => {
                          (e.target as HTMLVideoElement).pause();
                          (e.target as HTMLVideoElement).currentTime = 0;
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center bg-black/50">
                          <span className="text-[6px] ml-0.5 text-white">▶</span>
                        </div>
                      </div>
                    </div>
                  ) : item.imageUrl ? (
                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 relative group border">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={e => {
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            parent.className =
                              'w-12 h-12 rounded bg-gray-200 flex items-center justify-center';
                            (e.target as HTMLImageElement).style.display = 'none';
                            parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
                          }
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
                  <span className="text-xs text-gray-500 font-mono uppercase">
                    {item.type || 'IMAGE'}
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
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
          initialData={
            editingItem
              ? {
                  ...editingItem,
                  description: editingItem.description || undefined,
                  imageUrl: editingItem.imageUrl,
                  videoUrl: editingItem.videoUrl, // Passar videoUrl
                }
              : undefined
          }
          existingCategories={uniqueCategories} // Passar categorias existentes
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSaving}
        />
      </Modal>
    </div>
  );
};

export { Portfolio };
