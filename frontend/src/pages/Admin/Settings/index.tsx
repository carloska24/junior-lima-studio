import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, MapPin, Contact, Clock, Share2, Type } from 'lucide-react';
import { apiFetch } from '@/services/api';

interface StudioSettings {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  openingHours: string;
  instagramUrl: string;
}

export function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudioSettings>();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const response = await apiFetch('/studio');
      if (response.ok) {
        const data = await response.json();
        // Populate form
        Object.keys(data).forEach(key => {
          setValue(key as keyof StudioSettings, data[key]);
        });
      }
    } catch (error) {
      console.error('Failed to load settings');
      setMessage({ type: 'error', text: 'Erro ao carregar configurações.' });
    } finally {
      setIsLoading(false);
    }
  }

  const onSubmit = async (data: StudioSettings) => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await apiFetch('/studio', {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Configurações atualizadas com sucesso!' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao atualizar configurações.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-midnight-900">Configurações do Studio</h1>
        <p className="text-gray-500">Gerencie as informações institucionais exibidas no site</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Identity Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-midnight-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
            <Type size={18} className="text-gold-500" />
            Identidade
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Studio</label>
              <input
                {...register('name', { required: 'Nome é obrigatório' })}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-midnight-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
            <Contact size={18} className="text-gold-500" />
            Contato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Público</label>
              <input
                {...register('email', { required: 'Email é obrigatório' })}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                {...register('phone')}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input
                {...register('whatsapp')}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <div className="relative">
                <Share2 className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input
                  {...register('instagramUrl')}
                  className="w-full pl-10 px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Address Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-midnight-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
            <MapPin size={18} className="text-gold-500" />
            Endereço
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logradouro / Número / Bairro
              </label>
              <input
                {...register('address', { required: 'Endereço é obrigatório' })}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade / Estado / CEP
              </label>
              <input
                {...register('city', { required: 'Cidade é obrigatória' })}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
          </div>
        </section>

        {/* Hours Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-midnight-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
            <Clock size={18} className="text-gold-500" />
            Horário de Funcionamento
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto de Horários (exibido no rodapé)
            </label>
            <textarea
              {...register('openingHours')}
              rows={7}
              className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 font-mono text-sm"
              placeholder="Segunda: Fechado..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Insira cada dia em uma linha para melhor formatação.
            </p>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {message && (
            <div
              className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
            >
              {message.text}
            </div>
          )}
          {!message && <div></div>} {/* Spacer */}
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-gold-500 hover:bg-gold-600 text-midnight-900 font-medium rounded-md transition-colors disabled:opacity-50 shadow-md"
          >
            <Save size={18} />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
