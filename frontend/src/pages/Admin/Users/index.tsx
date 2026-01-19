import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import { Plus, Search, Shield, ShieldOff, MoreVertical, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const response = await apiFetch('/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateUser(data: any) {
    try {
      const response = await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowModal(false);
        reset();
        loadUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao criar usuário');
      }
    } catch (error) {
      setError('Erro de conexão');
    }
  }

  async function toggleActive(id: string) {
    try {
      const response = await apiFetch(`/users/${id}/toggle-active`, {
        method: 'PUT',
      });
      if (response.ok) {
        loadUsers();
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error('Failed to toggle status');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-midnight-900">Administradores</h1>
          <p className="text-gray-500">Gerencie o acesso ao sistema</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gold-500 text-midnight-900 px-4 py-2 rounded-md hover:bg-gold-600 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Novo Administrador
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Carregando...
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-medium text-midnight-900">{user.name}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{user.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => toggleActive(user.id)}
                      className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${user.active ? 'text-red-500' : 'text-green-500'}`}
                      title={user.active ? 'Desativar' : 'Ativar'}
                    >
                      {user.active ? <ShieldOff size={18} /> : <Shield size={18} />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-serif text-midnight-900 mb-6">Novo Administrador</h2>

            <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  {...register('name', { required: true })}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input
                  type="password"
                  {...register('password', { required: true, minLength: 6 })}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-midnight-900 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-midnight-900 rounded-md font-medium"
                >
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
