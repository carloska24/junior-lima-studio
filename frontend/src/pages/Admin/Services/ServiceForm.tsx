import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  durationMin: number;
  imageUrl?: string;
  active?: boolean;
}

interface ServiceFormProps {
  initialData?: ServiceFormData;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ServiceForm({ initialData, onSubmit, onCancel, isLoading }: ServiceFormProps) {
  const [imagePreview, setImagePreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ServiceFormData>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      durationMin: 30,
      imageUrl: '',
      active: true,
    },
  });

  const watchImageUrl = watch('imageUrl');

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name);
      setValue('description', initialData.description || '');
      setValue('price', Number(initialData.price));
      setValue('durationMin', Number(initialData.durationMin));
      setValue('imageUrl', initialData.imageUrl || '');
      setValue('active', initialData.active);
      setImagePreview(initialData.imageUrl || '');
    }
  }, [initialData, setValue]);

  useEffect(() => {
    if (watchImageUrl) {
      setImagePreview(watchImageUrl);
    }
  }, [watchImageUrl]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome do Serviço *</label>
        <input
          {...register('name', { required: 'Nome é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
          placeholder="Ex: Corte Signature"
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Preço (R$) *</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { required: 'Preço é obrigatório', min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Duração (Min) *</label>
          <input
            type="number"
            {...register('durationMin', { required: 'Duração é obrigatória', min: 5 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
            placeholder="30"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
          placeholder="Detalhes sobre o serviço..."
        />
      </div>

      {/* Campo de URL da Imagem */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-2">
            <ImageIcon size={16} />
            URL da Imagem (opcional)
          </span>
        </label>
        <input
          {...register('imageUrl')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
          placeholder="https://exemplo.com/imagem.jpg"
        />
        <p className="mt-1 text-xs text-gray-500">
          Cole a URL de uma imagem para exibir na landing page (Unsplash, Google Drive, etc.)
        </p>

        {/* Preview da Imagem */}
        {imagePreview && (
          <div className="mt-3 relative">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <div className="w-full h-32 rounded-md overflow-hidden bg-gray-100 border">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setImagePreview('')}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gold-600 rounded-md hover:bg-gold-700 disabled:opacity-50"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          Salvar
        </button>
      </div>
    </form>
  );
}
