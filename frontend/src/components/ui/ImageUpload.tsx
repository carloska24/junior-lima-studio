import { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, Trash2 } from 'lucide-react';

interface ImageUploadProps {
  defaultImage?: string;
  onImageUploaded: (url: string) => void;
  className?: string;
  isLoading?: boolean;
}

export function ImageUpload({
  defaultImage,
  onImageUploaded,
  className = '',
  isLoading,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setShowMenu(false);

    // Upload immediately
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Use standard fetch to avoid content-type issues
      const token = localStorage.getItem('@JuniorLima:token');
      const uploadRes = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3333'}/users/uploads`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!uploadRes.ok) throw new Error('Falha no upload');

      const data = await uploadRes.json();
      onImageUploaded(data.url);
    } catch (error) {
      console.error(error);
      // Revert preview on error?
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded('');
    setShowMenu(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Avatar Circle */}
      <div
        className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer group"
        onClick={() => setShowMenu(!showMenu)}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-1">
            <div className="bg-gray-200 p-3 rounded-full">
              <ImageIcon size={24} />
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Edit Badge - Bottom Right */}
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="absolute bottom-1 right-1 bg-gold-500 text-white p-2.5 rounded-full shadow-md hover:bg-gold-600 transition-colors border-2 border-white z-10"
        title="Alterar foto"
      >
        <Camera size={16} />
      </button>

      {/* Popover Menu */}
      {showMenu && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-30 animate-in fade-in zoom-in-95 duration-200 origin-top">
          <div className="px-3 py-2 border-b border-gray-50 mb-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Foto de Perfil
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUploading}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <ImageIcon size={16} className="text-gray-400" />
            Galeria
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isLoading || isUploading}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Camera size={16} className="text-gray-400" />
            Câmera
          </button>

          {preview && (
            <>
              <div className="my-1 border-t border-gray-100" />
              <button
                type="button"
                onClick={handleRemove}
                disabled={isLoading || isUploading}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <Trash2 size={16} />
                Remover Foto
              </button>
            </>
          )}
        </div>
      )}

      {/* Hidden Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        capture="user"
        className="hidden"
      />
    </div>
  );
}
