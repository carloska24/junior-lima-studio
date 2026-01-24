import { useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';
import { useForm } from 'react-hook-form';
// import { Save, User, Shield } from 'lucide-react'; // Removed unused imports
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export function Profile() {
  const { updateUser } = useAuth(); // Assume we need to update context too potentially
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue: setProfileValue,
  } = useForm<{ name: string; avatarUrl: string }>();

  // Password Form
  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
  } = useForm<{ oldPassword: string; password: string; confirmPassword: string }>();

  // --- RESTORED LOGIC ---
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const response = await apiFetch('/users/me');

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setProfileValue('name', data.name);
        setProfileValue('avatarUrl', data.avatarUrl || '');
      } else {
        // Handle non-OK response if necessary, e.g., throw an error or set a message
      }
    } catch (error) {
      // Handle network errors or parsing errors
    } finally {
      setIsLoading(false);
    }
  }
  // ----------------------

  const onUpdateProfile = async (data: { name: string; avatarUrl: string }) => {
    setIsSavingProfile(true);
    setMessage(null);
    try {
      const response = await apiFetch('/users/me/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // 204 No Content - do not try to parse JSON
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });

        // Update local state
        setUser(prev => (prev ? { ...prev, ...data } : null));

        // Update global context immediately (updates Header)
        updateUser(data);
      } else {
        throw new Error('Falha ao atualizar');
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Erro ao salvar perfil' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const onUpdatePassword = async (data: {
    oldPassword: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (data.password !== data.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    setIsSavingPassword(true);
    setMessage(null);

    try {
      const response = await apiFetch('/users/me/password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword: data.oldPassword, password: data.password }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
        resetPass();
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Erro ao atualizar senha' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao conectar com o servidor' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading)
    return (
      <div className="p-8 flex items-center justify-center h-full text-gray-500">
        Carregando perfil...
      </div>
    );

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-12 pt-4">
      <div className="text-center">
        <h1 className="text-xl font-serif text-midnight-900">Minha Conta</h1>
        <p className="text-xs text-gray-500 mt-1">Gerencie seus dados pessoais e segurança</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <ImageUpload
            defaultImage={user?.avatarUrl || undefined}
            onImageUploaded={url => setProfileValue('avatarUrl', url)}
          />
          <div className="mt-3 text-center">
            <h2 className="text-lg font-medium text-midnight-900">{user?.name}</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-gold-50 text-gold-700 mt-1 uppercase tracking-wider">
              Gestor
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {/* Personal Data Section */}
          <section>
            <div className="flex items-center justify-center mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">
                Dados Pessoais
              </span>
            </div>

            <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Nome Completo
                </label>
                <input
                  {...registerProfile('name', { required: true })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 bg-white text-gray-900 text-sm transition-all text-center"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="opacity-70 pointer-events-none">
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide text-center">
                  Email
                </label>
                <input
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg border border-gray-100 bg-gray-50 text-gray-400 text-sm text-center"
                />
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  {isSavingProfile ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Salvar Alterações'
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Password Section */}
          <section>
            <div className="flex items-center justify-center mb-4 pt-4 border-t border-gray-50">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest pb-1">
                Segurança
              </span>
            </div>

            <form onSubmit={handleSubmitPass(onUpdatePassword)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
                  Senha Atual
                </label>
                <input
                  type="password"
                  {...registerPass('oldPassword', { required: true })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 bg-white text-gray-900 text-sm transition-all text-center"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide text-center">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    {...registerPass('password', { required: true, minLength: 6 })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 bg-white text-gray-900 text-sm transition-all text-center"
                    placeholder="••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide text-center">
                    Confirmar
                  </label>
                  <input
                    type="password"
                    {...registerPass('confirmPassword', { required: true })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 bg-white text-gray-900 text-sm transition-all text-center"
                    placeholder="••••••"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="w-full px-6 py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  {isSavingPassword ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Atualizar Senha'
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>

      {/* Universal Message Toast style */}
      {message && (
        <div
          className={`fixed bottom-8 right-8 p-4 rounded-lg shadow-xl text-sm z-50 animate-in slide-in-from-bottom-5 flex items-center gap-3 ${
            message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
