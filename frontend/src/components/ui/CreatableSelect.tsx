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
    <div className={cn('relative', className)} ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm shadow-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 placeholder:text-gray-400"
          placeholder={placeholder}
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            onChange(e.target.value); // Propaga mudança enquanto digita (controlled input behavior)
          }}
          onFocus={() => setIsOpen(true)}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <div
                key={option.value}
                className={cn(
                  'relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-gold-50 text-gray-900',
                  value === option.value && 'bg-gold-100 text-gold-900 font-medium'
                )}
                onClick={() => handleSelect(option.value)}
              >
                <span className="block truncate">{option.label}</span>
                {value === option.value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gold-600">
                    <Check size={16} />
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">Nenhuma opção encontrada.</div>
          )}

          {/* Opção de criar novo se não existir nos exatos */}
          {searchTerm && !options.some(o => o.label.toLowerCase() === searchTerm.toLowerCase()) && (
            <div
              className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gold-700 hover:bg-gold-50 border-t border-gray-100 font-medium flex items-center gap-2"
              onClick={handleCreate}
            >
              <Plus size={14} />
              Criar "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
