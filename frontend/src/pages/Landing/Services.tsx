import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Scissors, User, Palette, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { apiFetch } from '@/services/api';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  imageUrl: string | null;
}

// Ícones fallback baseados no nome do serviço
const getIconForService = (name: string) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('corte')) return Scissors;
  if (nameLower.includes('barba')) return User;
  if (nameLower.includes('color')) return Palette;
  return Sparkles;
};

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Quantidade inicial de serviços visíveis
  const INITIAL_VISIBLE = 4;

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await apiFetch('/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const visibleServices = showAll ? services : services.slice(0, INITIAL_VISIBLE);
  const hasMore = services.length > INITIAL_VISIBLE;

  if (loading) {
    return (
      <section className="py-32 px-6 bg-midnight-950 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-midnight-800 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-96 bg-midnight-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-6 bg-midnight-950 w-full">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-12 gap-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-serif text-offwhite-100"
          >
            Serviços
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-offwhite-300 max-w-md text-right md:text-left font-sans text-sm tracking-wide leading-relaxed"
          >
            Não vendemos cortes. Criamos identidades visuais através de visagismo e técnica
            refinada.
          </motion.p>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          <AnimatePresence mode="popLayout">
            {visibleServices.map((service, index) => {
              const IconComponent = getIconForService(service.name);

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className={cn(
                    'group cursor-pointer space-y-6',
                    index % 2 === 1 ? 'md:mt-24' : '' // Asymmetric offset
                  )}
                >
                  {/* Image ou Placeholder */}
                  <div className="bg-midnight-900 relative">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity duration-700 z-10 pointer-events-none" />
                    {service.imageUrl ? (
                      <motion.img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-auto object-contain filter grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all duration-700"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        loading="lazy"
                      />
                    ) : (
                      <motion.div
                        className="w-full h-full flex items-center justify-center bg-midnight-800 text-offwhite-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                      >
                        <IconComponent
                          strokeWidth={0.5}
                          className="w-24 h-24 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="space-y-3 pl-2 border-l border-transparent group-hover:border-gold-500/50 transition-colors duration-500">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-2xl font-serif text-offwhite-200 group-hover:text-white transition-colors">
                        {service.name}
                      </h3>
                      <span className="text-gold-400 font-sans text-sm opacity-60 group-hover:opacity-100 transition-opacity">
                        {service.durationMin} min
                      </span>
                    </div>

                    <p className="text-offwhite-300 text-sm leading-relaxed max-w-sm group-hover:text-offwhite-100 transition-colors">
                      {service.description || 'Serviço premium com atendimento personalizado.'}
                    </p>

                    <div className="pt-2 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-xs tracking-widest uppercase text-gold-500">
                        A partir de R$ {Number(service.price).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Botão Ver Menu Completo */}
        {hasMore && (
          <motion.div
            className="text-center pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="group inline-flex items-center gap-3 text-offwhite-300 hover:text-gold-400 transition-colors duration-500 text-sm tracking-[0.2em] uppercase font-sans"
            >
              <span>{showAll ? 'Ver Menos' : 'Ver Menu Completo'}</span>
              {showAll ? (
                <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
              ) : (
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
              )}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
