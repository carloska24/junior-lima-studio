import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import { useForm } from 'react-hook-form';
import { Save, Lock } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const response = await apiFetch('/users/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (data: { password: string; confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await apiFetch('/users/me/password', {
        method: 'PUT',
        body: JSON.stringify({ password: data.password }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
        reset();
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Erro ao atualizar senha' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-midnight-900">Meu Perfil</h1>
        <p className="text-gray-500">Gerencie suas informações e segurança</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-midnight-900 flex items-center justify-center text-gold-500 text-2xl font-serif">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-medium text-midnight-900">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-midnight-900 flex items-center gap-2">
              <Lock size={18} />
              Alterar Senha
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
              <input
                type="password"
                {...register('password', { required: true, minLength: 6 })}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              {errors.password && (
                <span className="text-red-500 text-xs">Mínimo de 6 caracteres</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                {...register('confirmPassword', { required: true })}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-gold-500 hover:bg-gold-600 text-midnight-900 font-medium rounded-md transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}
