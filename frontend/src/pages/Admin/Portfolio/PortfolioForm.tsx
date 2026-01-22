import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface PortfolioFormData {
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
  order?: number;
  active?: boolean;
}

interface PortfolioFormProps {
  initialData?: PortfolioFormData;
  onSubmit: (data: PortfolioFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const categories = ['Corte', 'Barba', 'Coloração', 'Tratamento', 'Visagismo'];

export function PortfolioForm({ initialData, onSubmit, onCancel, isLoading }: PortfolioFormProps) {
  const [imagePreview, setImagePreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PortfolioFormData>({
    defaultValues: {
      title: '',
      category: 'Corte',
      imageUrl: '',
      description: '',
      order: 0,
      active: true,
    },
  });

  const watchImageUrl = watch('imageUrl');

  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title);
      setValue('category', initialData.category);
      setValue('imageUrl', initialData.imageUrl);
      setValue('description', initialData.description || '');
      setValue('order', initialData.order || 0);
      setValue('active', initialData.active ?? true);
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
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Título *</label>
        <input
          {...register('title', { required: 'Título é obrigatório' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
          placeholder="Ex: Fade Clássico"
        />
        {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Categoria *</label>
        <select
          {...register('category', { required: 'Categoria é obrigatória' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* URL da Imagem */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-2">
            <ImageIcon size={16} />
            URL da Imagem *
          </span>
        </label>
        <input
          {...register('imageUrl', { required: 'URL da imagem é obrigatória' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
          placeholder="https://exemplo.com/imagem.jpg"
        />
        {errors.imageUrl && <span className="text-xs text-red-500">{errors.imageUrl.message}</span>}
        <p className="mt-1 text-xs text-gray-500">
          Cole a URL de uma imagem de alta qualidade (Unsplash, Google Drive, etc.)
        </p>

        {/* Preview */}
        {imagePreview && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <div className="w-full h-40 rounded-md overflow-hidden bg-gray-100 border">
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

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição (opcional)</label>
        <textarea
          {...register('description')}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
          placeholder="Breve descrição do trabalho..."
        />
      </div>

      {/* Ordem */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Ordem de exibição</label>
        <input
          type="number"
          {...register('order', { valueAsNumber: true })}
          className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
          placeholder="0"
          min={0}
        />
        <p className="mt-1 text-xs text-gray-500">Números menores aparecem primeiro</p>
      </div>

      {/* Botões */}
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
