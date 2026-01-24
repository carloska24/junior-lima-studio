import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface CreatableSelectProps {
  options: Option[]; // Opções disponíveis
  value: string; // Valor selecionado (string simples)
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CreatableSelect({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  className,
}: CreatableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atualiza search term quando value externo muda
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setSearchTerm(optionValue);
    setIsOpen(false);
  };

  const handleCreate = () => {
    if (searchTerm.trim()) {
      onChange(searchTerm); // Cria com o texto atual
      setIsOpen(false);
    }
  };

  return (
    <div className={cn('relative font-sans text-sm', className)} ref={containerRef}>
      <div className="relative group">
        <input
          type="text"
          className="w-full rounded-sm border border-gold-200/60 bg-offwhite-100/50 py-2.5 pl-3 pr-10 text-midnight-900 shadow-sm transition-all duration-300 placeholder:text-gray-400 focus:border-gold-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500/20"
          placeholder={placeholder}
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            onChange(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gold-400 transition-colors duration-300 group-hover:text-gold-600"
        >
          <ChevronDown
            size={14}
            className={cn('transition-transform duration-300', isOpen && 'rotate-180')}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-sm border border-gold-100 bg-white py-1 shadow-xl shadow-gold-900/5 focus:outline-none scrollbar-light animate-in fade-in zoom-in-95 duration-150 ease-out origin-top">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <div
                key={option.value}
                className={cn(
                  'relative cursor-pointer select-none py-2.5 pl-3 pr-9 transition-all duration-200',
                  'hover:bg-gold-50 hover:pl-4',
                  value === option.value
                    ? 'bg-gold-50 text-gold-900 font-medium tracking-wide'
                    : 'text-gray-600'
                )}
                onClick={() => handleSelect(option.value)}
              >
                <span className="block truncate">{option.label}</span>
                {value === option.value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gold-500">
                    <Check size={14} />
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-xs text-gray-400 italic text-center">
              Nenhuma opção existente.
            </div>
          )}

          {/* Opção de criar novo */}
          {searchTerm && !options.some(o => o.label.toLowerCase() === searchTerm.toLowerCase()) && (
            <div
              className="relative cursor-pointer select-none py-3 pl-3 pr-9 bg-offwhite-100 text-gold-700 hover:bg-gold-100 hover:text-gold-900 border-t border-gold-100 transition-colors font-medium flex items-center gap-2 group"
              onClick={handleCreate}
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gold-200 text-gold-700 group-hover:bg-gold-500 group-hover:text-white transition-colors">
                <Plus size={10} />
              </div>
              <span className="text-sm">
                Criar{' '}
                <span className="underline decoration-gold-300 underline-offset-2">
                  "{searchTerm}"
                </span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
