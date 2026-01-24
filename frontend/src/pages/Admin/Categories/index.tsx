import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import { useToast } from '@/contexts/ToastContext';
import { Loader2, Save, GripVertical, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Category {
  id: string;
  name: string;
  order: number;
  active: boolean;
  coverImageUrl?: string | null;
  itemCount?: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { addToast } = useToast();

  // Logic for deletion
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await apiFetch(`/categories/${deleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao deletar categoria');
      }

      setCategories(prev => prev.filter(c => c.id !== deleteId));
      addToast('Categoria deletada com sucesso!', 'success');
      setDeleteId(null);
    } catch (error: any) {
      addToast(error.message, 'error');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiFetch('/categories/admin');
      if (!response.ok) throw new Error('Erro ao buscar categorias');
      const data = await response.json();
      setCategories(data);
      setHasChanges(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (id: string, field: keyof Category, value: any) => {
    setCategories(prev => prev.map(cat => (cat.id === id ? { ...cat, [field]: value } : cat)));
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updates = categories.map(cat =>
        apiFetch(`/categories/${cat.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: cat.name,
            order: cat.order,
            active: cat.active,
            coverImageUrl: cat.coverImageUrl,
          }),
        })
      );

      const responses = await Promise.all(updates);
      const hasError = responses.some(res => !res.ok);

      if (hasError) {
        throw new Error('Falha ao salvar alguns itens');
      }

      await fetchCategories();
      addToast('Alterações salvas com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      addToast('Erro ao salvar alterações.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-gold-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-midnight-900">Categorias</h1>
          <p className="text-gray-500">Defina a ordem e capa das categorias no site.</p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-white rounded-md hover:bg-gold-700 transition disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Salvar Alterações
          </button>
        )}
      </header>
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Categoria"
        message="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        variant="danger"
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Ordem</TableHead>
              <TableHead className="w-[80px]">Capa</TableHead>
              <TableHead className="w-[200px]">Nome</TableHead>
              <TableHead>URL da Capa (Opcional)</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat.id}>
                {/* ... (Existing cells) */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <GripVertical className="text-gray-300" size={16} />
                    <input
                      type="number"
                      value={cat.order}
                      onChange={e => handleChange(cat.id, 'order', parseInt(e.target.value) || 0)}
                      className="w-12 px-2 py-1 border border-gray-200 rounded text-center focus:border-gold-500 outline-none"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                    {cat.coverImageUrl ? (
                      <img
                        src={cat.coverImageUrl}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        Auto
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-lg text-midnight-900">{cat.name}</TableCell>
                <TableCell>
                  <input
                    type="text"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={cat.coverImageUrl || ''}
                    onChange={e => handleChange(cat.id, 'coverImageUrl', e.target.value)}
                    className="w-full px-3 py-1 text-sm border border-gray-200 rounded focus:border-gold-500 outline-none placeholder:text-gray-300"
                  />
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => setDeleteId(cat.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-gray-400 mt-4">
        * <strong>Auto:</strong> Se deixar vazio, o sistema usa a primeira foto do álbum. Cole um
        link para fixar uma capa personalizada.
      </p>
    </div>
  );
};

export { Categories };
