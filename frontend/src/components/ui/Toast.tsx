import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

const icons = {
  success: <CheckCircle className="text-green-500" size={20} />,
  error: <AlertCircle className="text-red-500" size={20} />,
  info: <Info className="text-blue-500" size={20} />,
};

const bgColors = {
  success: 'bg-white border-green-100',
  error: 'bg-white border-red-100',
  info: 'bg-white border-blue-100',
};

export function Toast({ id, message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000); // Auto close after 4s

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg shadow-lg border animate-in slide-in-from-top-2 fade-in duration-300 min-w-[300px]',
        bgColors[type]
      )}
    >
      <div className="shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
      <button onClick={() => onClose(id)} className="text-gray-400 hover:text-gray-600">
        <X size={16} />
      </button>
    </div>
  );
}
