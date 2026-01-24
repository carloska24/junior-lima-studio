import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Image as ImageIcon, Video } from 'lucide-react';

interface PortfolioFormData {
  title: string;
  category: string;
  imageUrl: string;
  videoUrl?: string; // Novo campo
  description?: string;
  order?: number;
  active?: boolean;
}

interface PortfolioFormProps {
  initialData?: PortfolioFormData;
  existingCategories?: string[]; // Recebe categorias do pai
  onSubmit: (data: PortfolioFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultCategories = ['Corte', 'Barba', 'Coloração', 'Tratamento', 'Visagismo'];

export function PortfolioForm({
  initialData,
  existingCategories = [],
  onSubmit,
  onCancel,
  isLoading,
}: PortfolioFormProps) {
  const [imagePreview, setImagePreview] = useState<string>('');
  const [videoPreview, setVideoPreview] = useState<string>('');

  // Merge default categories with existing ones from DB to show suggestions
  const suggestionCategories = Array.from(new Set([...defaultCategories, ...existingCategories]));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PortfolioFormData>({
    defaultValues: {
      title: '',
      category: '', // Vazio para obrigar escolha ou digitação
      imageUrl: '',
      videoUrl: '',
      description: '',
      order: 0,
      active: true,
    },
  });

  const watchImageUrl = watch('imageUrl');
  const watchVideoUrl = watch('videoUrl');

  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title);
      setValue('category', initialData.category);
      setValue('imageUrl', initialData.imageUrl);
      setValue('videoUrl', initialData.videoUrl || '');
      setValue('description', initialData.description || '');
      setValue('order', initialData.order || 0);
      setValue('active', initialData.active ?? true);
      setImagePreview(initialData.imageUrl || '');
      setVideoPreview(initialData.videoUrl || '');
    }
  }, [initialData, setValue]);

  useEffect(() => {
    if (watchImageUrl) setImagePreview(watchImageUrl);
  }, [watchImageUrl]);

  useEffect(() => {
    if (watchVideoUrl) setVideoPreview(watchVideoUrl);
    else setVideoPreview('');
  }, [watchVideoUrl]);

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

      {/* Categoria Dinâmica (Input com Datalist) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Categoria *</label>
        <input
          list="categories-list"
          {...register('category', { required: 'Categoria é obrigatória' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
          placeholder="Selecione ou digite uma nova..."
        />
        <datalist id="categories-list">
          {suggestionCategories.map(cat => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
        {errors.category && <span className="text-xs text-red-500">{errors.category.message}</span>}
        <p className="mt-1 text-xs text-gray-500">
          Você pode digitar uma nova categoria livremente ou escolher da lista.
        </p>
      </div>

      {/* URL da Imagem (Capa) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-2">
            <ImageIcon size={16} />
            URL da Imagem (Capa) *
          </span>
        </label>
        <input
          {...register('imageUrl', { required: 'URL da imagem é obrigatória' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
          placeholder="https://exemplo.com/imagem.jpg"
        />
        {errors.imageUrl && <span className="text-xs text-red-500">{errors.imageUrl.message}</span>}
        <p className="mt-1 text-xs text-gray-500">Capa do story. Obrigatória mesmo se for vídeo.</p>
      </div>

      {/* URL do Vídeo (Opcional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center gap-2">
            <Video size={16} />
            URL do Vídeo (Opcional)
          </span>
        </label>
        <input
          {...register('videoUrl')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border text-midnight-900"
          placeholder="https://exemplo.com/video.mp4"
        />
        <p className="mt-1 text-xs text-gray-500">
          Se preenchido, o story será um vídeo. A imagem acima será a capa.
        </p>

        {/* Previews */}
        <div className="flex gap-4 mt-3">
          {imagePreview && (
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-2">Preview Capa:</p>
              <div className="w-full h-32 rounded-md overflow-hidden bg-gray-100 border relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImagePreview('')}
                />
              </div>
            </div>
          )}
          {videoPreview && (
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-2">Preview Vídeo:</p>
              <div className="w-full h-32 rounded-md overflow-hidden bg-black border relative">
                <video src={videoPreview} className="w-full h-full object-cover" controls />
              </div>
            </div>
          )}
        </div>
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
